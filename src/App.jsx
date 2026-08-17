import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import IntakeForm from './IntakeForm';
import Icon from './Icon';
import LegacyWidgets from './LegacyWidgets';
import OverviewStory from './OverviewStory';
import {
  ORKA_PRODUCTS,
  ORKA_APP_GROUPS,
  PRODUCT_GROUP_FILTERS,
  ROADMAP_PHASES,
  ROADMAP_STATUS_META
} from './products.js';
import orkaLogoLight from './assets/brand/orka-logo-on-light.png';
import orkaLogoDark from './assets/brand/orka-logo-on-dark.png';
import orkaProfile from './assets/shell/orka-profile.webp';
import googleWorkspaceLogo from './assets/shell/google-workspace.png';
import googleWorkspaceOfficialLogo from './assets/shell/google-workspace-official.png';
import awsLogo from './assets/shell/aws-logo.webp';
import rsnaLogo from './assets/shell/rsna-cloud-connect-black-transparent.png';

const THEME_STORAGE_KEY = 'orkaos-theme';
const FEEDBACK_FORM_URL = import.meta.env.VITE_FEEDBACK_FORM_URL || '';
const VIEW_LABELS = {
  overview: 'Overview',
  apps: 'Orka Apps',
  future: 'Future Plan',
  'orka-ai': 'Orka AI'
};

const NAV_FOLDERS = {
  overview: {
    label: 'Overview',
    icon: 'home',
    tabs: [
      { id: 'start', label: 'Start Here', icon: 'home' },
      { id: 'philosophy', label: 'Philosophy', icon: 'help' },
      { id: 'ecosystem', label: 'Ecosystem', icon: 'layers' },
      { id: 'adoption', label: 'Adoption', icon: 'route' },
      { id: 'journey', label: 'User Journey', icon: 'users' }
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
      { id: 'calendar', label: 'Rollout Planning', icon: 'calendar' }
    ]
  }
};


const OVERVIEW_SEARCH_ITEMS = [
  ['Start Here', 'What OrkaOS is, why it exists, and the Google Workspace micro-stack foundation.', 'start'],
  ['Philosophy', 'Focused tools, pod-based work, progressive complexity, and shared operating language.', 'philosophy'],
  ['Ecosystem', 'How the 20 Orka apps, app families, Google Workspace, and the OrkaOS hub fit together.', 'ecosystem'],
  ['Adoption', 'How a team starts with one workflow and grows toward a broader pod.', 'adoption'],
  ['User Journey', 'Detailed Medium Team, Small Team, Pre-launch, and Solopreneur operating cases.', 'journey']
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

function OrkaAvatar({ large = false }) {
  return (
    <span className={`orka-profile-avatar${large ? ' is-large' : ''}`} aria-hidden="true">
      <img src={orkaProfile} alt="" />
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

function MasterSidebarCollapseIcon() {
  return (
    <svg className="master-collapse-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m11 17-5-5 5-5M18 17l-5-5 5-5" />
    </svg>
  );
}

function StatusPill({ status }) {
  const normalized = status.toLowerCase().replace(/\s+/g, '-');
  const label = status === 'Design' ? 'Design & Testing' : status;
  return <span className={`status-pill status-${normalized}`}>{label}</span>;
}

function PaneControlIcon({ state }) {
  if (state === 'collapsed') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
        <path d="m11 17-5-5 5-5M18 17l-5-5 5-5" />
      </svg>
    );
  }
  if (state === 'expanded') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="4" width="5" height="16" rx="1" />
      <rect x="9.5" y="4" width="5" height="16" rx="1" />
      <rect x="16" y="4" width="5" height="16" rx="1" />
    </svg>
  );
}

function PaneControls({ state = 'normal', onChange }) {
  const options = [
    ['collapsed', 'Collapse this pane'],
    ['normal', 'Three-pane view'],
    ['expanded', 'Fill the workspace with this pane']
  ];

  return (
    <div className="pane-seg" role="group" aria-label="Pane size">
      {options.map(([value, label]) => {
        const active = state === value;
        const restoreAll = value === 'normal';
        return (
          <button
            key={value}
            className="pane-seg-button"
            data-state={value}
            type="button"
            onClick={() => (restoreAll || !active) && onChange?.(value)}
            aria-label={label}
            aria-current={active ? 'true' : undefined}
            aria-disabled={active ? 'true' : undefined}
            tabIndex={active && !restoreAll ? -1 : 0}
            title={label}
          >
            <PaneControlIcon state={value} />
          </button>
        );
      })}
    </div>
  );
}

function ThemeGlyph({ theme }) {
  return (
    <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      {theme === 'dark' ? (
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      ) : (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
        </>
      )}
    </svg>
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
    // Orka Master: the center control is a whole-workspace reset.
    if (nextState === 'normal') {
      setPaneStates({ catalog: 'normal', detail: 'normal', insight: 'normal' });
      return;
    }

    setPaneStates((current) => {
      const paneOrder = ['catalog', 'detail', 'insight'];
      const others = paneOrder.filter((item) => item !== pane);
      const previousState = current[pane];
      const next = { ...current, [pane]: nextState };

      if (nextState === 'expanded') {
        others.forEach((item) => { next[item] = 'collapsed'; });
      } else if (previousState === 'expanded') {
        // Master behavior: collapsing an expanded pane re-opens its two siblings.
        others.forEach((item) => { next[item] = 'normal'; });
      }

      if (nextState === 'normal' && previousState === 'collapsed') {
        others.forEach((item) => { if (next[item] === 'expanded') next[item] = 'normal'; });
      }

      const visible = paneOrder.filter((item) => next[item] !== 'collapsed');
      if (!visible.length) {
        const promote = others.find((item) => current[item] !== 'collapsed') || others[0];
        next[promote] = 'normal';
      }
      return next;
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

            {selectedProduct.ai ? (
              <>
                <div className="detail-section ai-catalog-intro">
                  <span className="detail-label">What Orka AI actually is</span>
                  <h3>An onboard CTO for small Google Workspace teams.</h3>
                  <p>Orka AI is a read-only management console for leaders who have a real Google Workspace stack but no CTO, IT department, or AI specialist. It helps them see what AI and automation they already have, how much is being used, and what useful capacity is still sitting idle.</p>
                </div>
                <div className="app-feature-grid ai-catalog-feature-grid">
                  <article><Icon name="layers" size={19} /><b>Capability inventory</b><p>What AI and automation is already included in the Workspace plan?</p></article>
                  <article><Icon name="users" size={19} /><b>Utilization & adoption</b><p>Who is using it, where is adoption strong, and where is the organization dark?</p></article>
                  <article><Icon name="sparkles" size={19} /><b>Feature advisory</b><p>What useful new capability has arrived inside tools the organization already owns?</p></article>
                  <article><Icon name="route" size={19} /><b>Tech-stack impact</b><p>How would adding or removing a tool affect overlap, integration, and complexity?</p></article>
                </div>
                <div className="ai-catalog-guardrail"><Icon name="lock" size={16} /><span><b>Read-only and advisory.</b> Orka AI does not change Google Workspace, manage licenses, or recommend downsizing.</span></div>
              </>
            ) : (
              <>
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
              </>
            )}

            <div className="mini-app-window">
              <div className="mini-app-top"><span className="mini-app-logo">{selectedProduct.name.slice(0, 1)}</span><b>{selectedProduct.name}</b><span className="mini-app-search"><Icon name="search" size={13} /> Search</span><OrkaAvatar /></div>
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
            <button className="button primary" type="button" onClick={() => onOpenForm('Join Alpha Testing')}>
              Join Alpha Testing
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
              <span className="dashboard-label">Public planning</span>
              <h3>{selectedProduct.publicStatus}</h3>
              <p>{selectedProduct.status === 'Production' ? 'Active production/development. This is not a public-launch claim.' : 'Timing remains TBD while the app is in Design & Testing.'}</p>
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
                    <span>{product.name.replace('Orka', '').slice(0, 2).toUpperCase()}</span><div><b>{product.name}</b><small>{product.publicStatus}</small></div>
                  </button>
                ))}
              </div>
            </article>
            <article className="dashboard-card catalog-snapshot-card">
              <span className="dashboard-label">Catalog snapshot</span>
              <p>The richer three-pane Catalog is the primary app exploration experience. Use these quick picks to move between apps without duplicating the Catalog in a second card directory.</p>
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

  const roadmapPriority = ['orka-aria', 'orka-sop', 'orka-flow', 'orka-os'];
  const orderedProducts = [...ORKA_PRODUCTS].sort((a, b) => {
    const aPriority = roadmapPriority.indexOf(a.id);
    const bPriority = roadmapPriority.indexOf(b.id);
    if (aPriority !== -1 || bPriority !== -1) {
      if (aPriority === -1) return 1;
      if (bPriority === -1) return -1;
      return aPriority - bPriority;
    }
    return a.group.localeCompare(b.group) || a.name.localeCompare(b.name);
  });

  return (
    <div className="view-scroll roadmap-view">
      <section className="roadmap-header content-surface">
        <div>
          <span className="eyebrow">Product view</span>
          <h1>What’s next for the Orka ecosystem.</h1>
          <p>Follow the public priority sequence and current external stage for all 20 Orka apps. The roadmap communicates direction without turning internal availability or rough planning dates into public launch claims.</p>
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
          <div><span className="eyebrow">Public build sequence</span><h2>Priority and stage, in one compact view</h2></div>
          <div className="roadmap-legend">
            {ROADMAP_PHASES.map((phase) => <span key={phase.id}><i className={`legend-dot ${phase.id}`} />{phase.label.replace(/^\d+ · /, '')}</span>)}
          </div>
        </header>
        <div className="roadmap-table">
          <div className="roadmap-table-head"><span>App</span><span>Group</span><span>Progress</span><span>Planning</span><span>Stage</span></div>
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
        <article className="content-surface"><span className="step-number">1</span><h3>Validate the problem</h3><p>Concepts stay visible before code is treated as a commitment.</p></article>
        <article className="content-surface"><span className="step-number">2</span><h3>Design with real teams</h3><p>Early access and testing shape the workflow before production.</p></article>
        <article className="content-surface"><span className="step-number">3</span><h3>Advance one clear job</h3><p>Each app should keep a focused operating purpose as it moves from design and testing into production.</p></article>
        <article className="content-surface"><span className="step-number">4</span><h3>Connect, then graduate</h3><p>Teams can add adjacent apps or move to larger platforms when ready.</p></article>
      </section>

      <section className="content-surface future-cta">
        <div><span className="eyebrow">Help shape the sequence</span><h2>See an app your team needs?</h2><p>Join the pod for previews, or participate in alpha testing when a module reaches an active build stage.</p></div>
        <div className="final-actions"><button className="button primary" type="button" onClick={() => onOpenForm('Join the Pod')}>Join the Pod</button><button className="button secondary" type="button" onClick={() => onOpenForm('Join Alpha Testing')}>Test a build</button></div>
      </section>
    </div>
  );
}


function RolloutPlanningView({ onOpenForm, onSelectProduct }) {
  const priorityIds = ['orka-aria', 'orka-sop', 'orka-flow', 'orka-os'];
  const priorities = priorityIds.map((id) => ORKA_PRODUCTS.find((product) => product.id === id)).filter(Boolean);
  const remaining = ORKA_PRODUCTS.filter((product) => !priorityIds.includes(product.id));

  return (
    <div className="view-scroll rollout-view rollout-planning-view">
      <section className="rollout-hero content-surface">
        <div>
          <span className="eyebrow">Public rollout planning</span>
          <h1>Sequence and stage — without speculative launch dates.</h1>
          <p>The public plan emphasizes what is being prioritized and which stage each app is in. Timing stays TBD until approved commitments exist.</p>
          <div className="hero-actions">
            <button className="button primary" type="button" onClick={() => onOpenForm('Join Alpha Testing')}>Join Alpha Testing</button>
            <span className="estimate-disclaimer"><Icon name="calendar" size={15} /> Dates intentionally omitted</span>
          </div>
        </div>
        <div className="rollout-next-card">
          <span>Current priority</span>
          <b>Orka AI</b>
          <strong>Production</strong>
          <small>Active development · not a public-launch claim</small>
        </div>
      </section>

      <section className="content-surface rollout-priority-section">
        <div className="story-section-heading left compact">
          <span className="eyebrow">Reviewed priority order</span>
          <h2>The first four priorities stay visible as a compact production sequence.</h2>
          <p>The remaining 16 apps are still part of the broader ecosystem and remain visible below.</p>
        </div>
        <div className="priority-roadmap-bar" aria-label="First four OrkaOS roadmap priorities">
          {priorities.map((product, index) => (
            <button type="button" key={product.id} onClick={() => onSelectProduct(product.id)}>
              <span>{String(index + 1)}</span>
              <div><b>{product.name}</b><small>{product.publicStatus}</small></div>
              <i className={`priority-progress ${product.status.toLowerCase()}`} aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      <section className="content-surface rollout-broader-ecosystem">
        <div className="story-section-heading left compact">
          <span className="eyebrow">Broader ecosystem</span>
          <h2>Sixteen more apps remain in the public 20-app vision.</h2>
        </div>
        <div className="rollout-planning-list">
          {remaining.map((product) => (
            <button type="button" key={product.id} onClick={() => onSelectProduct(product.id)}>
              <span className="app-mark small">{product.ai ? 'AI' : product.name.replace('Orka', '').slice(0, 2).toUpperCase()}</span>
              <div><b>{product.name}</b><small>{product.group} · {product.publicStatus}</small></div>
              <span>TBD / planning</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}


const ARIA_STARTERS = [
  'What is OrkaOS?',
  'Which app should I start with?',
  'Explain the three panes',
  'What is the current public plan?'
];

function ariaGuideAnswer(prompt) {
  const query = prompt.toLowerCase();
  if (query.includes('pane') || query.includes('collapse') || query.includes('expand')) {
    return 'The Catalog uses three panes: Catalog, Workspace, and Dashboard. Use the Orka Master segmented control in a pane header to collapse that pane, restore the balanced three-pane view, or expand it while the other panes become compact rails.';
  }
  if (query.includes('rollout') || query.includes('plan') || query.includes('next') || query.includes('release') || query.includes('roadmap')) {
    return 'Future Plan shows public priority and stage without publishing speculative dates. The current first-four sequence is Orka AI, OrkaSOP, OrkaFlow, then OrkaOS; timing elsewhere remains TBD / planning.';
  }
  if (query.includes('start') || query.includes('which app') || query.includes('recommend')) {
    return 'Start with the smallest workflow that is already painful. Use the User Journey section to recognize your operating situation, then use the 20-app Catalog or All App Cards view to choose the focused Orka app that fits that workflow.';
  }
  if (query.includes('aria')) {
    return 'OrkaAria is the interactive guide in the OrkaOS shell. It answers questions about this website and ecosystem. Orka AI is the separate onboard-CTO product beside it: a Google Workspace-first management console for capability inventory, adoption, feature advisory, and tech-stack impact.';
  }
  if (query.includes('ai')) {
    return 'Orka AI is the onboard-CTO product in the 20-app ecosystem. It reads a small team’s Google Workspace environment without changing it, inventories the AI and automation they already have, measures adoption and hours realized or unrealized, surfaces relevant new capability, and advises on buy / keep / drop stack decisions. The OrkaAria control beside it is the website guide you are using now.';
  }
  if (query.includes('what is') || query.includes('orkaos') || query.includes('ecosystem')) {
    return 'OrkaOS is a modular operating system built around focused Orka apps and Google Workspace. Teams can start with one useful workflow, add adjacent capabilities as needs grow, and keep a shared operating language across the pod.';
  }
  if (query.includes('philosophy') || query.includes('adoption') || query.includes('journey') || query.includes('story')) {
    return 'The Overview keeps the full OrkaOS origin story while making Philosophy, Ecosystem, Adoption, and User Journey explicit. Adoption is progressive: begin with the workflow that matters now, establish habits, then connect adjacent workflows as the pod grows.';
  }
  return 'I can guide you through the OrkaOS story, explain Philosophy / Ecosystem / Adoption, recommend a starting point, explain the three-pane workspace, distinguish OrkaAria from Orka AI, or summarize the current public plan.';
}

function OrkaAriaPanel({ onClose, onNavigate }) {
  const [messages, setMessages] = useState([
    { role: 'aria', text: 'Hi — I’m OrkaAria, the OrkaOS guide. Ask about the story, ecosystem, a starting app, the three-pane workspace, adoption, or the current public plan.' }
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
        <div><h2 id="aria-title">OrkaAria</h2><p>OrkaOS guide</p></div>
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
        <span>Guided public preview</span>
        <div><button type="button" onClick={() => { onNavigate('apps', 'catalog'); onClose(); }}>Apps</button><button type="button" onClick={() => { onNavigate('future', 'plan'); onClose(); }}>Future Plan</button></div>
      </footer>
    </section>
  );
}

function OrkaAIView({ onBack, onOpenForm }) {
  const functions = [
    {
      icon: 'layers',
      number: '1',
      title: 'Capability Inventory',
      question: 'What AI and automation do we already have and already pay for?',
      copy: 'Maps the AI and automation surfaces available on the organization’s Google Workspace plan, including useful capability that may be entitled but untouched.'
    },
    {
      icon: 'users',
      number: '2',
      title: 'Utilization & Adoption',
      question: 'What is actually being used, what is not, and who is using it?',
      copy: 'Shows adoption by person, team, and organization so leaders can see where capability is working, where it is dark, and who others can learn from.'
    },
    {
      icon: 'sparkles',
      number: '3',
      title: 'Feature Advisory',
      question: 'What is new inside the tools we already own?',
      copy: 'Surfaces relevant new AI and automation capability inside the customer’s existing Workspace plan instead of adding general AI-news noise.'
    },
    {
      icon: 'route',
      number: '4',
      title: 'Tech Stack Impact',
      question: 'If we add or remove a tool, what does that do to our stack?',
      copy: 'Provides onboard-CTO guidance on overlap, native integration, complexity, and silo risk in the context of what the organization already uses.'
    }
  ];

  return (
    <div className="view-scroll orka-ai-view">
      <section className="orka-ai-hero orka-ai-grid-surface">
        <div className="orka-ai-hero-copy">
          <span className="orka-ai-kicker">Orka AI · Onboard CTO for small teams</span>
          <h1>Get more out of the AI you already pay for.</h1>
          <p>Orka AI connects to a company’s Google Workspace with read-only access and shows leaders what AI and automation they already have, who is actually using it, and how many hours of manual work are still being left on the table.</p>
          <div className="orka-ai-audience-chips" aria-label="Orka AI audience and scope">
            <span>3–50 people</span>
            <span>Paid Google Workspace</span>
            <span>No CTO / IT / AI specialist</span>
            <span>Read-only & advisory</span>
          </div>
          <div className="hero-actions">
            <button className="button primary" type="button" onClick={() => onOpenForm('Join Alpha Testing')}>Join Alpha Testing</button>
            <button className="button orka-ai-ghost" type="button" onClick={onBack}>Back to OrkaOS</button>
          </div>
        </div>

        <aside className="orka-ai-console-preview" aria-label="Illustrative Orka AI management-console model">
          <div className="orka-ai-console-top">
            <span className="orka-ai-console-mark"><Icon name="sparkles" size={17} /></span>
            <div><small>MANAGEMENT CONSOLE</small><b>Google Workspace assessment</b></div>
            <span className="orka-ai-readonly"><Icon name="lock" size={13} /> Read only</span>
          </div>
          <div className="orka-ai-console-grid">
            <article><small>SEE</small><b>Capability inventory</b><span>What is already available?</span></article>
            <article><small>MEASURE</small><b>Adoption</b><span>Who is actually using it?</span></article>
            <article><small>VALUE</small><b>Hours</b><span>Realized vs. unrealized</span></article>
            <article><small>ADVISE</small><b>Next action</b><span>What should we do now?</span></article>
          </div>
          <div className="orka-ai-console-foot"><span className="status-dot" /> Advisory only · your Workspace stays under your control</div>
        </aside>
      </section>

      <section className="orka-ai-section content-surface">
        <div className="orka-ai-section-head">
          <span className="eyebrow">Four core functions</span>
          <h2>Four questions. Nothing extra.</h2>
          <p>The product is intentionally anchored to four management questions so it does not drift into a generic AI assistant, license tool, or news feed.</p>
        </div>
        <div className="orka-ai-function-grid">
          {functions.map((item) => (
            <article key={item.number}>
              <div className="orka-ai-function-top"><span>{item.number}</span><Icon name={item.icon} size={20} /></div>
              <h3>{item.title}</h3>
              <b>{item.question}</b>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="orka-ai-value-section">
        <div className="orka-ai-section-head">
          <span className="eyebrow">Value model</span>
          <h2>Measure the gap in hours, not cancelled licenses.</h2>
          <p>Orka AI is an adoption and efficiency product. Its headline unit is time: how much manual work AI and automation removed, and how much useful capacity was available but not taken.</p>
        </div>
        <div className="orka-ai-value-grid">
          <article className="realized"><span><Icon name="checkCircle" size={20} /></span><small>HOURS REALIZED</small><h3>Work already removed</h3><p>Manual effort that the organization’s AI and automation actually displaced during the period.</p></article>
          <article className="unrealized"><span><Icon name="clock" size={20} /></span><small>HOURS UNREALIZED</small><h3>Useful capacity left untaken</h3><p>Eligible work that stayed manual even though an entitled AI or automation surface was available.</p></article>
          <article className="score"><span><Icon name="chart" size={20} /></span><small>EFFICIENCY SCORE</small><h3>A comparable 0–100 signal</h3><p>A score at organization, team, and person level derived from realized and unrealized opportunity.</p></article>
        </div>
        <p className="orka-ai-value-note">Dollar equivalence can be an optional derived view. It is not the headline metric and is not framed as subscription savings.</p>
      </section>

      <section className="orka-ai-how content-surface">
        <div className="orka-ai-how-copy">
          <span className="eyebrow">Google Workspace first</span>
          <h2>A magnifying glass, not a telescope.</h2>
          <p>Phase 1 goes deep on Google Workspace. The POC architecture reads entitlement, configuration, and activity data, analyzes it on AWS, and returns ranked insight through the Orka AI management console. It does not write back to Workspace.</p>
          <div className="orka-ai-how-flow" aria-label="Orka AI POC flow">
            <div><img src={googleWorkspaceOfficialLogo} alt="Google Workspace" /><b>Google Workspace</b><span>Read-only signals</span></div>
            <span aria-hidden="true">→</span>
            <div><img src={awsLogo} alt="AWS" /><b>AWS analysis</b><span>Rules + Bedrock judgment</span></div>
            <span aria-hidden="true">→</span>
            <div><span className="orka-ai-flow-mark"><Icon name="sparkles" size={20} /></span><b>Orka AI</b><span>Insight + recommended action</span></div>
          </div>
        </div>
        <div className="orka-ai-guardrail-card">
          <span className="eyebrow">Deliberate guardrails</span>
          <h3>What Orka AI is not</h3>
          <ul>
            <li><Icon name="x" size={16} /><span><b>Not license or billing management.</b> It does not track seats or subscriptions.</span></li>
            <li><Icon name="x" size={16} /><span><b>Not a cost-cutting tool.</b> It never recommends downsizing; the goal is stronger adoption.</span></li>
            <li><Icon name="x" size={16} /><span><b>Not a generic chatbot.</b> The CTO chat is one advisory function inside a management console.</span></li>
            <li><Icon name="x" size={16} /><span><b>Not read-write.</b> It advises; the customer decides and acts.</span></li>
            <li><Icon name="x" size={16} /><span><b>Not multi-tool yet.</b> Phase 1 is deliberately Google Workspace-first.</span></li>
          </ul>
        </div>
      </section>

      <section className="orka-ai-poc-strip content-surface">
        <div className="orka-ai-poc-copy">
          <span className="eyebrow">Proof of concept</span>
          <h2>Built to prove the management layer, not a demo chatbot.</h2>
          <p>The current POC direction with RSNA Cloud Connect on AWS is to prove that a real Workspace organization can be connected, assessed, and advised without changing anything in its environment.</p>
        </div>
        <div className="orka-ai-partner-row">
          <div><img src={awsLogo} alt="AWS" /><span>Powered by AWS</span></div>
          <div><img className="orka-ai-rsna-logo" src={rsnaLogo} alt="RSNA Cloud Connect" /><span>POC partner</span></div>
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
            {ORKA_PRODUCTS.map((product) => <div key={product.id}><b>{product.name}</b><span>{product.group}</span><StatusPill status={product.status} /><span>Follow / test</span></div>)}
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
                <button className="button primary" type="button" onClick={() => onOpenForm('Join Alpha Testing')}>Follow app</button>
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

function EcosystemFooter({ onOpenForm, onNavigate }) {
  return (
    <footer className="ecosystem-footer" aria-label="OrkaOS participation and credibility links">
      <div className="partner-hierarchy" aria-label="OrkaOS ecosystem relationships">
        <div className="partner-zone partner-zone-left">
          <b className="projxon-wordmark">PROJXON</b>
        </div>
        <div className="partner-zone partner-zone-center">
          <div className="partner-lockup partner-lockup-google">
            <div className="partner-mark"><img src={googleWorkspaceLogo} alt="Google Workspace" /></div>
            <small className="partner-relationship">Built for Google Workspace</small>
          </div>
          <div className="partner-lockup partner-lockup-aws">
            <div className="partner-mark"><img src={awsLogo} alt="AWS" /></div>
            <small className="partner-relationship">Powered by AWS</small>
          </div>
        </div>
        <div className="partner-zone partner-zone-right">
          <div className="partner-lockup partner-lockup-rsna">
            <div className="partner-mark"><img src={rsnaLogo} alt="RSNA" /></div>
            <small className="partner-relationship">Built by RSNA</small>
          </div>
        </div>
      </div>

      <div className="participation-row">
        <button className="participation-action primary" type="button" onClick={() => onOpenForm('Join the Pod')}>
          <span><Icon name="userPlus" size={18} /></span><div><b>Join the Pod</b><small>Explore OrkaOS with the team</small></div>
        </button>
        <button className="participation-action" type="button" onClick={() => onOpenForm('Join Alpha Testing')}>
          <span><Icon name="flask" size={18} /></span><div><b>Test New Apps Early</b><small>Join Alpha Testing</small></div>
        </button>
        <button className="participation-action" type="button" onClick={() => onOpenForm('Partner with OrkaOS')}>
          <span><Icon name="handshake" size={18} /></span><div><b>Partner with OrkaOS</b><small>Explore a pilot or partnership</small></div>
        </button>
      </div>

      <div className="ecosystem-utility-row">
        <button type="button" onClick={() => onNavigate('overview', 'start')}>Overview</button>
        <button type="button" onClick={() => onNavigate('apps', 'catalog')}>20-app Catalog</button>
        <a href="https://www.linkedin.com/company/orkaos/about/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        <span>OrkaOS · BUILD YOUR POD</span>
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
  const [selectedProductId, setSelectedProductId] = useState('orka-aria');
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
  const [launcherFilter, setLauncherFilter] = useState('');
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [ariaOpen, setAriaOpen] = useState(false);
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
    if (NAV_FOLDERS[view]) setOpenFolders((current) => ({ ...current, [view]: true }));
    setSidebarOpen(false);
    setSearchOpen(false);
  };

  // Keep this callback stable so Overview's scroll tracker is not torn down and
  // recreated every time activeTab changes during a smooth chapter navigation.
  const handleOverviewSectionChange = useCallback((section) => {
    setActiveTab(section);
  }, []);

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
      .map(([title, description, tab]) => ({
        type: 'destination',
        id: 'overview',
        tab,
        title,
        meta: description
      }));

    const appResults = ORKA_PRODUCTS
      .filter((product) => `${product.name} ${product.summary} ${product.group} ${product.publicStatus} ${product.priority}`.toLowerCase().includes(query))
      .slice(0, 7)
      .map((product) => ({ type: 'app', id: product.id, title: product.name, meta: `${product.group} · ${product.publicStatus} · ${product.rolloutLabel}` }));

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

  const launcherProducts = ORKA_PRODUCTS.filter((product) => product.name.toLowerCase().includes(launcherFilter.trim().toLowerCase()));
  const launcherGroups = ORKA_APP_GROUPS.map((group) => ({
    ...group,
    products: launcherProducts.filter((product) => product.groupId === group.id)
  })).filter((group) => group.products.length);
  const logo = theme === 'dark' ? orkaLogoDark : orkaLogoLight;
  const currentFolder = NAV_FOLDERS[activeView];
  const currentTab = currentFolder?.tabs.find((tab) => tab.id === activeTab);

  const renderUserView = () => {
    if (activeView === 'orka-ai') {
      return <OrkaAIView onBack={() => navigate('overview', 'start')} onOpenForm={openIntake} />;
    }

    if (activeView === 'overview') {
      return (
        <OverviewStory
          chapter={activeTab}
          onOpenForm={openIntake}
          onOpenApps={() => navigate('apps', 'catalog')}
          onSelectProduct={(id) => { setSelectedProductId(id); navigate('apps', 'catalog'); }}
          onNavigate={navigate}
          onSectionChange={handleOverviewSectionChange}
        />
      );
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
    if (activeTab === 'calendar') return <RolloutPlanningView onOpenForm={openIntake} onSelectProduct={(id) => { setSelectedProductId(id); navigate('apps', 'catalog'); }} />;
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
            <span className="version-chip">V1.5</span>
          </button>
          <span className="brand-build-pod">BUILD YOUR POD</span>
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

          <div className="menu-anchor launcher-anchor">
            <button className="icon-button" type="button" aria-label="Open Orka app launcher" onClick={() => { setAppsOpen((open) => !open); setAlertsOpen(false); setProfileOpen(false); }}><NineDotIcon /></button>
            {appsOpen && (
              <div className="apps-popover popover right-popover">
                <div className="launcher-title-row"><span>App series</span><span>{launcherProducts.length} of {ORKA_PRODUCTS.length} apps</span></div>
                <input
                  className="apps-filter"
                  type="search"
                  value={launcherFilter}
                  onChange={(event) => setLauncherFilter(event.target.value)}
                  placeholder="Filter apps…"
                  aria-label="Filter apps"
                  autoComplete="off"
                />
                <div className="apps-scroll scroll-area">
                  {launcherGroups.map((group) => (
                    <section className="launcher-group" key={group.id} aria-label={`${group.label} apps`}>
                      <div className="launcher-group-head"><span className="launcher-group-bar" aria-hidden="true" /><b>{group.label}</b><small>{group.products.length}</small></div>
                      <div className="app-launcher-grid">
                        {group.products.map((product) => (
                          <button type="button" key={product.id} onClick={() => { setSelectedProductId(product.id); navigate('apps', 'catalog'); setAppsOpen(false); }}>
                            <span className={product.ai ? 'is-ai' : ''}>{product.ai ? 'AI' : product.name.replace('Orka', '').slice(0, 2).toUpperCase()}</span>
                            <b>{product.name.replace('Orka', '') || 'OS'}</b>
                          </button>
                        ))}
                      </div>
                    </section>
                  ))}
                  {!launcherGroups.length && <div className="launcher-empty">No apps match “{launcherFilter}”.</div>}
                </div>
                <button className="popover-footer-action" type="button" onClick={() => { navigate('apps', 'catalog'); setAppsOpen(false); }}>View full catalog →</button>
              </div>
            )}
          </div>

          <button className="theme-switch" type="button" onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title="Toggle light / dark">
            <span className="theme-track"><ThemeGlyph theme={theme} /><span className="theme-knob" /></span>
          </button>

          <div className="menu-anchor alerts-anchor">
            <button className="icon-button" type="button" aria-label="Open updates" onClick={() => { setAlertsOpen((open) => !open); setAppsOpen(false); setProfileOpen(false); }}><Icon name="bell" size={18} /><span className="notification-dot" /></button>
            {alertsOpen && (
              <div className="alerts-popover popover right-popover">
                <div className="popover-title"><b>What’s new</b><small>Website preview</small></div>
                <div className="alert-item"><span className="alert-dot purple" /><div><b>Orka AI · onboard CTO</b><p>Google Workspace-first, read-only, and focused on capability inventory, adoption, relevant feature advisory, and tech-stack impact.</p></div></div>
                <div className="alert-item"><span className="alert-dot blue" /><div><b>Overview rebuilt around five concepts</b><p>Philosophy, Ecosystem, Adoption, and User Journey now sit beside Start Here in one continuous experience.</p></div></div>
                <div className="alert-item"><span className="alert-dot green" /><div><b>Public dates removed</b><p>Future Plan now communicates priority, stage, and TBD planning instead of speculative rollout dates.</p></div></div>
              </div>
            )}
          </div>

          <div className="menu-anchor">
            <button className="profile-button" type="button" aria-label="Open profile menu" onClick={() => { setProfileOpen((open) => !open); setAppsOpen(false); setAlertsOpen(false); }}><OrkaAvatar /></button>
            {profileOpen && (
              <div className="profile-popover popover right-popover">
                <div className="profile-summary"><OrkaAvatar large /><div><b>OS User</b><small>Public OrkaOS preview</small></div></div>
                <div className="menu-separator" />
                <button type="button" onClick={() => setProfileOpen(false)} aria-label="Settings, demo only"><Icon name="settings" size={16} /> <span>Settings</span><small className="menu-item-note">Demo</small></button>
                <button type="button" onClick={() => { navigate('overview'); setProfileOpen(false); }}><Icon name="help" size={16} /> <span>About OrkaOS</span></button>
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
            <button className="collapse-btn" type="button" onClick={() => setSidebarCollapsed((collapsed) => !collapsed)} title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}><MasterSidebarCollapseIcon /><span className="gas-nav-label">Collapse</span></button>
          </div>
        </aside>

        <main className="main-wrap">
          <div className="guide-bar">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              {role === 'admin' ? (
                <b aria-current="page">Admin Console</b>
              ) : activeView === 'orka-ai' ? (
                <b aria-current="page">Orka AI</b>
              ) : (
                <>
                  <span className="breadcrumb-folder">{currentFolder?.label}</span>
                  <span className="breadcrumb-separator">/</span>
                  <b aria-current="page">{currentTab?.label}</b>
                </>
              )}
            </nav>
            <div className="guide-actions">
              <button className="button small aria-button" type="button" onClick={() => { setRole('user'); setAriaOpen(true); }} aria-label="Open OrkaAria" aria-expanded={ariaOpen} aria-controls="orka-aria-panel"><Icon name="sparkles" size={15} /> OrkaAria</button>
              <button className="button small orka-ai-entry" type="button" onClick={() => { setRole('user'); setAriaOpen(false); navigate('orka-ai'); }} aria-label="Open Orka AI"><Icon name="sparkles" size={15} /> Orka AI</button>
            </div>
          </div>

          <div className="main-content">
            {role === 'admin' ? (
              <AdminView activeView={activeView} setActiveView={(view) => navigate(view)} setFeedbackOpen={openFeedback} />
            ) : renderUserView()}
          </div>

        </main>
      </div>

      <EcosystemFooter onOpenForm={openIntake} onNavigate={navigate} />

      {ariaOpen && <OrkaAriaPanel onClose={() => setAriaOpen(false)} onNavigate={navigate} />}
      {feedbackOpen && <FeedbackPlaceholder onClose={() => setFeedbackOpen(false)} />}
      <IntakeForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} defaultIntent={formIntent} onSubmitData={async () => {
        window.alert('The intake form is connected to the existing website flow. Configure /api/intake in deployment to receive submissions.');
      }} />
    </div>
  );
}
