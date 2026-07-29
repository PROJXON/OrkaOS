/**
 * Public OrkaOS product catalog
 * -----------------------------
 * This list is shared by the landing-page catalog, roadmap, and intake form.
 * It intentionally excludes tools that are specific to PROJXON/MIP internal
 * operations, candidate administration, or the internal Orka production stack.
 */

export const ORKA_APP_SERIES = [
  {
    id: 'people-organization',
    label: 'People & Organization',
    filterLabel: 'People & org',
    description: 'Employee records, team structure, roles, and organizational context.'
  },
  {
    id: 'talent-acquisition',
    label: 'Talent Acquisition',
    filterLabel: 'Talent acquisition',
    description: 'Role planning, recruiting, applicant tracking, and onboarding handoffs.'
  },
  {
    id: 'career-skill-growth',
    label: 'Career & Skill Growth',
    filterLabel: 'Career & skills',
    description: 'Career planning, goals, learning, workshops, and capability development.'
  },
  {
    id: 'planning-project-delivery',
    label: 'Planning & Project Delivery',
    filterLabel: 'Project delivery',
    description: 'Tasks, projects, sprints, cadence, and execution planning.'
  },
  {
    id: 'communication-service',
    label: 'Communication & Service',
    filterLabel: 'Communication & service',
    description: 'Meetings, team communication, support requests, and service follow-through.'
  },
  {
    id: 'knowledge-process',
    label: 'Knowledge & Process',
    filterLabel: 'Knowledge & process',
    description: 'SOPs, processes, policies, glossary, and shared operational knowledge.'
  },
  {
    id: 'product-adoption',
    label: 'Product & Adoption',
    filterLabel: 'Product & adoption',
    description: 'Product development, feedback, rollout planning, and change adoption.'
  },
  {
    id: 'marketing-content',
    label: 'Marketing & Content',
    filterLabel: 'Marketing & content',
    description: 'Brand assets, campaigns, social, content, and web performance.'
  },
  {
    id: 'sales-partnerships',
    label: 'Sales & Partnerships',
    filterLabel: 'Sales & partnerships',
    description: 'CRM, sales pipeline, referrals, and partner relationships.'
  },
  {
    id: 'finance-legal-governance',
    label: 'Finance, Legal & Governance',
    filterLabel: 'Governance & finance',
    description: 'Financial visibility, agreements, access controls, and accountability.'
  },
  {
    id: 'ai-automation',
    label: 'AI & Automation',
    filterLabel: 'AI & automation',
    description: 'AI guidance, reusable prompts, and cross-app automation.'
  },
  {
    id: 'core-os-workspace',
    label: 'Core OS & Workspace',
    filterLabel: 'Core OS',
    description: 'The shared operating layer, workspace, and navigation for the Orka ecosystem.'
  }
];

const ORKA_SERIES_BY_ID = Object.fromEntries(
  ORKA_APP_SERIES.map((series) => [series.id, series])
);

export const ORKA_PRODUCTS = [
  {
    id: 'orka-vault', name: 'OrkaVault', status: 'Live', priority: 'Available',
    lane: 'current', seriesId: 'finance-legal-governance',
    summary: 'Secure access management and credential sharing for small teams.',
    google: 'Google Workspace + secure app layer', pairs: ['OrkaSOP', 'OrkaWorkspace'], featured: true
  },
  {
    id: 'orka-hr', name: 'OrkaHR', status: 'Production', priority: 'Available',
    lane: 'current', seriesId: 'people-organization',
    summary: 'Employee records, contact cards, roles, and team identity in one workspace.',
    google: 'Google Forms + Sheets', pairs: ['OrkaOrg', 'OrkaPolicies'], featured: true
  },
  {
    id: 'orka-sop', name: 'OrkaSOP', status: 'Production', priority: 'Available',
    lane: 'current', seriesId: 'knowledge-process',
    summary: 'Living standard operating procedures with ownership and review-health signals.',
    google: 'Google Docs + company index', pairs: ['OrkaProcess', 'OrkaSkills'], featured: true
  },
  {
    id: 'orka-ats', name: 'OrkaATS', status: 'Testing', priority: 'In validation',
    lane: 'current', seriesId: 'talent-acquisition',
    summary: 'Applicant pipeline tracking from pre-screening through onboarding.',
    google: 'Google Apps Script + Sheets', pairs: ['OrkaRecruiting', 'OrkaHR'], featured: true
  },
  {
    id: 'orka-recruiting', name: 'OrkaRecruiting', status: 'Testing', priority: 'In validation',
    lane: 'current', seriesId: 'talent-acquisition',
    summary: 'Role planning and recruiting workflows before candidates enter the ATS.',
    google: 'LinkedIn + Sheets + recruiting sources', pairs: ['OrkaATS', 'OrkaHR'], featured: true
  },
  {
    id: 'orka-assets', name: 'OrkaAssets', status: 'Testing', priority: 'In validation',
    lane: 'current', seriesId: 'marketing-content',
    summary: 'A living brand kit for approved assets, version history, and share links.',
    google: 'Google Drive + Sheets + Sites', pairs: ['OrkaMarketing', 'OrkaSocial'], featured: true
  },
  {
    id: 'orka-feedback', name: 'OrkaFeedback', status: 'Design', priority: 'In design',
    lane: 'building', seriesId: 'product-adoption',
    summary: 'Stage-aware feedback collection, routing, and structured follow-up.',
    google: 'Google Forms + Docs', pairs: ['OrkaProduct', 'OrkaProject']
  },
  {
    id: 'orka-cadence', name: 'OrkaCadence', status: 'Design', priority: 'In design',
    lane: 'building', seriesId: 'planning-project-delivery',
    summary: 'A shared rhythm for recurring work, meetings, check-ins, and availability.',
    google: 'Google Calendar + Workspace', pairs: ['OrkaGoals', 'OrkaWorkspace']
  },
  {
    id: 'orka-task', name: 'OrkaTask', status: 'Design', priority: 'In design',
    lane: 'building', seriesId: 'planning-project-delivery',
    summary: 'Kanban-style task management built for clear ownership and fast handoffs.',
    google: 'Google Workspace + task app layer', pairs: ['OrkaProject', 'OrkaFlow'], featured: true
  },
  {
    id: 'orka-goals', name: 'OrkaGoals', status: 'Design', priority: 'In design',
    lane: 'building', seriesId: 'career-skill-growth',
    summary: 'Personal and team goal planning with visible progress and accountability.',
    google: 'Google Workspace', pairs: ['OrkaCadence', 'OrkaCareer']
  },
  {
    id: 'orka-career', name: 'OrkaCareer', status: 'Design', priority: 'In design',
    lane: 'building', seriesId: 'career-skill-growth',
    summary: 'A career hub for professional assets, goals, and job-application momentum.',
    google: 'Google Sheets + dashboards', pairs: ['OrkaGoals', 'OrkaRecruiting']
  },
  {
    id: 'orka-legal', name: 'OrkaLegal', status: 'Design', priority: 'In design',
    lane: 'building', seriesId: 'finance-legal-governance',
    summary: 'Contracts, agreements, compliance records, and renewal visibility.',
    google: 'Google Docs + Drive', pairs: ['OrkaFinance', 'OrkaVault']
  },
  {
    id: 'orka-finance', name: 'OrkaFinance', status: 'Design', priority: 'In design',
    lane: 'building', seriesId: 'finance-legal-governance',
    summary: 'Budgeting, expenses, revenue tracking, and financial reporting.',
    google: 'Google Sheets + web app', pairs: ['OrkaLegal', 'OrkaSales']
  },
  {
    id: 'orka-ai', name: 'OrkaAI', status: 'Design', priority: 'In design',
    lane: 'building', seriesId: 'ai-automation',
    summary: 'An onboard CTO for tech-stack visibility, AI adoption, and tool governance.',
    google: 'Gemini + AWS', pairs: ['OrkaAutomation', 'OrkaFin'], featured: true, ai: true
  },
  {
    id: 'orka-social', name: 'OrkaSocial', status: 'Design', priority: 'In design',
    lane: 'building', seriesId: 'marketing-content',
    summary: 'Guided social-account setup, optimization, activity logs, and analytics links.',
    google: 'Google Sheets + Drive', pairs: ['OrkaContent', 'OrkaMarketing']
  },
  {
    id: 'orka-marketing', name: 'OrkaMarketing', status: 'Design', priority: 'In design',
    lane: 'building', seriesId: 'marketing-content',
    summary: 'A guided campaign builder for audiences, journeys, channels, and deadlines.',
    google: 'Google Sheets + Docs + creative tools', pairs: ['OrkaSocial', 'OrkaCRM'], featured: true
  },
  {
    id: 'orka-org', name: 'OrkaOrg', status: 'Design', priority: 'In design',
    lane: 'building', seriesId: 'people-organization',
    summary: 'Organization structure, teams, reporting lines, and shared role context.',
    google: 'Google Workspace directory', pairs: ['OrkaHR', 'OrkaWorkspace']
  },
  {
    id: 'orka-support', name: 'OrkaSupport', status: 'Design', priority: 'In design',
    lane: 'building', seriesId: 'communication-service',
    summary: 'Service requests, support tickets, triage, and response ownership.',
    google: 'Google Forms + Sheets', pairs: ['OrkaFeedback', 'OrkaCRM']
  },
  {
    id: 'orka-flow', name: 'OrkaFlow', status: 'Design', priority: 'In design',
    lane: 'building', seriesId: 'communication-service',
    summary: 'Meeting facilitation, decisions, action items, and structured handoffs.',
    google: 'Google Docs + Calendar', pairs: ['OrkaCadence', 'OrkaTask']
  },
  {
    id: 'orka-skills', name: 'OrkaSkills', status: 'Design', priority: 'In design',
    lane: 'building', seriesId: 'career-skill-growth',
    summary: 'Skills development, workshops, learning resources, and capability tracking.',
    google: 'LMS + Google Drive', pairs: ['OrkaWorkshop', 'OrkaCareer']
  },
  {
    id: 'orka-sprint', name: 'OrkaSprint', status: 'Design', priority: 'In design',
    lane: 'building', seriesId: 'planning-project-delivery',
    summary: 'Time-boxed planning for focused delivery, reviews, and team commitments.',
    google: 'Google Calendar + project tools', pairs: ['OrkaProject', 'OrkaGoals']
  },
  {
    id: 'orka-project', name: 'OrkaProject', status: 'Design', priority: 'In design',
    lane: 'building', seriesId: 'planning-project-delivery',
    summary: 'Structured project planning with drafts, ownership, deadlines, and health signals.',
    google: 'Google Sheets + ClickUp integration', pairs: ['OrkaTask', 'OrkaSprint'], featured: true
  },
  {
    id: 'orka-prompt', name: 'OrkaPrompt', status: 'Design', priority: 'In design',
    lane: 'building', seriesId: 'ai-automation',
    summary: 'A version-controlled prompt catalog for reusable, stage-based AI workflows.',
    google: 'Google Docs + Drive', pairs: ['OrkaAI', 'OrkaAutomation'], ai: true
  },
  {
    id: 'orka-os', name: 'OrkaOS', status: 'Design', priority: 'In design',
    lane: 'building', seriesId: 'core-os-workspace',
    summary: 'The modular operating-system hub connecting Google Workspace and Orka apps.',
    google: 'Google Workspace + AWS', pairs: ['OrkaWorkspace', 'OrkaFin']
  },
  {
    id: 'orka-workspace', name: 'OrkaWorkspace', status: 'Next', priority: 'Up next',
    lane: 'queued', seriesId: 'core-os-workspace',
    summary: 'A personalized console for goals, tasks, availability, and project portfolios.',
    google: 'Google Workspace + dashboards', pairs: ['OrkaOS', 'OrkaFin'], featured: true
  },
  {
    id: 'orka-automation', name: 'OrkaAutomation', status: 'Next', priority: 'Up next',
    lane: 'queued', seriesId: 'ai-automation',
    summary: 'Cross-app rules, triggers, and repeatable automations for recurring work.',
    google: 'Google Apps Script', pairs: ['OrkaAI', 'OrkaProcess'], ai: true
  },
  {
    id: 'orka-policies', name: 'OrkaPolicies', status: 'Next', priority: 'Up next',
    lane: 'queued', seriesId: 'knowledge-process',
    summary: 'A searchable policy library with ownership, publishing, and review cycles.',
    google: 'Google Drive + Sites', pairs: ['OrkaProcess', 'OrkaLegal']
  },
  {
    id: 'orka-process', name: 'OrkaProcess', status: 'Next', priority: 'Up next',
    lane: 'queued', seriesId: 'knowledge-process',
    summary: 'Process mapping and improvement workflows that connect policies, SOPs, and automation.',
    google: 'Google Workspace', pairs: ['OrkaSOP', 'OrkaAutomation']
  },
  {
    id: 'orka-chat', name: 'OrkaChat', status: 'Concept', priority: 'Planned',
    lane: 'later', seriesId: 'communication-service',
    summary: 'Team communication that keeps shared Google Drive context connected to conversation.',
    google: 'Google Drive + communication layer', pairs: ['OrkaProject', 'OrkaSupport']
  },
  {
    id: 'orka-partners', name: 'OrkaPartners', status: 'Concept', priority: 'Planned',
    lane: 'later', seriesId: 'sales-partnerships',
    summary: 'Partner relationships, referrals, co-selling activity, and shared opportunities.',
    google: 'Google Sheets + Drive', pairs: ['OrkaCRM', 'OrkaSales']
  },
  {
    id: 'orka-crm', name: 'OrkaCRM', status: 'Concept', priority: 'Planned',
    lane: 'later', seriesId: 'sales-partnerships',
    summary: 'Contact, relationship, and deal-pipeline management for growing teams.',
    google: 'Google Sheets + web intake', pairs: ['OrkaSales', 'OrkaMarketing'], featured: true
  },
  {
    id: 'orka-content', name: 'OrkaContent', status: 'Concept', priority: 'Planned',
    lane: 'later', seriesId: 'marketing-content',
    summary: 'Content planning, production, approvals, and reusable messaging assets.',
    google: 'Google Docs + Drive', pairs: ['OrkaMarketing', 'OrkaSocial']
  },
  {
    id: 'orka-web', name: 'OrkaWeb', status: 'Concept', priority: 'Planned',
    lane: 'later', seriesId: 'marketing-content',
    summary: 'Website observability for SEO, AEO, crawl health, and unified analytics.',
    google: 'Google Analytics + Python web app', pairs: ['OrkaContent', 'OrkaMarketing']
  },
  {
    id: 'orka-sales', name: 'OrkaSales', status: 'Concept', priority: 'Planned',
    lane: 'later', seriesId: 'sales-partnerships',
    summary: 'Sales intake, qualification, pipeline health, and opportunity triage.',
    google: 'Google Sheets + web intake', pairs: ['OrkaCRM', 'OrkaPartners']
  },
  {
    id: 'orka-workshop', name: 'OrkaWorkshop', status: 'Concept', priority: 'Planned',
    lane: 'later', seriesId: 'career-skill-growth',
    summary: 'Workshop planning, facilitation materials, attendance, and follow-through.',
    google: 'Google Workspace', pairs: ['OrkaSkills', 'OrkaSOP']
  },
  {
    id: 'orka-glossary', name: 'OrkaGlossary', status: 'Concept', priority: 'Planned',
    lane: 'later', seriesId: 'knowledge-process',
    summary: 'A shared vocabulary for terms, acronyms, definitions, and organizational context.',
    google: 'Google Docs + Workspace', pairs: ['OrkaSOP', 'OrkaPolicies']
  },
  {
    id: 'orka-product', name: 'OrkaProduct', status: 'Concept', priority: 'Planned',
    lane: 'later', seriesId: 'product-adoption',
    summary: 'Milestone-based product development with structured review and feedback gates.',
    google: 'Google Sheets + company index', pairs: ['OrkaFeedback', 'OrkaProject']
  },
  {
    id: 'orka-adoption', name: 'OrkaAdoption', status: 'Concept', priority: 'Planned',
    lane: 'later', seriesId: 'product-adoption',
    summary: 'Adoption planning, rollout visibility, usage signals, and change-management follow-up.',
    google: 'Google Sheets + company index', pairs: ['OrkaWorkspace', 'OrkaFin']
  },
  {
    id: 'orka-cascade', name: 'OrkaCascade', status: 'Concept', priority: 'Planned',
    lane: 'later', seriesId: 'finance-legal-governance',
    summary: 'A structured way to cascade strategy, goals, decisions, and accountability through teams.',
    google: 'Google Workspace', pairs: ['OrkaGoals', 'OrkaOrg']
  },
  {
    id: 'orka-fin', name: 'OrkaFin', status: 'Concept', priority: 'Planned',
    lane: 'later', seriesId: 'ai-automation',
    summary: 'The OrkaOS AI sidekick for navigation, how-to guidance, and automation suggestions.',
    google: 'AWS + OrkaOS activity data', pairs: ['OrkaAI', 'OrkaWorkspace'], ai: true
  }
].map((product) => ({
  ...product,
  series: ORKA_SERIES_BY_ID[product.seriesId].label
}));

export const PRODUCT_SERIES_FILTERS = [
  ['all', 'All'],
  ...ORKA_APP_SERIES.map((series) => [series.id, series.filterLabel])
];

export const ROADMAP_PHASES = [
  { id: 'concept', label: '01 · Concept' },
  { id: 'next', label: '02 · Next' },
  { id: 'design', label: '03 · Design' },
  { id: 'testing', label: '04 · Testing' },
  { id: 'production', label: '05 · Production' },
  { id: 'live', label: '06 · Live' }
];

export const ROADMAP_STATUS_META = {
  Concept: { barLabel: 'Concept', barClass: 'concept', pillClass: 'status-concept', progress: 15 },
  Next: { barLabel: 'Next', barClass: 'next', pillClass: 'status-next', progress: 32 },
  Design: { barLabel: 'Design', barClass: 'design', pillClass: 'status-design', progress: 49 },
  Testing: { barLabel: 'Testing', barClass: 'testing', pillClass: 'status-testing', progress: 66 },
  Production: { barLabel: 'Production', barClass: 'production', pillClass: 'status-production', progress: 83 },
  Live: { barLabel: 'Live', barClass: 'live', pillClass: 'status-live', progress: 97 }
};

const ROADMAP_SORT_ORDER = {
  Live: 0,
  Production: 1,
  Testing: 2,
  Design: 3,
  Next: 4,
  Concept: 5
};

export const ROADMAP_SEQUENCE = [...ORKA_PRODUCTS]
  .sort((a, b) => {
    const stageDifference = ROADMAP_SORT_ORDER[a.status] - ROADMAP_SORT_ORDER[b.status];
    return stageDifference || a.name.localeCompare(b.name);
  })
  .map((product) => ({
    id: product.id,
    start: 1,
    width: ROADMAP_STATUS_META[product.status].progress
  }));

export const ORKA_PRODUCTS_BY_ID = Object.fromEntries(
  ORKA_PRODUCTS.map((product) => [product.id, product])
);
