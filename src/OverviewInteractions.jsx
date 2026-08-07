import React, { useEffect, useMemo, useState } from 'react';
import Icon from './Icon';
import { ORKA_PRODUCTS, ORKA_PRODUCTS_BY_ID } from './products.js';
import orkaLogoLight from './assets/brand/orka-logo-on-light.png';
import podFormationArt from './assets/story/orka-pod-formation.webp';
import topologyField from './assets/system/topology-field.svg';
import currentRibbon from './assets/system/current-ribbon.svg';
import podMember from './assets/system/pod-member.svg';
import nodeShell from './assets/system/node-shell.svg';
import navigationDial from './assets/system/navigation-dial.svg';
import slipstreamStreak from './assets/system/slipstream-streak.svg';
import workflowMessage from './assets/system/workflow-message.svg';
import workflowDocument from './assets/system/workflow-document.svg';
import workflowTask from './assets/system/workflow-task.svg';

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

const ROUTE_SLOTS = [
  { x: 225, y: 390, className: 'route-slot-a' },
  { x: 455, y: 215, className: 'route-slot-b' },
  { x: 690, y: 370, className: 'route-slot-c' }
];

const HUB_SLOT = { x: 825, y: 175 };
const ROUTE_PATH = 'M 225 390 C 305 365 345 245 455 215 C 565 185 620 285 690 370 C 748 424 825 320 825 175';
const CONTEXT_ANCHORS = [
  { ids: ['orka-aria', 'orka-prompt'], x: 115, y: 120 },
  { ids: ['orka-hr', 'orka-ats'], x: 810, y: 100 },
  { ids: ['orka-finance', 'orka-crm'], x: 875, y: 445 },
  { ids: ['orka-social', 'orka-marketing'], x: 120, y: 495 }
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

const MENTAL_MODELS = [
  {
    id: 'pod',
    label: 'Pod',
    icon: 'users',
    signal: 'Formation',
    headline: 'Individual effort becomes coordinated movement.',
    body: 'Related people and apps move into formation around one objective. The interaction model is synchronization, not decoration.'
  },
  {
    id: 'flow',
    label: 'Flow',
    icon: 'route',
    signal: 'Continuity',
    headline: 'The next action stays visible without a handoff cliff.',
    body: 'Work moves through meetings, tasks, documents, and projects as one current instead of restarting inside every tool.'
  },
  {
    id: 'slipstream',
    label: 'Slipstream',
    icon: 'trending',
    signal: 'Acceleration',
    headline: 'The system recedes while the team gains momentum.',
    body: 'Supporting automation and context stay beneath the primary task until they are useful, keeping the interface calm and the team in control.'
  },
  {
    id: 'ecosystem',
    label: 'Ecosystem',
    icon: 'layers',
    signal: 'Navigation',
    headline: 'Every useful entry point can reveal the next useful relationship.',
    body: 'Apps belong to families and series, so adoption can grow inward toward the OrkaOS hub without forcing an all-or-nothing suite.'
  }
];

const ORIGIN_EVENTS = [
  {
    number: '01',
    short: 'Friction surfaced',
    title: 'Coaching revealed the same collaboration problem.',
    body: 'Students, founders, and remote teammates could do the work, but scattered messages and unclear handoffs kept breaking the group.'
  },
  {
    number: '02',
    short: 'A workflow emerged',
    title: 'A personal deep-work rhythm became the first useful model.',
    body: 'Better meetings, visible owners, focused sessions, and follow-through showed that the process itself could guide a team into flow.'
  },
  {
    number: '03',
    short: 'The pod formed',
    title: 'A synchronized micro-team gave the system its operating language.',
    body: 'A pod of three to five people could divide whale-sized work, stay aligned, and move faster through clear responsibilities.'
  },
  {
    number: '04',
    short: 'The stack compounded',
    title: 'One focused app led naturally to another.',
    body: 'HR, chat, AI, tasks, projects, and operating tools stopped looking like separate ideas and became a modular micro-stack around Google Workspace.'
  }
];

const FIT_STAGES = [
  { id: 'solo', label: 'Solo', range: '1', verdict: 'Useful edge case', body: 'A solopreneur can begin with one focused workflow, especially when preparing to collaborate.' },
  { id: 'pod', label: 'Pod', range: '3–5', verdict: 'Natural starting zone', body: 'A small group is establishing its first shared operating rhythm and needs structure without overhead.' },
  { id: 'scaling', label: 'Scaling', range: '5–50', verdict: 'Strongest fit', body: 'Collaboration is starting to crack, but a giant enterprise suite would add more weight than clarity.' },
  { id: 'mature', label: 'Mature stack', range: '50+', verdict: 'Often time to graduate', body: 'Deep specialist systems and dedicated administrators may be the better fit. OrkaOS is designed to help teams reach that stage, not trap them.' }
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
  const [activeProductId, setActiveProductId] = useState(STARTING_POINTS[0].series[0]);
  const [userInteracted, setUserInteracted] = useState(false);
  const [paused, setPaused] = useState(false);
  const selected = STARTING_POINTS.find((point) => point.id === selectedId) || STARTING_POINTS[0];
  const products = useMemo(() => selected.series.map((id) => ORKA_PRODUCTS_BY_ID[id]).filter(Boolean), [selected]);
  const contextProducts = useMemo(() => CONTEXT_ANCHORS.map((anchor) => {
    const id = anchor.ids.find((candidate) => !selected.series.includes(candidate));
    return id ? { product: ORKA_PRODUCTS_BY_ID[id], ...anchor } : null;
  }).filter((item) => item?.product), [selected]);
  const activeProduct = ORKA_PRODUCTS_BY_ID[activeProductId] || products[0];
  const nextProduct = products[adoptedCount];
  const hubReady = adoptedCount >= products.length;

  useEffect(() => {
    if (userInteracted || paused || typeof window === 'undefined' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timers = [
      window.setTimeout(() => {
        setSelectedId('tasks');
        setAdoptedCount(1);
        setActiveProductId('orka-task');
      }, 2600),
      window.setTimeout(() => {
        setAdoptedCount(2);
        setActiveProductId('orka-project');
      }, 5000),
      window.setTimeout(() => {
        setAdoptedCount(3);
        setActiveProductId('orka-goals');
      }, 7400),
      window.setTimeout(() => {
        setSelectedId(STARTING_POINTS[0].id);
        setAdoptedCount(1);
        setActiveProductId(STARTING_POINTS[0].series[0]);
      }, 10200)
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [paused, userInteracted]);

  const markInteracted = () => setUserInteracted(true);

  const chooseStartingPoint = (id) => {
    const point = STARTING_POINTS.find((item) => item.id === id) || STARTING_POINTS[0];
    markInteracted();
    setSelectedId(id);
    setAdoptedCount(1);
    setActiveProductId(point.series[0]);
  };

  const addNext = () => {
    markInteracted();
    if (hubReady) {
      onOpenApps?.();
      return;
    }
    setAdoptedCount((count) => Math.min(products.length, count + 1));
    setActiveProductId(nextProduct?.id || products.at(-1)?.id);
  };

  const inspectProduct = (id) => {
    markInteracted();
    setActiveProductId(id);
  };

  return (
    <div
      className="micro-stack-explorer ecosystem-explorer ecosystem-explorer-v4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="ecosystem-command" aria-labelledby="stack-question-title">
        <div className="ecosystem-command-heading">
          <span className="eyebrow">Choose your entry current</span>
          <h3 id="stack-question-title">What feels stuck first?</h3>
          <p>Pick one real pain. The ecosystem will surface a starting app and illuminate a natural path inward.</p>
        </div>
        <div className="ecosystem-problems" role="group" aria-label="Choose a starting problem">
          {STARTING_POINTS.map((point) => {
            const active = point.id === selectedId;
            return (
              <button
                key={point.id}
                type="button"
                className={`ecosystem-problem${active ? ' active' : ''}`}
                onClick={() => chooseStartingPoint(point.id)}
                aria-pressed={active}
              >
                <Icon name={point.icon} size={16} />
                <span>{point.label}</span>
              </button>
            );
          })}
        </div>
        <blockquote>{selected.prompt}</blockquote>
      </div>

      <div className="ecosystem-scene ecosystem-system-v5" aria-live="polite">
        <img className="ecosystem-topology-asset" src={topologyField} alt="" aria-hidden="true" />
        <img className="ecosystem-current-asset" src={currentRibbon} alt="" aria-hidden="true" />
        <span className="ecosystem-zone-label zone-discover" aria-hidden="true">Discover</span>
        <span className="ecosystem-zone-label zone-connect" aria-hidden="true">Connect</span>

        <svg className="ecosystem-route-field" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path className="ecosystem-route-bed" d={ROUTE_PATH} />
          <path className="ecosystem-route-active" d={ROUTE_PATH} />
        </svg>

        {contextProducts.map(({ product, x, y }) => (
          <button
            key={product.id}
            type="button"
            className={`ecosystem-context-node ecosystem-context-node-v5${activeProductId === product.id ? ' active' : ''}`}
            style={{ left: `${x / 10}%`, top: `${y / 5.6}%` }}
            onClick={() => inspectProduct(product.id)}
            aria-pressed={activeProductId === product.id}
            aria-label={`${product.name}. ${product.group} context app. ${product.summary}`}
          >
            <img src={nodeShell} alt="" aria-hidden="true" />
            <span><b>{product.name}</b><small>{product.group}</small></span>
          </button>
        ))}

        {products.map((product, index) => {
          const slot = ROUTE_SLOTS[index];
          const adopted = index < adoptedCount;
          const next = index === adoptedCount;
          const active = product.id === activeProductId;
          return (
            <button
              key={product.id}
              type="button"
              className={`ecosystem-route-node ecosystem-route-node-v5 ${slot.className}${adopted ? ' adopted' : ''}${next ? ' next' : ''}${active ? ' active' : ''}`}
              style={{ left: `${slot.x / 10}%`, top: `${slot.y / 5.6}%`, '--slot-order': index + 1 }}
              onClick={() => inspectProduct(product.id)}
              aria-pressed={active}
              aria-label={`${product.name}. ${index === 0 ? 'Recommended starting app.' : `Step ${index + 1}.`} ${product.summary}`}
            >
              <span className="ecosystem-route-marker ecosystem-route-marker-v5" aria-hidden="true">
                <img src={nodeShell} alt="" />
                <b>{index + 1}</b>
              </span>
              <span className="ecosystem-route-node-copy">
                <small>{index === 0 ? 'Start here' : next ? 'Next' : adopted ? 'In your pod' : `Step ${index + 1}`}</small>
                <b>{product.name}</b>
                <em>{product.group}</em>
              </span>
            </button>
          );
        })}

        <div
          className={`ecosystem-hub-v4 ecosystem-hub-v5${hubReady ? ' ready' : ''}`}
          style={{ left: `${HUB_SLOT.x / 10}%`, top: `${HUB_SLOT.y / 5.6}%`, '--slot-order': 4 }}
          aria-label="OrkaOS hub destination"
        >
          <img className="ecosystem-hub-dial" src={navigationDial} alt="" aria-hidden="true" />
          <span className="ecosystem-hub-v4-mark"><img src={orkaLogoLight} alt="" /></span>
          <small>{hubReady ? 'Path connected' : 'Destination'}</small>
          <b>OrkaOS</b>
        </div>

        <div className="ecosystem-google-foundation-v4" aria-label="Google Workspace remains the foundation">
          <span className="google-mark" aria-hidden="true">G</span>
          <span><small>Foundation stays yours</small><b>Google Workspace</b></span>
        </div>
      </div>
      <div className="ecosystem-route-readout-v4">
        <div className="ecosystem-active-product" aria-live="polite">
          <small>{selected.series.includes(activeProduct?.id) ? 'On this path' : 'Ecosystem context'}</small>
          <h4>{activeProduct?.name}</h4>
          <p>{activeProduct?.summary}</p>
        </div>
        <div className="ecosystem-route-copy-v4">
          <small>Recommended current</small>
          <b>{selected.explanation}</b>
        </div>
        <ol aria-label="Recommended app series">
          {products.map((product, index) => (
            <li key={product.id} className={index < adoptedCount ? 'done' : index === adoptedCount ? 'next' : ''}>
              <button type="button" onClick={() => inspectProduct(product.id)}>
                <span>{index + 1}</span><b>{product.name}</b>
              </button>
            </li>
          ))}
          <li className={hubReady ? 'done hub' : 'hub'}><span><img src={orkaLogoLight} alt="" /></span><b>OrkaOS hub</b></li>
        </ol>
        <button className="button primary ecosystem-route-action" type="button" onClick={addNext}>
          {hubReady ? 'Explore the full catalog' : `Follow current to ${nextProduct?.name}`}
        </button>
      </div>
      <p className="stack-demo-note">Illustrative route. Start with one useful app, reveal two or three relevant next steps, and keep the relationship to Google Workspace and the OrkaOS hub visible without forcing full-stack adoption.</p>
    </div>
  );
}

export function OriginCurrent() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = ORIGIN_EVENTS[activeIndex];
  const fragments = [
    ['Message', workflowMessage],
    ['Document', workflowDocument],
    ['Next step', workflowTask]
  ];

  return (
    <div className="origin-editorial origin-system-v5" data-active={activeIndex}>
      <figure className="origin-system-stage">
        <img className="origin-topology-asset" src={topologyField} alt="" aria-hidden="true" />
        <img className="origin-current-asset" src={currentRibbon} alt="" aria-hidden="true" />

        <div className="origin-fragment-set" aria-hidden="true">
          {fragments.map(([label, asset], index) => (
            <span className={`origin-fragment fragment-${index}`} key={label}>
              <img src={asset} alt="" />
              <b>{label}</b>
            </span>
          ))}
        </div>

        <div className="origin-pod-set" aria-hidden="true">
          {[0, 1, 2].map((index) => <img key={index} className={`origin-pod-member pod-${index}`} src={podMember} alt="" />)}
        </div>

        <div className="origin-stack-set" aria-hidden="true">
          {[0, 1, 2, 3].map((index) => (
            <span key={index} className={`origin-stack-node stack-${index}`}><img src={nodeShell} alt="" /></span>
          ))}
          <span className="origin-stack-core"><img src={orkaLogoLight} alt="" /></span>
        </div>

        <figcaption><span>{active.number}</span><b>{active.short}</b></figcaption>
      </figure>
      <div className="origin-editorial-copy" aria-live="polite">
        <small>{active.number} · {active.short}</small>
        <h3>{active.title}</h3>
        <p>{active.body}</p>
      </div>
      <div className="origin-stage-rail" role="group" aria-label="Explore the four stages in the OrkaOS origin story">
        {ORIGIN_EVENTS.map((event, index) => (
          <button
            key={event.number}
            type="button"
            className={activeIndex === index ? 'active' : ''}
            onClick={() => setActiveIndex(index)}
            aria-pressed={activeIndex === index}
          >
            <span>{event.number}</span>
            <b>{event.short}</b>
          </button>
        ))}
      </div>
    </div>
  );
}

export function FragmentedToFlow() {
  const [mode, setMode] = useState('fragmented');
  const flowing = mode === 'flow';
  const fragments = [
    ['Messages', workflowMessage],
    ['Documents', workflowDocument],
    ['Tasks', workflowTask]
  ];

  return (
    <div className={`friction-transform ${mode}`}>
      <div className="friction-transform-copy">
        <span className="eyebrow">The transformation</span>
        <h2>{flowing ? 'One current makes the handoffs legible.' : 'The work exists. The system does not.'}</h2>
        <p>{flowing
          ? 'OrkaOS does not replace the foundation. It adds focused structure around the handoffs so the same tools can move together.'
          : 'Small teams often already have capable tools. The friction lives between them: missing context, unclear owners, and a different routine every time.'}</p>
        <div className="friction-transform-switch" role="group" aria-label="Compare fragmented work and synchronized flow">
          <button type="button" className={!flowing ? 'active' : ''} onClick={() => setMode('fragmented')}>Fragmented</button>
          <button type="button" className={flowing ? 'active' : ''} onClick={() => setMode('flow')}>In flow</button>
        </div>
      </div>
      <figure className="friction-transform-stage-v5" aria-live="polite">
        <img className="flow-topology-asset" src={topologyField} alt="" aria-hidden="true" />
        <img className="flow-current-asset" src={currentRibbon} alt="" aria-hidden="true" />
        <div className="flow-fragment-track">
          {fragments.map(([label, asset], index) => (
            <span className={`flow-fragment flow-fragment-${index}`} key={label}>
              <img src={asset} alt="" aria-hidden="true" />
              <b>{label}</b>
            </span>
          ))}
          <span className="flow-orka-core" aria-hidden="true"><img src={orkaLogoLight} alt="" /></span>
        </div>
        <div className="flow-pod-cue" aria-hidden="true">
          <img src={podMember} alt="" /><img src={podMember} alt="" /><img src={podMember} alt="" />
        </div>
        <figcaption>
          <span>{flowing ? 'Orka layer active' : 'Broken handoffs'}</span>
          <b>{flowing ? 'Same foundation. Shared context. Clear ownership.' : 'Capable tools. Fragmented context. Invisible ownership.'}</b>
        </figcaption>
      </figure>
      <div className="friction-foundation-note">
        <span className="google-mark" aria-hidden="true">G</span>
        <p><b>Google Workspace stays foundational.</b> OrkaOS coordinates the operating layer around it.</p>
      </div>
    </div>
  );
}

export function MentalModelInstrument() {
  const [activeId, setActiveId] = useState('pod');
  const active = MENTAL_MODELS.find((model) => model.id === activeId) || MENTAL_MODELS[0];

  return (
    <div className={`mental-model-instrument model-${activeId}`}>
      <div className="instrument-copy">
        <span className="eyebrow">Interactive mental-model instrument</span>
        <h2>Pod. Flow. Slipstream. Ecosystem.</h2>
        <p>These are not four slogans. Select one to see the behavior it contributes to the product experience.</p>
        <div className="instrument-live-readout" aria-live="polite">
          <small>{active.signal}</small>
          <h3>{active.headline}</h3>
          <p>{active.body}</p>
        </div>
      </div>
      <div className="instrument-system-wrap">
        <div className="instrument-stage-v5" data-model={activeId}>
          <img className="instrument-dial-asset" src={navigationDial} alt="" aria-hidden="true" />
          <img className="instrument-topology-asset" src={topologyField} alt="" aria-hidden="true" />
          <img className="instrument-current-asset" src={currentRibbon} alt="" aria-hidden="true" />
          <img className="instrument-slipstream-asset" src={slipstreamStreak} alt="" aria-hidden="true" />
          <div className="instrument-pod-layer" aria-hidden="true">
            {[0, 1, 2].map((index) => <img key={index} className={`instrument-pod-member pod-${index}`} src={podMember} alt="" />)}
          </div>
          <div className="instrument-ecosystem-layer" aria-hidden="true">
            {[0, 1, 2, 3].map((index) => <span key={index} className={`instrument-ecosystem-node node-${index}`}><img src={nodeShell} alt="" /></span>)}
          </div>
          <div className="instrument-system-core" aria-hidden="true">
            <span><img src={orkaLogoLight} alt="" /></span>
            <small>{active.signal}</small>
          </div>
        </div>
        <div className="instrument-controls-v5" role="group" aria-label="Choose an OrkaOS mental model">
          {MENTAL_MODELS.map((model) => (
            <button
              key={model.id}
              type="button"
              className={activeId === model.id ? 'active' : ''}
              onClick={() => setActiveId(model.id)}
              aria-pressed={activeId === model.id}
            >
              <span><Icon name={model.icon} size={17} /></span>
              <b>{model.label}</b>
              <small>{model.signal}</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FitNavigator() {
  const [activeId, setActiveId] = useState('scaling');
  const activeIndex = FIT_STAGES.findIndex((stage) => stage.id === activeId);
  const active = FIT_STAGES[activeIndex];

  return (
    <div className="fit-navigator" style={{ '--fit-progress': `${(activeIndex / (FIT_STAGES.length - 1)) * 100}%` }}>
      <div className="fit-navigator-copy">
        <span className="eyebrow">Find your place on the current</span>
        <h2>OrkaOS is strongest before the stack becomes an anchor.</h2>
        <p>Choose the stage that feels closest to your team. The goal is not to keep every company forever; it is to help a pod reach the next stage with less operational drag.</p>
      </div>
      <div className="fit-current" role="group" aria-label="Choose a team stage">
        <span className="fit-current-line" aria-hidden="true"><i /></span>
        {FIT_STAGES.map((stage, index) => (
          <button
            type="button"
            key={stage.id}
            className={activeId === stage.id ? 'active' : ''}
            onClick={() => setActiveId(stage.id)}
            aria-pressed={activeId === stage.id}
          >
            <span>{stage.range}</span>
            <b>{stage.label}</b>
            <small>{index === 2 ? 'sweet spot' : index === 3 ? 'graduate' : 'entry'}</small>
          </button>
        ))}
      </div>
      <div className="fit-current-readout" aria-live="polite">
        <span>{active.verdict}</span>
        <h3>{active.label} · {active.range} people</h3>
        <p>{active.body}</p>
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
