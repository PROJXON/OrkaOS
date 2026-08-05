import React, { useEffect, useMemo, useRef, useState } from 'react';
import IntakeForm from './IntakeForm';
import Icon from './Icon';
import LegacyWidgets from './LegacyWidgets';
import {
  ORKA_PRODUCTS,
  PRODUCT_GROUP_FILTERS,
  ROADMAP_PHASES,
  ROADMAP_STATUS_META
} from './products.js';
import orkaLogoLight from './assets/brand/orka-logo-on-light.png';
import orkaLogoDark from './assets/brand/orka-logo-on-dark.png';

const THEME_STORAGE_KEY = 'orkaos-theme';
const FEEDBACK_FORM_URL = import.meta.env.VITE_FEEDBACK_FORM_URL || '';
const VIEW_LABELS = {
  overview: 'Overview',
  apps: 'Orka Apps',
  future: 'Future Plan'
};

const NAV_FOLDERS = {
  overview: {
    label: 'Overview',
    icon: 'home',
    tabs: [
      { id: 'start', label: 'Start Here', icon: 'home' },
      { id: 'why', label: 'Why OrkaOS', icon: 'help' },
      { id: 'how', label: 'How It Works', icon: 'route' },
      { id: 'experience', label: 'OrkaApp Experience', icon: 'grid' },
      { id: 'fit', label: 'Fit & Brand', icon: 'users' }
    ]
  },
  apps: {
    label: 'Orka Apps',
    icon: 'grid',
    tabs: [
      { id: 'catalog', label: 'Catalog', icon: 'layers' },
      { id: 'directory', label: 'All App Cards', icon: 'grid' },
      { id: 'favorites', label: 'Favorites', icon: 'star' }
    ]
  },
  future: {
    label: 'Future Plan',
    icon: 'trending',
    tabs: [
      { id: 'plan', label: 'Plan Overview', icon: 'trending' },
      { id: 'roadmap', label: 'Product Roadmap', icon: 'chart' },
      { id: 'join', label: 'Get Involved', icon: 'users' }
    ]
  }
};

const APP_LAUNCHER_IDS = [
  'orka-os',
  'orka-vault',
  'orka-sop',
  'orka-task',
  'orka-hr',
  'orka-aira',
  'orka-marketing',
  'orka-project'
];

const OVERVIEW_SEARCH_ITEMS = [
  ['Why OrkaOS', 'The scaling problem OrkaOS is designed to solve.'],
  ['How it works', 'Keep Google Workspace and add only the apps your team needs.'],
  ['What an OrkaApp feels like', 'A familiar, focused app shell with one clear job.'],
  ['Who it is for', 'Small teams in the space between spreadsheets and enterprise software.'],
  ['White-label experience', 'A shared design system that can carry your organization’s brand.']
];

function initialTheme() {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function AnonymousAvatar({ large = false }) {
  return (
    <span className={`anonymous-avatar${large ? ' is-large' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 40 40" role="img">
        <circle cx="20" cy="14" r="7" />
        <path d="M8.5 34c1.4-7.3 5.2-11 11.5-11s10.1 3.7 11.5 11" />
      </svg>
    </span>
  );
}

function NineDotIcon() {
  return (
    <svg className="nine-dot-icon" viewBox="0 0 24 24" aria-hidden="true">
      {[5, 12, 19].flatMap((x) => [5, 12, 19].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.8" />))}
    </svg>
  );
}

function Chevron({ open = false }) {
  return (
    <svg className={`chevron${open ? ' is-open' : ''}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="m8 10 4 4 4-4" />
    </svg>
  );
}

function StatusPill({ status }) {
  const normalized = status.toLowerCase().replace(/\s+/g, '-');
  return <span className={`status-pill status-${normalized}`}>{status}</span>;
}

function PaneControls({ state = 'normal', onChange, compact = false }) {
  const options = [
    ['collapsed', 'Collapse pane'],
    ['normal', 'Restore all panes'],
    ['expanded', 'Expand pane']
  ];

  return (
    <div className={`pane-controls${compact ? ' compact' : ''}`} role="group" aria-label="Pane size">
      {options.map(([value, label]) => (
        <button
          key={value}
          className={`pane-control-dot${state === value ? ' active' : ''}`}
          type="button"
          onClick={() => onChange?.(value)}
          aria-label={label}
          title={label}
        />
      ))}
    </div>
  );
}

function FeedbackPlaceholder({ onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    dialogRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-scrim" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="feedback-modal" role="dialog" aria-modal="true" aria-labelledby="feedback-title" tabIndex="-1" ref={dialogRef}>
        <header className="modal-header">
          <div className="modal-icon"><Icon name="plus" size={20} /></div>
          <div>
            <h2 id="feedback-title">Feedback form placeholder</h2>
            <p>The + Add action is ready for your Google Apps Script feedback form.</p>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close feedback dialog">
            <Icon name="x" size={18} />
          </button>
        </header>
        <div className="modal-body">
          <div className="placeholder-form">
            <label>
              <span>Feedback type</span>
              <select disabled><option>Website experience</option></select>
            </label>
            <label>
              <span>Message</span>
              <textarea disabled placeholder="Your GAS feedback form will appear here." />
            </label>
          </div>
          <div className="integration-note">
            <Icon name="checkCircle" size={18} />
            <div>
              <strong>Integration point prepared</strong>
              <span>Replace this modal with your deployed GAS form URL or embedded form component.</span>
            </div>
          </div>
        </div>
        <footer className="modal-footer">
          <button className="button secondary" type="button" onClick={onClose}>Close</button>
          <button className="button primary" type="button" disabled>Submit feedback</button>
        </footer>
      </section>
    </div>
  );
}

function OverviewView({ onOpenForm, onOpenApps }) {
  const availableCount = ORKA_PRODUCTS.filter((product) => ['Live', 'Production', 'Testing'].includes(product.status)).length;
  const inProgressCount = ORKA_PRODUCTS.filter((product) => ['Design', 'Next'].includes(product.status)).length;

  return (
    <div className="view-scroll overview-view" id="overview-view">
      <section className="hero-card content-surface">
        <div className="hero-copy">
          <span className="eyebrow">OrkaOS overview</span>
          <h1>The operating system for teams ready to scale.</h1>
          <p>
            OrkaOS adds a simple operating layer to Google Workspace. Start with one focused app,
            solve one problem, and grow into a connected system without adopting enterprise software too early.
          </p>
          <div className="hero-actions">
            <button className="button primary" type="button" onClick={onOpenApps}>Explore Orka Apps</button>
            <button className="button secondary" type="button" onClick={() => onOpenForm('Join the Pod')}>Join the Pod</button>
          </div>
          <div className="hero-badges">
            <span><Icon name="checkCircle" size={15} /> Google Workspace foundation</span>
            <span><Icon name="layers" size={15} /> Modular by design</span>
            <span><Icon name="route" size={15} /> Built to be outgrown</span>
          </div>
        </div>
        <div className="app-preview" aria-label="Example OrkaApp interface">
          <div className="preview-topbar">
            <div className="preview-brand">
              <img src={orkaLogoLight} alt="" />
              <b><span>Orka</span>Task</b>
            </div>
            <div className="preview-search"><Icon name="search" size={14} /> Search tasks</div>
            <AnonymousAvatar />
          </div>
          <div className="preview-body">
            <aside className="preview-sidebar">
              <button className="preview-add"><Icon name="plus" size={14} /> Add task</button>
              <span className="preview-nav active"><Icon name="grid" size={14} /> Board</span>
              <span className="preview-nav"><Icon name="clipboard" size={14} /> My work</span>
              <span className="preview-nav"><Icon name="chart" size={14} /> Progress</span>
            </aside>
            <main className="preview-workspace">
              <div className="preview-guide">Workspace / Mission Production Process</div>
              <div className="preview-columns">
                {[
                  ['Backlog', 'Clarify website message', 'Map customer intake'],
                  ['In progress', 'Build OrkaOS catalog', 'Test onboarding flow'],
                  ['Done', 'Connect Google Sheet', 'Publish first SOP']
                ].map(([label, ...tasks]) => (
                  <div className="preview-column" key={label}>
                    <div className="preview-column-head"><b>{label}</b><span>{tasks.length}</span></div>
                    {tasks.map((task) => <div className="preview-task" key={task}><span className="task-dot" />{task}</div>)}
                  </div>
                ))}
              </div>
            </main>
          </div>
          <div className="preview-caption">One shared shell. One clear job per app.</div>
        </div>
      </section>

      <section className="metric-grid" aria-label="OrkaOS summary metrics">
        <article className="metric-card"><span>Public catalog</span><strong>{ORKA_PRODUCTS.length}</strong><small>roadmap-approved Orka apps</small></article>
        <article className="metric-card"><span>Available now</span><strong>{availableCount}</strong><small>live, production, or testing</small></article>
        <article className="metric-card"><span>Actively shaping</span><strong>{inProgressCount}</strong><small>next or in design</small></article>
        <article className="metric-card"><span>Core principle</span><strong>1</strong><small>problem solved per app</small></article>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <span className="eyebrow">Why it exists</span>
          <h2>Scaling a small team breaks the tools that got it started.</h2>
          <p>OrkaOS is designed for the point where spreadsheets are no longer enough, but enterprise platforms are still too much.</p>
        </div>
        <div className="three-card-grid">
          <article className="info-card">
            <span className="card-icon"><Icon name="unlink" size={22} /></span>
            <h3>Too many tools, nothing connected</h3>
            <p>Work scatters across files, messages, forms, and personal workarounds. The team loses shared context.</p>
          </article>
          <article className="info-card">
            <span className="card-icon"><Icon name="chart" size={22} /></span>
            <h3>Google Sheets is not enough anymore</h3>
            <p>Sheets remain useful, but they do not provide the guided workflows, ownership, and permissions a growing team needs.</p>
          </article>
          <article className="info-card">
            <span className="card-icon"><Icon name="building" size={22} /></span>
            <h3>Enterprise software is too complex, too early</h3>
            <p>Heavy platforms introduce administrators, consultants, and configuration before the business is ready for them.</p>
          </article>
        </div>
      </section>

      <section className="content-surface progression-surface">
        <div className="section-heading compact-heading">
          <span className="eyebrow">How OrkaOS works</span>
          <h2>Keep Google. Add only what your team needs.</h2>
        </div>
        <div className="progression-grid">
          <article>
            <span className="step-number">01</span>
            <div><h3>Stay in Google Workspace</h3><p>Drive, Docs, Sheets, Forms, Calendar, and Gmail remain the foundation your team already understands.</p></div>
          </article>
          <article>
            <span className="step-number">02</span>
            <div><h3>Solve one problem at a time</h3><p>Add a focused OrkaApp for tasks, SOPs, people, finance, marketing, or another workflow only when the need appears.</p></div>
          </article>
          <article>
            <span className="step-number">03</span>
            <div><h3>See the work more clearly</h3><p>Use a consistent shell, shared design language, and connected data so every new app still feels familiar.</p></div>
          </article>
        </div>
      </section>

      <section className="split-section">
        <article className="content-surface audience-card positive">
          <span className="eyebrow">Built for</span>
          <h2>The in-between stage</h2>
          <ul className="check-list">
            <li><Icon name="check" size={17} /> Solopreneurs scaling into a team</li>
            <li><Icon name="check" size={17} /> Micro-businesses and startups</li>
            <li><Icon name="check" size={17} /> Nonprofits, student organizations, and remote teams</li>
            <li><Icon name="check" size={17} /> Teams that hit a technology wall before hiring operations staff</li>
          </ul>
          <blockquote>“I tried to scale, but hit a tech wall.”</blockquote>
        </article>
        <article className="content-surface audience-card neutral">
          <span className="eyebrow">Positioning</span>
          <h2>Structured simplicity in the middle</h2>
          <div className="position-scale">
            <div><small>Too loose</small><b>Sheets · Notion · Trello</b></div>
            <div className="position-current"><small>Just right</small><b>OrkaOS</b></div>
            <div><small>Too heavy</small><b>Jira · HubSpot · Workday</b></div>
          </div>
          <p>OrkaOS is intentionally temporary: a launchpad toward larger systems when your team truly needs them.</p>
        </article>
      </section>

      <section className="content-surface system-section">
        <div className="system-copy">
          <span className="eyebrow">The system teaches you</span>
          <h2>Capability grows progressively, never all at once.</h2>
          <p>As your team gets value from one module, OrkaOS can suggest the next connected workflow without forcing a full-suite rollout.</p>
        </div>
        <div className="suggestion-stack">
          <article><span className="suggestion-icon"><Icon name="route" size={20} /></span><div><small>Suggested next tool</small><b>You’re using OrkaVault. Add OrkaSOP next.</b><p>Turn organized company information into reusable operating procedures.</p></div></article>
          <article><span className="suggestion-icon"><Icon name="route" size={20} /></span><div><small>Then</small><b>You documented five SOPs. Try OrkaProcess.</b><p>Connect approved procedures into a clearer end-to-end workflow.</p></div></article>
        </div>
      </section>

      <section className="white-label-section">
        <div>
          <span className="eyebrow light-eyebrow">One shared design language</span>
          <h2>Every OrkaApp can feel like it belongs to your organization.</h2>
          <p>OrkaOS carries the global brand, permissions, and app catalog while each module keeps the same familiar top bar, sidebar, controls, and light/dark themes.</p>
        </div>
        <div className="brand-swatch-demo">
          <div className="swatch-card"><span className="swatch blue" /><b>Orka blue</b><small>Default system</small></div>
          <div className="swatch-card"><span className="swatch navy" /><b>Organization brand</b><small>White-label ready</small></div>
          <div className="swatch-card"><span className="swatch teal" /><b>AI accent</b><small>Clearly distinct</small></div>
        </div>
      </section>

      <section className="final-cta content-surface">
        <div>
          <span className="eyebrow">Start small</span>
          <h2>Pick one module. Solve one problem. Let the system grow with you.</h2>
          <p>Start with what you need. Scale with confidence. Outgrow OrkaOS on purpose.</p>
        </div>
        <div className="final-actions">
          <button className="button primary" type="button" onClick={() => onOpenForm('Join the Pod')}>Join the Pod</button>
          <button className="button secondary" type="button" onClick={() => onOpenForm('Join Alpha Testing')}>Join Alpha Testing</button>
        </div>
      </section>
    </div>
  );
}

function AppsView({ selectedProductId, setSelectedProductId, onOpenForm, favoriteIds, onToggleFavorite }) {
  const [groupFilter, setGroupFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [catalogQuery, setCatalogQuery] = useState('');
  const [paneStates, setPaneStates] = useState({ catalog: 'normal', detail: 'normal', insight: 'normal' });

  const visibleProducts = useMemo(() => ORKA_PRODUCTS.filter((product) => {
    const groupMatches = groupFilter === 'all' || product.groupId === groupFilter;
    const stageMatches = stageFilter === 'all' || product.status.toLowerCase() === stageFilter;
    const haystack = `${product.name} ${product.summary} ${product.group} ${product.google}`.toLowerCase();
    const queryMatches = !catalogQuery.trim() || haystack.includes(catalogQuery.trim().toLowerCase());
    return groupMatches && stageMatches && queryMatches;
  }), [groupFilter, stageFilter, catalogQuery]);

  const selectedProduct = ORKA_PRODUCTS.find((product) => product.id === selectedProductId) || visibleProducts[0] || ORKA_PRODUCTS[0];
  const relatedProducts = selectedProduct.pairs
    .map((name) => ORKA_PRODUCTS.find((product) => product.name === name))
    .filter(Boolean);

  useEffect(() => {
    if (visibleProducts.length && !visibleProducts.some((product) => product.id === selectedProductId)) {
      setSelectedProductId(visibleProducts[0].id);
    }
  }, [visibleProducts, selectedProductId, setSelectedProductId]);

  const setPaneState = (pane, nextState) => {
    if (nextState === 'normal') {
      setPaneStates({ catalog: 'normal', detail: 'normal', insight: 'normal' });
      return;
    }
    if (nextState === 'expanded') {
      setPaneStates({
        catalog: pane === 'catalog' ? 'expanded' : 'collapsed',
        detail: pane === 'detail' ? 'expanded' : 'collapsed',
        insight: pane === 'insight' ? 'expanded' : 'collapsed'
      });
      return;
    }
    setPaneStates((current) => {
      const next = { ...current, [pane]: 'collapsed' };
      const remaining = Object.values(next).filter((state) => state !== 'collapsed').length;
      return remaining ? next : { catalog: 'normal', detail: 'normal', insight: 'normal' };
    });
  };

  const paneWidth = (pane, normalWidth) => {
    const state = paneStates[pane];
    if (state === 'collapsed') return '44px';
    if (state === 'expanded') return 'minmax(0, 1fr)';
    return normalWidth;
  };
  const gridTemplateColumns = [
    paneWidth('catalog', 'minmax(260px, .82fr)'),
    paneWidth('detail', 'minmax(420px, 1.25fr)'),
    paneWidth('insight', 'minmax(260px, .78fr)')
  ].join(' ');

  const PaneRail = ({ pane, label, icon }) => (
    <button className="pane-rail pane-shell" type="button" onClick={() => setPaneState(pane, 'normal')} title={`Restore ${label} pane`}>
      <Icon name={icon} size={17} />
      <span>{label}</span>
      <span className="pane-rail-plus">+</span>
    </button>
  );

  return (
    <div className="apps-view" style={{ '--catalog-grid': gridTemplateColumns }}>
      {paneStates.catalog === 'collapsed' ? <PaneRail pane="catalog" label="Catalog" icon="layers" /> : (
        <section className={`catalog-pane pane-shell pane-state-${paneStates.catalog}`}>
          <header className="pane-header">
            <div><span className="pane-kicker">Catalog</span><h2>Orka Apps</h2><p>{visibleProducts.length} of {ORKA_PRODUCTS.length} apps</p></div>
            <PaneControls state={paneStates.catalog} onChange={(state) => setPaneState('catalog', state)} compact />
          </header>
          <div className="pane-toolbar">
            <label className="pane-search"><Icon name="search" size={15} /><input value={catalogQuery} onChange={(event) => setCatalogQuery(event.target.value)} placeholder="Filter apps" /></label>
            <select value={stageFilter} onChange={(event) => setStageFilter(event.target.value)} aria-label="Filter by roadmap stage">
              <option value="all">All stages</option>
              {ROADMAP_PHASES.map((phase) => <option value={phase.id} key={phase.id}>{phase.label.replace(/^\d+ · /, '')}</option>)}
            </select>
          </div>
          <div className="catalog-filter-row" aria-label="Filter by app group">
            {PRODUCT_GROUP_FILTERS.map(([id, label]) => (
              <button key={id} type="button" className={groupFilter === id ? 'active' : ''} onClick={() => setGroupFilter(id)}>{label}</button>
            ))}
          </div>
          <div className="catalog-list scroll-area">
            {visibleProducts.length ? visibleProducts.map((product) => (
              <button
                type="button"
                className={`catalog-row${selectedProduct.id === product.id ? ' active' : ''}${product.ai ? ' ai-row' : ''}`}
                key={product.id}
                onClick={() => setSelectedProductId(product.id)}
              >
                <span className="app-mark">{product.ai ? 'AI' : product.name.replace('Orka', '').slice(0, 2).toUpperCase()}</span>
                <span className="catalog-row-copy"><b>{product.name}</b><small>{product.group} · {product.priority}</small></span>
                <StatusPill status={product.status} />
              </button>
            )) : <div className="empty-state"><Icon name="search" size={26} /><b>No apps match</b><p>Try a different group, stage, or search term.</p></div>}
          </div>
        </section>
      )}

      {paneStates.detail === 'collapsed' ? <PaneRail pane="detail" label="Workspace" icon="clipboard" /> : (
        <article className={`detail-pane pane-shell pane-state-${paneStates.detail}${selectedProduct.ai ? ' ai-detail' : ''}`}>
          <header className="pane-header">
            <div><span className="pane-kicker">App workspace</span><h2>{selectedProduct.name}</h2><p>{selectedProduct.group} · {selectedProduct.priority}</p></div>
            <PaneControls state={paneStates.detail} onChange={(state) => setPaneState('detail', state)} compact />
          </header>
          <div className="detail-scroll scroll-area">
            <div className="detail-hero">
              <span className="detail-app-mark">{selectedProduct.ai ? 'AI' : selectedProduct.name.replace('Orka', '').slice(0, 2).toUpperCase()}</span>
              <div><StatusPill status={selectedProduct.status} /><h1>{selectedProduct.name}</h1><p>{selectedProduct.summary}</p></div>
            </div>

            <div className="detail-section">
              <span className="detail-label">What it feels like</span>
              <h3>A focused OrkaApp, not another giant platform.</h3>
              <p>Each app uses the same navigation, controls, permissions, profile, search, and theme behavior you are experiencing on OrkaOS.com—then narrows the workspace to one operating problem.</p>
            </div>

            <div className="app-feature-grid">
              <article><Icon name="checkCircle" size={19} /><b>Clear job</b><p>{selectedProduct.summary}</p></article>
              <article><Icon name="layers" size={19} /><b>Shared shell</b><p>Familiar controls across every app reduce training and cognitive load.</p></article>
              <article><Icon name="lock" size={19} /><b>Google foundation</b><p>{selectedProduct.google}</p></article>
              <article><Icon name="route" size={19} /><b>Progressive adoption</b><p>Add it when the workflow becomes necessary—not before.</p></article>
            </div>

            <div className="mini-app-window">
              <div className="mini-app-top"><span className="mini-app-logo">{selectedProduct.name.slice(0, 1)}</span><b>{selectedProduct.name}</b><span className="mini-app-search"><Icon name="search" size={13} /> Search</span><AnonymousAvatar /></div>
              <div className="mini-app-content">
                <div className="mini-app-nav"><span className="active">Overview</span><span>Workspace</span><span>Activity</span></div>
                <div className="mini-app-canvas"><small>WELCOME TO {selectedProduct.name.toUpperCase()}</small><h4>One workflow. Clear ownership. Less setup.</h4><div className="mini-card-row"><span /><span /><span /></div></div>
              </div>
            </div>
          </div>
          <footer className="pane-footer">
            <button className={`button favorite-button${favoriteIds.includes(selectedProduct.id) ? ' active' : ''}`} type="button" onClick={() => onToggleFavorite(selectedProduct.id)} aria-pressed={favoriteIds.includes(selectedProduct.id)}>
              <span aria-hidden="true">{favoriteIds.includes(selectedProduct.id) ? '♥' : '♡'}</span> {favoriteIds.includes(selectedProduct.id) ? 'Favorited' : 'Favorite'}
            </button>
            <button className="button secondary" type="button" onClick={() => onOpenForm('Join the Pod')}>Follow this app</button>
            <button className="button primary" type="button" onClick={() => onOpenForm(selectedProduct.status === 'Live' || selectedProduct.status === 'Production' ? 'Join the Pod' : 'Join Alpha Testing')}>
              {selectedProduct.status === 'Live' || selectedProduct.status === 'Production' ? 'Request access' : 'Join testing'}
            </button>
          </footer>
        </article>
      )}

      {paneStates.insight === 'collapsed' ? <PaneRail pane="insight" label="Dashboard" icon="chart" /> : (
        <aside className={`insight-pane pane-shell pane-state-${paneStates.insight}`}>
          <header className="pane-header">
            <div><span className="pane-kicker">Dashboard</span><h2>App context</h2><p>How this module fits</p></div>
            <PaneControls state={paneStates.insight} onChange={(state) => setPaneState('insight', state)} compact />
          </header>
          <div className="insight-scroll scroll-area">
            <article className="dashboard-card">
              <span className="dashboard-label">Roadmap stage</span>
              <div className="stage-meter"><span style={{ width: `${ROADMAP_STATUS_META[selectedProduct.status].progress}%` }} /></div>
              <div className="dashboard-row"><StatusPill status={selectedProduct.status} /><b>{ROADMAP_STATUS_META[selectedProduct.status].progress}%</b></div>
            </article>
            <article className="dashboard-card">
              <span className="dashboard-label">Google pairing</span>
              <h3>{selectedProduct.google}</h3>
              <p>OrkaApps enhance the tools your team already uses instead of forcing a rip-and-replace migration.</p>
            </article>
            <article className="dashboard-card">
              <span className="dashboard-label">Works well with</span>
              <div className="related-apps">
                {relatedProducts.map((product) => (
                  <button type="button" key={product.id} onClick={() => setSelectedProductId(product.id)}>
                    <span>{product.name.replace('Orka', '').slice(0, 2).toUpperCase()}</span><div><b>{product.name}</b><small>{product.status}</small></div>
                  </button>
                ))}
              </div>
            </article>
            <article className="dashboard-card catalog-snapshot-card">
              <span className="dashboard-label">Catalog snapshot</span>
              <p>The card-based explorer from the original website remains available in <b>All App Cards</b>. Use these quick picks without leaving the three-pane catalog.</p>
              <div className="catalog-snapshot-grid">
                {ORKA_PRODUCTS.slice(0, 6).map((product) => (
                  <button type="button" key={product.id} onClick={() => setSelectedProductId(product.id)} className={product.id === selectedProduct.id ? 'active' : ''}>
                    <span>{product.ai ? 'AI' : product.name.replace('Orka', '').slice(0, 2).toUpperCase()}</span>
                    <b>{product.name}</b>
                  </button>
                ))}
              </div>
            </article>
            <article className="dashboard-card accent-card">
              <span className="dashboard-label">OrkaOS principle</span>
              <h3>Oversimplicity by design.</h3>
              <p>The catalog is the point: discover a focused app, understand its role, and launch only what your team is ready to use.</p>
            </article>
          </div>
        </aside>
      )}
    </div>
  );
}

function RoadmapView({ onOpenForm, onOpenApps }) {
  const stageCounts = ROADMAP_PHASES.map((phase) => ({
    ...phase,
    count: ORKA_PRODUCTS.filter((product) => product.status.toLowerCase() === phase.id).length
  }));

  const orderedProducts = [...ORKA_PRODUCTS].sort((a, b) => {
    return ROADMAP_STATUS_META[b.status].progress - ROADMAP_STATUS_META[a.status].progress || a.name.localeCompare(b.name);
  });

  return (
    <div className="view-scroll roadmap-view">
      <section className="roadmap-header content-surface">
        <div>
          <span className="eyebrow">Product view</span>
          <h1>What’s next for the Orka ecosystem.</h1>
          <p>Follow every public OrkaApp from concept through live release. The roadmap is deliberately visible so early users can understand what exists, what is being shaped, and where feedback matters.</p>
          <div className="hero-actions">
            <button className="button primary" type="button" onClick={() => onOpenForm('Join Alpha Testing')}>Join Alpha Testing</button>
            <button className="button secondary" type="button" onClick={onOpenApps}>Open the catalog</button>
          </div>
        </div>
        <div className="roadmap-summary">
          {stageCounts.map((stage) => <div key={stage.id}><span>{stage.label.replace(/^\d+ · /, '')}</span><b>{stage.count}</b></div>)}
        </div>
      </section>

      <section className="roadmap-board content-surface">
        <header className="roadmap-board-head">
          <div><span className="eyebrow">Public build sequence</span><h2>From concept to live, in one view</h2></div>
          <div className="roadmap-legend">
            {ROADMAP_PHASES.map((phase) => <span key={phase.id}><i className={`legend-dot ${phase.id}`} />{phase.label.replace(/^\d+ · /, '')}</span>)}
          </div>
        </header>
        <div className="roadmap-table">
          <div className="roadmap-table-head"><span>App</span><span>Group</span><span>Progress</span><span>Stage</span></div>
          {orderedProducts.map((product) => (
            <div className="roadmap-row" key={product.id}>
              <div className="roadmap-app"><span className="app-mark small">{product.ai ? 'AI' : product.name.replace('Orka', '').slice(0, 2).toUpperCase()}</span><div><b>{product.name}</b><small>{product.priority}</small></div></div>
              <span className="roadmap-group">{product.group}</span>
              <div className="roadmap-track"><span className={`roadmap-fill ${product.status.toLowerCase()}`} style={{ width: `${ROADMAP_STATUS_META[product.status].progress}%` }} /></div>
              <StatusPill status={product.status} />
            </div>
          ))}
        </div>
      </section>

      <section className="roadmap-principles">
        <article className="content-surface"><span className="step-number">01</span><h3>Validate the problem</h3><p>Concepts stay visible before code is treated as a commitment.</p></article>
        <article className="content-surface"><span className="step-number">02</span><h3>Design with real teams</h3><p>Early access and testing shape the workflow before production.</p></article>
        <article className="content-surface"><span className="step-number">03</span><h3>Ship one clear job</h3><p>Apps move live only when they solve a focused problem simply.</p></article>
        <article className="content-surface"><span className="step-number">04</span><h3>Connect, then graduate</h3><p>Teams can add adjacent apps or move to larger platforms when ready.</p></article>
      </section>

      <section className="content-surface future-cta">
        <div><span className="eyebrow">Help shape the sequence</span><h2>See an app your team needs?</h2><p>Join the pod for previews, or participate in alpha testing when a module reaches an active build stage.</p></div>
        <div className="final-actions"><button className="button primary" type="button" onClick={() => onOpenForm('Join the Pod')}>Join the Pod</button><button className="button secondary" type="button" onClick={() => onOpenForm('Join Alpha Testing')}>Test a build</button></div>
      </section>
    </div>
  );
}

function AdminView({ activeView, setActiveView, setFeedbackOpen }) {
  const [adminTab, setAdminTab] = useState('content');
  const publishedCount = ORKA_PRODUCTS.filter((product) => ['Live', 'Production'].includes(product.status)).length;

  return (
    <div className="admin-view view-scroll">
      <section className="admin-hero content-surface">
        <div><span className="eyebrow">Admin view · website preview</span><h1>Manage how OrkaOS.com introduces the ecosystem.</h1><p>This demo mirrors the OrkaOS GAS admin switch without exposing real controls on the public site. It shows where content, catalog status, brand settings, and the future feedback connection belong.</p></div>
        <span className="admin-demo-badge">DEMO MODE</span>
      </section>

      <div className="admin-tabs" role="tablist">
        {[['content', 'Content map'], ['catalog', 'Catalog status'], ['brand', 'Brand & feedback']].map(([id, label]) => (
          <button key={id} className={adminTab === id ? 'active' : ''} type="button" onClick={() => setAdminTab(id)}>{label}</button>
        ))}
      </div>

      {adminTab === 'content' && (
        <section className="admin-grid">
          {[
            ['overview', 'Overview folder', 'Homepage story, OrkaApp experience, audience fit, positioning, white-label, and conversion paths.'],
            ['apps', 'Orka Apps catalog', 'Interactive catalog, group filters, app details, Google pairings, and roadmap status.'],
            ['future', 'Future Plan view', 'Public product sequence, stage counts, progress, and alpha-testing calls to action.']
          ].map(([id, title, copy]) => (
            <article className={`admin-tile content-surface${activeView === id ? ' selected' : ''}`} key={id}>
              <div className="admin-tile-head"><span className="admin-page-icon"><Icon name={id === 'overview' ? 'home' : id === 'apps' ? 'grid' : 'trending'} size={20} /></span><StatusPill status={activeView === id ? 'Live' : 'Design'} /></div>
              <h2>{title}</h2><p>{copy}</p><button className="button secondary" type="button" onClick={() => setActiveView(id)}>Preview this view</button>
            </article>
          ))}
        </section>
      )}

      {adminTab === 'catalog' && (
        <section className="admin-catalog content-surface">
          <div className="admin-stat-row"><article><span>Total apps</span><b>{ORKA_PRODUCTS.length}</b></article><article><span>Published</span><b>{publishedCount}</b></article><article><span>Active design</span><b>{ORKA_PRODUCTS.filter((p) => p.status === 'Design').length}</b></article><article><span>Concepts</span><b>{ORKA_PRODUCTS.filter((p) => p.status === 'Concept').length}</b></article></div>
          <div className="admin-catalog-table">
            <div className="admin-catalog-head"><span>App</span><span>Group</span><span>Stage</span><span>Public action</span></div>
            {ORKA_PRODUCTS.map((product) => <div key={product.id}><b>{product.name}</b><span>{product.group}</span><StatusPill status={product.status} /><span>{product.status === 'Live' || product.status === 'Production' ? 'Request access' : 'Follow / test'}</span></div>)}
          </div>
        </section>
      )}

      {adminTab === 'brand' && (
        <section className="admin-brand-grid">
          <article className="content-surface brand-config-card"><span className="eyebrow">Global brand</span><h2>OrkaOS design system</h2><p>The public website now uses the same semantic surface, border, typography, radius, and light/dark behavior as the GAS app.</p><div className="brand-token-row"><span /><span /><span /><span /></div></article>
          <article className="content-surface feedback-config-card"><span className="eyebrow">+ Add action</span><h2>Feedback form connection</h2><p>The sidebar’s Add button currently opens a placeholder. Connect your GAS form here later without changing the navigation model.</p><button className="button primary" type="button" onClick={() => setFeedbackOpen(true)}>Preview placeholder</button></article>
        </section>
      )}
    </div>
  );
}

function FavoritesView({ favoriteIds, onToggleFavorite, onSelectProduct, onOpenCatalog, onOpenForm }) {
  const favorites = ORKA_PRODUCTS.filter((product) => favoriteIds.includes(product.id));

  return (
    <div className="view-scroll favorites-view">
      <section className="folder-hero content-surface">
        <div>
          <span className="eyebrow">Orka Apps / Favorites</span>
          <h1>Your saved Orka Apps.</h1>
          <p>Keep a small shortlist while you learn the ecosystem. Favorites stay in this browser and can be removed at any time.</p>
        </div>
        <button className="button primary" type="button" onClick={onOpenCatalog}>Browse the catalog</button>
      </section>

      {favorites.length ? (
        <section className="favorites-grid">
          {favorites.map((product) => (
            <article className={`favorite-card content-surface${product.ai ? ' ai-card' : ''}`} key={product.id}>
              <div className="favorite-card-head">
                <span className="app-mark">{product.ai ? 'AI' : product.name.replace('Orka', '').slice(0, 2).toUpperCase()}</span>
                <button className="favorite-heart active" type="button" onClick={() => onToggleFavorite(product.id)} aria-label={`Remove ${product.name} from favorites`}>♥</button>
              </div>
              <StatusPill status={product.status} />
              <h2>{product.name}</h2>
              <p>{product.summary}</p>
              <div className="favorite-meta"><span>{product.group}</span><span>{product.google}</span></div>
              <div className="favorite-actions">
                <button className="button secondary" type="button" onClick={() => onSelectProduct(product.id)}>Open details</button>
                <button className="button primary" type="button" onClick={() => onOpenForm(product.status === 'Live' || product.status === 'Production' ? 'Join the Pod' : 'Join Alpha Testing')}>Follow app</button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="empty-favorites content-surface">
          <span className="empty-favorite-icon">♡</span>
          <h2>No favorites yet</h2>
          <p>Open the Orka Apps folder, select an app, and use the Favorite button in its workspace.</p>
          <button className="button primary" type="button" onClick={onOpenCatalog}>Explore Orka Apps</button>
        </section>
      )}
    </div>
  );
}

function PersistentCtaFooter({ onOpenForm, onNavigate }) {
  const actions = [
    ['Join the Pod', 'Early-access previews and demos', 'userPlus', false],
    ['Join Alpha Testing', 'Test incomplete builds and shape what ships', 'flask', false],
    ['Join Beta Testing', 'Near-release validation · enrollment coming soon', 'badgeCheck', true],
    ['Partner with PROJXON', 'Pilots, integrations, or co-building', 'handshake', false]
  ];

  return (
    <footer className="persistent-cta-footer" aria-label="Join OrkaOS options">
      <div className="persistent-cta-intro">
        <div className="persistent-cta-brand"><span className="site-footer-mark"><span className="official-orka-logo" /></span><span><b>Build your pod.</b><small>OrkaOS · by PROJXON</small></span></div>
        <div className="persistent-footer-links">
          <button type="button" onClick={() => onNavigate('overview', 'start')}>Overview</button>
          <a href="https://www.linkedin.com/company/orkaos/about/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        </div>
      </div>
      <div className="persistent-cta-actions">
        {actions.map(([intent, detail, icon, disabled]) => (
          <button
            className={`persistent-cta-card${intent === 'Join the Pod' ? ' primary' : ''}${disabled ? ' soon' : ''}`}
            type="button"
            key={intent}
            disabled={disabled}
            onClick={() => !disabled && onOpenForm(intent)}
          >
            <span className="persistent-cta-icon"><Icon name={icon} size={18} /></span>
            <span><b>{intent}</b><small>{detail}</small></span>
          </button>
        ))}
      </div>
    </footer>
  );
}

export default function App() {
  const [theme, setTheme] = useState(initialTheme);
  const [role, setRole] = useState('user');
  const [activeView, setActiveView] = useState('overview');
  const [activeTab, setActiveTab] = useState('start');
  const [openFolders, setOpenFolders] = useState({ overview: true, apps: true, future: true });
  const [selectedProductId, setSelectedProductId] = useState('orka-os');
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem('orkaos-favorites') || 'null');
      return Array.isArray(saved) ? saved : ['orka-vault', 'orka-sop', 'orka-task'];
    } catch {
      return ['orka-vault', 'orka-sop', 'orka-task'];
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formIntent, setFormIntent] = useState('Join the Pod');
  const searchRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { window.localStorage.setItem(THEME_STORAGE_KEY, theme); } catch { /* no-op */ }
  }, [theme]);

  useEffect(() => {
    try { window.localStorage.setItem('orkaos-favorites', JSON.stringify(favoriteIds)); } catch { /* no-op */ }
  }, [favoriteIds]);

  useEffect(() => {
    const handleKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setAppsOpen(false);
        setAlertsOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const openFeedback = () => {
    if (FEEDBACK_FORM_URL) {
      window.open(FEEDBACK_FORM_URL, '_blank', 'noopener,noreferrer');
      return;
    }
    setFeedbackOpen(true);
  };

  const openIntake = (intent) => {
    setFormIntent(intent);
    setIsFormOpen(true);
  };

  const navigate = (view, tab = null) => {
    const destinationTab = tab || NAV_FOLDERS[view]?.tabs[0]?.id || null;
    setActiveView(view);
    setActiveTab(destinationTab);
    setOpenFolders((current) => ({ ...current, [view]: true }));
    setSidebarOpen(false);
    setSearchOpen(false);
  };

  const toggleFavorite = (productId) => {
    setFavoriteIds((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]);
  };

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    const folderResults = Object.entries(NAV_FOLDERS).flatMap(([folderId, folder]) =>
      folder.tabs
        .filter((tab) => `${tab.label} ${folder.label} ${VIEW_LABELS[folderId] || ''}`.toLowerCase().includes(query))
        .map((tab) => ({ type: 'destination', id: folderId, tab: tab.id, title: tab.label, meta: folder.label }))
    );

    const overviewResults = OVERVIEW_SEARCH_ITEMS
      .filter(([title, description]) => `${title} ${description}`.toLowerCase().includes(query))
      .map(([title, description]) => ({
        type: 'destination',
        id: 'overview',
        tab: /how/i.test(title) ? 'how' : /feel/i.test(title) ? 'experience' : /who|white/i.test(title) ? 'fit' : 'why',
        title,
        meta: description
      }));

    const appResults = ORKA_PRODUCTS
      .filter((product) => `${product.name} ${product.summary} ${product.group} ${product.status}`.toLowerCase().includes(query))
      .slice(0, 7)
      .map((product) => ({ type: 'app', id: product.id, title: product.name, meta: `${product.group} · ${product.status}` }));

    return [...folderResults, ...overviewResults, ...appResults].slice(0, 10);
  }, [searchQuery]);

  const chooseSearchResult = (result) => {
    if (result.type === 'app') {
      setSelectedProductId(result.id);
      navigate('apps', 'catalog');
    } else {
      navigate(result.id, result.tab || null);
    }
    setSearchQuery('');
  };

  const launcherProducts = APP_LAUNCHER_IDS.map((id) => ORKA_PRODUCTS.find((product) => product.id === id)).filter(Boolean);
  const logo = theme === 'dark' ? orkaLogoDark : orkaLogoLight;
  const currentFolder = NAV_FOLDERS[activeView];
  const currentTab = currentFolder?.tabs.find((tab) => tab.id === activeTab);

  const renderUserView = () => {
    if (activeView === 'overview') {
      if (activeTab === 'start') return <OverviewView onOpenForm={openIntake} onOpenApps={() => navigate('apps', 'catalog')} />;
      if (activeTab === 'why') return <div className="view-scroll legacy-view"><LegacyWidgets panel="overview-why" onOpenForm={openIntake} onNavigate={navigate} /></div>;
      if (activeTab === 'how') return <div className="view-scroll legacy-view"><LegacyWidgets panel="overview-how" onOpenForm={openIntake} onNavigate={navigate} /></div>;
      if (activeTab === 'experience') return <div className="view-scroll legacy-view"><LegacyWidgets panel="overview-experience" onOpenForm={openIntake} onNavigate={navigate} /></div>;
      if (activeTab === 'fit') return <div className="view-scroll legacy-view"><LegacyWidgets panel="overview-fit" onOpenForm={openIntake} onNavigate={navigate} /></div>;
      return null;
    }

    if (activeView === 'apps') {
      if (activeTab === 'catalog') return <AppsView selectedProductId={selectedProductId} setSelectedProductId={setSelectedProductId} onOpenForm={openIntake} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} />;
      if (activeTab === 'directory') return <div className="view-scroll legacy-view"><LegacyWidgets panel="apps-catalog" onOpenForm={openIntake} onNavigate={navigate} /></div>;
      if (activeTab === 'favorites') return (
        <FavoritesView
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          onSelectProduct={(id) => { setSelectedProductId(id); navigate('apps', 'catalog'); }}
          onOpenCatalog={() => navigate('apps', 'catalog')}
          onOpenForm={openIntake}
        />
      );
      return null;
    }

    if (activeTab === 'plan') return <RoadmapView onOpenForm={openIntake} onOpenApps={() => navigate('apps', 'catalog')} />;
    if (activeTab === 'roadmap') return <div className="view-scroll legacy-view"><LegacyWidgets panel="future-roadmap" onOpenForm={openIntake} onNavigate={navigate} /></div>;
    if (activeTab === 'join') return <div className="view-scroll legacy-view"><LegacyWidgets panel="future-join" onOpenForm={openIntake} onNavigate={navigate} /></div>;
    return null;
  };

  return (
    <div className={`app-shell${sidebarCollapsed ? ' nav-collapsed' : ''}${sidebarOpen ? ' drawer-open' : ''}`}>
      <header className="topnav">
        <div className="topnav-left">
          <button className="mobile-menu-button icon-button" type="button" onClick={() => setSidebarOpen((open) => !open)} aria-label="Open navigation">
            <span /><span /><span />
          </button>
          <button className="brand-mark" type="button" onClick={() => navigate('overview')} aria-label="Go to OrkaOS overview">
            <img src={logo} alt="" />
            <span className="brand-word"><b>Orka</b><strong>OS</strong></span>
            <span className="version-chip">WEB</span>
          </button>
        </div>

        <div className="top-center">
          <div className="global-search">
            <Icon name="search" size={17} />
            <input
              ref={searchRef}
              value={searchQuery}
              onChange={(event) => { setSearchQuery(event.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search OrkaOS and apps"
              aria-label="Search OrkaOS and apps"
            />
            <kbd>⌘ K</kbd>
            {searchOpen && searchQuery.trim() && (
              <div className="search-popover popover">
                {searchResults.length ? searchResults.map((result, index) => (
                  <button key={`${result.type}-${result.id}-${result.tab || ''}-${index}`} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => chooseSearchResult(result)}>
                    <span className="search-result-icon">{result.type === 'app' ? result.title.replace('Orka', '').slice(0, 2).toUpperCase() : <Icon name={result.id === 'overview' ? 'home' : result.id === 'apps' ? 'grid' : 'trending'} size={15} />}</span>
                    <span><b>{result.title}</b><small>{result.meta}</small></span>
                  </button>
                )) : <div className="search-empty">No matches found.</div>}
              </div>
            )}
          </div>
        </div>

        <div className="topnav-right">
          <div className="role-toggle" role="tablist" aria-label="View mode">
            <button type="button" className={role === 'user' ? 'active' : ''} onClick={() => setRole('user')}><Icon name="users" size={14} /> User</button>
            <button type="button" className={role === 'admin' ? 'active admin' : ''} onClick={() => setRole('admin')}><Icon name="settings" size={14} /> Admin</button>
          </div>

          <div className="menu-anchor">
            <button className="icon-button" type="button" aria-label="Open Orka app launcher" onClick={() => { setAppsOpen((open) => !open); setAlertsOpen(false); setProfileOpen(false); }}><NineDotIcon /></button>
            {appsOpen && (
              <div className="apps-popover popover right-popover">
                <div className="popover-title"><b>Orka Apps</b><small>Explore the ecosystem</small></div>
                <div className="app-launcher-grid">
                  {launcherProducts.map((product) => (
                    <button type="button" key={product.id} onClick={() => { setSelectedProductId(product.id); navigate('apps', 'catalog'); setAppsOpen(false); }}>
                      <span>{product.ai ? 'AI' : product.name.replace('Orka', '').slice(0, 2).toUpperCase()}</span><b>{product.name.replace('Orka', '') || 'OS'}</b>
                    </button>
                  ))}
                </div>
                <button className="popover-footer-action" type="button" onClick={() => { navigate('apps', 'catalog'); setAppsOpen(false); }}>View full catalog →</button>
              </div>
            )}
          </div>

          <button className="theme-switch" type="button" onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            <span className="theme-track"><span className="theme-knob" /><Icon name="sun" size={13} /></span>
          </button>

          <div className="menu-anchor alerts-anchor">
            <button className="icon-button" type="button" aria-label="Open updates" onClick={() => { setAlertsOpen((open) => !open); setAppsOpen(false); setProfileOpen(false); }}><Icon name="bell" size={18} /><span className="notification-dot" /></button>
            {alertsOpen && (
              <div className="alerts-popover popover right-popover">
                <div className="popover-title"><b>What’s new</b><small>OrkaOS.com preview</small></div>
                <div className="alert-item"><span className="alert-dot blue" /><div><b>Original widgets restored</b><p>The full website experiences now live inside the three OrkaOS folders.</p></div></div>
                <div className="alert-item"><span className="alert-dot green" /><div><b>Folder navigation</b><p>Use sidebar tabs or clickable breadcrumbs to move up the path.</p></div></div>
                <div className="alert-item"><span className="alert-dot purple" /><div><b>Feedback ready</b><p>The + Add placeholder is prepared for your GAS form.</p></div></div>
              </div>
            )}
          </div>

          <div className="menu-anchor">
            <button className="profile-button" type="button" aria-label="Open profile menu" onClick={() => { setProfileOpen((open) => !open); setAppsOpen(false); setAlertsOpen(false); }}><AnonymousAvatar /></button>
            {profileOpen && (
              <div className="profile-popover popover right-popover">
                <div className="profile-summary"><AnonymousAvatar large /><div><b>Anonymous visitor</b><small>Public OrkaOS.com preview</small></div></div>
                <div className="menu-separator" />
                <button type="button" onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}><Icon name="sun" size={16} /> Toggle theme</button>
                <button type="button" onClick={() => { navigate('overview'); setProfileOpen(false); }}><Icon name="help" size={16} /> About OrkaOS</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="app-body">
        <div className="drawer-scrim" onClick={() => setSidebarOpen(false)} />
        <aside className="gas-sidenav">
          <div className="gas-sidenav-top">
            <button className="add-button" type="button" onClick={openFeedback} title={FEEDBACK_FORM_URL ? 'Open feedback form' : 'Open feedback form placeholder'}>
              <span className="add-icon"><Icon name="plus" size={17} /></span><span className="gas-nav-label">Feedback</span>
            </button>
          </div>
          <div className="gas-sidenav-scroll scroll-area">
            {Object.entries(NAV_FOLDERS).map(([folderId, folder]) => (
              <div className={`gas-nav-group${openFolders[folderId] ? '' : ' collapsed'}`} key={folderId}>
                <div className="folder-row">
                  <div className={`folder-label${activeView === folderId ? ' current' : ''}`} title={`${folder.label} folder`}>
                    <Icon name={folder.icon} size={18} /><span className="gas-nav-label">{folder.label}</span>
                  </div>
                  <button className="folder-toggle" type="button" onClick={() => setOpenFolders((current) => ({ ...current, [folderId]: !current[folderId] }))} title={`${openFolders[folderId] ? 'Collapse' : 'Expand'} ${folder.label}`} aria-label={`${openFolders[folderId] ? 'Collapse' : 'Expand'} ${folder.label}`} aria-expanded={openFolders[folderId]}>
                    <Chevron open={openFolders[folderId]} />
                  </button>
                </div>
                <div className="folder-tabs">
                  {folder.tabs.map((tab) => (
                    <button className={`gas-nav-item${activeView === folderId && activeTab === tab.id && role === 'user' ? ' active' : ''}`} type="button" key={tab.id} onClick={() => navigate(folderId, tab.id)} title={tab.label}>
                      <Icon name={tab.icon} size={17} /><span className="gas-nav-label">{tab.label}</span>
                      {folderId === 'apps' && tab.id === 'favorites' ? <span className="gas-nav-count">{favoriteIds.length}</span> : null}
                      {folderId === 'apps' && tab.id === 'catalog' ? <span className="gas-nav-count">{ORKA_PRODUCTS.length}</span> : null}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="gas-sidenav-foot">
            <a className="gas-foot-button" href="https://www.linkedin.com/company/orkaos/about/" target="_blank" rel="noopener noreferrer" title="OrkaOS on LinkedIn"><Icon name="users" size={18} /><span className="gas-nav-label">LinkedIn</span></a>
            <button className="gas-foot-button" type="button" onClick={() => setSidebarCollapsed((collapsed) => !collapsed)} title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}><Chevron open={sidebarCollapsed} /><span className="gas-nav-label">Collapse sidebar</span></button>
          </div>
        </aside>

        <main className="main-wrap">
          <div className="guide-bar">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              {role === 'admin' ? (
                <b aria-current="page">Admin Console</b>
              ) : (
                <>
                  <span className="breadcrumb-folder">{currentFolder.label}</span>
                  <span className="breadcrumb-separator">/</span>
                  <b aria-current="page">{currentTab?.label}</b>
                </>
              )}
            </nav>
            <div className="guide-actions">
              <span className="experience-chip"><span className="connected-dot" /> OrkaApp experience</span>
              <button className="button small secondary" type="button" onClick={() => openIntake('Join the Pod')}>Get early access</button>
            </div>
          </div>

          <div className="main-content">
            {role === 'admin' ? (
              <AdminView activeView={activeView} setActiveView={(view) => navigate(view)} setFeedbackOpen={openFeedback} />
            ) : renderUserView()}
          </div>

        </main>
      </div>

      <PersistentCtaFooter onOpenForm={openIntake} onNavigate={navigate} />

      {feedbackOpen && <FeedbackPlaceholder onClose={() => setFeedbackOpen(false)} />}
      <IntakeForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} defaultIntent={formIntent} onSubmitData={async () => {
        window.alert('The intake form is connected to the existing website flow. Configure /api/intake in deployment to receive submissions.');
      }} />
    </div>
  );
}
