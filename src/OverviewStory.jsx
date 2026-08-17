import React, { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import orkaLogoLight from './assets/brand/orka-logo-on-light.png';
import {
  FitNavigator,
  FragmentedToFlow,
  InteractiveAppShell,
  MentalModelInstrument,
  MicroStackExplorer,
  OriginCurrent,
  PodFormationVisual
} from './OverviewInteractions';
import { ORKA_PRODUCTS } from './products';
import './OverviewStory.css';

const OVERVIEW_SECTIONS = [
  { id: 'start', label: 'Start Here' },
  { id: 'philosophy', label: 'Philosophy' },
  { id: 'ecosystem', label: 'Ecosystem' },
  { id: 'adoption', label: 'Adoption' },
  { id: 'journey', label: 'User Journey' }
];


const QUICK_TASKS = [
  { task: 'See where AI fits into our tech stack', app: 'Orka AI', appId: 'orka-aria', tone: 'ai' },
  { task: 'Share a password or credential safely', app: 'OrkaVault', appId: 'orka-vault', tone: 'it' },
  { task: 'Look up how we do something', app: 'OrkaSOP', appId: 'orka-sop', tone: 'ops' },
  { task: 'See who is who and what they own', app: 'OrkaHR', appId: 'orka-hr', tone: 'hr' },
  { task: 'Move a candidate through hiring', app: 'OrkaATS', appId: 'orka-ats', tone: 'hr' },
  { task: 'Run a meeting that ends with clear owners', app: 'OrkaFlow', appId: 'orka-flow', tone: 'ops' },
  { task: 'See what I am meant to be working on', app: 'OrkaTask', appId: 'orka-task', tone: 'ops' },
  { task: 'Plan a project with owners and deadlines', app: 'OrkaProject', appId: 'orka-project', tone: 'ops' },
  { task: 'Set a goal and track it', app: 'OrkaGoals', appId: 'orka-goals', tone: 'ops' },
  { task: 'Map a process and improve it', app: 'OrkaProcess', appId: 'orka-process', tone: 'ops' },
  { task: 'Keep contacts and deals organized', app: 'OrkaCRM', appId: 'orka-crm', tone: 'business' },
  { task: 'Build a campaign from audience to deadline', app: 'OrkaMarketing', appId: 'orka-marketing', tone: 'marketing' }
];



const ECOSYSTEM_ORBIT_RINGS = [
  {
    id: 'inner',
    className: 'orbit-inner',
    duration: '138s',
    direction: 'normal',
    offset: -90,
    apps: ['orka-aria', 'orka-task', 'orka-hr', 'orka-crm', 'orka-goals']
  },
  {
    id: 'middle-a',
    className: 'orbit-middle-a',
    duration: '176s',
    direction: 'reverse',
    offset: -54,
    apps: ['orka-chat', 'orka-project', 'orka-sales', 'orka-finance', 'orka-content']
  },
  {
    id: 'middle-b',
    className: 'orbit-middle-b',
    duration: '218s',
    direction: 'normal',
    offset: -18,
    apps: ['orka-sop', 'orka-flow', 'orka-vault', 'orka-legal', 'orka-social']
  },
  {
    id: 'outer',
    className: 'orbit-outer',
    duration: '264s',
    direction: 'reverse',
    offset: 18,
    apps: ['orka-process', 'orka-prompt', 'orka-ats', 'orka-marketing']
  }
];

const ORBIT_PRODUCT_BY_ID = Object.fromEntries(ORKA_PRODUCTS.map((product) => [product.id, product]));
const ORBIT_PRODUCT_ID_BY_NAME = Object.fromEntries(ORKA_PRODUCTS.map((product) => [product.name, product.id]));
const ORBIT_RELATED_BY_ID = Object.fromEntries(
  ORKA_PRODUCTS.map((product) => {
    const direct = (product.pairs || []).map((name) => ORBIT_PRODUCT_ID_BY_NAME[name]).filter(Boolean);
    const reverse = ORKA_PRODUCTS
      .filter((candidate) => (candidate.pairs || []).includes(product.name))
      .map((candidate) => candidate.id);
    return [product.id, [...new Set([...direct, ...reverse])]];
  })
);

function orbitLabel(name) {
  if (name === 'Orka AI') return 'AI';
  if (name === 'OrkaOS') return 'OS';
  return name.replace(/^Orka/, '');
}

function LivingEcosystemOrbit() {
  const [selectedIds, setSelectedIds] = useState([]);
  const selectedSet = new Set(selectedIds);
  const anchorId = selectedIds[selectedIds.length - 1] || null;
  const anchorProduct = anchorId ? ORBIT_PRODUCT_BY_ID[anchorId] : null;
  const relatedIds = anchorId && selectedIds.length < 3 ? (ORBIT_RELATED_BY_ID[anchorId] || []) : [];
  const relatedSet = new Set(relatedIds);
  const slipstreamActive = selectedIds.length === 3;
  const flowProgress = selectedIds.length <= 1 ? 0 : selectedIds.length === 2 ? 50 : 100;

  const toggleApp = (appId) => {
    setSelectedIds((current) => {
      if (current.includes(appId)) return current.filter((id) => id !== appId);
      if (current.length >= 3) return current;
      return [...current, appId];
    });
  };

  let builderHeading = 'Build a three-app slipstream';
  let builderCopy = 'Choose any app to pin it. Related next apps will glow wherever they are in the orbit.';
  if (selectedIds.length === 1) {
    builderHeading = 'First app pinned';
    builderCopy = `${anchorProduct.name} is your starting point. Related next apps are glowing; choose one to extend the flow.`;
  } else if (selectedIds.length === 2) {
    builderHeading = 'One connection away';
    builderCopy = `${anchorProduct.name} is now the end of the flow. Choose a glowing related app to complete the slipstream.`;
  } else if (slipstreamActive) {
    builderHeading = 'Slipstream formed';
    builderCopy = 'The OrkaOS control center is active. Click any pinned app again to remove it and reshape the flow.';
  }

  return (
    <section className="living-ecosystem-story story-ocean-card" aria-labelledby="living-ecosystem-title">
      <div className="living-ecosystem-copy">
        <span className="story-chapter-label light">The ecosystem in motion</span>
        <h2 id="living-ecosystem-title">Nineteen focused apps around one operating hub.</h2>
        <p>Nineteen focused apps can move independently around the work they support, while OrkaOS stays fixed at the center as the shared operating hub. The point is not that every team uses everything at once — it is that the pieces can stay part of the same system as needs change.</p>
        <div className="living-ecosystem-legend" aria-hidden="true">
          <span><i />19 orbiting apps</span>
          <span><i />4 slow-moving currents</span>
          <span><i />1 shared OrkaOS center</span>
        </div>
        <div className={`living-slipstream-status${slipstreamActive ? ' is-active' : ''}`} aria-live="polite">
          <div>
            <b>{builderHeading}</b>
            <span>{builderCopy}</span>
          </div>
          {selectedIds.length > 0 ? (
            <button type="button" onClick={() => setSelectedIds([])}>Clear flow</button>
          ) : null}
        </div>
      </div>

      <figure className="living-ecosystem-visual" aria-label="Interactive OrkaOS ecosystem with nineteen orbiting apps around the central OrkaOS hub and a three-app slipstream builder">
        <div className={`living-ecosystem-field${slipstreamActive ? ' slipstream-active' : ''}`}>
          <span className="living-current-glow glow-a" aria-hidden="true" />
          <span className="living-current-glow glow-b" aria-hidden="true" />

          {ECOSYSTEM_ORBIT_RINGS.map((ring, ringIndex) => (
            <div
              key={ring.id}
              className={`living-orbit-ring ${ring.className}`}
              style={{ '--orbit-duration': ring.duration, '--orbit-direction': ring.direction }}
              aria-label={`${ring.id} ecosystem current`}
            >
              {ring.apps.map((appId, index) => {
                const product = ORBIT_PRODUCT_BY_ID[appId];
                if (!product) return null;
                const angle = ring.offset + (index * 360 / ring.apps.length);
                const radians = angle * Math.PI / 180;
                const left = 50 + Math.cos(radians) * 50;
                const top = 50 + Math.sin(radians) * 50;
                const isSelected = selectedSet.has(appId);
                const isRelated = !isSelected && relatedSet.has(appId);
                const isDimmed = selectedIds.length > 0 && selectedIds.length < 3 && !isSelected && !isRelated;
                const relationLabel = isRelated && anchorProduct ? ` Related to ${anchorProduct.name}.` : '';
                return (
                  <button
                    type="button"
                    key={appId}
                    className={`living-orbit-node group-${product.groupId}${isSelected ? ' is-selected' : ''}${isRelated ? ' is-related' : ''}${isDimmed ? ' is-dimmed' : ''}`}
                    style={{ left: `${left}%`, top: `${top}%`, '--float-delay': `${-(ringIndex * 1.4 + index * 0.9)}s` }}
                    onClick={() => toggleApp(appId)}
                    disabled={slipstreamActive && !isSelected}
                    tabIndex={isSelected ? -1 : 0}
                    aria-hidden={isSelected ? 'true' : undefined}
                    aria-pressed={isSelected}
                    aria-label={`${product.name}.${relationLabel} ${selectedIds.length < 3 ? 'Add to slipstream.' : ''}`}
                  >
                    <span className="living-orbit-upright">
                      <span className="living-orbit-card">
                        <span className="living-orbit-app-icon"><img src={orkaLogoLight} alt="" /></span>
                        <b>{orbitLabel(product.name)}</b>
                        {isRelated ? <small>next</small> : null}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ))}

          <div className={`living-ecosystem-core${slipstreamActive ? ' is-active' : ''}`} aria-live="polite">
            <span className="living-core-halo" aria-hidden="true" />
            <span className="living-core-mark"><img src={orkaLogoLight} alt="" /></span>
            <b>OrkaOS</b>
            <small>{slipstreamActive ? 'slipstream active' : selectedIds.length ? `${selectedIds.length}/3 flow nodes` : 'shared operating center'}</small>
          </div>

        </div>

        {selectedIds.length > 0 ? (
          <div
            className={`living-slipstream-lane count-${selectedIds.length}${slipstreamActive ? ' is-active' : ''}`}
            style={{ '--flow-progress': `${flowProgress}%` }}
            role="group"
            aria-label="Selected slipstream apps"
          >
            <span className="living-slipstream-label">Slipstream</span>
            <span className="living-slipstream-track" aria-hidden="true"><i /></span>
            <div className="living-slipstream-slots">
              {[0, 1, 2].map((slotIndex) => {
                const appId = selectedIds[slotIndex];
                const product = appId ? ORBIT_PRODUCT_BY_ID[appId] : null;
                if (!product) {
                  return <span key={`empty-${slotIndex}`} className="living-slipstream-slot is-empty" aria-hidden="true"><i>{slotIndex + 1}</i></span>;
                }
                return (
                  <button
                    type="button"
                    key={appId}
                    className={`living-slipstream-slot group-${product.groupId}`}
                    onClick={() => toggleApp(appId)}
                    aria-label={`Remove ${product.name} from slipstream`}
                  >
                    <span className="living-slipstream-icon"><img src={orkaLogoLight} alt="" /></span>
                    <b>{orbitLabel(product.name)}</b>
                    <small>{slotIndex + 1}</small>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <figcaption>Pick an app to pin it outside the orbit. Related apps are suggested in place; selected apps move into a shared flow lane below the ecosystem so the orbit stays fully visible and clickable.</figcaption>
      </figure>
    </section>
  );
}

const JOURNEYS = [
  {
    id: 'medium',
    tab: 'Medium Team',
    range: '15–20 people',
    headline: 'The team grew. The operating environment did not grow with it.',
    who: 'A medium team has enough people, roles, meetings, projects, and recurring work that coordination is now a system-level concern. The team can still move quickly, but the way information and ownership travel between people matters every day.',
    environment: 'Google Workspace is often the shared foundation, while additional point tools, spreadsheets, documents, chats, and personal workarounds accumulate around it. Different functions may have their own useful tools, but the overall stack no longer feels like one operating environment.',
    breaking: 'Knowledge becomes difficult to capture, handoffs depend on memory, and the same question is answered in multiple places. Meetings create work that is hard to trace. Tools that were individually useful begin to create friction when the team has to move between them.',
    why: 'At 15–20 people, informal context no longer reaches everyone. More roles create more interfaces between people, and every interface creates a chance for ownership, knowledge, or process to get lost.',
    consequence: 'Without better structure, the team spends more time reconstructing context, coordinating the stack, and teaching people where work lives. The technology becomes another layer the team has to operate instead of a support system for the work.',
    approach: 'OrkaOS approaches this as an operating-model problem rather than a request for one giant enterprise platform. Keep the Google Workspace foundation, establish shared operating language, then add focused Orka capabilities around the workflows that need clearer ownership and repeatability.',
    ecosystem: ['OPS family for process, projects, tasks, meetings, and handoffs', 'IT family for platform access, governance, and AI-oriented workflows', 'HR family where people records and hiring workflows need a shared structure'],
    adoption: 'Begin with the fractured workflow that is creating the most coordination cost. Stabilize that routine, establish ownership and habits around it, then connect the adjacent workflow instead of attempting a full-suite migration.',
    outcome: 'The team should experience a more coherent operating environment: clearer places for recurring work, easier handoffs, less dependence on individual memory, and a stack that can expand without becoming the project itself.',
    next: 'Explore the Catalog after identifying the first workflow your team wants to bring back into one operating rhythm.'
  },
  {
    id: 'small',
    tab: 'Small Team',
    range: '3–5 people',
    headline: 'Informal coordination is starting to become a real operating system — whether the team designed one or not.',
    who: 'A small team is still close enough to talk constantly, but large enough that people are beginning to specialize. Someone owns customers, someone owns delivery, someone owns operations, and the team can no longer keep every detail in one shared conversation.',
    environment: 'The team is adding tools as needs appear. Google Docs, Sheets, Drive, Calendar, messages, task lists, and a few specialist apps may all be doing useful jobs, but the rules for how they fit together are mostly implicit.',
    breaking: 'Shared processes are becoming necessary. Tasks disappear after meetings, repeat work is performed differently by each person, and new information creates more places to check. The team begins spending energy managing its tools and remembering its own routines.',
    why: 'The 3–5 person stage is where individual habits become team dependencies. A shortcut that works for one person becomes a coordination problem when three other people need to understand it, repeat it, or inherit it.',
    consequence: 'If the team waits until the stack is deeply fragmented, every later improvement also becomes a migration and change-management project. Small inconsistencies compound into operating debt.',
    approach: 'OrkaOS gives the pod a shared shell and a progressive way to add structure. The team can standardize one routine without adopting enterprise overhead, then use familiar patterns again when the next workflow needs support.',
    ecosystem: ['OPS family for shared routines, projects, tasks, and handoffs', 'HR family as the team begins formalizing people and hiring workflows', 'Business or Marketing families only when those workflows actually become recurring team work'],
    adoption: 'Start with one visible pain: a recurring process, a meeting-to-action handoff, team identity, or another supported workflow. Make the habit reliable first. Add a connected capability only when the next problem is real.',
    outcome: 'The team gains operating leverage early: fewer invented-on-the-fly processes, clearer ownership, and a foundation that can grow without asking a five-person team to behave like a 500-person company.',
    next: 'Use the Catalog to choose the first focused capability that matches the team’s current pain, then join the pod or alpha-testing path when appropriate.'
  },
  {
    id: 'prelaunch',
    tab: 'Pre-launch',
    range: 'Team preparing to launch',
    headline: 'Build the operating foundation before complexity becomes the default.',
    who: 'A pre-launch team is forming its working model while it is also building the thing it plans to launch. Roles may still be fluid, but the team already needs a dependable way to capture decisions, documents, processes, ownership, and the work that must survive launch day.',
    environment: 'The temptation is to select tools one at a time as urgent needs appear. That can work for a while, but it can also create a stack whose structure is accidental before the company has even established its operating habits.',
    breaking: 'Important processes are still undocumented, ownership can shift without a clear record, and tool choices can multiply before the team has agreed how work should move. The risk is not “having no software”; it is building a fragmented operating environment too early.',
    why: 'Pre-launch teams change quickly. When the operating foundation is implicit, every role change or new collaborator forces the team to reconstruct context. Early decisions become difficult to unwind once customers, deadlines, and hiring add pressure.',
    consequence: 'Tool sprawl and undocumented routines can become embedded at the same moment the team needs repeatability most. Growth then amplifies the original ambiguity instead of benefiting from a clean foundation.',
    approach: 'OrkaOS encourages intentional selection around the work rather than around a checklist of software categories. Keep Google Workspace as the foundation, document repeatable work early, and introduce focused Orka capabilities where they make a real launch workflow clearer.',
    ecosystem: ['OPS family for repeatable process, project, task, and meeting foundations', 'IT family for secure access and technology-oriented workflows', 'HR, Business, and Marketing families as those functions become active and recurring'],
    adoption: 'Document the first routines the team knows it will repeat. Choose the capability that supports the most important one, establish a clean ownership pattern, then connect adjacent workflows as launch complexity becomes real.',
    outcome: 'The team reaches launch with more of its operating knowledge outside individual heads, clearer structures for new collaborators, and a stack that was shaped intentionally rather than assembled under pressure.',
    next: 'Explore the Catalog with the question: “Which workflow must still be understandable when the team is twice this size?”'
  },
  {
    id: 'solo',
    tab: 'Solopreneur',
    range: '1 person preparing to build a team',
    headline: 'Turn personal knowledge into an operating foundation someone else can inherit.',
    who: 'A solopreneur is currently the whole operating system: the memory, the process owner, the project manager, and the person who knows why each workaround exists. The immediate goal is not to imitate a larger company; it is to make future collaboration possible.',
    environment: 'One-person workflows can live comfortably in memory, personal documents, ad-hoc lists, and individual habits. That is efficient until another person has to understand, repeat, or take responsibility for the work.',
    breaking: 'The first hiring or collaboration step exposes which routines were never documented. Repeat work depends on recollection, context is difficult to transfer, and the founder has to remain the translator between every person and every process.',
    why: 'A one-person system optimizes for speed of recall. A team system must optimize for shared understanding. The transition begins before the first hire, when the founder decides which knowledge and workflows should become repeatable.',
    consequence: 'If nothing is externalized, growth can make the founder the permanent bottleneck. Every new collaborator adds questions instead of capacity because the operating context still lives in one person’s head.',
    approach: 'OrkaOS can provide a lightweight place to begin structuring repeat work without forcing a solo operator into enterprise software. The goal is to capture what matters, create reusable routines, and keep the system small until another workflow truly needs support.',
    ecosystem: ['OPS family for repeatable processes, projects, tasks, and handoffs', 'IT family for access and technology foundations', 'Other families only as collaborators and recurring functional work actually appear'],
    adoption: 'Choose one process you would have to explain to a future teammate. Document and run it consistently. Then choose the next process only when the first is genuinely repeatable.',
    outcome: 'The solopreneur should gain a clearer operating memory, less dependence on mental recall, and a foundation future collaborators can enter without rebuilding the business from oral history.',
    next: 'Explore the Catalog for the first repeatable workflow you want a future teammate to inherit.'
  }
];

function SectionHeading({ eyebrow, title, body }) {
  return (
    <div className="story-section-heading left">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {body ? <p>{body}</p> : null}
    </div>
  );
}

function StartHereSection({ onOpenApps, onNavigate }) {
  return (
    <section className="overview-anchor-section" id="overview-start" data-overview-section="start">
      <section className="story-hero story-ocean-card story-hero-with-art story-grid-hero">
        <div className="story-hero-copy">
          <span className="story-chapter-label light">Start Here · A tech-stack starter kit for a synchronized pod</span>
          <h1>A whale of a project should not require a whale of a tech stack.</h1>
          <p>OrkaOS keeps Google Workspace at the center and adds only the focused apps your team needs.</p>
          <div className="story-hero-actions">
            <button className="button story-button-light" type="button" onClick={() => onNavigate('overview', 'philosophy')}>Understand the philosophy</button>
            <button className="button story-button-ghost" type="button" onClick={onOpenApps}>Explore Orka Apps</button>
          </div>
        </div>
        <PodFormationVisual />
      </section>

      <section className="story-definition content-surface">
        <div className="story-definition-lead">
          <span className="eyebrow">OrkaOS in plain English</span>
          <h2>You already have the workplace. OrkaOS gives the work a flow.</h2>
        </div>
        <div className="story-definition-grid">
          <article>
            <span className="definition-icon"><Icon name="grid" size={20} /></span>
            <small>You keep</small>
            <h3>Google Workspace</h3>
            <p>Gmail, Drive, Docs, Sheets, Calendar, identity — the familiar foundation.</p>
          </article>
          <span className="definition-plus" aria-hidden="true">+</span>
          <article>
            <span className="definition-icon"><Icon name="layers" size={20} /></span>
            <small>You add</small>
            <h3>Focused OrkaApps</h3>
            <p>Simple tools for tasks, SOPs, people, projects, finance, marketing, and more.</p>
          </article>
          <span className="definition-equals" aria-hidden="true">=</span>
          <article className="definition-result">
            <span className="definition-icon"><img src={orkaLogoLight} alt="" /></span>
            <small>You get</small>
            <h3>A synchronized pod</h3>
            <p>Shared context, clearer handoffs, and less time fighting the software.</p>
          </article>
        </div>
      </section>

      <section className="story-quick-tour">
        <div className="story-section-heading">
          <span className="eyebrow">The whole idea in four beats</span>
          <h2>Start small. Move together. Grow on purpose.</h2>
        </div>
        <div className="story-beat-grid">
          {[
            ['1', 'A real problem appears', 'The handoff is messy. The SOP lives in someone’s head. Nobody knows who owns the next step.'],
            ['2', 'Add one OrkaApp', 'Choose the smallest useful tool for that problem — not a giant suite for problems you do not have.'],
            ['3', 'The team learns by doing', 'Every app feels familiar, so the process becomes the training instead of another course.'],
            ['4', 'The pod builds its system', 'Add connected apps as the work grows. After a few, the OrkaOS hub brings the pod together.']
          ].map(([number, title, body]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="story-promise story-ocean-strip">
        <div>
          <span className="story-chapter-label light">The promise</span>
          <h2>The software stays quiet. Your people and their work stand out.</h2>
        </div>
        <div className="story-promise-pills">
          <span>Calm like Google</span>
          <span>Polished like macOS</span>
          <span>Modular by design</span>
          <span>Never locked in</span>
        </div>
      </section>

      <section className="story-page-hero content-surface restored-origin-hero">
        <div className="story-intro-copy">
          <span className="story-chapter-label">The Story · How OrkaOS came to be</span>
          <h1>OrkaOS did not begin as a software suite. It began with a bad group project.</h1>
          <p>In coaching sessions, brilliant people kept describing the same frustration: everyone could do the work, but the group could not collaborate. Messages were scattered, meetings ended without clear owners, and the tools made the project harder instead of easier.</p>
        </div>
        <div className="story-origin-quote">
          <span>“</span>
          <blockquote>There is no mastermind here — just a series of incredibly fortunate events.</blockquote>
          <small>One real problem led to one useful tool. Then another.</small>
        </div>
      </section>

      <section className="story-origin-section story-origin-current-section">
        <div className="story-section-heading left">
          <span className="eyebrow">How the pod formed</span>
          <h2>Four discoveries moved through one current.</h2>
          <p>The origin story is not a product roadmap. It is a sequence of real problems becoming increasingly connected.</p>
        </div>
        <OriginCurrent />
      </section>
    </section>
  );
}

function PhilosophySection() {
  return (
    <section className="overview-anchor-section" id="overview-philosophy" data-overview-section="philosophy">
      <section className="story-page-hero content-surface story-experience-hero">
        <div className="story-intro-copy">
          <span className="story-chapter-label">Philosophy · The principles behind OrkaOS</span>
          <h1>The best tool disappears into the work.</h1>
          <p>OrkaOS is built around focused tools, pod-based work, progressive complexity, shared operating language, and a simple test: technology should support the outcome instead of becoming the burden.</p>
        </div>
        <InteractiveAppShell />
      </section>

      <section className="philosophy-principles content-surface">
        <SectionHeading
          eyebrow="The operating philosophy"
          title="Structure should arrive with the problem — not years before it."
          body="The Orka Way is not a promise that every team should use every app. It is a way to keep the system understandable while the work becomes more complex."
        />
        <div className="philosophy-principle-grid">
          <article><span>1</span><h3>Focused tools over one giant application</h3><p>Choose a clear tool for a clear operating job. The interface can stay calm because the app does not need to solve every possible problem.</p></article>
          <article><span>2</span><h3>Pod-based work</h3><p>People, ownership, meetings, documents, and tasks should move as a coordinated pod rather than as isolated personal systems.</p></article>
          <article><span>3</span><h3>Progressive complexity</h3><p>Add structure as the work requires it. A small team should not carry the configuration burden of an enterprise platform before it has enterprise problems.</p></article>
          <article><span>4</span><h3>Shared operating language</h3><p>Familiar shell patterns and recurring concepts make it easier for people to move between workflows without relearning the system each time.</p></article>
        </div>
      </section>

      <section className="story-friction-transform">
        <FragmentedToFlow />
      </section>

      <section className="mental-models mental-models-instrument">
        <MentalModelInstrument />
      </section>

      <section className="monday-flow content-surface">
        <div className="story-section-heading left compact">
          <span className="eyebrow">What this feels like on Monday</span>
          <h2>The work moves. The team does not chase it.</h2>
        </div>
        <div className="monday-flow-grid">
          {[
            ['09:00', 'Run the meeting', 'A guided space keeps the conversation focused and captures decisions.'],
            ['09:27', 'Leave with owners', 'Tasks and due dates are clear before anyone closes the call.'],
            ['13:15', 'Work stays connected', 'The file, discussion, SOP, and project context remain attached to the work.'],
            ['Friday', 'See the pattern', 'The team can review progress, friction, and the next workflow worth improving.']
          ].map(([time, title, body]) => (
            <article key={time}><span>{time}</span><h3>{title}</h3><p>{body}</p></article>
          ))}
        </div>
      </section>

      <section className="slipstream-section story-ocean-card">
        <div>
          <span className="story-chapter-label light">In the slipstream</span>
          <h2>Your business should feel like your business.</h2>
          <p>Premium white-labeling lets the Orka shell carry your logo and colors. The product recedes so the team feels like it is working inside one coherent company system.</p>
        </div>
        <div className="slipstream-brand-demo">
          <div className="brand-demo-top"><span>PX</span><b>PROJXON Workspace</b><small>Powered by OrkaOS</small></div>
          <div className="brand-demo-apps"><i>HR</i><i>SOP</i><i>TSK</i><i>AI</i></div>
        </div>
      </section>

      <section className="hammer-story story-ocean-card">
        <div>
          <span className="story-chapter-label light">The hammer test</span>
          <h2>You should not have to study a hammer before you can drive a nail.</h2>
          <p>The point of a business tool is the outcome: a productive meeting, a clear owner, a secure handoff, a repeatable process, and a team that knows what happens next.</p>
        </div>
        <div className="hammer-outcomes">
          <span><Icon name="calendar" size={18} /> Better meetings</span>
          <span><Icon name="clipboard" size={18} /> Clear next steps</span>
          <span><Icon name="users" size={18} /> Shared accountability</span>
          <span><Icon name="trending" size={18} /> Momentum that compounds</span>
        </div>
      </section>
    </section>
  );
}

function EcosystemSection({ onOpenApps }) {
  return (
    <section className="overview-anchor-section" id="overview-ecosystem" data-overview-section="ecosystem">
      <section className="story-page-hero content-surface story-how-hero">
        <div className="story-intro-copy">
          <span className="story-chapter-label">Ecosystem · Why this is an operating system</span>
          <h1>Twenty focused apps can act like one system when they share a foundation, language, and path between workflows.</h1>
          <p>Google Workspace remains underneath the system. OrkaOS provides the shared shell and operating context, while app families focus on the particular work a team needs today.</p>
        </div>
        <div className="human-hardware-card">
          <img src={orkaLogoLight} alt="" />
          <div><small>Why call it an OS?</small><b>The “hardware” is your team.</b><p>OrkaOS connects people and operating routines, not computer parts.</p></div>
        </div>
      </section>

      <section className="ecosystem-architecture content-surface">
        <SectionHeading
          eyebrow="One ecosystem, not twenty unrelated products"
          title="A shared foundation makes each focused app more useful in context."
          body="The system is organized into approved IT, OPS, HR, Business, and Marketing families. A visitor can enter through one workflow, learn the shared shell, and add adjacent capabilities as the operating need expands."
        />
        <div className="ecosystem-layer-grid">
          <article><span className="definition-icon"><Icon name="grid" size={19} /></span><small>Foundation</small><h3>Google Workspace</h3><p>Identity, Drive, Docs, Sheets, Calendar, and the familiar workplace remain central.</p></article>
          <article><span className="definition-icon"><Icon name="layers" size={19} /></span><small>Families</small><h3>IT · OPS · HR · Business · Marketing</h3><p>Related workflows stay legible as parts of a larger operating environment.</p></article>
          <article><span className="definition-icon"><Icon name="route" size={19} /></span><small>Growth path</small><h3>One useful workflow → connected workflows</h3><p>The ecosystem expands with the team rather than requiring an all-at-once suite migration.</p></article>
          <article><span className="definition-icon"><Icon name="checkCircle" size={19} /></span><small>Full vision</small><h3>Exactly 20 public apps</h3><p>The Catalog keeps the complete ecosystem visible even while the public roadmap prioritizes a smaller sequence.</p></article>
        </div>
      </section>

      <LivingEcosystemOrbit />

      <section className="ecosystem-map content-surface ecosystem-map-interactive">
        <SectionHeading
          eyebrow="A choose-your-own-adventure micro-stack"
          title="There is no single front door."
          body="Enter through the problem you have today. Google Workspace stays underneath it, while the app path changes around the work your pod actually needs."
        />
        <MicroStackExplorer onOpenApps={onOpenApps} />
      </section>

      <section className="ecosystem-catalog-bridge story-ocean-card">
        <div>
          <span className="story-chapter-label light">The full ecosystem remains visible</span>
          <h2>Understand the system first. Then explore all 20 apps in context.</h2>
          <p>The Catalog is where the detailed app exploration happens; the Overview explains why those apps belong together before the visitor meets the full list.</p>
        </div>
        <button className="button story-button-light" type="button" onClick={onOpenApps}>Open the 20-app Catalog</button>
      </section>
    </section>
  );
}

function AdoptionSection({ onNavigate }) {
  const steps = [
    ['1', 'Start with the problem that matters now', 'Choose the workflow creating real friction instead of purchasing a theoretical future stack.'],
    ['2', 'Add the appropriate Orka capability', 'Introduce one focused tool around that work while keeping Google Workspace as the foundation.'],
    ['3', 'Establish the operating habit', 'Make ownership, process, and the next action repeatable before adding another layer.'],
    ['4', 'Connect the adjacent workflow', 'When the next dependency becomes visible, extend the system deliberately instead of inventing a new isolated workaround.'],
    ['5', 'Grow toward a broader pod', 'The operating environment becomes more connected over time without forcing an all-at-once suite migration.']
  ];

  return (
    <section className="overview-anchor-section" id="overview-adoption" data-overview-section="adoption">
      <section className="story-page-hero content-surface adoption-hero">
        <div className="story-intro-copy">
          <span className="story-chapter-label">Adoption · How a team actually begins</span>
          <h1>Adoption is a current, not a cutover.</h1>
          <p>OrkaOS is designed to begin with a useful workflow, create a reliable operating habit, and connect the next workflow only when the team is ready. The goal is not a forced suite migration.</p>
        </div>
        <div className="adoption-signal-card">
          <small>The practical starting question</small>
          <blockquote>“Which piece of work is already painful enough that the team wants a better way to run it?”</blockquote>
        </div>
      </section>

      <section className="adoption-current content-surface">
        <SectionHeading
          eyebrow="Progressive adoption"
          title="Build the pod one operating habit at a time."
          body="This is the bridge between understanding the ecosystem and recognizing which User Journey describes the team."
        />
        <div className="adoption-step-list">
          {steps.map(([number, title, body]) => (
            <article key={number}>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{body}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="monday-flow content-surface">
        <SectionHeading eyebrow="What adoption protects" title="The system grows without becoming the project." />
        <div className="monday-flow-grid">
          <article><span>Keep</span><h3>What already works</h3><p>Google Workspace and useful existing habits stay in place instead of being replaced for the sake of a platform migration.</p></article>
          <article><span>Add</span><h3>Only needed structure</h3><p>A capability arrives because the workflow needs it, not because the suite includes it.</p></article>
          <article><span>Learn</span><h3>Through the work</h3><p>Shared shell patterns reduce the need to relearn navigation and interaction with each new app.</p></article>
          <article><span>Expand</span><h3>When adjacency is real</h3><p>The next app should connect to a real operating dependency, not an imagined future requirement.</p></article>
        </div>
      </section>

      <button className="story-next content-surface adoption-next" type="button" onClick={() => onNavigate('overview', 'journey')}>
        <span className="story-next-number">→</span>
        <span className="story-next-copy"><small>Next</small><b>Recognize your User Journey</b><span>See how adoption changes across four stages of team growth.</span></span>
        <span className="story-next-arrow" aria-hidden="true">→</span>
      </button>
    </section>
  );
}


function QuickAnswersLauncher({ onSelectProduct, onOpenApps }) {
  return (
    <section className="quick-answers-board" aria-labelledby="quick-answers-title">
      <div className="quick-answers-heading">
        <div>
          <span className="quick-answers-eyebrow">Quick answers</span>
          <h2 id="quick-answers-title">“I just need to…”</h2>
          <p>Start with the job in front of you. Each answer opens the Orka app built around that workflow.</p>
        </div>
        <button className="quick-answers-all" type="button" onClick={onOpenApps}>See all 20 apps <span aria-hidden="true">→</span></button>
      </div>
      <div className="quick-answers-grid" role="list" aria-label="Common tasks and their Orka apps">
        {QUICK_TASKS.map((item) => (
          <button
            className={`quick-answer-card tone-${item.tone}`}
            type="button"
            role="listitem"
            key={item.appId}
            onClick={() => onSelectProduct(item.appId)}
            aria-label={`${item.task}. Open ${item.app}.`}
          >
            <span className="quick-answer-task">{item.task}</span>
            <span className="quick-answer-app"><b>{item.app}</b><i aria-hidden="true">→</i></span>
          </button>
        ))}
      </div>
    </section>
  );
}

function JourneyDetail({ journey, onOpenApps, onOpenForm }) {
  return (
    <article className="journey-case" id={`journey-panel-${journey.id}`} role="tabpanel" aria-labelledby={`journey-tab-${journey.id}`} tabIndex="0">
      <header className="journey-case-hero story-ocean-card">
        <div>
          <span className="story-chapter-label light">{journey.tab} · {journey.range}</span>
          <h2>{journey.headline}</h2>
          <p>{journey.who}</p>
        </div>
        <div className="journey-case-signal"><small>Stage</small><strong>{journey.range}</strong><span>Operating case</span></div>
      </header>

      <div className="journey-narrative-grid">
        <section className="journey-narrative content-surface">
          <small>Who they are · current environment</small>
          <h3>How work looks before the problem becomes obvious</h3>
          <p>{journey.environment}</p>
        </section>
        <section className="journey-narrative content-surface">
          <small>What breaks · why now</small>
          <h3>The stage creates a coordination problem, not just a tool problem</h3>
          <p>{journey.breaking}</p>
          <p>{journey.why}</p>
        </section>
      </div>

      <section className="journey-consequence content-surface">
        <div className="journey-section-label"><small>If nothing changes</small></div>
        <div><h3>The friction compounds with the organization.</h3><p>{journey.consequence}</p></div>
      </section>

      <section className="journey-response content-surface">
        <div className="journey-response-main">
          <div className="journey-section-label"><small>How OrkaOS approaches it</small></div>
          <h3>Respond at the operating-system level.</h3>
          <p>{journey.approach}</p>
        </div>
        <div className="journey-ecosystem-panel">
          <div className="journey-section-label"><small>Relevant ecosystem areas</small></div>
          <ul>{journey.ecosystem.map((item) => <li key={item}><Icon name="checkCircle" size={16} /> {item}</li>)}</ul>
        </div>
      </section>

      <div className="journey-narrative-grid journey-lower-grid">
        <section className="journey-narrative content-surface">
          <small>How adoption begins</small>
          <h3>Start with a concrete first workflow.</h3>
          <p>{journey.adoption}</p>
        </section>
        <section className="journey-narrative content-surface">
          <small>Value and outcome</small>
          <h3>Make the work easier to operate.</h3>
          <p>{journey.outcome}</p>
        </section>
      </div>

      <section className="journey-next-step story-ocean-card">
        <div>
          <span className="story-chapter-label light">What to do next</span>
          <h3>{journey.next}</h3>
          <p>Use the detailed operating case to enter the app ecosystem with context rather than treating all 20 apps as an undifferentiated list.</p>
        </div>
        <div className="journey-next-actions">
          <button className="button story-button-light" type="button" onClick={onOpenApps}>Explore the App Catalog</button>
          <button className="button story-button-ghost" type="button" onClick={() => onOpenForm('Join the Pod')}>Join the Pod</button>
        </div>
      </section>
    </article>
  );
}

function UserJourneySection({ onOpenApps, onOpenForm, onSelectProduct }) {
  const [activeJourney, setActiveJourney] = useState(JOURNEYS[0].id);
  const journey = JOURNEYS.find((item) => item.id === activeJourney) || JOURNEYS[0];

  const onTabKeyDown = (event, index) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % JOURNEYS.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + JOURNEYS.length) % JOURNEYS.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = JOURNEYS.length - 1;
    setActiveJourney(JOURNEYS[nextIndex].id);
    requestAnimationFrame(() => document.getElementById(`journey-tab-${JOURNEYS[nextIndex].id}`)?.focus());
  };

  return (
    <section className="overview-anchor-section user-journey-section" id="overview-journey" data-overview-section="journey">
      <section className="story-page-hero content-surface journey-overview-hero">
        <div className="story-intro-copy">
          <span className="story-chapter-label">User Journey · Four detailed operating cases</span>
          <h1>Recognize the operating situation before choosing the app.</h1>
          <p>Each journey is a substantial adoption case: who the team is, how it works today, what begins to break, why the problem appears at this stage, how OrkaOS responds, and what a sensible first step looks like.</p>
        </div>
        <div className="journey-order-card"><small>Intentional order</small><b>Medium → Small → Pre-launch → Solo</b><p>Work backward in organizational scale to see where structure changes.</p></div>
      </section>

      <div className="journey-explorer">
        <div className="journey-selector-shell content-surface">
          <div className="journey-tabs" role="tablist" aria-label="Choose a User Journey">
            {JOURNEYS.map((item, index) => (
              <button
                id={`journey-tab-${item.id}`}
                key={item.id}
                type="button"
                role="tab"
                aria-selected={activeJourney === item.id}
                aria-controls={`journey-panel-${item.id}`}
                tabIndex={activeJourney === item.id ? 0 : -1}
                className={activeJourney === item.id ? 'active' : ''}
                onClick={() => setActiveJourney(item.id)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
              >
                <b>{item.tab}</b>
                <span>{item.range}</span>
              </button>
            ))}
          </div>
        </div>

        <JourneyDetail journey={journey} onOpenApps={onOpenApps} onOpenForm={onOpenForm} />
      </div>

      <section className="story-page-hero content-surface story-fit-hero restored-fit-intro">
        <div className="story-intro-copy">
          <span className="story-chapter-label">The original fit story</span>
          <h1>OrkaOS thrives at the start of the journey — not every stage of it.</h1>
          <p>It is built for people creating structure for the first time, or for small teams reaching the point where collaboration is beginning to break. If your systems are already mature, highly customized, and deeply embedded, you have probably outgrown OrkaOS — by design.</p>
          <div className="story-hero-actions dark-actions">
            <button className="button primary" type="button" onClick={onOpenApps}>Find a starting app</button>
            <button className="button secondary" type="button" onClick={() => onOpenForm('Join the Pod')}>Join the Pod</button>
          </div>
        </div>
        <div className="fit-signal-card">
          <span className="fit-pulse" />
          <small>The strongest signal</small>
          <blockquote>“We are doing good work — but the way we work is starting to break.”</blockquote>
        </div>
      </section>

      <section className="audience-stages audience-current-section restored-fit-navigator">
        <FitNavigator />
      </section>

      <section className="fit-compare">
        <article className="fit-yes content-surface">
          <span className="eyebrow">A good fit</span>
          <h2>You need a calmer way to begin.</h2>
          <ul>
            <li><Icon name="check" size={17} /> Google Workspace is already your home base.</li>
            <li><Icon name="check" size={17} /> Remote, fractional, student, or cross-organization collaboration matters.</li>
            <li><Icon name="check" size={17} /> Your team needs clear routines but not a full operations department.</li>
            <li><Icon name="check" size={17} /> You would rather adopt one useful tool than configure a giant suite.</li>
          </ul>
        </article>
        <article className="fit-no content-surface">
          <span className="eyebrow">Probably not a fit</span>
          <h2>Your stack is already the system.</h2>
          <ul>
            <li><Icon name="x" size={17} /> A large enterprise with mature systems and dedicated administrators.</li>
            <li><Icon name="x" size={17} /> Deeply invested in Jira, HubSpot, Salesforce, Workday, or a custom platform.</li>
            <li><Icon name="x" size={17} /> Heavy customization and open-ended backend configuration are required.</li>
            <li><Icon name="x" size={17} /> You need one specialist platform to go extremely deep in a technical function.</li>
          </ul>
        </article>
      </section>

      <QuickAnswersLauncher onSelectProduct={onSelectProduct} onOpenApps={onOpenApps} />

      <section className="overview-faq">
        <div className="story-section-heading left compact">
          <span className="eyebrow">Three last questions</span>
          <h2>The things first-time visitors usually ask.</h2>
        </div>
        <div className="faq-grid">
          <article><h3>Does it replace Google Workspace?</h3><p>No. OrkaOS is designed to augment it. Google remains the foundation.</p></article>
          <article><h3>Do we have to adopt every app?</h3><p>No. Start with one. Follow an app series only when the next workflow is actually useful.</p></article>
          <article><h3>Are we locked in forever?</h3><p>No. The system is meant to help you reach the next stage — including the stage where you need larger specialist tools.</p></article>
        </div>
      </section>

      <section className="story-final-cta story-ocean-card">
        <div>
          <span className="story-chapter-label light">Build your pod</span>
          <h2>Choose one problem. Give the team one clear place to solve it.</h2>
          <p>That is how OrkaOS begins: not with a transformation project, but with a useful first win.</p>
        </div>
        <div className="story-final-actions">
          <button className="button story-button-light" type="button" onClick={onOpenApps}>Explore Orka Apps</button>
          <button className="button story-button-ghost" type="button" onClick={() => onOpenForm('Join Alpha Testing')}>Join Alpha Testing</button>
        </div>
      </section>
    </section>
  );
}

export default function OverviewStory({ chapter = 'start', onOpenForm, onOpenApps, onSelectProduct, onNavigate, onSectionChange }) {
  const scrollRef = useRef(null);
  const lastRequestedRef = useRef(null);

  useEffect(() => {
    if (!OVERVIEW_SECTIONS.some((section) => section.id === chapter)) return;
    const root = scrollRef.current;
    root?.querySelectorAll('[data-overview-section]').forEach((section) => {
      section.classList.toggle('is-overview-active', section.dataset.overviewSection === chapter);
    });
    if (lastRequestedRef.current === chapter) return;
    lastRequestedRef.current = chapter;
    const target = document.getElementById(`overview-${chapter}`);
    if (!target) return;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    requestAnimationFrame(() => target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' }));
  }, [chapter]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return undefined;
    const sections = [...root.querySelectorAll('[data-overview-section]')];
    if (!sections.length) return undefined;

    // Track the chapter using a fixed reading marker inside the Overview scroller.
    // Intersection ratios are unreliable here because User Journey is much taller
    // than Adoption; a small visible slice of Adoption could otherwise win and
    // leave User Journey faded even after navigation lands on it.
    const updateActiveSection = () => {
      const rootRect = root.getBoundingClientRect();
      const markerY = rootRect.top + Math.min(380, Math.max(150, root.clientHeight * 0.42));
      let active = sections[0];

      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= markerY) active = section;
      });

      const id = active?.dataset?.overviewSection;
      if (!id) return;
      sections.forEach((section) => {
        section.classList.toggle('is-overview-active', section.dataset.overviewSection === id);
      });
      lastRequestedRef.current = id;
      onSectionChange?.(id);
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActiveSection);
    };

    root.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateActiveSection();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      root.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [onSectionChange]);

  return (
    <div className="view-scroll overview-story overview-story-continuous" id="overview" ref={scrollRef}>
      <StartHereSection onOpenApps={onOpenApps} onNavigate={onNavigate} />
      <PhilosophySection />
      <EcosystemSection onOpenApps={onOpenApps} />
      <AdoptionSection onNavigate={onNavigate} />
      <UserJourneySection onOpenApps={onOpenApps} onOpenForm={onOpenForm} onSelectProduct={onSelectProduct} />
    </div>
  );
}
