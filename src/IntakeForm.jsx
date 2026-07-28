import React, { useEffect, useId, useRef } from 'react';
import { useForm } from 'react-hook-form';
import './IntakeForm.css';
import { getTimeZoneGroups, US_TIME_ZONES } from './timezones.js';
import { ORKA_PRODUCTS } from './products.js';

/**
 * Intake dialog developer map
 * ---------------------------
 * The landing page passes an intent into this modal; the intent selects the
 * heading copy and pre-fills `primaryGoal`. react-hook-form owns validation and
 * submission state, while this component handles modal-only behavior such as
 * focus trapping, Escape-to-close, and restoring the user's previous focus.
 *
 * CSS uses a BEM-style naming pattern: `.intake-modal__*` is the dialog shell,
 * `.intake-form__*` is section layout, and `.intake-field__*` is a form control.
 * Modifier classes such as `--card`, `--highlight`, and `--roadmap` change a
 * component variant without changing its underlying responsibility.
 */

// Only these paths can currently be submitted. Keep this list aligned with the
// enabled action cards in App.jsx.
const ENABLED_GOALS = [
  'Join the Pod',
  'Join Alpha Testing',
  'Partner with PROJXON'
];

// Normalizes external CTA labels before they become form values.
const INTENT_MAPPING = {
  'Join the Pod': 'Join the Pod',
  'Join Alpha Testing': 'Join Alpha Testing',
  'Partner with PROJXON': 'Partner with PROJXON'
};

// Dialog heading and helper copy shown for each supported intake path.
const INTENT_COPY = {
  'Join the Pod': {
    title: 'Join the Pod',
    description:
      'Get invited to early-access previews and demos as Orka apps become ready to explore.'
  },
  'Join Alpha Testing': {
    title: 'Join Alpha Testing',
    description:
      'Test active work-in-progress builds, expect rough edges, and help shape what ships next.'
  },
  'Partner with PROJXON': {
    title: 'Partner with PROJXON',
    description:
      'Explore a pilot, integration, strategic partnership, or co-building opportunity.'
  }
};

// Product choices come from the same public catalog used by the landing page.
// Non-concept apps are shown first; concept-stage apps remain in the expandable
// roadmap group so the form stays scannable without drifting from the website.
const DEVELOPMENT_APPS = ORKA_PRODUCTS
  .filter((product) => product.status !== 'Concept')
  .map((product) => [product.name, product.summary, product.status]);

const ROADMAP_APPS = ORKA_PRODUCTS
  .filter((product) => product.status === 'Concept')
  .map((product) => [product.name, product.summary, product.status]);

// Remaining option arrays are form copy only; submitted values are the visible
// strings, so changing wording here also changes the payload value.
const ORKA_USE_REASONS = [
  ['Current tools are too complex', 'We spend too much time configuring or maintaining them.'],
  ['Current tools do not cover our needs', 'Important work still happens manually or falls between systems.'],
  ['Improve how our team works together', 'We need clearer handoffs, shared context, or accountability.'],
  ['Bring more structure to Google Workspace', 'We want a guided operating layer without replacing Workspace.'],
  ['Reduce repetitive work with automation', 'We want recurring tasks and handoffs to run more consistently.'],
  ['Explore AI-assisted workflows', 'We want practical AI support inside day-to-day operations.'],
  ['Start small before adopting a larger platform', 'We want a focused tool now and a migration path later.'],
  ['Other', 'Tell us what is driving your interest.']
];

const PURPOSE_OPTIONS = [
  'Get early access as apps reach preview or demo stage',
  'Test work-in-progress product builds',
  'See a guided product demo',
  'Use Orka apps in my own work or organization',
  'Explore what PROJXON and Orka are building',
  'Explore a pilot, integration, or partnership',
  'Share product or industry expertise'
];

const DISCOVERY_OPTIONS = [
  'Friend, family member, or colleague',
  'LinkedIn or another social platform',
  'Online search',
  'AI assistant or AI search',
  'School, university, or campus group',
  'Event, community, or professional network',
  'PROJXON program or team member',
  'Other'
];

const FAMILIARITY_OPTIONS = [
  'Not familiar yet',
  'I have heard of it',
  'I have followed or engaged with it',
  'I have participated or worked with it'
];

const TESTING_WINDOWS = [
  'Weekday mornings',
  'Weekday afternoons',
  'Weekday evenings',
  'Weekends',
  'Flexible / varies'
];

const COMMUNICATION_OPTIONS = [
  'Email',
  'Google Meet',
  'Phone call',
  'Text / SMS'
];

// Used by the modal focus trap. Disabled and negative-tabindex controls are
// deliberately excluded so keyboard focus only visits usable elements.
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

// Timezone detection is best-effort because some privacy modes can block Intl.
function getBrowserTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  } catch {
    return '';
  }
}

const DETECTED_TIMEZONE = getBrowserTimezone();
const WORLD_TIME_ZONE_GROUPS = getTimeZoneGroups(DETECTED_TIMEZONE);

// Return a fresh object for every reset; arrays must not be shared between opens.
function getEmptyForm(primaryGoal = '') {
  return {
    firstName: '',
    lastName: '',
    email: '',
    primaryGoal,
    icp: '',
    workspace: '',
    profession: '',
    workplace: '',
    university: '',
    expertise: '',
    teamSize: '',
    purposeOptions: [],
    orkaUseReasons: [],
    orkaUseReasonDetails: '',
    purposeDetails: '',
    interests: [],
    projxonFamiliarity: '',
    momentumFamiliarity: '',
    growthAdvisoryFamiliarity: '',
    orkaFamiliarity: '',
    involvementNotes: '',
    discoverySource: '',
    discoveryDetails: '',
    currentTools: '',
    priorTesting: '',
    testingAvailability: [],
    testingAvailabilityNotes: '',
    timezone: DETECTED_TIMEZONE,
    communicationMethods: [],
    phone: ''
  };
}

/**
 * Shared checkbox-card renderer used by the reason, purpose, and app-interest
 * groups. `registerField` is created once per field group below, then reused by
 * every option so react-hook-form collects the checked values into one array.
 */
function CheckOption({ id, value, registerField, description, badge }) {
  return (
    <label className="intake-check intake-check--card" htmlFor={id}>
      <input id={id} type="checkbox" value={value} {...registerField} />
      <span className="intake-check__box" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </span>
      <span className="intake-check__copy">
        <span className="intake-check__title">
          {value}
          {badge && <span className="intake-status-badge">{badge}</span>}
        </span>
        {description && <span className="intake-check__description">{description}</span>}
      </span>
    </label>
  );
}

export default function IntakeForm({
  isOpen,
  onClose,
  defaultIntent = '',
  onSubmitData
}) {
  // useId keeps labels and ARIA relationships unique if more than one dialog is
  // ever mounted on the same page.
  const id = useId();
  const dialogRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  const turnstileContainerRef = useRef(null);
  const turnstileWidgetIdRef = useRef(null);
  const turnstileTokenRef = useRef('');
  const mappedIntent = INTENT_MAPPING[defaultIntent] || '';
  const resolvedIntent = ENABLED_GOALS.includes(mappedIntent) ? mappedIntent : '';

  // react-hook-form keeps input updates local and exposes errors only when needed.
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: getEmptyForm(resolvedIntent),
    mode: 'onBlur',
    shouldUnregister: true
  });

  // Watched values decide which conditional fields are mounted. Because
  // `shouldUnregister` is true, hidden fields are removed from the final payload.
  const primaryGoal = watch('primaryGoal', '');
  const icp = watch('icp', '');
  const communicationMethods = watch('communicationMethods', []);
  const isAlphaTesting = primaryGoal === 'Join Alpha Testing';
  const isStudent = icp === 'College Student';
  const needsTeamSize = Boolean(icp) && icp !== 'Solopreneur';
  const needsPhone =
    communicationMethods.includes('Phone call') ||
    communicationMethods.includes('Text / SMS');

  // Fall back to neutral copy if the modal is opened without a recognized intent.
  const dialogCopy =
    INTENT_COPY[resolvedIntent] || {
      title: 'Build your pod',
      description: 'Choose the path that best matches how you want to explore OrkaOS.'
    };
  const formId = `${id}-form`;
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  // Modal lifecycle: lock background scroll, reset data, move focus inside,
  // trap Tab navigation, close on Escape, and restore focus on cleanup.
  useEffect(() => {
    if (!isOpen) return undefined;

    previouslyFocusedRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    reset(getEmptyForm(resolvedIntent));

    const focusFrame = window.requestAnimationFrame(() => {
      setFocus('firstName');
    });

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll(FOCUSABLE_SELECTOR)
      ).filter((element) => !element.hasAttribute('hidden'));

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocusedRef.current?.focus?.();
    };
  }, [isOpen, onClose, reset, resolvedIntent, setFocus]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const siteKey =
      import.meta.env.VITE_TURNSTILE_SITE_KEY;

    if (!siteKey) {
      setError('root.server', {
        type: 'configuration',
        message:
          'Human verification is not configured.'
      });

      return undefined;
    }

    let cancelled = false;
    let retryTimer;

    const renderTurnstile = () => {
      if (
        cancelled ||
        !turnstileContainerRef.current
      ) {
        return;
      }

      /*
       * The external Turnstile script loads asynchronously.
       * Wait until its global API is available.
       */
      if (!window.turnstile) {
        retryTimer = window.setTimeout(
          renderTurnstile,
          100
        );
        return;
      }

      turnstileTokenRef.current = '';

      turnstileWidgetIdRef.current =
        window.turnstile.render(
          turnstileContainerRef.current,
          {
            sitekey: siteKey,
            theme: 'auto',
            size: 'flexible',
            action: 'orkaos_intake',

            callback: (token) => {
              turnstileTokenRef.current = token;
              clearErrors('root.server');
            },

            'expired-callback': () => {
              turnstileTokenRef.current = '';

              setError('root.server', {
                type: 'verification',
                message:
                  'Human verification expired. Complete it again.'
              });
            },

            'error-callback': () => {
              turnstileTokenRef.current = '';

              setError('root.server', {
                type: 'verification',
                message:
                  'Human verification could not load. Refresh and try again.'
              });
            }
          }
        );
    };

    renderTurnstile();

    return () => {
      cancelled = true;

      if (retryTimer) {
        window.clearTimeout(retryTimer);
      }

      if (
        window.turnstile &&
        turnstileWidgetIdRef.current !== null
      ) {
        window.turnstile.remove(
          turnstileWidgetIdRef.current
        );
      }

      turnstileWidgetIdRef.current = null;
      turnstileTokenRef.current = '';
    };
  }, [clearErrors, isOpen, setError]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const siteKey =
      import.meta.env.VITE_TURNSTILE_SITE_KEY;

    if (!siteKey) {
      setError('root.server', {
        type: 'configuration',
        message:
          'Human verification is not configured.'
      });

      return undefined;
    }

    let cancelled = false;
    let retryTimer;

    const renderTurnstile = () => {
      if (
        cancelled ||
        !turnstileContainerRef.current
      ) {
        return;
      }

      /*
       * The external Turnstile script loads asynchronously.
       * Wait until its global API is available.
       */
      if (!window.turnstile) {
        retryTimer = window.setTimeout(
          renderTurnstile,
          100
        );
        return;
      }

      turnstileTokenRef.current = '';

      turnstileWidgetIdRef.current =
        window.turnstile.render(
          turnstileContainerRef.current,
          {
            sitekey: siteKey,
            theme: 'auto',
            size: 'flexible',
            action: 'orkaos_intake',

            callback: (token) => {
              turnstileTokenRef.current = token;
              clearErrors('root.server');
            },

            'expired-callback': () => {
              turnstileTokenRef.current = '';

              setError('root.server', {
                type: 'verification',
                message:
                  'Human verification expired. Complete it again.'
              });
            },

            'error-callback': () => {
              turnstileTokenRef.current = '';

              setError('root.server', {
                type: 'verification',
                message:
                  'Human verification could not load. Refresh and try again.'
              });
            }
          }
        );
    };

    renderTurnstile();

    return () => {
      cancelled = true;

      if (retryTimer) {
        window.clearTimeout(retryTimer);
      }

      if (
        window.turnstile &&
        turnstileWidgetIdRef.current !== null
      ) {
        window.turnstile.remove(
          turnstileWidgetIdRef.current
        );
      }

      turnstileWidgetIdRef.current = null;
      turnstileTokenRef.current = '';
    };
  }, [clearErrors, isOpen, setError]);

  // Validate the intake path defensively, enrich the payload with metadata, then
  // hand it to the caller. The alert is a development fallback until a webhook is wired.
  const submitForm = async (data) => {
    if (!ENABLED_GOALS.includes(data.primaryGoal)) {
      setError('primaryGoal', {
        type: 'validate',
        message: 'Choose an available intake path.'
      });

      return;
    }

    const turnstileToken =
      turnstileTokenRef.current;

    if (!turnstileToken) {
      setError('root.server', {
        type: 'verification',
        message:
          'Complete the human verification before submitting.'
      });

      return;
    }

    const payload = {
      ...data,
      intakeVersion: 'orkaos-v4-complete',
      submittedAt: new Date().toISOString(),
      turnstileToken
    };

    try {
      if (!onSubmitData) {
        throw new Error(
          'The intake submission service is not connected.'
        );
      }

      await onSubmitData(payload);

      reset(getEmptyForm());
      onClose();
    } catch (error) {
      setError('root.server', {
        type: 'server',
        message:
          error instanceof Error
            ? error.message
            : 'Unable to submit the form. Please try again.'
      });

      turnstileTokenRef.current = '';

      if (
        window.turnstile &&
        turnstileWidgetIdRef.current !== null
      ) {
        window.turnstile.reset(
          turnstileWidgetIdRef.current
        );
      }
    }
  };

  // Do not leave a hidden dialog in the tab order; unmount it completely instead.
  if (!isOpen) return null;

  // Group registrations are declared once and passed to every CheckOption. Each
  // validator ensures at least one checkbox is selected when the group is required.
  const interestRegistration = register('interests', {
    validate: (value) =>
      (Array.isArray(value) && value.length > 0) ||
      'Choose at least one Orka app.'
  });

  const purposeRegistration = register('purposeOptions', {
    validate: (value) =>
      (Array.isArray(value) && value.length > 0) ||
      'Choose at least one reason for joining.'
  });

  const orkaUseReasonRegistration = register('orkaUseReasons', {
    validate: (value) =>
      (Array.isArray(value) && value.length > 0) ||
      'Choose at least one reason you want to use OrkaOS.'
  });

  const communicationRegistration = register('communicationMethods', {
    validate: (value) =>
      (Array.isArray(value) && value.length > 0) ||
      'Choose at least one communication method.'
  });

  const testingWindowRegistration = register('testingAvailability', {
    validate: (value) =>
      !isAlphaTesting ||
      (Array.isArray(value) && value.length > 0) ||
      'Choose at least one testing window.'
  });

  return (
    /* Clicking the shaded overlay closes the dialog; clicks inside the panel do not. */
    <div
      className="intake-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        className="intake-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        {/* Dialog header: brand mark, intent-specific copy, and close control. */}
        <header className="intake-modal__head">
          <div className="intake-modal__brand" aria-hidden="true">
            <span className="official-orka-logo" />
          </div>
          <div className="intake-modal__heading">
            <p className="intake-modal__kicker">OrkaOS intake</p>
            <h2 className="intake-modal__title" id={titleId}>
              {dialogCopy.title}
            </h2>
            <p className="intake-modal__description" id={descriptionId}>
              {dialogCopy.description}
            </p>
          </div>

          <button
            className="intake-modal__close"
            type="button"
            onClick={onClose}
            aria-label="Close intake form"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        {/* Scrollable form body. The footer remains visible outside this region. */}
        <div className="intake-modal__body">
          <form
            id={formId}
            className="intake-form"
            onSubmit={handleSubmit(submitForm)}
            noValidate
          >
            {/* Step 01: identity, intake goal, profile, and Workspace status. */}
            <section className="intake-form__section" aria-labelledby={`${id}-contact-heading`}>
              <div className="intake-form__section-head">
                <span className="intake-form__step">01</span>
                <div>
                  <h3 id={`${id}-contact-heading`}>About you</h3>
                  <p>Start with the basics so we know who is joining the pod.</p>
                </div>
              </div>

              <div className="intake-form__grid">
                <div className="intake-field">
                  <label className="intake-field__label" htmlFor={`${id}-first-name`}>
                    First name <span className="intake-field__required">*</span>
                  </label>
                  <input
                    id={`${id}-first-name`}
                    className="intake-field__control"
                    type="text"
                    autoComplete="given-name"
                    aria-invalid={Boolean(errors.firstName)}
                    {...register('firstName', { required: 'Enter your first name.' })}
                  />
                  {errors.firstName && <p className="intake-field__error">{errors.firstName.message}</p>}
                </div>

                <div className="intake-field">
                  <label className="intake-field__label" htmlFor={`${id}-last-name`}>
                    Last name <span className="intake-field__required">*</span>
                  </label>
                  <input
                    id={`${id}-last-name`}
                    className="intake-field__control"
                    type="text"
                    autoComplete="family-name"
                    aria-invalid={Boolean(errors.lastName)}
                    {...register('lastName', { required: 'Enter your last name.' })}
                  />
                  {errors.lastName && <p className="intake-field__error">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="intake-field">
                <label className="intake-field__label" htmlFor={`${id}-email`}>
                  Email address <span className="intake-field__required">*</span>
                </label>
                <input
                  id={`${id}-email`}
                  className="intake-field__control"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  {...register('email', {
                    required: 'Enter your email address.',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address.'
                    }
                  })}
                />
                {errors.email && <p className="intake-field__error">{errors.email.message}</p>}
              </div>

              <div className="intake-form__grid">
                <div className="intake-field">
                  <label className="intake-field__label" htmlFor={`${id}-goal`}>
                    Primary goal <span className="intake-field__required">*</span>
                  </label>
                  <div className="intake-select-wrap">
                    <select
                      id={`${id}-goal`}
                      className="intake-field__select"
                      aria-invalid={Boolean(errors.primaryGoal)}
                      {...register('primaryGoal', {
                        required: 'Choose your primary goal.',
                        validate: (value) =>
                          ENABLED_GOALS.includes(value) || 'Choose an available intake path.'
                      })}
                    >
                      <option value="">Select a path…</option>
                      <option value="Join the Pod">Join the Pod</option>
                      <option value="Join Alpha Testing">Join Alpha Testing</option>
                      <option value="beta-coming-soon" disabled>
                        Join Beta Testing — coming soon
                      </option>
                      <option value="Partner with PROJXON">Partner with PROJXON</option>
                    </select>
                  </div>
                  <p className="intake-field__hint">
                    Beta testing is later-stage, near-release validation. Enrollment is not open yet.
                  </p>
                  {errors.primaryGoal && <p className="intake-field__error">{errors.primaryGoal.message}</p>}
                </div>

                <div className="intake-field">
                  <label className="intake-field__label" htmlFor={`${id}-profile`}>
                    Which best describes you? <span className="intake-field__required">*</span>
                  </label>
                  <div className="intake-select-wrap">
                    <select
                      id={`${id}-profile`}
                      className="intake-field__select"
                      aria-invalid={Boolean(errors.icp)}
                      {...register('icp', { required: 'Choose the profile that fits best.' })}
                    >
                      <option value="">Select a profile…</option>
                      <option value="Solopreneur">Solopreneur</option>
                      <option value="Small Team">Small Team</option>
                      <option value="Veteran Startup">Veteran Startup</option>
                      <option value="College Student">College Student</option>
                    </select>
                  </div>
                  {errors.icp && <p className="intake-field__error">{errors.icp.message}</p>}
                </div>
              </div>

              <fieldset className="intake-field">
                <legend className="intake-field__label">
                  Do you currently use Google Workspace? <span className="intake-field__required">*</span>
                </legend>
                <div className="intake-radio-row">
                  {['Yes', 'No', 'Not sure'].map((answer) => (
                    <label className="intake-radio" key={answer}>
                      <input
                        type="radio"
                        value={answer}
                        {...register('workspace', { required: 'Choose an answer.' })}
                      />
                      <span className="intake-radio__dot" aria-hidden="true" />
                      <span>{answer}</span>
                    </label>
                  ))}
                </div>
                {errors.workspace && <p className="intake-field__error">{errors.workspace.message}</p>}
              </fieldset>
            </section>

            {/* Step 02: professional context; student and team fields are conditional. */}
            <section className="intake-form__section" aria-labelledby={`${id}-background-heading`}>
              <div className="intake-form__section-head">
                <span className="intake-form__step">02</span>
                <div>
                  <h3 id={`${id}-background-heading`}>Work and expertise</h3>
                  <p>Help us understand the experience and operating context you bring.</p>
                </div>
              </div>

              <div className="intake-form__grid">
                <div className="intake-field">
                  <label className="intake-field__label" htmlFor={`${id}-profession`}>
                    Profession, role, or major <span className="intake-field__required">*</span>
                  </label>
                  <input
                    id={`${id}-profession`}
                    className="intake-field__control"
                    type="text"
                    autoComplete="organization-title"
                    placeholder="For example: Operations manager"
                    aria-invalid={Boolean(errors.profession)}
                    {...register('profession', { required: 'Enter your profession, role, or major.' })}
                  />
                  {errors.profession && <p className="intake-field__error">{errors.profession.message}</p>}
                </div>

                {isStudent ? (
                  <div className="intake-field">
                    <label className="intake-field__label" htmlFor={`${id}-university`}>
                      University <span className="intake-field__required">*</span>
                    </label>
                    <input
                      id={`${id}-university`}
                      className="intake-field__control"
                      type="text"
                      autoComplete="organization"
                      aria-invalid={Boolean(errors.university)}
                      {...register('university', { required: 'Enter your university.' })}
                    />
                    {errors.university && <p className="intake-field__error">{errors.university.message}</p>}
                  </div>
                ) : (
                  <div className="intake-field">
                    <label className="intake-field__label" htmlFor={`${id}-workplace`}>
                      Organization, business, or place of work <span className="intake-field__required">*</span>
                    </label>
                    <input
                      id={`${id}-workplace`}
                      className="intake-field__control"
                      type="text"
                      autoComplete="organization"
                      placeholder="Independent is okay"
                      aria-invalid={Boolean(errors.workplace)}
                      {...register('workplace', { required: 'Enter your organization or work context.' })}
                    />
                    {errors.workplace && <p className="intake-field__error">{errors.workplace.message}</p>}
                  </div>
                )}
              </div>

              {needsTeamSize && (
                <div className="intake-field">
                  <label className="intake-field__label" htmlFor={`${id}-team-size`}>
                    Size of your team, organization, or project group <span className="intake-field__required">*</span>
                  </label>
                  <input
                    id={`${id}-team-size`}
                    className="intake-field__control"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max="10000"
                    placeholder="For example: 5"
                    aria-invalid={Boolean(errors.teamSize)}
                    {...register('teamSize', {
                      required: 'Enter the size of your team or group.',
                      min: { value: 1, message: 'Team size must be at least 1.' }
                    })}
                  />
                  {errors.teamSize && <p className="intake-field__error">{errors.teamSize.message}</p>}
                </div>
              )}

              <div className="intake-field">
                <label className="intake-field__label" htmlFor={`${id}-expertise`}>
                  Areas of expertise <span className="intake-field__required">*</span>
                </label>
                <textarea
                  id={`${id}-expertise`}
                  className="intake-field__textarea intake-field__textarea--compact"
                  placeholder="Operations, HR, sales, product testing, software development, marketing…"
                  aria-invalid={Boolean(errors.expertise)}
                  {...register('expertise', { required: 'Tell us about your areas of expertise.' })}
                />
                {errors.expertise && <p className="intake-field__error">{errors.expertise.message}</p>}
              </div>

              <div className="intake-field">
                <label className="intake-field__label" htmlFor={`${id}-current-tools`}>
                  What tools do you or your team use right now? <span className="intake-field__required">*</span>
                </label>
                <textarea
                  id={`${id}-current-tools`}
                  className="intake-field__textarea intake-field__textarea--compact"
                  placeholder="Google Workspace, Notion, Slack, HubSpot, spreadsheets, project tools…"
                  aria-invalid={Boolean(errors.currentTools)}
                  {...register('currentTools', { required: 'List the tools you currently use.' })}
                />
                {errors.currentTools && <p className="intake-field__error">{errors.currentTools.message}</p>}
              </div>
            </section>

            {/* Step 03: why the person wants OrkaOS and what follow-up they want. */}
            <section className="intake-form__section" aria-labelledby={`${id}-purpose-heading`}>
              <div className="intake-form__section-head">
                <span className="intake-form__step">03</span>
                <div>
                  <h3 id={`${id}-purpose-heading`}>Why OrkaOS</h3>
                  <p>Help us understand the friction you want OrkaOS to remove.</p>
                </div>
              </div>

              <fieldset className="intake-field">
                <legend className="intake-field__label">
                  Why do you want to use OrkaOS? <span className="intake-field__required">*</span>
                </legend>
                <div className="intake-checkbox-grid intake-checkbox-grid--plain">
                  {ORKA_USE_REASONS.map(([reason, description], index) => (
                    <CheckOption
                      key={reason}
                      id={`${id}-orka-reason-${index}`}
                      value={reason}
                      description={description}
                      registerField={orkaUseReasonRegistration}
                    />
                  ))}
                </div>
                {errors.orkaUseReasons && <p className="intake-field__error">{errors.orkaUseReasons.message}</p>}
              </fieldset>

              <div className="intake-field">
                <label className="intake-field__label" htmlFor={`${id}-orka-reason-details`}>
                  What is not working well today?
                </label>
                <textarea
                  id={`${id}-orka-reason-details`}
                  className="intake-field__textarea"
                  placeholder="Describe the complexity, missing capability, team handoff, or recurring work you want to improve."
                  aria-invalid={Boolean(errors.orkaUseReasonDetails)}
                  {...register('orkaUseReasonDetails')}
                />
                {errors.orkaUseReasonDetails && <p className="intake-field__error">{errors.orkaUseReasonDetails.message}</p>}
              </div>

              <fieldset className="intake-field">
                <legend className="intake-field__label">
                  What would you like to do with us? <span className="intake-field__required">*</span>
                </legend>
                <div className="intake-checkbox-grid intake-checkbox-grid--plain">
                  {PURPOSE_OPTIONS.map((purpose, index) => (
                    <CheckOption
                      key={purpose}
                      id={`${id}-purpose-${index}`}
                      value={purpose}
                      registerField={purposeRegistration}
                    />
                  ))}
                </div>
                {errors.purposeOptions && <p className="intake-field__error">{errors.purposeOptions.message}</p>}
              </fieldset>

              <div className="intake-field">
                <label className="intake-field__label" htmlFor={`${id}-purpose-details`}>
                  Tell us what a useful experience would look like
                </label>
                <textarea
                  id={`${id}-purpose-details`}
                  className="intake-field__textarea"
                  placeholder="What are you hoping to test, see, use, learn, or build with us?"
                  aria-invalid={Boolean(errors.purposeDetails)}
                  {...register('purposeDetails')}
                />
                {errors.purposeDetails && <p className="intake-field__error">{errors.purposeDetails.message}</p>}
              </div>
            </section>

            {/* Step 04: current-development apps first, expandable roadmap apps second. */}
            <section className="intake-form__section" aria-labelledby={`${id}-interests-heading`}>
              <div className="intake-form__section-head">
                <span className="intake-form__step">04</span>
                <div>
                  <h3 id={`${id}-interests-heading`}>Orka app interests</h3>
                  <p>Choose the Orka apps you want to follow today, then add any upcoming products that interest you.</p>
                </div>
              </div>

              <fieldset className="intake-field">
                <legend className="intake-field__label">
                  Which Orka apps interest you? <span className="intake-field__required">*</span>
                </legend>

                <div className="intake-interest-group">
                  <div className="intake-interest-group__head">
                    <h4>Available and in development</h4>
                    <span>{DEVELOPMENT_APPS.length} non-concept apps</span>
                  </div>
                  <div className="intake-checkbox-grid">
                    {DEVELOPMENT_APPS.map(([app, description, status], index) => (
                      <CheckOption
                        key={app}
                        id={`${id}-interest-development-${index}`}
                        value={app}
                        description={description}
                        badge={status}
                        registerField={interestRegistration}
                      />
                    ))}
                  </div>
                </div>

                <details className="intake-interest-group intake-interest-group--roadmap">
                  <summary>
                    <span>
                      <strong>Concept-stage apps on the roadmap</strong>
                      <small>Choose early concepts you want to follow.</small>
                    </span>
                    <span className="intake-interest-group__count">{ROADMAP_APPS.length} apps</span>
                  </summary>
                  <div className="intake-checkbox-grid intake-checkbox-grid--roadmap">
                    {ROADMAP_APPS.map(([app, description, status], index) => (
                      <CheckOption
                        key={app}
                        id={`${id}-interest-roadmap-${index}`}
                        value={app}
                        description={description}
                        badge={status}
                        registerField={interestRegistration}
                      />
                    ))}
                  </div>
                </details>

                {errors.interests && <p className="intake-field__error">{errors.interests.message}</p>}
              </fieldset>
            </section>

            {/* Step 05: prior familiarity and discovery-source context. */}
            <section className="intake-form__section" aria-labelledby={`${id}-history-heading`}>
              <div className="intake-form__section-head">
                <span className="intake-form__step">05</span>
                <div>
                  <h3 id={`${id}-history-heading`}>Previous connection</h3>
                  <p>Tell us how familiar you are with PROJXON and related programs.</p>
                </div>
              </div>

              <div className="intake-familiarity-grid">
                {[
                  ['projxonFamiliarity', 'PROJXON'],
                  ['momentumFamiliarity', 'Momentum Internship Program'],
                  ['growthAdvisoryFamiliarity', 'Growth Advisory Program'],
                  ['orkaFamiliarity', 'Orka / OrkaOS']
                ].map(([field, label]) => (
                  <div className="intake-field intake-familiarity" key={field}>
                    <label className="intake-field__label" htmlFor={`${id}-${field}`}>
                      {label} <span className="intake-field__required">*</span>
                    </label>
                    <div className="intake-select-wrap">
                      <select
                        id={`${id}-${field}`}
                        className="intake-field__select"
                        aria-invalid={Boolean(errors[field])}
                        {...register(field, { required: `Choose your familiarity with ${label}.` })}
                      >
                        <option value="">Select…</option>
                        {FAMILIARITY_OPTIONS.map((option) => (
                          <option value={option} key={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    {errors[field] && <p className="intake-field__error">{errors[field].message}</p>}
                  </div>
                ))}
              </div>

              <div className="intake-field">
                <label className="intake-field__label" htmlFor={`${id}-involvement-notes`}>
                  Previous involvement or context
                </label>
                <textarea
                  id={`${id}-involvement-notes`}
                  className="intake-field__textarea intake-field__textarea--compact"
                  placeholder="Share a program cohort, project, team member, event, or prior conversation."
                  {...register('involvementNotes')}
                />
              </div>

              <div className="intake-form__grid">
                <div className="intake-field">
                  <label className="intake-field__label" htmlFor={`${id}-discovery-source`}>
                    How did you find out about this? <span className="intake-field__required">*</span>
                  </label>
                  <div className="intake-select-wrap">
                    <select
                      id={`${id}-discovery-source`}
                      className="intake-field__select"
                      aria-invalid={Boolean(errors.discoverySource)}
                      {...register('discoverySource', { required: 'Choose how you found us.' })}
                    >
                      <option value="">Select a source…</option>
                      {DISCOVERY_OPTIONS.map((option) => (
                        <option value={option} key={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  {errors.discoverySource && <p className="intake-field__error">{errors.discoverySource.message}</p>}
                </div>

                <div className="intake-field">
                  <label className="intake-field__label" htmlFor={`${id}-discovery-details`}>
                    Referral, person, search, or other detail
                  </label>
                  <input
                    id={`${id}-discovery-details`}
                    className="intake-field__control"
                    type="text"
                    placeholder="Optional detail"
                    {...register('discoveryDetails')}
                  />
                </div>
              </div>
            </section>

            {/* Alpha-only follow-up. This block unmounts for every other goal. */}
            {isAlphaTesting && (
              <section
                className="intake-form__section intake-form__section--highlight"
                aria-labelledby={`${id}-testing-heading`}
              >
                <div className="intake-form__section-head">
                  <span className="intake-form__step">α</span>
                  <div>
                    <h3 id={`${id}-testing-heading`}>Alpha testing availability</h3>
                    <p>Alpha builds are incomplete and may change quickly. Your feedback directly informs the build.</p>
                  </div>
                </div>

                <fieldset className="intake-field">
                  <legend className="intake-field__label">
                    Have you participated in software testing before? <span className="intake-field__required">*</span>
                  </legend>
                  <div className="intake-radio-row">
                    {['Yes', 'No'].map((answer) => (
                      <label className="intake-radio" key={answer}>
                        <input
                          type="radio"
                          value={answer}
                          {...register('priorTesting', { required: 'Choose yes or no.' })}
                        />
                        <span className="intake-radio__dot" aria-hidden="true" />
                        <span>{answer}</span>
                      </label>
                    ))}
                  </div>
                  {errors.priorTesting && <p className="intake-field__error">{errors.priorTesting.message}</p>}
                </fieldset>

                <fieldset className="intake-field">
                  <legend className="intake-field__label">
                    Best general testing windows <span className="intake-field__required">*</span>
                  </legend>
                  <div className="intake-checkbox-grid intake-checkbox-grid--plain">
                    {TESTING_WINDOWS.map((windowLabel, index) => (
                      <CheckOption
                        key={windowLabel}
                        id={`${id}-testing-window-${index}`}
                        value={windowLabel}
                        registerField={testingWindowRegistration}
                      />
                    ))}
                  </div>
                  {errors.testingAvailability && <p className="intake-field__error">{errors.testingAvailability.message}</p>}
                </fieldset>

                <div className="intake-field">
                  <label className="intake-field__label" htmlFor={`${id}-testing-notes`}>
                    Specific availability or testing constraints <span className="intake-field__required">*</span>
                  </label>
                  <textarea
                    id={`${id}-testing-notes`}
                    className="intake-field__textarea intake-field__textarea--compact"
                    placeholder="For example: Tuesdays after 3 PM, up to two one-hour sessions per month."
                    aria-invalid={Boolean(errors.testingAvailabilityNotes)}
                    {...register('testingAvailabilityNotes', {
                      required: 'Share your specific availability.'
                    })}
                  />
                  {errors.testingAvailabilityNotes && <p className="intake-field__error">{errors.testingAvailabilityNotes.message}</p>}
                </div>
              </section>
            )}

            {/* Step 06: timezone and communication preferences; phone is conditional. */}
            <section className="intake-form__section" aria-labelledby={`${id}-contact-preferences-heading`}>
              <div className="intake-form__section-head">
                <span className="intake-form__step">06</span>
                <div>
                  <h3 id={`${id}-contact-preferences-heading`}>Contact preferences</h3>
                  <p>Choose the channels and timezone that make coordination easiest.</p>
                </div>
              </div>

              <div className="intake-field">
                <label className="intake-field__label" htmlFor={`${id}-timezone`}>
                  Timezone <span className="intake-field__required">*</span>
                </label>
                <div className="intake-select-wrap">
                  <select
                    id={`${id}-timezone`}
                    className="intake-field__select"
                    aria-invalid={Boolean(errors.timezone)}
                    {...register('timezone', { required: 'Choose your timezone.' })}
                  >
                    <option value="">Select a timezone</option>
                    <optgroup label="United States and territories">
                      {US_TIME_ZONES.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </optgroup>
                    {WORLD_TIME_ZONE_GROUPS.map(({ label, options }) => (
                      <optgroup key={label} label={label}>
                        {options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <p className="intake-field__hint">
                  U.S. zones use familiar labels such as EST, CST, MST, and PST. Global choices use precise IANA zones for daylight-saving accuracy.
                </p>
                {errors.timezone && <p className="intake-field__error">{errors.timezone.message}</p>}
              </div>

              <fieldset className="intake-field">
                <legend className="intake-field__label">
                  Best ways to communicate with you <span className="intake-field__required">*</span>
                </legend>
                <div className="intake-checkbox-grid intake-checkbox-grid--plain">
                  {COMMUNICATION_OPTIONS.map((method, index) => (
                    <CheckOption
                      key={method}
                      id={`${id}-communication-${index}`}
                      value={method}
                      registerField={communicationRegistration}
                    />
                  ))}
                </div>
                {errors.communicationMethods && <p className="intake-field__error">{errors.communicationMethods.message}</p>}
              </fieldset>

              {needsPhone && (
                <div className="intake-field">
                  <label className="intake-field__label" htmlFor={`${id}-phone`}>
                    Phone number <span className="intake-field__required">*</span>
                  </label>
                  <input
                    id={`${id}-phone`}
                    className="intake-field__control"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    aria-invalid={Boolean(errors.phone)}
                    {...register('phone', { required: 'Enter a phone number for calls or texts.' })}
                  />
                  {errors.phone && <p className="intake-field__error">{errors.phone.message}</p>}
                </div>
              )}
            </section>
            <div className="intake-turnstile">
              <div ref={turnstileContainerRef} />

              {errors.root?.server && (
                <p
                  className="intake-field__error"
                  role="alert"
                >
                  {errors.root.server.message}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Sticky action footer; submit targets the form above through `formId`. */}
        <footer className="intake-modal__foot">
          <p className="intake-modal__privacy">
            We will only use this information to follow up on the path you select.
          </p>
          <div className="intake-modal__actions">
            <button
              type="button"
              className="intake-button intake-button--secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              form={formId}
              className="intake-button intake-button--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting…' : 'Submit intake'}
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
