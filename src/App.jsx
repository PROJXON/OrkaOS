import React, { useEffect, useMemo, useRef, useState } from 'react';
import IntakeForm from './IntakeForm';
import Icon from './Icon';
import LegacyWidgets from './LegacyWidgets';
import OverviewStory from './OverviewStory';
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
      { id: 'why', label: 'The Story', icon: 'help' },
      { id: 'how', label: 'How It Works', icon: 'route' },
      { id: 'experience', label: 'The Orka Way', icon: 'grid' },
      { id: 'fit', label: 'Is It for You?', icon: 'users' }
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
      { id: 'calendar', label: 'Rollout Calendar', icon: 'calendar' },
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
  'orka-aria',
  'orka-marketing',
  'orka-project'
];

const OVERVIEW_SEARCH_ITEMS = [
  ['Meet OrkaOS', 'A plain-English introduction to the Google Workspace micro-stack.'],
  ['The OrkaOS origin story', 'How group-project friction became a pod of focused business apps.'],
  ['How the micro-stack works', 'Start with one app, follow a useful series, and grow toward the OrkaOS hub.'],
  ['Pod, flow, slipstream, ecosystem', 'The four ideas behind the OrkaOS product experience.'],
  ['Is OrkaOS for my team?', 'Who it is built for, who has outgrown it, and where to start.']
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

function PaneControls({ state = 'normal', onChange }) {
  const options = [
    ['collapsed', 'Collapse pane'],
    ['normal', 'Three-pane view'],
    ['expanded', 'Expand pane']
  ];

  return (
    <div className="pane-seg" role="group" aria-label="Pane size">
      {options.map(([value, label]) => {
        const active = state === value;
        return (
          <button
            key={value}
            className="pane-seg-button"
            type="button"
            onClick={() => !active && onChange?.(value)}
            aria-label={label}
            aria-current={active ? 'true' : undefined}
            aria-disabled={active ? 'true' : undefined}
            tabIndex={active ? -1 : 0}
            title={label}
          />
        );
      })}
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

function AppsView({ selectedProductId, setSelectedProductId, onOpenForm, onOpenAria, favoriteIds, onToggleFavorite }) {
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
            <PaneControls state={paneStates.catalog} onChange={(state) => setPaneState('catalog', state)} />
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
            <PaneControls state={paneStates.detail} onChange={(state) => setPaneState('detail', state)} />
          </header>
          <div className="detail-scroll scroll-area">
            <div className="detail-hero">
              <span className="detail-app-mark">{selectedProduct.ai ? 'AI' : selectedProduct.name.replace('Orka', '').slice(0, 2).toUpperCase()}</span>
              <div><StatusPill status={selectedProduct.status} /><h1>{selectedProduct.name}</h1><p>{selectedProduct.summary}</p><span className="rollout-inline"><Icon name="calendar" size={13} /> {selectedProduct.rolloutLabel}{selectedProduct.rolloutDate ? ' · estimated' : ''}</span></div>
            </div>

            <div className="detail-section">
              <span className="detail-label">What it feels like</span>
              <h3>A focused OrkaApp, not another giant platform.</h3>
              <p>Each app uses the same navigation, controls, permissions, profile, search, and theme behavior you are experiencing on this OrkaOS website—then narrows the workspace to one operating problem.</p>
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
            <PaneControls state={paneStates.insight} onChange={(state) => setPaneState('insight', state)} />
          </header>
          <div className="insight-scroll scroll-area">
            <article className="dashboard-card">
              <span className="dashboard-label">Roadmap stage</span>
              <div className="stage-meter"><span style={{ width: `${ROADMAP_STATUS_META[selectedProduct.status].progress}%` }} /></div>
              <div className="dashboard-row"><StatusPill status={selectedProduct.status} /><b>{ROADMAP_STATUS_META[selectedProduct.status].progress}%</b></div>
            </article>
            <article className="dashboard-card rollout-card">
              <span className="dashboard-label">Estimated rollout</span>
              <h3>{selectedProduct.rolloutLabel}</h3>
              <p>{selectedProduct.rolloutDate ? 'Planning estimate · subject to change as testing and feedback progress.' : 'This app is already available to eligible teams.'}</p>
            </article>
            <article className="dashboard-card aria-context-card">
              <span className="dashboard-label">OrkaAria</span>
              <h3>Ask about this app</h3>
              <p>Use the public OrkaAria guide for plain-English help with the ecosystem, panes, and rollout plan.</p>
              <button className="button small aria-button" type="button" onClick={onOpenAria} aria-controls="orka-aria-panel"><Icon name="sparkles" size={14} /> Ask OrkaAria</button>
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
          <div className="roadmap-table-head"><span>App</span><span>Group</span><span>Progress</span><span>Estimate</span><span>Stage</span></div>
          {orderedProducts.map((product) => (
            <div className="roadmap-row" key={product.id}>
              <div className="roadmap-app"><span className="app-mark small">{product.ai ? 'AI' : product.name.replace('Orka', '').slice(0, 2).toUpperCase()}</span><div><b>{product.name}</b><small>{product.priority}</small></div></div>
              <span className="roadmap-group">{product.group}</span>
              <div className="roadmap-track"><span className={`roadmap-fill ${product.status.toLowerCase()}`} style={{ width: `${ROADMAP_STATUS_META[product.status].progress}%` }} /></div>
              <span className="roadmap-estimate">{product.rolloutLabel}</span>
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


const ARIA_STARTERS = [
  'What is OrkaOS?',
  'Which app should I start with?',
  'Explain the three panes',
  'What is rolling out next?'
];

function ariaGuideAnswer(prompt) {
  const query = prompt.toLowerCase();
  if (query.includes('pane') || query.includes('collapse') || query.includes('expand')) {
    return 'The workspace uses three panes: Catalog, Workspace, and Dashboard. Use the three-segment control in a pane header to collapse it, return to the balanced three-pane view, or expand it while the other panes become compact rails.';
  }
  if (query.includes('rollout') || query.includes('calendar') || query.includes('next') || query.includes('release')) {
    return 'The Rollout Calendar shows public planning estimates, not committed release dates. OrkaATS is the next validation target, followed by OrkaProcess and the OrkaOS hub. Open Future Plan → Rollout Calendar for the full sequence.';
  }
  if (query.includes('start') || query.includes('which app') || query.includes('recommend')) {
    return 'Start with the smallest workflow that is already painful. OrkaVault fits access sharing, OrkaSOP fits repeatable procedures, OrkaHR fits people records, and OrkaATS fits applicant tracking. The catalog shows each app’s current stage and estimate.';
  }
  if (query.includes('aria') || query.includes('ai')) {
    return 'OrkaAria is the guide layer for the Orka ecosystem. On this public site it provides guided, prewritten answers so visitors can understand apps, navigation, and rollout plans without pretending to be a live production assistant.';
  }
  if (query.includes('what is') || query.includes('orkaos') || query.includes('ecosystem')) {
    return 'OrkaOS is a modular set of focused business apps designed around Google Workspace. Teams can adopt one useful app first, add adjacent apps later, and use the OrkaOS hub as the ecosystem grows.';
  }
  return 'I can guide you through the OrkaOS concept, recommend a starting app, explain the three-pane workspace, or summarize the estimated rollout calendar.';
}

function OrkaAriaPanel({ onClose, onNavigate }) {
  const [messages, setMessages] = useState([
    { role: 'aria', text: 'Hi — I’m OrkaAria, the public guide to OrkaOS. Ask about the ecosystem, an app, the three-pane workspace, or the rollout plan.' }
  ]);
  const [draft, setDraft] = useState('');
  const threadRef = useRef(null);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const ask = (value) => {
    const prompt = String(value || draft).trim();
    if (!prompt) return;
    setMessages((current) => [
      ...current,
      { role: 'user', text: prompt },
      { role: 'aria', text: ariaGuideAnswer(prompt) }
    ]);
    setDraft('');
  };

  return (
    <section className="aria-panel" id="orka-aria-panel" role="dialog" aria-labelledby="aria-title">
      <header className="aria-panel-head">
        <span className="aria-avatar"><Icon name="sparkles" size={19} /></span>
        <div><h2 id="aria-title">OrkaAria</h2><p>Public OrkaOS guide</p></div>
        <button className="icon-button" type="button" onClick={onClose} aria-label="Close OrkaAria"><Icon name="x" size={17} /></button>
      </header>
      <div className="aria-thread scroll-area" ref={threadRef} aria-live="polite">
        {messages.map((message, index) => (
          <div className={`aria-message ${message.role}`} key={`${message.role}-${index}`}>
            {message.role === 'aria' ? <span className="aria-mini"><Icon name="sparkles" size={12} /></span> : null}
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <div className="aria-starters" aria-label="Suggested questions">
        {ARIA_STARTERS.map((starter) => <button type="button" key={starter} onClick={() => ask(starter)}>{starter}</button>)}
      </div>
      <form className="aria-compose" onSubmit={(event) => { event.preventDefault(); ask(); }}>
        <textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask OrkaAria…" rows={2} aria-label="Ask OrkaAria" />
        <button type="submit" aria-label="Send question" disabled={!draft.trim()}>Send</button>
      </form>
      <footer className="aria-panel-foot">
        <span>Guided public preview · not a live AI service</span>
        <div><button type="button" onClick={() => { onNavigate('apps', 'catalog'); onClose(); }}>Apps</button><button type="button" onClick={() => { onNavigate('future', 'calendar'); onClose(); }}>Calendar</button></div>
      </footer>
    </section>
  );
}

function parseRolloutDate(value) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
}

function calendarDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function RolloutCalendarView({ onOpenForm, onSelectProduct }) {
  const scheduled = useMemo(() => ORKA_PRODUCTS
    .filter((product) => product.rolloutDate)
    .sort((a, b) => a.rolloutDate.localeCompare(b.rolloutDate)), []);
  const available = ORKA_PRODUCTS.filter((product) => !product.rolloutDate && ['Live', 'Production'].includes(product.status));
  const firstUpcoming = scheduled.find((product) => parseRolloutDate(product.rolloutDate) >= new Date()) || scheduled[0];
  const [cursor, setCursor] = useState(() => {
    const date = parseRolloutDate(firstUpcoming?.rolloutDate) || new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1, 12);
  });
  const [mode, setMode] = useState('month');

  const monthTitle = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(cursor);
  const quarter = Math.floor(cursor.getMonth() / 3);
  const quarterTitle = `Q${quarter + 1} ${cursor.getFullYear()}`;

  const monthCells = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1, 12);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [cursor]);

  const shift = (direction) => {
    const step = mode === 'quarter' ? 3 : 1;
    setCursor((current) => new Date(current.getFullYear(), current.getMonth() + (direction * step), 1, 12));
  };

  const eventsForDate = (date) => scheduled.filter((product) => product.rolloutDate === calendarDateKey(date));
  const quarterMonths = Array.from({ length: 3 }, (_, index) => new Date(cursor.getFullYear(), quarter * 3 + index, 1, 12));
  const todayKey = calendarDateKey(new Date());

  return (
    <div className="view-scroll rollout-view">
      <section className="rollout-hero content-surface">
        <div>
          <span className="eyebrow">Estimated OrkaApp rollouts</span>
          <h1>A calendar for what may ship next.</h1>
          <p>These dates are planning estimates for the public roadmap. They can move as testing, dependencies, and early-user feedback change the sequence.</p>
          <div className="hero-actions"><button className="button primary" type="button" onClick={() => onOpenForm('Join Alpha Testing')}>Join Alpha Testing</button><span className="estimate-disclaimer"><Icon name="calendar" size={15} /> Estimates, not commitments</span></div>
        </div>
        <div className="rollout-next-card">
          <span>Next estimated rollout</span>
          <b>{firstUpcoming?.name}</b>
          <strong>{firstUpcoming?.rolloutLabel}</strong>
          <small>{firstUpcoming?.status} · subject to change</small>
        </div>
      </section>

      <section className="rollout-calendar content-surface">
        <header className="rollout-calendar-head">
          <div><span className="eyebrow">Planning calendar</span><h2>{mode === 'quarter' ? quarterTitle : mode === 'list' ? 'Upcoming estimates' : monthTitle}</h2></div>
          <div className="rollout-calendar-actions">
            <div className="calendar-mode" role="tablist" aria-label="Calendar view">
              {[
                ['month', 'Month'],
                ['quarter', 'Quarter'],
                ['list', 'List']
              ].map(([id, label]) => <button type="button" role="tab" aria-selected={mode === id} className={mode === id ? 'active' : ''} key={id} onClick={() => setMode(id)}>{label}</button>)}
            </div>
            {mode !== 'list' ? <div className="calendar-nav"><button type="button" onClick={() => shift(-1)} aria-label="Previous period">‹</button><button type="button" onClick={() => setCursor(new Date(new Date().getFullYear(), new Date().getMonth(), 1, 12))}>Today</button><button type="button" onClick={() => shift(1)} aria-label="Next period">›</button></div> : null}
          </div>
        </header>

        {mode === 'month' && (
          <div className="month-calendar">
            <div className="calendar-weekdays">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span key={day}>{day}</span>)}</div>
            <div className="calendar-grid">
              {monthCells.map((date) => {
                const events = eventsForDate(date);
                const key = calendarDateKey(date);
                return (
                  <div className={`calendar-day${date.getMonth() !== cursor.getMonth() ? ' outside' : ''}${key === todayKey ? ' today' : ''}${events.length ? ' has-event' : ''}`} key={key}>
                    <span className="calendar-day-number">{date.getDate()}</span>
                    {events.map((product) => (
                      <button type="button" className={`calendar-event ${product.ai ? 'ai' : ''}`} key={product.id} onClick={() => onSelectProduct(product.id)} title={`Open ${product.name}`}>
                        <span>{product.ai ? 'AI' : product.name.replace('Orka', '').slice(0, 2).toUpperCase()}</span><b>{product.name}</b>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {mode === 'quarter' && (
          <div className="quarter-grid">
            {quarterMonths.map((month) => {
              const products = scheduled.filter((product) => {
                const date = parseRolloutDate(product.rolloutDate);
                return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth();
              });
              return (
                <article className="quarter-month" key={`${month.getFullYear()}-${month.getMonth()}`}>
                  <header><b>{new Intl.DateTimeFormat('en-US', { month: 'long' }).format(month)}</b><span>{products.length} estimate{products.length === 1 ? '' : 's'}</span></header>
                  {products.length ? products.map((product) => (
                    <button type="button" key={product.id} onClick={() => onSelectProduct(product.id)}>
                      <span className="app-mark small">{product.ai ? 'AI' : product.name.replace('Orka', '').slice(0, 2).toUpperCase()}</span>
                      <div><b>{product.name}</b><small>{product.rolloutLabel} · {product.status}</small></div>
                    </button>
                  )) : <p>No rollout estimate in this month.</p>}
                </article>
              );
            })}
          </div>
        )}

        {mode === 'list' && (
          <div className="rollout-list">
            {scheduled.map((product) => (
              <button type="button" className={product.ai ? 'ai' : ''} key={product.id} onClick={() => onSelectProduct(product.id)}>
                <time dateTime={product.rolloutDate}><b>{parseRolloutDate(product.rolloutDate).getDate()}</b><span>{new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(parseRolloutDate(product.rolloutDate))}</span></time>
                <span className="app-mark">{product.ai ? 'AI' : product.name.replace('Orka', '').slice(0, 2).toUpperCase()}</span>
                <div><b>{product.name}</b><small>{product.group} · {product.priority}</small></div>
                <StatusPill status={product.status} />
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="available-now content-surface">
        <div><span className="eyebrow">Available now</span><h2>Apps already beyond an estimate.</h2><p>Live and production apps appear here instead of receiving a speculative future date.</p></div>
        <div className="available-now-grid">
          {available.map((product) => <button type="button" key={product.id} onClick={() => onSelectProduct(product.id)}><span className="app-mark">{product.name.replace('Orka', '').slice(0, 2).toUpperCase()}</span><div><b>{product.name}</b><small>{product.status}</small></div><Icon name="checkCircle" size={18} /></button>)}
        </div>
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
        <div><span className="eyebrow">Admin view · website preview</span><h1>Manage how the OrkaOS website introduces the ecosystem.</h1><p>This demo mirrors the OrkaOS GAS admin switch without exposing real controls on the public site. It shows where content, catalog status, brand settings, and the future feedback connection belong.</p></div>
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
  const [ariaOpen, setAriaOpen] = useState(false);
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
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setAppsOpen(false);
        setAlertsOpen(false);
        setProfileOpen(false);
        setAriaOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);


  useEffect(() => {
    const timers = new WeakMap();
    const handleScroll = (event) => {
      const element = event.target;
      if (!(element instanceof HTMLElement) || !element.matches('.scroll-area, .view-scroll')) return;
      element.classList.add('is-scrolling');
      const existing = timers.get(element);
      if (existing) window.clearTimeout(existing);
      timers.set(element, window.setTimeout(() => {
        element.classList.remove('is-scrolling');
        timers.delete(element);
      }, 700));
    };

    document.addEventListener('scroll', handleScroll, true);
    return () => document.removeEventListener('scroll', handleScroll, true);
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
        tab: /meet/i.test(title) ? 'start' : /origin|story/i.test(title) ? 'why' : /micro-stack|works/i.test(title) ? 'how' : /pod|flow|slipstream|ecosystem/i.test(title) ? 'experience' : 'fit',
        title,
        meta: description
      }));

    const appResults = ORKA_PRODUCTS
      .filter((product) => `${product.name} ${product.summary} ${product.group} ${product.status} ${product.rolloutLabel} rollout estimate`.toLowerCase().includes(query))
      .slice(0, 7)
      .map((product) => ({ type: 'app', id: product.id, title: product.name, meta: `${product.group} · ${product.status} · ${product.rolloutLabel}` }));

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
      return (
        <OverviewStory
          chapter={activeTab}
          onOpenForm={openIntake}
          onOpenApps={() => navigate('apps', 'catalog')}
          onNavigate={navigate}
        />
      );
    }

    if (activeView === 'apps') {
      if (activeTab === 'catalog') return <AppsView selectedProductId={selectedProductId} setSelectedProductId={setSelectedProductId} onOpenForm={openIntake} onOpenAria={() => setAriaOpen(true)} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} />;
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
    if (activeTab === 'calendar') return <RolloutCalendarView onOpenForm={openIntake} onSelectProduct={(id) => { setSelectedProductId(id); navigate('apps', 'catalog'); }} />;
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
            <span className="version-chip">V 1.6</span>
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
              placeholder="Search OrkaOS, apps & rollouts…"
              aria-label="Search OrkaOS, apps and rollouts"
            />
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
                <div className="popover-title"><b>What’s new</b><small>Website preview</small></div>
                <div className="alert-item"><span className="alert-dot purple" /><div><b>Meet OrkaAria</b><p>The public guide now explains apps, pane controls, and the rollout plan.</p></div></div>
                <div className="alert-item"><span className="alert-dot blue" /><div><b>Rollout calendar added</b><p>Future Plan now includes estimated OrkaApp rollout months, clearly marked as subject to change.</p></div></div>
                <div className="alert-item"><span className="alert-dot green" /><div><b>OrkaVault is live</b><p>Secure access management and credential sharing for small teams is now available.</p></div></div>
              </div>
            )}
          </div>

          <div className="menu-anchor">
            <button className="profile-button" type="button" aria-label="Open profile menu" onClick={() => { setProfileOpen((open) => !open); setAppsOpen(false); setAlertsOpen(false); }}><AnonymousAvatar /></button>
            {profileOpen && (
              <div className="profile-popover popover right-popover">
                <div className="profile-summary"><AnonymousAvatar large /><div><b>Anonymous visitor</b><small>Public OrkaOS preview</small></div></div>
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
              <button className="button small aria-button" type="button" onClick={() => setAriaOpen(true)} aria-expanded={ariaOpen} aria-controls="orka-aria-panel"><Icon name="sparkles" size={15} /> OrkaAria</button>
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

      {ariaOpen && <OrkaAriaPanel onClose={() => setAriaOpen(false)} onNavigate={navigate} />}
      {feedbackOpen && <FeedbackPlaceholder onClose={() => setFeedbackOpen(false)} />}
      <IntakeForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} defaultIntent={formIntent} onSubmitData={async () => {
        window.alert('The intake form is connected to the existing website flow. Configure /api/intake in deployment to receive submissions.');
      }} />
    </div>
  );
}
