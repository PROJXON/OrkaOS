import React, { useMemo, useState } from 'react';
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
 * Original OrkaOS website widgets, preserved inside the GAS-inspired website shell.
 * The `panel` prop places the original long-form homepage sections into the
 * Overview, Orka Apps, and Future Plan folders without flattening them away.
 */
export default function LegacyWidgets({ panel, onOpenForm, onNavigate }) {
  const [selectedModule, setSelectedModule] = useState('orka-vault');
  const [catalogFilter, setCatalogFilter] = useState('all');
  const [brandSwatch, setBrandSwatch] = useState('ocean');

  const openForm = onOpenForm;
  const selectedProduct = ORKA_PRODUCTS.find((product) => product.id === selectedModule) || ORKA_PRODUCTS[0];
  const featuredProducts = useMemo(() => ORKA_PRODUCTS.filter((product) => product.featured), []);
  const visibleCatalogProducts = useMemo(() => ORKA_PRODUCTS.filter((product) =>
    catalogFilter === 'all' || product.groupId === catalogFilter
  ), [catalogFilter]);
  const roadmapStageCounts = useMemo(() => ROADMAP_PHASES.map((phase) => ({
    ...phase,
    count: ORKA_PRODUCTS.filter((product) => product.status.toLowerCase() === phase.id).length
  })), []);
  const productionProductCount = useMemo(() => ORKA_PRODUCTS.filter((product) =>
    product.publicStatus === 'Production'
  ).length, []);

  return (
    <div className="legacy-widget-scope">
      {panel === 'overview-why' && <>
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
        <div className="value-num">1</div>
        <h4>No integration required</h4>
        <p>
          Every module talks to every other module from day one — no Zapier,
          no engineers.
        </p>
      </div>
      <div className="value-card">
        <div className="value-num">2</div>
        <h4>Intuitive by design</h4>
        <p>
          No training. No certifications. If you've used Google Docs, you can
          run OrkaOS.
        </p>
      </div>
      <div className="value-card">
        <div className="value-num">3</div>
        <h4>Modular growth</h4>
        <p>
          Add tools as you need them. Pay for what's on. Turn things off when
          you don't.
        </p>
      </div>
      <div className="value-card">
        <div className="value-num">4</div>
        <h4>White-labeled experience</h4>
        <p>
          Your team works inside <em>your</em> platform — not someone else's
          brand.
        </p>
      </div>
      <div className="value-card">
        <div className="value-num">5</div>
        <h4>Built for non-technical founders</h4>
        <p>
          No setup complexity. No admin console. You're operating in 30
          minutes.
        </p>
      </div>
    </div>
  </div>
</section>
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
      </>}

      {panel === 'overview-how' && <>
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
        <div className="scope-stage">1 · Start</div>
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
        <div className="scope-stage">2 · Build</div>
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
        <div className="scope-stage">3 · Scale</div>
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
      </>}

      {panel === 'overview-experience' && <>
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
              <div className="tile-name">Orka AI</div>
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
        <div className="dock-icon ai" title="Orka AI · Onboard CTO">
          AI
        </div>
      </div>
    </div>
  </div>
</section>
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
              <div className="pr-text">Orka AI</div>
              <div className="pr-meta">Assessment ready</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
      </>}

      {panel === 'overview-fit' && <>
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
      </>}

      {panel === 'apps-catalog' && <>
<section id="ecosystem">
  <div className="wrap">
    <div className="section-head">
      <span className="eyebrow">Product catalog</span>
      <h2 className="h2">Explore what OrkaOS is offering and building</h2>
      <p className="lead">
        Browse the roadmap-approved Orka lineup, filter by Orka app group, and follow the apps
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
              <small>{product.publicStatus} · {product.priority}</small>
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
            {selectedProduct.publicStatus}
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

    {/* Orka app group filters only change which catalog cards are rendered below. */}
    <div className="catalog-toolbar" role="group" aria-label="Filter Orka products by Orka app group">
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
            <span className={`catalog-status catalog-status--${product.status.toLowerCase()}`}>{product.publicStatus}</span>
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
      </>}

      {panel === 'future-roadmap' && <>
<section id="roadmap">
  <div className="wrap">
    <div className="section-head">
      <span className="eyebrow">Product roadmap</span>
      <h2 className="h2">Priority and public stage, in one view</h2>
      <p className="lead">
        The public roadmap keeps all 20 apps visible while separating reviewed priority from public stage. Bars communicate planning maturity, not launch timing.
      </p>
    </div>

    <div className="roadmap-overview" aria-label="OrkaOS roadmap summary">
      <div className="roadmap-overview__total">
        <span>Public roadmap</span>
        <strong>{ORKA_PRODUCTS.length} apps</strong>
        <small>{productionProductCount} in Production · active development</small>
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
      <div className="gantt roadmap-chart" role="table" aria-label="OrkaOS products by public planning stage">
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
                    <span className={`owner-pill ${status.pillClass}`}>{product.publicStatus}</span>
                  </div>
                  <div className="gantt-owner">{product.group} group</div>
                </div>
              </div>
              <div className="gantt-track" role="cell" aria-label={`${product.name} is currently in ${product.publicStatus}`}>
                {ROADMAP_PHASES.map((phase) => (
                  <div key={`${product.id}-${phase.id}`} aria-hidden="true" />
                ))}
                <div
                  className={`gantt-bar ${status.barClass}${product.ai ? ' gantt-bar--ai' : ''}`}
                  style={{ left: `${roadmapItem.start}%`, width: `${roadmapItem.width}%` }}
                  title={`${product.name} · ${product.publicStatus}`}
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
      </>}


    </div>
  );
}
