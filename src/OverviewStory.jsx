import React from 'react';
import Icon from './Icon';
import { ORKA_PRODUCTS_BY_ID } from './products.js';
import orkaLogoLight from './assets/brand/orka-logo-on-light.png';
import './OverviewStory.css';

const STORY_CHAPTERS = [
  { id: 'start', number: '01', label: 'Start Here', short: 'Meet OrkaOS' },
  { id: 'why', number: '02', label: 'The Story', short: 'Why it exists' },
  { id: 'how', number: '03', label: 'How It Works', short: 'Build your micro-stack' },
  { id: 'experience', number: '04', label: 'The Orka Way', short: 'Pod, flow & feel' },
  { id: 'fit', number: '05', label: 'Is It for You?', short: 'Find your starting point' }
];

const APP_PATH = ['orka-vault', 'orka-sop', 'orka-task', 'orka-hr', 'orka-flow', 'orka-project']
  .map((id) => ORKA_PRODUCTS_BY_ID[id])
  .filter(Boolean);

function StoryProgress({ active, onNavigate }) {
  return (
    <nav className="story-progress content-surface" aria-label="OrkaOS overview chapters">
      {STORY_CHAPTERS.map((chapter) => (
        <button
          className={`story-progress-step${active === chapter.id ? ' active' : ''}`}
          type="button"
          key={chapter.id}
          onClick={() => onNavigate('overview', chapter.id)}
          aria-current={active === chapter.id ? 'step' : undefined}
        >
          <span>{chapter.number}</span>
          <b>{chapter.label}</b>
        </button>
      ))}
    </nav>
  );
}

function ChapterIntro({ number, kicker, title, body, children, dark = false }) {
  return (
    <header className={`story-intro${dark ? ' is-dark' : ''}`}>
      <div className="story-intro-copy">
        <span className="story-chapter-label">Chapter {number} · {kicker}</span>
        <h1>{title}</h1>
        <p>{body}</p>
        {children}
      </div>
    </header>
  );
}

function NextChapter({ current, onNavigate, onOpenApps }) {
  const index = STORY_CHAPTERS.findIndex((chapter) => chapter.id === current);
  const next = STORY_CHAPTERS[index + 1];

  if (!next) {
    return (
      <section className="story-next content-surface story-next-final">
        <div>
          <span className="eyebrow">You made it</span>
          <h2>Now choose the first problem your pod wants to solve.</h2>
          <p>You do not need the whole system. One useful app is the beginning.</p>
        </div>
        <button className="button primary" type="button" onClick={onOpenApps}>Explore Orka Apps</button>
      </section>
    );
  }

  return (
    <button className="story-next content-surface" type="button" onClick={() => onNavigate('overview', next.id)}>
      <span className="story-next-number">{next.number}</span>
      <span className="story-next-copy">
        <small>Continue the story</small>
        <b>{next.label}</b>
        <span>{next.short}</span>
      </span>
      <span className="story-next-arrow" aria-hidden="true">→</span>
    </button>
  );
}

function AppShellPreview() {
  return (
    <div className="story-app-shell" aria-label="Example of the familiar three-pane OrkaApp layout">
      <div className="story-app-topbar">
        <div className="story-app-brand"><img src={orkaLogoLight} alt="" /><b><span>Orka</span>SOP</b></div>
        <div className="story-app-search"><Icon name="search" size={13} /> Search procedures</div>
        <div className="story-app-avatar">PX</div>
      </div>
      <div className="story-app-panes">
        <aside>
          <small>CATALOG</small>
          <button className="active" type="button"><Icon name="grid" size={14} /> All SOPs <b>24</b></button>
          <button type="button"><Icon name="star" size={14} /> Favorites <b>6</b></button>
          <button type="button"><Icon name="users" size={14} /> My team <b>8</b></button>
        </aside>
        <main>
          <small>WORKSPACE</small>
          <div className="story-doc-title"><span>New Employee Onboarding</span><em>On track</em></div>
          <div className="story-doc-line wide" />
          <div className="story-doc-line" />
          <div className="story-doc-steps">
            <span><b>1</b> Welcome & accounts</span>
            <span><b>2</b> Team introductions</span>
            <span><b>3</b> First-week check-in</span>
          </div>
        </main>
        <section>
          <small>INSIGHTS</small>
          <div className="story-insight"><b>92%</b><span>completion</span></div>
          <div className="story-insight"><b>18m</b><span>average run</span></div>
          <div className="story-mini-chart"><i /><i /><i /><i /><i /></div>
        </section>
      </div>
      <div className="story-app-caption">Catalog on the left. Work in the center. Useful signals on the right.</div>
    </div>
  );
}

function StartChapter({ onOpenForm, onOpenApps, onNavigate }) {
  return (
    <>
      <section className="story-hero story-ocean-card">
        <div className="story-hero-copy">
          <h1>A whale of a project should not require a whale of a tech stack.</h1>
          <p>OrkaOS keeps Google Workspace at the center and adds only the focused apps your team needs.</p>
        </div>
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
            ['01', 'A real problem appears', 'The handoff is messy. The SOP lives in someone’s head. Nobody knows who owns the next step.'],
            ['02', 'Add one OrkaApp', 'Choose the smallest useful tool for that problem — not a giant suite for problems you do not have.'],
            ['03', 'The team learns by doing', 'Every app feels familiar, so the process becomes the training instead of another course.'],
            ['04', 'The pod builds its system', 'Add connected apps as the work grows. After a few, the OrkaOS hub brings the pod together.']
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

      <NextChapter current="start" onNavigate={onNavigate} onOpenApps={onOpenApps} />
    </>
  );
}

function WhyChapter({ onNavigate, onOpenApps }) {
  return (
    <>
      <section className="story-page-hero content-surface">
        <ChapterIntro
          number="02"
          kicker="The story"
          title="OrkaOS did not begin as a software suite. It began with a bad group project."
          body="In coaching sessions, brilliant people kept describing the same frustration: everyone could do the work, but the group could not collaborate. Messages were scattered, meetings ended without clear owners, and the tools made the project harder instead of easier."
        />
        <div className="story-origin-quote">
          <span>“</span>
          <blockquote>There is no mastermind here — just a series of incredibly fortunate events.</blockquote>
          <small>One real problem led to one useful tool. Then another.</small>
        </div>
      </section>

      <section className="story-origin-section">
        <div className="story-section-heading left">
          <span className="eyebrow">How the pod formed</span>
          <h2>Four discoveries turned a workflow into an operating system.</h2>
        </div>
        <div className="origin-timeline">
          {[
            ['01', 'Coaching revealed the pattern', 'Students, founders, and remote teammates were using capable tools in disconnected ways. The problem was not talent. It was coordination.'],
            ['02', 'A personal workflow became the model', 'Deep-work sessions, better meetings, clear tasks, and follow-through showed that a team could be guided into flow.'],
            ['03', 'The pod gave the idea a language', 'A synchronized micro-team of 3–5 could divide whale-sized work, communicate clearly, and keep momentum moving.'],
            ['04', 'The apps started building themselves', 'An HR tool, a chat tool, an AI concept, task and project ideas — each solved a real problem, and the micro-stack emerged.']
          ].map(([number, title, body]) => (
            <article key={number}>
              <div className="origin-marker"><span>{number}</span></div>
              <div><h3>{title}</h3><p>{body}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="story-friction content-surface">
        <div className="story-section-heading left compact">
          <span className="eyebrow">The enemy is friction</span>
          <h2>Small teams get trapped between chaos and bloat.</h2>
          <p>They outgrow ad-hoc workarounds before they are ready for enterprise software.</p>
        </div>
        <div className="friction-grid">
          <article>
            <span><Icon name="unlink" size={22} /></span>
            <h3>Scattered work</h3>
            <p>Files, chats, forms, and decisions live in different places. Context leaks at every handoff.</p>
          </article>
          <article>
            <span><Icon name="help" size={22} /></span>
            <h3>Tools that need a translator</h3>
            <p>The team spends time learning the platform, configuring the platform, and explaining the platform.</p>
          </article>
          <article>
            <span><Icon name="building" size={22} /></span>
            <h3>40% used, 100% paid</h3>
            <p>Huge suites arrive with features, certifications, and admin work a small team never asked for.</p>
          </article>
        </div>
      </section>

      <section className="hammer-story story-ocean-card">
        <div>
          <span className="story-chapter-label light">The hammer test</span>
          <h2>You should not have to study a hammer before you can drive a nail.</h2>
          <p>
            The point of a business tool is the outcome: a productive meeting, a clear owner, a secure handoff,
            a team that knows what happens next. OrkaOS strips away everything that gets between the person and that outcome.
          </p>
        </div>
        <div className="hammer-outcomes">
          <span><Icon name="calendar" size={18} /> Better meetings</span>
          <span><Icon name="clipboard" size={18} /> Clear next steps</span>
          <span><Icon name="users" size={18} /> Shared accountability</span>
          <span><Icon name="trending" size={18} /> Momentum that compounds</span>
        </div>
      </section>

      <NextChapter current="why" onNavigate={onNavigate} onOpenApps={onOpenApps} />
    </>
  );
}

function HowChapter({ onNavigate, onOpenApps }) {
  return (
    <>
      <section className="story-page-hero content-surface story-how-hero">
        <ChapterIntro
          number="03"
          kicker="How it works"
          title="Start anywhere. Follow the current. Build only what your pod needs."
          body="OrkaOS is not a new operating system for your laptop. It is an operating system for people, processes, and the tools around them. Google Workspace remains the foundation; focused OrkaApps make the work easier to run."
        />
        <div className="human-hardware-card">
          <img src={orkaLogoLight} alt="" />
          <div><small>Why call it an OS?</small><b>The “hardware” is your team.</b><p>OrkaOS connects people and operating routines, not computer parts.</p></div>
        </div>
      </section>

      <section className="ecosystem-map content-surface">
        <div className="story-section-heading left compact">
          <span className="eyebrow">A choose-your-own-adventure micro-stack</span>
          <h2>There is no single front door.</h2>
          <p>Enter through the problem you have today. The ecosystem guides you toward the next useful step — and eventually the hub.</p>
        </div>
        <div className="ecosystem-orbit" aria-label="OrkaApps surrounding the OrkaOS hub">
          <div className="ecosystem-watermark">GOOGLE WORKSPACE</div>
          <div className="ecosystem-ring ring-a" />
          <div className="ecosystem-ring ring-b" />
          <div className="ecosystem-core"><img src={orkaLogoLight} alt="" /><b>OrkaOS</b><small>Your hub</small></div>
          {APP_PATH.map((product, index) => (
            <div className={`ecosystem-node node-${index + 1}`} key={product.id}>
              <span>{product.name.replace('Orka', '') || 'OS'}</span>
              <small>{product.group}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="adoption-story">
        <div className="story-section-heading">
          <span className="eyebrow">The adoption path</span>
          <h2>One useful win at a time.</h2>
          <p>The system is intentionally progressive. You learn it by solving real work, not by sitting through an implementation.</p>
        </div>
        <div className="adoption-steps">
          {[
            ['01', 'Choose the stuck moment', '“Our credentials are scattered.” “Nobody follows the SOP.” “Tasks disappear after meetings.”'],
            ['02', 'Adopt one focused app', 'Start with OrkaVault, OrkaSOP, OrkaTask, OrkaHR, or the app that best matches the problem.'],
            ['03', 'Follow smart recommendations', 'A useful next app appears when the current workflow is working — not as a giant suite you must configure.'],
            ['04', 'Unlock the hub around three apps', 'The OrkaOS layer starts tying identity, navigation, activity, and the growing app pod together.'],
            ['05', 'Outgrow it when the time is right', 'Move into deeper specialist software when your scale truly requires it. OrkaOS is a launchpad, not a cage.']
          ].map(([number, title, body], index) => (
            <article key={number}>
              <span className="adoption-number">{number}</span>
              <div><h3>{title}</h3><p>{body}</p></div>
              {index < 4 && <i aria-hidden="true">↓</i>}
            </article>
          ))}
        </div>
      </section>

      <section className="app-series-demo content-surface">
        <div>
          <span className="eyebrow">Example app series</span>
          <h2>Organize the knowledge. Turn it into a process. Put the process to work.</h2>
          <p>A series is a recommended path, not a mandatory bundle.</p>
        </div>
        <div className="app-series-path">
          <article><span>1</span><b>OrkaVault</b><small>Find the source of truth</small></article>
          <i>→</i>
          <article><span>2</span><b>OrkaSOP</b><small>Document the right way</small></article>
          <i>→</i>
          <article><span>3</span><b>OrkaFlow</b><small>Run the handoff</small></article>
        </div>
      </section>

      <NextChapter current="how" onNavigate={onNavigate} onOpenApps={onOpenApps} />
    </>
  );
}

function ExperienceChapter({ onNavigate, onOpenApps }) {
  return (
    <>
      <section className="story-page-hero content-surface story-experience-hero">
        <ChapterIntro
          number="04"
          kicker="The Orka way"
          title="The best tool disappears into the work."
          body="OrkaOS borrows the calm familiarity of Google Workspace and the deliberate polish of macOS. The goal is not to make your team feel impressed by software. The goal is to make the next step feel obvious."
        />
        <AppShellPreview />
      </section>

      <section className="mental-models">
        <div className="story-section-heading">
          <span className="eyebrow">Four ideas behind every app and pixel</span>
          <h2>Pod. Flow. Slipstream. Ecosystem.</h2>
        </div>
        <div className="mental-model-grid">
          <article>
            <span className="model-number">01</span><span className="model-icon"><Icon name="users" size={21} /></span>
            <h3>The Pod</h3><b>In sync · in formation · in flow</b>
            <p>Collaboration is the point. Clear handoffs and shared accountability let a small team move as one.</p>
          </article>
          <article>
            <span className="model-number">02</span><span className="model-icon"><Icon name="route" size={21} /></span>
            <h3>The Flow</h3><b>Intuitive · natural · familiar</b>
            <p>The interface should match the team’s instincts, so momentum keeps moving from meeting to meeting.</p>
          </article>
          <article>
            <span className="model-number">03</span><span className="model-icon"><Icon name="trending" size={21} /></span>
            <h3>The Slipstream</h3><b>We recede · your team accelerates</b>
            <p>The system works beneath the surface. Your people, your brand, and your outcomes remain the focus.</p>
          </article>
          <article>
            <span className="model-number">04</span><span className="model-icon"><Icon name="layers" size={21} /></span>
            <h3>The Ecosystem</h3><b>Start with one · navigate to the hub</b>
            <p>Every app has one clear job and points toward the next useful solution without forcing the full suite.</p>
          </article>
        </div>
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

      <NextChapter current="experience" onNavigate={onNavigate} onOpenApps={onOpenApps} />
    </>
  );
}

function FitChapter({ onOpenForm, onOpenApps, onNavigate }) {
  return (
    <>
      <section className="story-page-hero content-surface story-fit-hero">
        <ChapterIntro
          number="05"
          kicker="Is it for you?"
          title="OrkaOS thrives at the start of the journey — not every stage of it."
          body="It is built for people creating structure for the first time, or for small teams reaching the point where collaboration is beginning to break. If your systems are already mature, highly customized, and deeply embedded, you have probably outgrown OrkaOS — by design."
        >
          <div className="story-hero-actions dark-actions">
            <button className="button primary" type="button" onClick={onOpenApps}>Find a starting app</button>
            <button className="button secondary" type="button" onClick={() => onOpenForm('Join the Pod')}>Join the Pod</button>
          </div>
        </ChapterIntro>
        <div className="fit-signal-card">
          <span className="fit-pulse" />
          <small>The strongest signal</small>
          <blockquote>“We are doing good work — but the way we work is starting to break.”</blockquote>
        </div>
      </section>

      <section className="audience-stages">
        <div className="story-section-heading">
          <span className="eyebrow">Who we build for</span>
          <h2>From the first pod to a team on the cusp of scale.</h2>
        </div>
        <div className="audience-stage-grid">
          <article className="primary">
            <span>Primary · 01</span><h3>Small teams on the cusp of scaling</h3>
            <p>Collaboration is beginning to crack. The team wants structure and speed without enterprise bloat.</p>
            <b>Usually 5–50 people</b>
          </article>
          <article>
            <span>Secondary · 02</span><h3>Micro-teams getting established</h3>
            <p>A founding pod of 3–5 is building its first real workflow and putting calm structure around the chaos.</p>
            <b>Usually 3–5 people</b>
          </article>
          <article>
            <span>Third · 03</span><h3>Solopreneurs & university teams</h3>
            <p>Solo founders and student groups are learning how to collaborate — and can carry that operating rhythm forward.</p>
            <b>Usually 1–5 people</b>
          </article>
        </div>
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

      <section className="starting-points content-surface">
        <div className="story-section-heading left compact">
          <span className="eyebrow">Pick the sentence that sounds familiar</span>
          <h2>Your first app should match the first real pain.</h2>
        </div>
        <div className="starting-point-grid">
          <article><span><Icon name="lock" size={19} /></span><blockquote>“Our credentials and company knowledge are scattered.”</blockquote><b>Start with OrkaVault</b></article>
          <article><span><Icon name="clipboard" size={19} /></span><blockquote>“Everyone completes the same work a different way.”</blockquote><b>Start with OrkaSOP</b></article>
          <article><span><Icon name="users" size={19} /></span><blockquote>“New teammates cannot tell who is who or where to go.”</blockquote><b>Start with OrkaHR</b></article>
        </div>
      </section>

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

      <NextChapter current="fit" onNavigate={onNavigate} onOpenApps={onOpenApps} />
    </>
  );
}

export default function OverviewStory({ chapter = 'start', onOpenForm, onOpenApps, onNavigate }) {
  const content = {
    start: <StartChapter onOpenForm={onOpenForm} onOpenApps={onOpenApps} onNavigate={onNavigate} />,
    why: <WhyChapter onNavigate={onNavigate} onOpenApps={onOpenApps} />,
    how: <HowChapter onNavigate={onNavigate} onOpenApps={onOpenApps} />,
    experience: <ExperienceChapter onNavigate={onNavigate} onOpenApps={onOpenApps} />,
    fit: <FitChapter onOpenForm={onOpenForm} onOpenApps={onOpenApps} onNavigate={onNavigate} />
  }[chapter] || null;

  return (
    <div className="view-scroll overview-story" id={`overview-${chapter}`}>
      <StoryProgress active={chapter} onNavigate={onNavigate} />
      {content}
    </div>
  );
}
