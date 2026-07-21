const ALLOWED_GOALS = [
  'Join the Pod',
  'Join Alpha Testing',
  'Partner with PROJXON'
];

const FORM_FIELDS = [
  'submittedAt',
  'intakeVersion',
  'firstName',
  'lastName',
  'email',
  'primaryGoal',
  'icp',
  'workspace',
  'profession',
  'workplace',
  'university',
  'expertise',
  'teamSize',
  'purposeOptions',
  'orkaUseReasons',
  'orkaUseReasonDetails',
  'purposeDetails',
  'interests',
  'projxonFamiliarity',
  'momentumFamiliarity',
  'growthAdvisoryFamiliarity',
  'orkaFamiliarity',
  'involvementNotes',
  'discoverySource',
  'discoveryDetails',
  'currentTools',
  'priorTesting',
  'testingAvailability',
  'testingAvailabilityNotes',
  'timezone',
  'communicationMethods',
  'phone'
];

const MAX_REQUEST_LENGTH = 65536;

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

export async function onRequestPost({ request, env }) {
  try {
    if (
      !env.GOOGLE_APPS_SCRIPT_URL ||
      !env.INTAKE_SHARED_SECRET ||
      !env.TURNSTILE_SECRET_KEY
    ) {
      console.error(
        'Required intake environment variables are missing.'
      );

      return jsonResponse(
        {
          ok: false,
          error: 'The intake service is not configured.'
        },
        500
      );
    }

    const rawBody = await request.text();

    if (!rawBody || rawBody.length > MAX_REQUEST_LENGTH) {
      return jsonResponse(
        {
          ok: false,
          error: 'Invalid submission size.'
        },
        413
      );
    }

    let body;

    try {
      body = JSON.parse(rawBody);
    } catch {
      return jsonResponse(
        {
          ok: false,
          error: 'Invalid submission format.'
        },
        400
      );
    }

    const validationError = validateBody(body);

    if (validationError) {
      return jsonResponse(
        {
          ok: false,
          error: validationError
        },
        400
      );
    }

    const submissionId = crypto.randomUUID();

    const turnstileResult = await verifyTurnstile({
      token: body.turnstileToken,
      secret: env.TURNSTILE_SECRET_KEY,
      remoteIp: request.headers.get('CF-Connecting-IP'),
      idempotencyKey: submissionId
    });

    if (
      !turnstileResult.success ||
      turnstileResult.action !== 'orkaos_intake'
    ) {
      console.warn('Turnstile validation failed:', {
        errors: turnstileResult['error-codes'],
        action: turnstileResult.action,
        hostname: turnstileResult.hostname
      });

      return jsonResponse(
        {
          ok: false,
          error:
            'Human verification failed. Refresh it and try again.'
        },
        400
      );
    }

    /*
     * Only forward known form fields. Do not forward arbitrary
     * properties supplied by the browser.
     */
    const forwardedPayload = {};

    for (const field of FORM_FIELDS) {
      if (Object.hasOwn(body, field)) {
        forwardedPayload[field] = body[field];
      }
    }

    forwardedPayload.submissionId = submissionId;
    forwardedPayload.receivedAt = new Date().toISOString();
    forwardedPayload.sharedSecret =
      env.INTAKE_SHARED_SECRET;

    const googleResponse = await fetch(
      env.GOOGLE_APPS_SCRIPT_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(forwardedPayload),
        redirect: 'follow'
      }
    );

    const responseText = await googleResponse.text();

    let googleResult;

    try {
      googleResult = JSON.parse(responseText);
    } catch {
      console.error(
        'Apps Script returned a non-JSON response:',
        responseText
      );

      return jsonResponse(
        {
          ok: false,
          error: 'The response could not be saved.'
        },
        502
      );
    }

    if (!googleResponse.ok || !googleResult?.ok) {
      console.error(
        'Apps Script rejected the intake submission:',
        {
          status: googleResponse.status,
          result: googleResult
        }
      );

      return jsonResponse(
        {
          ok: false,
          error: 'The response could not be saved.'
        },
        502
      );
    }

    if (googleResult.emailSent === false) {
      console.error(
        'The response was saved, but notification email failed:',
        googleResult.emailError
      );
    }

    return jsonResponse({
      ok: true,
      submissionId,
      emailSent: googleResult.emailSent !== false
    });
  } catch (error) {
    console.error('Intake function failed:', error);

    return jsonResponse(
      {
        ok: false,
        error:
          'Unable to submit the form. Please try again.'
      },
      500
    );
  }
}

export function onRequestGet() {
  return jsonResponse(
    {
      ok: false,
      error: 'Method not allowed.'
    },
    405
  );
}

function validateBody(body) {
  if (
    !body ||
    typeof body !== 'object' ||
    Array.isArray(body)
  ) {
    return 'Invalid submission.';
  }

  const requiredFields = [
    'firstName',
    'lastName',
    'email',
    'primaryGoal',
    'turnstileToken'
  ];

  for (const field of requiredFields) {
    if (!String(body[field] || '').trim()) {
      return `Missing required field: ${field}`;
    }
  }

  if (!ALLOWED_GOALS.includes(body.primaryGoal)) {
    return 'Invalid intake path.';
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      String(body.email)
    )
  ) {
    return 'Enter a valid email address.';
  }

  for (const value of Object.values(body)) {
    if (
      typeof value === 'string' &&
      value.length > 10000
    ) {
      return 'One or more responses are too long.';
    }
  }

  return '';
}

async function verifyTurnstile({
  token,
  secret,
  remoteIp,
  idempotencyKey
}) {
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        secret,
        response: token,
        remoteip: remoteIp || undefined,
        idempotency_key: idempotencyKey
      })
    }
  );

  if (!response.ok) {
    return {
      success: false,
      'error-codes': ['siteverify-request-failed']
    };
  }

  return response.json();
}