import React, { useMemo, useState } from 'react';
import Icon from './Icon';
import { ORKA_PRODUCTS_BY_ID } from './products.js';
import orkaLogoLight from './assets/brand/orka-logo-on-light.png';
import podFormationArt from './assets/story/orka-pod-formation.webp';

const STARTING_POINTS = [
  {
    id: 'knowledge',
    label: 'Knowledge is scattered',
    prompt: '“Credentials and company knowledge live in too many places.”',
    icon: 'lock',
    series: ['orka-vault', 'orka-sop', 'orka-flow'],
    explanation: 'Secure the source of truth, turn repeat knowledge into a living SOP, then carry that process into the handoff.'
  },
  {
    id: 'process',
    label: 'Work happens differently',
    prompt: '“Everyone completes the same work a different way.”',
    icon: 'clipboard',
    series: ['orka-sop', 'orka-process', 'orka-flow'],
    explanation: 'Document the repeatable work, map the process around it, then make the handoff easier to run.'
  },
  {
    id: 'tasks',
    label: 'Tasks disappear after meetings',
    prompt: '“We leave the call aligned, then the next steps disappear.”',
    icon: 'checkCircle',
    series: ['orka-task', 'orka-project', 'orka-goals'],
    explanation: 'Give actions an owner, connect them to project context, then make progress visible to the pod.'
  },
  {
    id: 'people',
    label: 'The team is hard to navigate',
    prompt: '“New teammates cannot tell who is who or where to go.”',
    icon: 'users',
    series: ['orka-hr', 'orka-process', 'orka-flow'],
    explanation: 'Start with team identity, clarify the routines around people, then make collaboration easier to run.'
  }
];

const SOP_ITEMS = [
  {
    id: 'onboarding',
    name: 'New Employee Onboarding',
    category: 'Onboarding',
    purpose: 'Ensure every new teammate has a consistent, engaging start.',
    steps: ['Welcome & accounts', 'Team introductions', 'First-week check-in'],
    insight: 'A repeatable people process with the owner, work, and review context in one place.'
  },
  {
    id: 'expense',
    name: 'Expense Reimbursement',
    category: 'Operations',
    purpose: 'Keep a recurring operational request easy to find, follow, and hand off.',
    steps: ['Collect the request', 'Confirm the required details', 'Route the next action'],
    insight: 'The dashboard stays a pinboard: useful signals about the selected work, not a separate analytics product.'
  },
  {
    id: 'client',
    name: 'Client Onboarding',
    category: 'Sales',
    purpose: 'Give a cross-functional handoff one shared source of truth.',
    steps: ['Confirm the handoff', 'Share the working context', 'Set the first checkpoint'],
    insight: 'The same shell can support another workflow without teaching the team a new navigation language.'
  },
  {
    id: 'incident',
    name: 'Incident Response',
    category: 'Operations',
    purpose: 'Put a time-sensitive routine where the team can act without searching through scattered documents.',
    steps: ['Open the response', 'Coordinate the owners', 'Capture the follow-through'],
    insight: 'Catalog, workspace, and dashboard stay in the same places even when the content changes.'
  }
];

export function PodFormationVisual() {
  return (
    <figure className="pod-formation-visual">
      <img
        src={podFormationArt}
        alt="A pod of orcas moving together through deep blue water, used as a visual metaphor for a synchronized team."
        width="366"
        height="910"
        loading="eager"
        fetchPriority="high"
      />
      <figcaption>
        <span>Pod</span>
        <i aria-hidden="true">→</i>
        <span>Formation</span>
        <i aria-hidden="true">→</i>
        <strong>Flow</strong>
      </figcaption>
    </figure>
  );
}

export function MicroStackExplorer({ onOpenApps }) {
  const [selectedId, setSelectedId] = useState(STARTING_POINTS[0].id);
  const [adoptedCount, setAdoptedCount] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const selected = STARTING_POINTS.find((point) => point.id === selectedId) || STARTING_POINTS[0];
  const products = useMemo(
    () => selected.series.map((id) => ORKA_PRODUCTS_BY_ID[id]).filter(Boolean),
    [selected]
  );
  const activeProduct = products[activeIndex] || products[0];
  const nextProduct = products[adoptedCount];
  const hubReady = adoptedCount >= products.length;

  const chooseStartingPoint = (id) => {
    setSelectedId(id);
    setAdoptedCount(1);
    setActiveIndex(0);
  };

  const addNext = () => {
    if (hubReady) {
      onOpenApps?.();
      return;
    }
    setAdoptedCount((count) => Math.min(products.length, count + 1));
    setActiveIndex(adoptedCount);
  };

  return (
    <div className="micro-stack-explorer">
      <div className="stack-question" aria-labelledby="stack-question-title">
        <div className="stack-question-heading">
          <span className="eyebrow">Interactive starting-point finder</span>
          <h3 id="stack-question-title">What feels stuck first?</h3>
          <p>Choose a real pain. Watch the micro-stack change around it.</p>
        </div>
        <div className="stack-start-options" role="group" aria-label="Choose a starting problem">
          {STARTING_POINTS.map((point) => {
            const active = point.id === selectedId;
            return (
              <button
                key={point.id}
                type="button"
                className={`stack-start-option${active ? ' active' : ''}`}
                onClick={() => chooseStartingPoint(point.id)}
                aria-pressed={active}
              >
                <span><Icon name={point.icon} size={17} /></span>
                <b>{point.label}</b>
              </button>
            );
          })}
        </div>
        <blockquote>{selected.prompt}</blockquote>
        <p className="stack-explanation">{selected.explanation}</p>
      </div>

      <div className="stack-current" aria-live="polite">
        <div className="stack-foundation">
          <span className="google-mark" aria-hidden="true">G</span>
          <div><small>Foundation stays put</small><b>Google Workspace</b></div>
          <span className="stack-foundation-note">Gmail · Drive · Docs · Sheets · Calendar</span>
        </div>

        <div className="stack-route" aria-label="Recommended app series">
          {products.map((product, index) => {
            const adopted = index < adoptedCount;
            const recommended = index === adoptedCount;
            const active = index === activeIndex;
            return (
              <React.Fragment key={product.id}>
                <button
                  type="button"
                  className={`stack-app-node${adopted ? ' adopted' : ''}${recommended ? ' recommended' : ''}${active ? ' active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={active}
                >
                  <span className="stack-app-number">{index + 1}</span>
                  <span className="stack-app-copy">
                    <small>{adopted ? 'In your pod' : recommended ? 'Recommended next' : 'Later in this series'}</small>
                    <b>{product.name}</b>
                    <span>{product.group} · {product.google}</span>
                  </span>
                  <span className="stack-app-state" aria-hidden="true">{adopted ? '✓' : recommended ? '→' : '·'}</span>
                </button>
                {index < products.length - 1 && <span className="stack-route-arrow" aria-hidden="true">→</span>}
              </React.Fragment>
            );
          })}
          <span className="stack-route-arrow to-hub" aria-hidden="true">→</span>
          <div className={`stack-hub${hubReady ? ' ready' : ''}`}>
            <img src={orkaLogoLight} alt="" />
            <div><small>{hubReady ? 'Pod connected' : 'Circling inward'}</small><b>OrkaOS</b></div>
          </div>
        </div>

        <div className="stack-detail-panel">
          <div>
            <span className="eyebrow">Selected app</span>
            <h4>{activeProduct?.name}</h4>
            <p>{activeProduct?.summary}</p>
          </div>
          <div className="stack-adoption-status">
            <small>Gradual adoption</small>
            <div className="stack-progress-dots" aria-label={`${adoptedCount} of ${products.length} apps in this example series adopted`}>
              {products.map((product, index) => <i key={product.id} className={index < adoptedCount ? 'on' : ''} />)}
            </div>
            <b>{hubReady ? 'The hub can now tie this example pod together.' : 'Start with one. Add the next app only when the workflow calls for it.'}</b>
          </div>
          <button className="button primary" type="button" onClick={addNext}>
            {hubReady ? 'Explore the full app catalog' : `Add ${nextProduct?.name}`}
          </button>
        </div>
        <p className="stack-demo-note">Illustrative route. OrkaOS is designed to make 2–3 useful next recommendations based on what the team is already using.</p>
      </div>
    </div>
  );
}

export function InteractiveAppShell() {
  const [selectedId, setSelectedId] = useState(SOP_ITEMS[0].id);
  const [mobilePane, setMobilePane] = useState('workspace');
  const selected = SOP_ITEMS.find((item) => item.id === selectedId) || SOP_ITEMS[0];

  return (
    <div className="story-app-demo-wrap">
      <div className="story-app-demo-label">
        <span className="eyebrow">Interactive product demo</span>
        <span>Sample content · click the catalog or switch panes</span>
      </div>
      <div className="story-app-pane-tabs" role="tablist" aria-label="Preview pane">
        {[
          ['catalog', 'Catalog'],
          ['workspace', 'Workspace'],
          ['dashboard', 'Dashboard']
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mobilePane === id}
            className={mobilePane === id ? 'active' : ''}
            onClick={() => setMobilePane(id)}
          >{label}</button>
        ))}
      </div>
      <div className="story-app-shell interactive" data-mobile-pane={mobilePane} aria-label="Interactive example of the universal three-pane OrkaApp layout">
        <div className="story-app-topbar">
          <div className="story-app-brand"><img src={orkaLogoLight} alt="" /><b><span>Orka</span>SOP</b></div>
          <div className="story-app-search"><Icon name="search" size={13} /> Search SOPs, keywords, or processes…</div>
          <div className="story-app-avatar" aria-hidden="true">PX</div>
        </div>
        <div className="story-app-panes">
          <aside className="story-demo-pane story-demo-catalog">
            <small>1 · CATALOG</small>
            <p className="story-demo-pane-subtitle">Browse what is inside the app.</p>
            {SOP_ITEMS.map((item) => (
              <button
                className={item.id === selectedId ? 'active' : ''}
                type="button"
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                aria-pressed={item.id === selectedId}
              >
                <span><Icon name="clipboard" size={14} /> {item.name}</span>
                <b>{item.category}</b>
              </button>
            ))}
          </aside>
          <main className="story-demo-pane story-demo-workspace" aria-live="polite">
            <small>2 · WORKSPACE</small>
            <p className="story-demo-pane-subtitle">Where the pod creates, edits, and collaborates.</p>
            <div className="story-doc-title"><span>{selected.name}</span><em>Selected</em></div>
            <label className="story-demo-field">
              <span>Purpose</span>
              <strong>{selected.purpose}</strong>
            </label>
            <div className="story-doc-steps">
              {selected.steps.map((step, index) => <span key={step}><b>{index + 1}</b> {step}</span>)}
            </div>
          </main>
          <section className="story-demo-pane story-demo-dashboard">
            <small>3 · DASHBOARD</small>
            <p className="story-demo-pane-subtitle">A pinboard of useful context at a glance.</p>
            <div className="story-demo-insight-card">
              <span>Current item</span>
              <b>{selected.name}</b>
              <p>{selected.insight}</p>
            </div>
            <div className="story-demo-signal-list">
              <span><i /> Same navigation pattern</span>
              <span><i /> Work remains central</span>
              <span><i /> Context changes with selection</span>
            </div>
          </section>
        </div>
        <div className="story-app-caption">Catalog on the left. Work in the center. Useful signals on the right. On smaller screens, the same three panes re-layer behind tabs instead of shrinking into unreadability.</div>
      </div>
    </div>
  );
}
