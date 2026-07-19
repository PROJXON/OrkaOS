const MAX_BODY_BYTES = 64_000;

const ALLOWED_GOALS = new Set([
  'Join the Pod',
  'Join Alpha Testing',
  'Partner with PROJXON'
]);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

function isNonEmptyString(value) {
  return (
    typeof value === 'string' &&
    value.trim().length > 0
  );
}

export async function onRequestPost({
  request,
  env
}) {
  if (
    !env.GOOGLE_SCRIPT_URL ||
    !env.FORM_WEBHOOK_SECRET
  ) {
    console.error(
      'Missing GOOGLE_SCRIPT_URL or FORM_WEBHOOK_SECRET.'
    );

    return json(
      {
        ok: false,
        error: 'Form service is not configured.'
      },
      500
    );
  }

  // Browser requests should originate from the site itself.
  const requestOrigin = request.headers.get('Origin');
  const pageOrigin = new URL(request.url).origin;

  if (
    requestOrigin &&
    requestOrigin !== pageOrigin
  ) {
    return json(
      {
        ok: false,
        error: 'Origin not allowed.'
      },
      403
    );
  }

  const contentType =
    request.headers.get('Content-Type') || '';

  if (!contentType.includes('application/json')) {
    return json(
      {
        ok: false,
        error: 'Expected JSON.'
      },
      415
    );
  }

  const declaredLength = Number(
    request.headers.get('Content-Length') || 0
  );

  if (declaredLength > MAX_BODY_BYTES) {
    return json(
      {
        ok: false,
        error: 'Submission is too large.'
      },
      413
    );
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    return json(
      {
        ok: false,
        error: 'Invalid JSON.'
      },
      400
    );
  }

  if (
    !payload ||
    typeof payload !== 'object' ||
    Array.isArray(payload)
  ) {
    return json(
      {
        ok: false,
        error: 'Invalid submission.'
      },
      400
    );
  }

  const actualLength = new TextEncoder()
    .encode(JSON.stringify(payload))
    .length;

  if (actualLength > MAX_BODY_BYTES) {
    return json(
      {
        ok: false,
        error: 'Submission is too large.'
      },
      413
    );
  }

  if (
    !isNonEmptyString(payload.firstName) ||
    !isNonEmptyString(payload.lastName) ||
    !isNonEmptyString(payload.email) ||
    !ALLOWED_GOALS.has(payload.primaryGoal)
  ) {
    return json(
      {
        ok: false,
        error:
          'Required fields are missing or invalid.'
      },
      400
    );
  }

  try {
    const googleResponse = await fetch(
      env.GOOGLE_SCRIPT_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          secret: env.FORM_WEBHOOK_SECRET,
          submission: {
            ...payload,
            receivedAt: new Date().toISOString()
          }
        }),
        redirect: 'follow'
      }
    );

    const responseText =
      await googleResponse.text();

    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      console.error(
        'Google Apps Script returned non-JSON:',
        responseText.slice(0, 500)
      );

      return json(
        {
          ok: false,
          error:
            'Submission service returned an invalid response.'
        },
        502
      );
    }

    if (!googleResponse.ok || !result.ok) {
      console.error(
        'Google Apps Script rejected the submission:',
        result
      );

      return json(
        {
          ok: false,
          error:
            result.error ||
            'Could not save the submission.'
        },
        502
      );
    }

    return json({
      ok: true,
      submissionId: result.submissionId,
      emailSent: result.emailSent !== false
    });
  } catch (error) {
    console.error(
      'Submission forwarding failed:',
      error
    );

    return json(
      {
        ok: false,
        error:
          'Could not reach the submission service.'
      },
      502
    );
  }
}