import React, { useEffect, useState } from 'react';
import IntakeForm from './IntakeForm';
import Icon from './Icon';
import {
  ORKA_PRODUCTS,
  ORKA_PRODUCTS_BY_ID,
  PRODUCT_GROUP_FILTERS,
  ROADMAP_PHASES,
  ROADMAP_SEQUENCE,
  ROADMAP_STATUS_META
} from './products.js';

/**
 * Landing-page developer map
 * --------------------------
 * This component owns the public OrkaOS page and the small pieces of UI state
 * that make its demos interactive. The large visual blocks are intentionally
 * grouped in the JSX in the same order that they appear on the page.
 *
 * Useful class families when tracing a widget into index.css:
 * - `rail-*` / `orka-actions`: the fixed left and right side panels.
 * - `os-*`: the desktop product-preview window.
 * - `collab-*`: the Google Workspace + OrkaOS explainer.
 * - `product-*` and `catalog-*`: the interactive product explorer and catalog.
 * - `scope-*`, `wl-*`, `phone-*`, and `gantt-*`: the adoption, brand, mobile,
 *   and roadmap widgets respectively.
 *
 * Keep new widget markup together here, then place its base CSS beside the
 * matching class-family section in index.css. This makes the project much
 * easier to scan than scattering one widget across unrelated regions.
 */

// Persistent UI settings and the section IDs used by the left progress rail.
const THEME_STORAGE_KEY = 'orkaos-theme';
const RAIL_SECTIONS = ['top', 'problem', 'progression', 'ecosystem', 'value', 'whitelabel-section', 'cta'];

// Product data lives in products.js so the catalog, roadmap, and intake form
// always expose the same public app list and roadmap status.

/**
 * Resolve the first theme before React paints.
 *
 * The saved preference wins; otherwise the browser's color-scheme preference is
 * used. Directly setting `documentElement.dataset.theme` here prevents a light
 * flash before the first effect runs.
 */
function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const initialTheme = storedTheme === 'light' || storedTheme === 'dark'
      ? storedTheme
      : window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';

    document.documentElement.dataset.theme = initialTheme;
    return initialTheme;
  } catch {
    const initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    document.documentElement.dataset.theme = initialTheme;
    return initialTheme;
  }
}

async function sendIntakeSubmission(payload) {
  const response = await fetch('/api/intake', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const result = await response
    .json()
    .catch(() => ({}));

  if (!response.ok || !result.ok) {
    throw new Error(
      result.error ||
      'Your submission could not be completed.'
    );
  }

  return result;
}

export default function App() {
  // Modal state: `formIntent` preselects the intake path that opened the dialog.
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formIntent, setFormIntent] = useState('');

  // Page-level display state shared by the theme toggle and interactive widgets.
  const [theme, setTheme] = useState(getInitialTheme);
  const [selectedModule, setSelectedModule] = useState('orka-vault');
  const [catalogFilter, setCatalogFilter] = useState('all');
  const [brandSwatch, setBrandSwatch] = useState('ocean');
  const [activeRailSection, setActiveRailSection] = useState('top');
  const [isRailCollapsed, setIsRailCollapsed] = useState(false);

  async function submitIntakeForm(payload) {
    const response = await fetch('/api/intake', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    let result = null;

    try {
      result = await response.json();
    } catch {
      // The generic error below handles invalid responses.
    }

    if (!response.ok || !result?.ok) {
      throw new Error(
        result?.error ||
        'Unable to submit the form. Please try again.'
      );
    }

    return result;
  }

  // Keep the root data attribute and localStorage in sync after a theme change.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // The theme still works when storage is unavailable.
    }
  }, [theme]);


  // Scroll-spy for the left rail. requestAnimationFrame batches rapid scroll and
  // resize events so this visual progress indicator does not trigger extra work.
  useEffect(() => {
    let frameId = 0;

    const updateActiveSection = () => {
      frameId = 0;
      const activationLine = window.innerHeight * 0.36;
      let nextSection = RAIL_SECTIONS[0];

      RAIL_SECTIONS.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section && section.getBoundingClientRect().top <= activationLine) {
          nextSection = sectionId;
        }
      });

      setActiveRailSection((current) => current === nextSection ? current : nextSection);
    };

    const queueUpdate = () => {
      if (!frameId) frameId = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', queueUpdate);

    return () => {
      window.removeEventListener('scroll', queueUpdate);
      window.removeEventListener('resize', queueUpdate);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark');
  };

  // Centralize the active-link class and accessible current-location attribute.
  const railLinkProps = (sectionId) => ({
    className: `rail-link${activeRailSection === sectionId ? ' is-active' : ''}`,
    'aria-current': activeRailSection === sectionId ? 'location' : undefined
  });

  // Every call-to-action uses this helper so the modal always opens with the
  // matching intake goal selected.
  const openForm = (intent) => {
    setFormIntent(intent);
    setIsFormOpen(true);
  };

  const handleIntakeSubmit = async (payload) => {
    try {
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response
        .json()
        .catch(() => ({}));

      if (!response.ok || !result.ok) {
        throw new Error(
          result.error ||
          'Your submission could not be completed.'
        );
      }

      if (result.emailSent === false) {
        window.alert(
          'Your submission was saved, but the notification email could not be sent.'
        );
      } else {
        window.alert(
          'Thank you. Your submission was received.'
        );
      }

      return result;
    } catch (error) {
      console.error('Intake submission failed:', error);

      window.alert(
        error.message ||
        'Your submission could not be completed. Please try again.'
      );

      // This prevents the form from clearing when submission fails.
      throw error;
    }
  };

  // Derived collections feed the product explorer. They are calculated from the
  // catalog rather than duplicated in markup, keeping filters and details aligned.
  const selectedProduct = ORKA_PRODUCTS.find((product) => product.id === selectedModule) || ORKA_PRODUCTS[0];
  const featuredProducts = ORKA_PRODUCTS.filter((product) => product.featured);
  const visibleCatalogProducts = ORKA_PRODUCTS.filter((product) =>
    catalogFilter === 'all' || product.groupId === catalogFilter
  );
  const roadmapStageCounts = ROADMAP_PHASES.map((phase) => ({
    ...phase,
    count: ORKA_PRODUCTS.filter((product) => product.status.toLowerCase() === phase.id).length
  }));
  const availableProductCount = ORKA_PRODUCTS.filter((product) =>
    product.status === 'Live' || product.status === 'Production'
  ).length;

  return (
    <>
      {/*
        Full-width page shell. `.orka-shell` controls the collapsible navigation
        rail, main content column, and bottom action footer.
      */}
      <div className={`orka-shell${isRailCollapsed ? ' is-rail-collapsed' : ''}`} id="orka-shell">
        {/*
          Left progress rail: section links mirror `RAIL_SECTIONS`. When adding a
          tracked page section, update both the ID list and the matching link here.
        */}
        <aside className="orka-rail" aria-label="Page progress">
          <div className="orka-side-inner">
            <button
              className="rail-collapse-toggle"
              type="button"
              onClick={() => setIsRailCollapsed((isCollapsed) => !isCollapsed)}
              aria-expanded={!isRailCollapsed}
              aria-controls="rail-navigation"
              aria-label={isRailCollapsed ? 'Expand page navigation' : 'Collapse page navigation'}
              title={isRailCollapsed ? 'Expand navigation' : 'Collapse navigation'}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={isRailCollapsed ? 'm9 18 6-6-6-6' : 'm15 18-6-6 6-6'} />
              </svg>
            </button>

            <a className="rail-brand" href="#top">
              <span className="rail-brand-mark">
                <span className="official-orka-logo" aria-hidden="true" />
              </span>
              <span className="rail-brand-label">OrkaOS</span>
            </a>
            <p className="rail-kicker">Explore the current</p>

            <nav className="rail-nav" id="rail-navigation" aria-label="Page sections">
              <span className="rail-progress" style={{ height: `${Math.max(0, RAIL_SECTIONS.indexOf(activeRailSection)) * 50}px` }} />

              <a {...railLinkProps('top')} href="#top">
                <span className="rail-symbol">
                  <span className="rail-token">
                    <span className="official-orka-logo" aria-hidden="true" />
                  </span>
                </span>
                <span className="rail-link-label">Start</span>
              </a>

              <a {...railLinkProps('problem')} href="#problem">
                <span className="rail-symbol">
                  <svg viewBox="0 0 64 40" aria-hidden="true">
                    <path className="g-fill" d="M4 25C13 10 27 8 35 16c6-6 17-4 23 5-9-2-13 4-15 10-8-8-19-8-26 0-3-5-7-6-13-6Z" />
                    <circle className="g-blue" cx="34" cy="18" r="2.2" />
                  </svg>
                </span>
                <span className="rail-link-label">Why OrkaOS</span>
              </a>

              <a {...railLinkProps('progression')} href="#progression">
                <span className="rail-symbol">
                  <svg viewBox="0 0 64 52" aria-hidden="true">
                    <path className="g-stroke" d="M7 17c11-8 21-8 33 0s14 8 17 3" />
                    <path className="g-stroke" d="M7 27c11-8 21-8 33 0s14 8 17 3" />
                    <path className="g-stroke" d="M7 37c11-8 21-8 33 0s14 8 17 3" />
                  </svg>
                </span>
                <span className="rail-link-label">Build the Pod</span>
              </a>

              <a {...railLinkProps('ecosystem')} href="#ecosystem">
                <span className="rail-symbol">
                  <svg viewBox="0 0 64 64" aria-hidden="true">
                    <circle className="g-stroke" cx="32" cy="32" r="24" />
                    <circle className="g-stroke" cx="32" cy="32" r="15" />
                    <circle className="g-blue" cx="32" cy="32" r="5" />
                  </svg>
                </span>
                <span className="rail-link-label">Explore the Stack</span>
              </a>

              <a {...railLinkProps('value')} href="#value">
                <span className="rail-symbol">
                  <svg viewBox="0 0 64 52" aria-hidden="true">
                    <rect className="g-stroke" x="5" y="7" width="54" height="38" rx="5" />
                    <path className="g-stroke" d="M19 8v36M45 8v36" />
                    <path className="g-stroke" d="M23 17h17M23 26h13M23 35h15" />
                  </svg>
                </span>
                <span className="rail-link-label">Find the Fit</span>
              </a>

              <a {...railLinkProps('whitelabel-section')} href="#whitelabel-section">
                <span className="rail-symbol">
                  <svg viewBox="0 0 64 52" aria-hidden="true">
                    <rect className="g-stroke" x="7" y="7" width="50" height="38" rx="5" />
                    <path className="g-stroke" d="M16 17h19M16 25h28" />
                    <path className="g-stroke" d="M16 35c9-8 16-8 27 0" />
                    <circle className="g-blue" cx="48" cy="17" r="3" />
                  </svg>
                </span>
                <span className="rail-link-label">Make It Yours</span>
              </a>

              <a {...railLinkProps('cta')} href="#cta">
                <span className="rail-symbol">
                  <svg viewBox="0 0 64 52" aria-hidden="true">
                    <path className="g-stroke" d="M7 38c10-17 19-17 27-7s14 8 23-8" />
                    <path className="g-stroke" d="M48 16h9v9" />
                    <circle className="g-blue" cx="8" cy="38" r="3" />
                  </svg>
                </span>
                <span className="rail-link-label">Join the Pod</span>
              </a>
            </nav>

            <p className="rail-note"><strong>Start with one.</strong><br />Grow into the ecosystem as your pod needs it.</p>

            <a className="rail-social rail-social--icon-only" href="https://www.linkedin.com/company/orkaos/about/" target="_blank" rel="noopener noreferrer" aria-label="Follow OrkaOS on LinkedIn" title="Follow OrkaOS on LinkedIn">
              <svg className="linkedin-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V8.98h3.41v1.57h.05c.48-.9 1.63-1.85 3.35-1.85 3.58 0 4.25 2.36 4.25 5.43v6.32ZM5.33 7.41a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.11 20.45H3.55V8.98h3.56v11.47Z" />
              </svg>
              <span className="sr-only">Follow OrkaOS on LinkedIn</span>
            </a>
          </div>
        </aside>

        {/* Center column: the public landing-page content and interactive demos. */}
        <main className="orka-center" id="siteMain">
          {/* Sticky site navigation and persisted light/dark theme control. */}
          <header className="nav">
            <div className="nav-inner">
              <a className="brand" href="#top">
                <span className="orka-mark" aria-hidden="true">
                  <span className="official-orka-logo" aria-hidden="true" />
                </span>
                OrkaOS
              </a>
              <nav className="nav-links">
                <a href="#problem">Why</a>
                <a href="#how">How it works</a>
                <a href="#ecosystem">Ecosystem</a>
                <a href="#roadmap">Roadmap</a>
                <a href="#who">Who it's for</a>
              </nav>
              <button
                className="theme-toggle"
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                aria-pressed={theme === 'dark'}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                <span className="theme-toggle-icon" aria-hidden="true">
                  {theme === 'dark' ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
                    </svg>
                  )}
                </span>
                <span className="theme-toggle-label">{theme === 'dark' ? 'Dark' : 'Light'}</span>
              </button>
              <a className="nav-cta" href="#cta">
                Start with a Module →
              </a>
            </div>
          </header>
          {/* Hero: primary positioning, requirements note, and page-level CTAs. */}
          <section className="hero" id="top">
            <div className="wrap hero-inner">
              <div className="hero-mark" aria-hidden="true">
                <span className="orka-mark" style={{ width: 60, height: 60 }}>
                  <span className="official-orka-logo" aria-hidden="true" />
                </span>
              </div>
              <span className="eyebrow" style={{ marginTop: 22 }}>
                The OrkaOS Ecosystem
              </span>
              <h1 className="h1">The Operating System for Teams Ready to Scale</h1>
              <p className="lead">
                OrkaOS is a modular micro-stack built on Google Workspace that helps
                small teams organize, collaborate, and scale — without the complexity of
                enterprise tools.
              </p>
              <ul className="hero-bullets">
                <li>Built on Google Workspace</li>
                <li>Designed for teams of 1–30</li>
                <li>No setup, no complexity</li>
              </ul>
              <div className="hero-cta">
                <a href="#cta" className="btn btn-primary">
                  Start with a Module →
                </a>
                <a href="#ecosystem" className="btn btn-secondary">
                  Explore the Ecosystem
                </a>
                <a href="#how" className="btn btn-ghost">
                  See how it works ↓
                </a>
              </div>
              <div className="workspace-required" role="note">
                <span className="workspace-required-badge">
                  Google Workspace required
                </span>
                <span>
                  OrkaOS is not a standalone suite. It adds a guided operating layer on
                  top of Gmail, Drive, Calendar, and Google identity.
                </span>
              </div>
            </div>
          </section>
          {/* Problem cards: explain the gap between ad-hoc and enterprise tools. */}
          <section id="problem">
            <div className="wrap">
              <div className="section-head">
                <span className="eyebrow">Why this exists</span>
                <h2 className="h2">Scaling a team breaks everything</h2>
                <p className="lead">
                  Going from 1 → 5 people is harder than 5 → 50. The tools you start
                  with stop working — and the tools built for scale are too much, too
                  soon.
                </p>
              </div>
              <div className="problem-grid">
                <div className="problem-card">
                  <div className="icon"><Icon name="unlink" /></div>
                  <h4>Too many tools, nothing connected</h4>
                  <p>
                    Sheets here, Trello there, Slack somewhere else. Nothing talks.
                    Everything leaks.
                  </p>
                </div>
                <div className="problem-card">
                  <div className="icon"><Icon name="chart" /></div>
                  <h4>Google Sheets isn't enough anymore</h4>
                  <p>
                    You've outgrown ad-hoc spreadsheets, but a real CRM or PM tool feels
                    like overkill.
                  </p>
                </div>
                <div className="problem-card">
                  <div className="icon"><Icon name="building" /></div>
                  <h4>Enterprise software is too complex, too early</h4>
                  <p>
                    HubSpot, Jira, Workday — built for teams of 200, not founders
                    running everything.
                  </p>
                </div>
              </div>
              <p className="problem-punch">
                OrkaOS fills the gap between <span className="accent">chaos</span> and{" "}
                <span className="accent">scale</span>.
              </p>
            </div>
          </section>
          {/* Three-layer model: Workspace foundation, OrkaOS layer, and modules. */}
          <section id="what">
            <div className="wrap">
              <div className="section-head">
                <span className="eyebrow">What is OrkaOS</span>
                <h2 className="h2">
                  A startup operating system, built on what you already use
                </h2>
                <p className="lead">
                  <strong>OrkaOS requires Google Workspace.</strong> It is not a
                  standalone suite: it adds a micro-stack operating layer on top of
                  Gmail, Drive, Calendar, and Google identity so your team can run the
                  business with structure from day one.
                </p>
              </div>
              <div className="workspace-foundation-note">
                <strong>Keep the workspace you already use.</strong>
                <span>
                  Google Workspace stays underneath the system; OrkaOS connects the
                  operating routines around it.
                </span>
              </div>
              <div className="analogy">
                <div className="analogy-card">
                  <div className="label">Layer 1</div>
                  <div className="name">Google Workspace</div>
                  <div className="role">
                    Your infrastructure — email, drive, identity.
                  </div>
                </div>
                <div className="analogy-card center">
                  <div className="label">Layer 2</div>
                  <div className="name">OrkaOS</div>
                  <div className="role">
                    The operating system layer that ties it all together.
                  </div>
                </div>
                <div className="analogy-card">
                  <div className="label">Layer 3</div>
                  <div className="name">Orka Modules</div>
                  <div className="role">
                    Apps and tools you turn on as you need them.
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Desktop preview section. The mock window is decorative, not a live app. */}
          <section id="demo">
            <div className="wrap">
              <div className="section-head">
                <span className="eyebrow">Live preview</span>
                <h2 className="h2">A familiar feel, built for first-time founders</h2>
                <p className="lead">
                  OrkaOS blends the simplicity of Google Workspace with the polish of
                  macOS — anyone can run a business without a learning curve.
                </p>
              </div>
              {/*
                Desktop-preview widget (`window-*` and `os-*` classes): browser chrome,
                sidebar, app grid, and dock are kept as one block for easy editing.
              */}
              <div className="os-window">
                <div className="window-bar">
                  <div className="traffic">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                  </div>
                  <div className="address"><Icon name="lock" size={12} /> <span>orkaos.app/projxon</span></div>
                  <div className="window-actions">
                    <span />
                    <span />
                  </div>
                </div>
                <div className="os-body">
                  <aside className="os-sidebar">
                    <div className="user-chip">
                      <div className="avatar">PX</div>
                      <div>
                        <div className="user-name">PROJXON</div>
                        <div className="user-role">Phelan · Founder</div>
                      </div>
                    </div>
                    <nav className="side-nav">
                      <a className="nav-item active">
                        <span className="ni"><Icon name="home" /></span>Home
                      </a>
                      <a className="nav-item">
                        <span className="ni"><Icon name="grid" /></span>My Apps
                      </a>
                      <a className="nav-item">
                        <span className="ni"><Icon name="compass" /></span>Discover
                      </a>
                      <a className="nav-item">
                        <span className="ni"><Icon name="clock" /></span>Activity
                      </a>
                      <a className="nav-item">
                        <span className="ni"><Icon name="settings" /></span>Settings
                      </a>
                    </nav>
                    <div className="side-section">
                      <div className="side-label">Recent</div>
                      <a className="nav-item small">OrkaVault</a>
                      <a className="nav-item small">OrkaSOP</a>
                      <a className="nav-item small">OrkaTask</a>
                    </div>
                  </aside>
                  <main className="os-main">
                    <div className="os-topbar">
                      <div className="search">
                        <span className="search-icon"><Icon name="search" /></span>
                        <input placeholder="Search apps, contacts, files…" />
                        <span className="kbd">⌘K</span>
                      </div>
                      <div className="topbar-actions">
                        <button className="icon-btn" type="button" title="Notifications" aria-label="Notifications">
                          <Icon name="bell" />
                        </button>
                        <button className="icon-btn" type="button" title="Help" aria-label="Help">
                          <Icon name="help" />
                        </button>
                        <div
                          className="avatar"
                          style={{ width: 30, height: 30, fontSize: 11 }}
                        >
                          PX
                        </div>
                      </div>
                    </div>
                    <div className="welcome">
                      <h3>Good morning, Phelan <Icon name="sun" size={18} /></h3>
                      <p>
                        3 apps installed at PROJXON · 18 more included on the current
                        website roadmap
                      </p>
                    </div>
                    <div className="app-grid">
                      <div className="app-tile installed">
                        <div className="tile-icon">
                          <span className="official-orka-logo" aria-hidden="true" />
                        </div>
                        <div className="tile-name">OrkaVault</div>
                      </div>
                      <div className="app-tile installed">
                        <div className="tile-icon">
                          <span className="official-orka-logo" aria-hidden="true" />
                        </div>
                        <div className="tile-name">OrkaSOP</div>
                      </div>
                      <div className="app-tile installed">
                        <div className="tile-icon">
                          <span className="official-orka-logo" aria-hidden="true" />
                        </div>
                        <div className="tile-name">OrkaTask</div>
                      </div>
                      <div className="app-tile">
                        <div className="tile-icon">
                          <span className="official-orka-logo" aria-hidden="true" />
                        </div>
                        <div className="tile-name">OrkaHR</div>
                      </div>
                      <div className="app-tile">
                        <div className="tile-icon">
                          <span className="official-orka-logo" aria-hidden="true" />
                        </div>
                        <div className="tile-name">OrkaATS</div>
                      </div>
                      <div className="app-tile">
                        <div className="tile-icon">
                          <span className="official-orka-logo" aria-hidden="true" />
                        </div>
                        <div className="tile-name">OrkaMarketing</div>
                      </div>
                      <div className="app-tile app-tile--ai">
                        <div className="tile-icon tile-icon--ai" aria-hidden="true">AI</div>
                        <div className="tile-name">OrkaProcess</div>
                      </div>
                      <div className="app-tile app-tile--ai">
                        <div className="tile-icon tile-icon--ai" aria-hidden="true">AI</div>
                        <div className="tile-name">OrkaAI</div>
                      </div>
                    </div>
                  </main>
                </div>
                <div className="dock">
                  <div className="dock-icon" title="OrkaVault">
                    <span className="official-orka-logo" aria-hidden="true" />
                  </div>
                  <div className="dock-icon" title="OrkaSOP">
                    <span className="official-orka-logo" aria-hidden="true" />
                  </div>
                  <div className="dock-icon" title="OrkaTask">
                    <span className="official-orka-logo" aria-hidden="true" />
                  </div>
                  <div className="dock-divider" />
                  <div className="dock-icon" title="OrkaOS">
                    <span className="official-orka-logo" aria-hidden="true" />
                  </div>
                  <div className="dock-divider" />
                  <div className="dock-icon ai" title="OrkaAI · AI Agent">
                    AI
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Collaboration explainer: a three-step visual adoption flow. */}
          <section id="progression">
            <div className="wrap">
              <div className="section-head">
                <span className="eyebrow">Google Workspace + OrkaOS</span>
                <h2 className="h2">
                  Keep Google Workspace. Add the structure around it.
                </h2>
                <p className="lead">
                  OrkaOS is a modular micro-stack designed to augment Google
                  Workspace—not replace it. Add the right modules as your team grows, so
                  the work is easier to see and coordinate.
                </p>
              </div>
              {/*
                Collaboration widget (`collab-*`): each card is one adoption step and
                connector elements are decorative bridges between those steps.
              */}
              <div
                className="collab-widget"
                aria-label="A simple view of how Google Workspace and OrkaOS work together"
              >
                <div className="collab-widget-head">
                  <div>
                    <p className="collab-kicker">How it works</p>
                    <h3>Keep Google. Add only what your team needs.</h3>
                  </div>
                  <div className="collab-badge">
                    <Icon name="checkCircle" size={15} /> Built for Google Workspace
                  </div>
                </div>
                <div className="collab-map">
                  <article className="collab-card collab-card--tools">
                    <p className="collab-card-label">Step 1 · Keep your tools</p>
                    <h3>Stay in Google Workspace</h3>
                    <p>Keep the tools your team already uses every day.</p>
                    <div
                      className="collab-tools"
                      aria-label="Google Workspace tools that stay in place"
                    >
                      <div className="collab-tool">
                        <span className="collab-tool-icon collab-tool-icon--docs">
                          D
                        </span>
                        <span>Docs</span>
                        <small>Write</small>
                      </div>
                      <div className="collab-tool">
                        <span className="collab-tool-icon collab-tool-icon--sheets">
                          S
                        </span>
                        <span>Sheets</span>
                        <small>Track</small>
                      </div>
                      <div className="collab-tool">
                        <span className="collab-tool-icon collab-tool-icon--gmail">
                          M
                        </span>
                        <span>Gmail</span>
                        <small>Email</small>
                      </div>
                      <div className="collab-tool">
                        <span className="collab-tool-icon collab-tool-icon--calendar">
                          C
                        </span>
                        <span>Calendar</span>
                        <small>Plan</small>
                      </div>
                    </div>
                  </article>
                  <div className="collab-connector" aria-hidden="true">
                    <span className="collab-connector-line" />
                    <span className="collab-connector-label">add a layer</span>
                  </div>
                  <article className="collab-card collab-card--orka">
                    <p className="collab-card-label">Step 2 · Add one tool</p>
                    <h3>Solve one problem at a time</h3>
                    <p>
                      Choose a small OrkaOS tool for the work that is getting stuck.
                    </p>
                    <div className="collab-core">
                      <span className="collab-core-mark" aria-hidden="true">
                        <span className="official-orka-logo" />
                      </span>
                      <span>OrkaOS</span>
                    </div>
                    <div className="collab-layer-list" aria-label="How to adopt OrkaOS">
                      <span>Start small</span>
                      <span>Fix one gap</span>
                      <span>Work with Google</span>
                      <span>Add more later</span>
                    </div>
                  </article>
                  <div className="collab-connector" aria-hidden="true">
                    <span className="collab-connector-line" />
                    <span className="collab-connector-label">bring together</span>
                  </div>
                  <article className="collab-card collab-card--flow">
                    <p className="collab-card-label">Step 3 · Bring work together</p>
                    <h3>See the work more clearly</h3>
                    <p>
                      Use Orka apps when they help, then bring activity into one shared
                      view.
                    </p>
                    <div
                      className="collab-work-list"
                      aria-label="Examples of the OrkaOS experience"
                    >
                      <div className="collab-work-item">
                        <span className="collab-work-state collab-work-state--done">
                          <Icon name="check" size={14} />
                        </span>
                        <div>
                          <b>OrkaChat</b>
                          <small>Team conversations</small>
                        </div>
                      </div>
                      <div className="collab-work-item">
                        <span className="collab-work-state"><Icon name="plus" size={14} /></span>
                        <div>
                          <b>More tools</b>
                          <small>Add them when needed</small>
                        </div>
                      </div>
                      <div className="collab-work-item">
                        <span className="collab-work-state collab-work-state--today">
                          <Icon name="layers" size={14} />
                        </span>
                        <div>
                          <b>Workspace hub</b>
                          <small>One shared view · planned</small>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
                <div className="collab-widget-foot">
                  <span className="collab-foot-mark" aria-hidden="true">
                    +
                  </span>
                  <p>
                    <strong>Google Workspace is the base.</strong> OrkaOS fills the gaps
                    around it.
                  </p>
                  <span className="collab-foot-note">Start small.</span>
                </div>
              </div>
            </div>
          </section>
          {/* Product explorer and filterable catalog, both driven by ORKA_PRODUCTS. */}
          <section id="ecosystem">
            <div className="wrap">
              <div className="section-head">
                <span className="eyebrow">Product catalog</span>
                <h2 className="h2">Explore what OrkaOS is offering and building</h2>
                <p className="lead">
                  Browse the roadmap-approved Orka lineup, filter by OrkaOS.com group, and follow the apps
                  that fit your team best.
                </p>
              </div>

              {/*
                Featured product explorer: selector buttons update `selectedModule`;
                the detail panel reads the same product object and announces changes.
              */}
              <div className="product-explorer">
                <div className="product-explorer__list" role="list" aria-label="Featured Orka products">
                  {featuredProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      className={`product-selector${selectedProduct.id === product.id ? ' is-active' : ''}${product.ai ? ' is-ai' : ''}`}
                      onClick={() => setSelectedModule(product.id)}
                      aria-pressed={selectedProduct.id === product.id}
                    >
                      <span className="product-selector__mark" aria-hidden="true">
                        {product.ai ? 'AI' : <span className="official-orka-logo" />}
                      </span>
                      <span className="product-selector__copy">
                        <strong>{product.name}</strong>
                        <small>{product.status} · {product.priority}</small>
                      </span>
                    </button>
                  ))}
                </div>

                <article className={`product-detail${selectedProduct.ai ? ' is-ai' : ''}`} aria-live="polite">
                  <div className="product-detail__head">
                    <span className="product-detail__mark" aria-hidden="true">
                      {selectedProduct.ai ? 'AI' : <span className="official-orka-logo" />}
                    </span>
                    <div>
                      <p className="product-detail__series">{selectedProduct.group} group</p>
                      <h3>{selectedProduct.name}</h3>
                    </div>
                    <span className={`product-status product-status--${selectedProduct.status.toLowerCase()}`}>
                      {selectedProduct.status}
                    </span>
                  </div>

                  <p className="product-detail__summary">{selectedProduct.summary}</p>

                  <dl className="product-detail__facts">
                    <div>
                      <dt>Roadmap stage</dt>
                      <dd>{selectedProduct.priority}</dd>
                    </div>
                    <div>
                      <dt>Built around</dt>
                      <dd>{selectedProduct.google}</dd>
                    </div>
                  </dl>

                  <div className="product-detail__pairs">
                    <span>Designed to pair with</span>
                    <div>
                      {selectedProduct.pairs.map((pair) => <span key={pair}>{pair}</span>)}
                    </div>
                  </div>

                  <button type="button" className="btn btn-primary" onClick={() => openForm('Join the Pod')}>
                    Follow {selectedProduct.name}
                  </button>
                </article>
              </div>

              {/* OrkaOS.com group filters only change which catalog cards are rendered below. */}
              <div className="catalog-toolbar" role="group" aria-label="Filter Orka products by OrkaOS.com group">
                {PRODUCT_GROUP_FILTERS.map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={`catalog-filter${catalogFilter === value ? ' is-active' : ''}`}
                    onClick={() => setCatalogFilter(value)}
                    aria-pressed={catalogFilter === value}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/*
                Full catalog grid. Each card keeps its status, description, metadata,
                and related actions together so a future card change is self-contained.
              */}
              <div className="module-catalog-grid" aria-live="polite">
                {visibleCatalogProducts.map((product) => (
                  <article className={`catalog-card${product.ai ? ' is-ai' : ''}`} key={product.id}>
                    <div className="catalog-card-top">
                      <span className={`catalog-status catalog-status--${product.status.toLowerCase()}`}>{product.status}</span>
                      <span className="catalog-orbit">{product.priority}</span>
                    </div>
                    <h3>{product.name}</h3>
                    <p>{product.summary}</p>
                    <div className="catalog-pairs">
                      <b>{product.group}</b>
                      <span>{product.google}</span>
                    </div>
                    <div className="catalog-card__actions">
                      <button type="button" className="catalog-card__action catalog-card__action--detail" onClick={() => {
                        setSelectedModule(product.id);
                        document.getElementById('ecosystem')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}>
                        View details
                      </button>
                      <button type="button" className="catalog-card__action catalog-card__action--follow" onClick={() => {
                        setSelectedModule(product.id);
                        openForm('Join the Pod');
                      }}>
                        Follow {product.name} →
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
          {/* Product roadmap follows the catalog so people can move directly from discovery to delivery status. */}
          <section id="roadmap">
            <div className="wrap">
              <div className="section-head">
                <span className="eyebrow">Product roadmap</span>
                <h2 className="h2">From concept to live, in one view</h2>
                <p className="lead">
                  The public roadmap includes only apps assigned to an OrkaOS.com group. Each bar shows how far an included app has moved through the shared delivery path.
                </p>
              </div>

              <div className="roadmap-overview" aria-label="OrkaOS roadmap summary">
                <div className="roadmap-overview__total">
                  <span>Public roadmap</span>
                  <strong>{ORKA_PRODUCTS.length} apps</strong>
                  <small>{availableProductCount} live or in production</small>
                </div>
                <div className="roadmap-overview__stages">
                  {roadmapStageCounts.map((phase) => (
                    <div className={`roadmap-stage-card roadmap-stage-card--${phase.id}`} key={phase.id}>
                      <span>{phase.label.replace(/^\d+ · /, '')}</span>
                      <strong>{phase.count}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="roadmap-scroll" tabIndex={0} aria-label="Scrollable OrkaOS product-stage roadmap">
                <div className="gantt roadmap-chart" role="table" aria-label="OrkaOS products progressing from concept to live">
                  <div className="gantt-header" role="rowgroup">
                    <div className="corner" role="columnheader">App &amp; current stage</div>
                    {ROADMAP_PHASES.map((phase) => (
                      <div key={phase.id} role="columnheader">{phase.label}</div>
                    ))}
                  </div>

                  {ROADMAP_SEQUENCE.map((roadmapItem) => {
                    const product = ORKA_PRODUCTS_BY_ID[roadmapItem.id];
                    const status = ROADMAP_STATUS_META[product.status];

                    return (
                      <div className="gantt-row" key={product.id} role="row">
                        <div className="gantt-tool" role="rowheader" title={product.summary}>
                          <span className={`gantt-icon${product.ai ? ' gantt-icon--ai' : ''}`} aria-hidden="true">
                            {product.ai ? 'AI' : <span className="official-orka-logo" aria-hidden="true" />}
                          </span>
                          <div>
                            <div className="gantt-name">
                              {product.name}
                              <span className={`owner-pill ${status.pillClass}`}>{product.status}</span>
                            </div>
                            <div className="gantt-owner">{product.group} group</div>
                          </div>
                        </div>
                        <div className="gantt-track" role="cell" aria-label={`${product.name} is currently in ${product.status}`}>
                          {ROADMAP_PHASES.map((phase) => (
                            <div key={`${product.id}-${phase.id}`} aria-hidden="true" />
                          ))}
                          <div
                            className={`gantt-bar ${status.barClass}${product.ai ? ' gantt-bar--ai' : ''}`}
                            style={{ left: `${roadmapItem.start}%`, width: `${roadmapItem.width}%` }}
                            title={`${product.name} · ${product.status}`}
                          >
                            <span>{status.barLabel}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="gantt-legend">
                    {roadmapStageCounts.map((phase) => (
                      <span className="key" key={`legend-${phase.id}`}>
                        <span className={`swatch ${phase.id}`} />
                        {phase.label.replace(/^\d+ · /, '')} · {phase.count}
                      </span>
                    ))}
                    <span className="roadmap-dependency-note">Bars show stage maturity, not promised dates.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Four-step onboarding path from a single module to a branded system. */}
          <section id="how">
            <div className="wrap">
              <div className="section-head">
                <span className="eyebrow">How you actually start</span>
                <h2 className="h2">You don't start with OrkaOS</h2>
                <p className="lead">
                  OrkaOS is the destination, not the starting point. Pick one module,
                  solve one problem, then expand from there.
                </p>
              </div>
              <div className="steps">
                <div className="step-card">
                  <div className="step-num">1</div>
                  <h4>Start with OrkaVault or OrkaSOP</h4>
                  <p>Organize company information or document one critical process first.</p>
                </div>
                <div className="step-card">
                  <div className="step-num">2</div>
                  <h4>Validate the next workflow</h4>
                  <p>
                    Add OrkaHR, OrkaATS, or OrkaMarketing when that workflow becomes the priority.
                  </p>
                </div>
                <div className="step-card">
                  <div className="step-num">3</div>
                  <h4>Unlock OrkaOS</h4>
                  <p>
                    Once you have 3+ modules, the control center activates: dashboards,
                    permissions, automations.
                  </p>
                </div>
                <div className="step-card final">
                  <div className="step-num">4</div>
                  <h4>Customize &amp; white-label</h4>
                  <p>
                    Add your logo, colors, and brand. Your team works inside{" "}
                    <em>your</em> platform.
                  </p>
                </div>
              </div>
            </div>
          </section>
          {/* Adoption-scope widget: simple team-size stages connected left to right. */}
          <section id="adoption-scope">
            <div className="wrap">
              <div className="section-head">
                <span className="eyebrow">Grow at your own depth</span>
                <h2 className="h2">Start small. Grow when you need to.</h2>
                <p className="lead">
                  Choose the stage that fits today. Add more only when your team needs
                  it.
                </p>
              </div>
              <div
                className="adoption-scope-widget"
                aria-label="Three simple ways to grow with OrkaOS"
              >
                <article className="scope-card scope-card--lean">
                  <div className="scope-stage">01 · Start</div>
                  <h3>
                    <span className="scope-number">3–5</span>
                    <span className="scope-phrase">in a pod</span>
                  </h3>
                  <p>Cover the essentials: people, processes, and communication.</p>
                  <div className="scope-modules">
                    <span>People</span>
                    <span>Process</span>
                    <span>Comms</span>
                  </div>
                </article>
                <div className="scope-connector" aria-hidden="true">
                  <span />
                </div>
                <article className="scope-card scope-card--operate">
                  <div className="scope-stage">02 · Build</div>
                  <h3>
                    <span className="scope-number">10–15</span>
                    <span className="scope-phrase">in a team</span>
                  </h3>
                  <p>Add the tools that keep shared work clear and moving.</p>
                  <div className="scope-modules">
                    <span>Planning</span>
                    <span>Projects</span>
                    <span>Customers</span>
                  </div>
                </article>
                <div className="scope-connector" aria-hidden="true">
                  <span />
                </div>
                <article className="scope-card scope-card--ecosystem">
                  <div className="scope-stage">03 · Scale</div>
                  <h3>
                    <span className="scope-number">20–30</span>
                    <span className="scope-phrase">for an organization</span>
                  </h3>
                  <p>Bring in deeper tools as roles, routines, and volume grow.</p>
                  <div className="scope-modules">
                    <span>Training</span>
                    <span>Automation</span>
                    <span>Insights</span>
                  </div>
                </article>
              </div>
              <p className="scope-bottom-note">
                Start with what helps now. Add the next layer when it earns its place.
              </p>
            </div>
          </section>
          {/* Reusable value cards. Number and copy are intentionally kept together. */}
          <section id="value">
            <div className="wrap">
              <div className="section-head">
                <span className="eyebrow">The value</span>
                <h2 className="h2">Built for simplicity, designed for scale</h2>
                <p className="lead">
                  Five things that make OrkaOS feel different the second you turn it on.
                </p>
              </div>
              <div className="value-grid">
                <div className="value-card">
                  <div className="value-num">01</div>
                  <h4>No integration required</h4>
                  <p>
                    Every module talks to every other module from day one — no Zapier,
                    no engineers.
                  </p>
                </div>
                <div className="value-card">
                  <div className="value-num">02</div>
                  <h4>Intuitive by design</h4>
                  <p>
                    No training. No certifications. If you've used Google Docs, you can
                    run OrkaOS.
                  </p>
                </div>
                <div className="value-card">
                  <div className="value-num">03</div>
                  <h4>Modular growth</h4>
                  <p>
                    Add tools as you need them. Pay for what's on. Turn things off when
                    you don't.
                  </p>
                </div>
                <div className="value-card">
                  <div className="value-num">04</div>
                  <h4>White-labeled experience</h4>
                  <p>
                    Your team works inside <em>your</em> platform — not someone else's
                    brand.
                  </p>
                </div>
                <div className="value-card">
                  <div className="value-num">05</div>
                  <h4>Built for non-technical founders</h4>
                  <p>
                    No setup complexity. No admin console. You're operating in 30
                    minutes.
                  </p>
                </div>
              </div>
            </div>
          </section>
          {/* White-label preview. `data-swatch` lets CSS recolor the mock instantly. */}
          <section id="whitelabel-section" data-swatch={brandSwatch}>
            <div className="wrap">
              <div className="whitelabel">
                <div className="wl-grid">
                  <div>
                    <span className="wl-eyebrow">Your business, your OS</span>
                    <h2>It feels like your company</h2>
                    <p>
                      Add your logo. Pick your colors. Drop in your brand voice. Your
                      team doesn't feel like they're using tools — they feel like
                      they're inside <strong>your</strong> platform.
                    </p>
                    <ul className="wl-list">
                      <li><Icon name="check" className="list-icon" />Custom logo &amp; favicon</li>
                      <li><Icon name="check" className="list-icon" />Brand colors across every module</li>
                      <li><Icon name="check" className="list-icon" />Custom domain (yourcompany.app)</li>
                      <li><Icon name="check" className="list-icon" />Branded emails &amp; notifications</li>
                      <li><Icon name="check" className="list-icon" />Your team. Your identity. Your OS.</li>
                    </ul>
                  </div>
                  <div className="wl-mock" aria-hidden="true">
                    <div className="wl-mock-bar">
                      <div className="wl-mock-logo">PX</div>
                      <div>
                        <div className="wl-mock-name">PROJXON Workspace</div>
                        <div className="wl-mock-sub">
                          Powered by OrkaOS · projxon.app
                        </div>
                      </div>
                    </div>
                    <div className="wl-mock-grid">
                      <div className="wl-mini">HR</div>
                      <div className="wl-mini">CH</div>
                      <div className="wl-mini">EV</div>
                      <div className="wl-mini alt">SOP</div>
                      <div className="wl-mini alt">CRM</div>
                      <div className="wl-mini alt">FN</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* These swatches only update the preview's `data-swatch` theme. */}
              <div className="palette-orbit" role="group" aria-label="Brand color preview">
                {[
                  ['ocean', 'Ocean blue'],
                  ['ember', 'Ember orange'],
                  ['meadow', 'Meadow green'],
                  ['indigo', 'Indigo']
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    data-theme={value}
                    aria-label={`${label} preview`}
                    aria-pressed={brandSwatch === value}
                    onClick={() => setBrandSwatch(value)}
                  />
                ))}
              </div>
            </div>
          </section>
          {/* Mobile-operation preview; the phone UI is an illustrative mockup. */}
          <section id="mobile">
            <div className="wrap">
              <div className="phone-section">
                <div>
                  <span className="eyebrow">Built for real operators</span>
                  <h2 className="h2">Run your entire business from your phone</h2>
                  <p className="lead">
                    OrkaOS lets founders operate, manage, and scale from anywhere —
                    while their team executes independently. Delegate work, standardize
                    processes, and stop being the bottleneck.
                  </p>
                  <ul className="phone-list">
                    <li>
                      <span className="pi"><Icon name="users" /></span>Manage your team
                    </li>
                    <li>
                      <span className="pi"><Icon name="clipboard" /></span>Track work
                    </li>
                    <li>
                      <span className="pi"><Icon name="calendar" /></span>Run meetings
                    </li>
                    <li>
                      <span className="pi"><Icon name="trending" /></span>Monitor performance
                    </li>
                  </ul>
                </div>
                <div className="phone-mock" aria-hidden="true">
                  <div className="phone-notch" />
                  <div className="phone-screen">
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--muted)",
                        fontWeight: 700,
                        letterSpacing: ".1em",
                        textTransform: "uppercase"
                      }}
                    >
                      PROJXON
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: "var(--navy)",
                        marginTop: "-6px"
                      }}
                    >
                      Good morning, Phelan
                    </div>
                    <div className="phone-row">
                      <div className="pr-icon">
                        <span className="official-orka-logo" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="pr-text">OrkaVault</div>
                        <div className="pr-meta">Company index updated</div>
                      </div>
                    </div>
                    <div className="phone-row">
                      <div className="pr-icon">
                        <span className="official-orka-logo" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="pr-text">OrkaHR</div>
                        <div className="pr-meta">3 reviews due</div>
                      </div>
                    </div>
                    <div className="phone-row">
                      <div className="pr-icon">
                        <span className="official-orka-logo" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="pr-text">OrkaATS</div>
                        <div className="pr-meta">4 candidates in review</div>
                      </div>
                    </div>
                    <div className="phone-row phone-row--ai">
                      <div className="pr-icon pr-icon--ai" aria-hidden="true">AI</div>
                      <div>
                        <div className="pr-text">OrkaAI</div>
                        <div className="pr-meta">Summary ready</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Progressive recommendations showing how the system suggests a next tool. */}
          <section id="smart">
            <div className="wrap">
              <div className="section-head">
                <span className="eyebrow">The system teaches you</span>
                <h2 className="h2">
                  You don't learn the system — the system teaches you
                </h2>
                <p className="lead">
                  As you use one module, OrkaOS suggests the next. Capability builds
                  progressively, never overwhelming.
                </p>
              </div>
              <div className="discover">
                <div className="di"><Icon name="route" size={22} /></div>
                <div className="copy">
                  <div className="sm">Suggested next tool</div>
                  <h4>You're using OrkaVault. Add OrkaSOP next.</h4>
                  <p>
                    Turn the information already organized in your company index into
                    clear, reusable operating procedures.
                  </p>
                </div>
                <a className="btn btn-primary" href="#cta">
                  Add OrkaSOP →
                </a>
              </div>
              <div className="discover" style={{ marginTop: 14 }}>
                <div className="di"><Icon name="route" size={22} /></div>
                <div className="copy">
                  <div className="sm">Suggested next tool</div>
                  <h4>You documented 5 SOPs. Try OrkaProcess.</h4>
                  <p>
                    Connect approved procedures into a clearer end-to-end operating process
                    for the team.
                  </p>
                </div>
                <a className="btn btn-secondary" href="#cta">
                  Follow OrkaProcess →
                </a>
              </div>
            </div>
          </section>
          {/* Audience-fit comparison: positive and negative ICP cards. */}
          <section id="who">
            <div className="wrap">
              <div className="section-head">
                <span className="eyebrow">Who it's for</span>
                <h2 className="h2">Designed for the in-between stage</h2>
                <p className="lead">
                  If you've tried to scale and hit a tech wall, you're in the right
                  place. If you've already built your stack, you've outgrown us.
                </p>
              </div>
              <div className="icp-grid">
                <div className="icp-card yes">
                  <div className="icp-tag">Built for</div>
                  <h3 className="h3">Who it's for</h3>
                  <ul>
                    <li><Icon name="check" className="list-icon" />Solopreneurs scaling to a team</li>
                    <li><Icon name="check" className="list-icon" />Micro-businesses (2–15 people)</li>
                    <li><Icon name="check" className="list-icon" />Startups in their first 18 months</li>
                    <li><Icon name="check" className="list-icon" />Nonprofits &amp; student orgs</li>
                    <li><Icon name="check" className="list-icon" />Remote-first teams without an ops hire</li>
                  </ul>
                  <div className="icp-punch">
                    "I tried to scale, but hit a tech wall."
                  </div>
                </div>
                <div className="icp-card no">
                  <div className="icp-tag">Not built for</div>
                  <h3 className="h3">Who it's not for</h3>
                  <ul>
                    <li><Icon name="x" className="list-icon" />Large enterprises with established stacks</li>
                    <li><Icon name="x" className="list-icon" />Teams already deep in Jira / HubSpot / Salesforce</li>
                    <li><Icon name="x" className="list-icon" />Organizations needing heavy customization</li>
                    <li><Icon name="x" className="list-icon" />Tech-native teams building their own platform</li>
                  </ul>
                  <div className="icp-punch">
                    If you've already scaled your systems, you've likely outgrown
                    OrkaOS.
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Market-positioning widget with OrkaOS highlighted in the center. */}
          <section id="compare">
            <div className="wrap">
              <div className="section-head">
                <span className="eyebrow">Positioning</span>
                <h2 className="h2">A new category between simple and complex</h2>
                <p className="lead">
                  Notion and Trello are too loose. Jira and HubSpot are too heavy.
                  OrkaOS is structured simplicity in the middle.
                </p>
              </div>
              <div className="compare">
                <div className="compare-cell">
                  <div className="stage">Too Simple</div>
                  <div className="name">Google Sheets, Notion, Trello</div>
                  <div className="desc">
                    Flexible, but no structure. Every team rebuilds the wheel.
                  </div>
                </div>
                <div className="compare-cell center">
                  <div className="check"><Icon name="checkCircle" size={24} /></div>
                  <div className="stage">Just Right</div>
                  <div className="name">OrkaOS</div>
                  <div className="desc">
                    Modular structure that actually fits a 1–30 person team.
                  </div>
                </div>
                <div className="compare-cell">
                  <div className="stage">Too Complex</div>
                  <div className="name">Jira, HubSpot, Workday</div>
                  <div className="desc">
                    Built for 200-person orgs with admins and consultants.
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Final conversion block. Buttons reuse openForm to preserve intent. */}
          <section id="cta">
            <div className="wrap">
              <div className="cta">
                <h2>Start building your business the right way</h2>
                <p>Pick one module. Solve one problem. Let the system grow with you.</p>
                <div className="cta-buttons">
                  <button type="button" className="btn btn-primary" onClick={() => openForm('Join the Pod')}>
                    Join the Pod →
                  </button>
                  <a href="#ecosystem" className="btn btn-secondary">
                    Explore catalog
                  </a>
                  <button type="button" className="btn btn-secondary" onClick={() => openForm('Join Alpha Testing')}>
                    Join Alpha Testing
                  </button>
                </div>
              </div>
              <div className="closing">
                <p className="closing-line">
                  <span>Start with what you need.</span>
                  <span>Scale with confidence.</span>
                  <span className="accent">Outgrow us on purpose.</span>
                </p>
                <p className="closing-sub">
                  OrkaOS is temporary by design — a launchpad into HubSpot, Slack,
                  ClickUp, QuickBooks &amp; beyond.
                </p>
              </div>
            </div>
          </section>
          {/* Compact footer navigation; keep anchors aligned with section IDs above. */}
          <footer className="foot">
            <div className="foot-inner">
              <div className="brand">
                <span className="orka-mark" style={{ width: 22, height: 22 }}>
                  <span className="official-orka-logo" aria-hidden="true" />
                </span>
                OrkaOS · by PROJXON
              </div>
              <div>
                <a href="#problem">Why</a>
                <a href="#how">How</a>
                <a href="#ecosystem">Ecosystem</a>
                <a href="#roadmap">Roadmap</a>
                <a
                  href="https://www.linkedin.com/company/orkaos/about/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn ↗
                </a>
                <a href="#cta">Get started</a>
              </div>
            </div>
          </footer>
        </main>

        {/*
          Sticky action footer: each enabled card opens the same IntakeForm with a
          different intent. The beta card stays visible but disabled for transparency.
        */}
        <footer className="orka-actions orka-action-footer" aria-label="Join OrkaOS options">
          <div className="orka-side-inner">
            <h2 className="actions-title">Build your pod.</h2>

            <div className="actions-grid">
              <button className="form-slot primary" type="button" onClick={() => openForm('Join the Pod')}>
                <span className="slot-icon"><Icon name="userPlus" /></span>
                <span>
                  <span className="slot-title">Join the Pod</span>
                  <span className="slot-detail">Early-access previews and demos as apps become ready</span>
                </span>
              </button>
              <button className="form-slot" type="button" onClick={() => openForm('Join Alpha Testing')}>
                <span className="slot-icon"><Icon name="flask" /></span>
                <span>
                  <span className="slot-title">Join Alpha Testing</span>
                  <span className="slot-detail">Test incomplete builds and shape what ships</span>
                </span>
              </button>
              <button
                className="form-slot form-slot--soon"
                type="button"
                aria-disabled="true"
                aria-describedby="path-guidance-note"
                disabled
              >
                <span className="slot-icon"><Icon name="badgeCheck" /></span>
                <span>
                  <span className="slot-title">Join Beta Testing</span>
                  <span className="slot-detail">Near-release validation · enrollment coming soon</span>
                </span>
              </button>
              <button className="form-slot" type="button" onClick={() => openForm('Partner with PROJXON')}>
                <span className="slot-icon"><Icon name="handshake" /></span>
                <span>
                  <span className="slot-title">Partner with PROJXON</span>
                  <span className="slot-detail">Explore pilots, integrations, or co-building</span>
                </span>
              </button>
            </div>

            <p className="actions-copy actions-copy--bottom" id="path-guidance-note">
              Choose the path that fits how you want to explore OrkaOS.
            </p>
          </div>
        </footer>

        {/* IntakeForm returns null while closed and manages its own dialog accessibility. */}
        <IntakeForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          defaultIntent={formIntent}
          onSubmitData={submitIntakeForm}
        />
      </div>
    </>
  );
}