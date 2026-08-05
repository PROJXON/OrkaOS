/**
 * Public OrkaOS product catalog
 * -----------------------------
 * This list mirrors the public OrkaOS Product Roadmap. Every app is assigned
 * to one of the published groups: IT, OPS, HR, Business, or Marketing.
 *
 * `rolloutDate` values are public planning estimates used by the website's
 * rollout calendar. They are not committed release dates and are intentionally
 * kept separate from the roadmap stage.
 */

const ESTIMATED_ROLLOUTS = {
  'orka-ats': '2026-09-15',
  'orka-process': '2026-10-15',
  'orka-os': '2026-11-15',
  'orka-task': '2026-12-15',
  'orka-aria': '2027-01-15',
  'orka-prompt': '2027-02-15',
  'orka-project': '2027-03-15',
  'orka-goals': '2027-04-15',
  'orka-flow': '2027-05-15',
  'orka-legal': '2027-06-15',
  'orka-finance': '2027-07-15',
  'orka-marketing': '2027-08-15',
  'orka-social': '2027-09-15',
  'orka-content': '2027-11-15',
  'orka-crm': '2027-12-15',
  'orka-sales': '2028-01-15',
  'orka-chat': '2028-02-15'
};

function formatRolloutLabel(date, status) {
  if (status === 'Live' || status === 'Production') return 'Available now';
  if (!date) return 'Estimate pending';
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${date}T12:00:00Z`));
}


export const ORKA_APP_GROUPS = [
  {
    id: 'it',
    label: 'IT',
    filterLabel: 'IT',
    description: 'Digital foundations, platform access, AI guidance, and the public OrkaOS experience.'
  },
  {
    id: 'ops',
    label: 'OPS',
    filterLabel: 'OPS',
    description: 'Core operating workflows for planning, delivery, process, finance, legal, and collaboration.'
  },
  {
    id: 'hr',
    label: 'HR',
    filterLabel: 'HR',
    description: 'People operations and applicant workflows from hiring through employee management.'
  },
  {
    id: 'business',
    label: 'Business',
    filterLabel: 'Business',
    description: 'Customer, pipeline, and revenue workflows for business development and sales.'
  },
  {
    id: 'marketing',
    label: 'Marketing',
    filterLabel: 'Marketing',
    description: 'Content, social, and campaign workflows for building and growing the brand.'
  }
];

const ORKA_GROUP_BY_ID = Object.fromEntries(
  ORKA_APP_GROUPS.map((group) => [group.id, group])
);

export const ORKA_PRODUCTS = [
  {
    id: 'orka-vault', name: 'OrkaVault', status: 'Live', priority: 'Available',
    lane: 'current', groupId: 'it',
    summary: 'Secure access management and credential sharing for small teams.',
    google: 'Google Workspace + secure app layer', pairs: ['OrkaSOP', 'OrkaOS'], featured: true
  },
  {
    id: 'orka-aria', name: 'OrkaAria', status: 'Design', priority: 'In design',
    lane: 'building', groupId: 'it',
    summary: 'An onboard CTO for tech-stack visibility, AI adoption, and tool governance.',
    google: 'Gemini + AWS', pairs: ['OrkaPrompt', 'OrkaOS'], featured: true, ai: true
  },
  {
    id: 'orka-prompt', name: 'OrkaPrompt', status: 'Design', priority: 'In design',
    lane: 'building', groupId: 'it',
    summary: 'A version-controlled prompt catalog for reusable, stage-based AI workflows.',
    google: 'Google Docs + Drive', pairs: ['OrkaAria', 'OrkaTask'], ai: true
  },
  {
    id: 'orka-os', name: 'OrkaOS', status: 'Design', priority: 'In design',
    lane: 'building', groupId: 'ops',
    summary: 'The modular operating-system hub connecting Google Workspace and Orka apps.',
    google: 'Google Workspace + AWS', pairs: ['OrkaVault', 'OrkaAria'], featured: true
  },
  {
    id: 'orka-chat', name: 'OrkaChat', status: 'Concept', priority: 'Planned',
    lane: 'later', groupId: 'ops',
    summary: 'Team communication that keeps shared Google Drive context connected to conversation.',
    google: 'Google Drive + communication layer', pairs: ['OrkaProject', 'OrkaFlow']
  },
  {
    id: 'orka-sop', name: 'OrkaSOP', status: 'Production', priority: 'Available',
    lane: 'current', groupId: 'ops',
    summary: 'Living standard operating procedures with ownership and review-health signals.',
    google: 'Google Docs + company index', pairs: ['OrkaProcess', 'OrkaFlow'], featured: true
  },
  {
    id: 'orka-task', name: 'OrkaTask', status: 'Design', priority: 'In design',
    lane: 'building', groupId: 'ops',
    summary: 'Kanban-style task management built for clear ownership and fast handoffs.',
    google: 'Google Workspace + task app layer', pairs: ['OrkaProject', 'OrkaFlow'], featured: true
  },
  {
    id: 'orka-goals', name: 'OrkaGoals', status: 'Design', priority: 'In design',
    lane: 'building', groupId: 'ops',
    summary: 'Personal and team goal planning with visible progress and accountability.',
    google: 'Google Workspace', pairs: ['OrkaTask', 'OrkaHR']
  },
  {
    id: 'orka-legal', name: 'OrkaLegal', status: 'Design', priority: 'In design',
    lane: 'building', groupId: 'ops',
    summary: 'Contracts, agreements, compliance records, and renewal visibility.',
    google: 'Google Docs + Drive', pairs: ['OrkaFinance', 'OrkaVault']
  },
  {
    id: 'orka-finance', name: 'OrkaFinance', status: 'Design', priority: 'In design',
    lane: 'building', groupId: 'ops',
    summary: 'Budgeting, expenses, revenue tracking, and financial reporting.',
    google: 'Google Sheets + web app', pairs: ['OrkaLegal', 'OrkaSales']
  },
  {
    id: 'orka-flow', name: 'OrkaFlow', status: 'Design', priority: 'In design',
    lane: 'building', groupId: 'ops',
    summary: 'Meeting facilitation, decisions, action items, and structured handoffs.',
    google: 'Google Docs + Calendar', pairs: ['OrkaTask', 'OrkaProcess']
  },
  {
    id: 'orka-process', name: 'OrkaProcess', status: 'Next', priority: 'Up next',
    lane: 'queued', groupId: 'ops',
    summary: 'Process mapping and improvement workflows that connect policies, SOPs, and repeatable execution.',
    google: 'Google Workspace', pairs: ['OrkaSOP', 'OrkaFlow']
  },
  {
    id: 'orka-project', name: 'OrkaProject', status: 'Design', priority: 'In design',
    lane: 'building', groupId: 'ops',
    summary: 'Structured project planning with drafts, ownership, deadlines, and health signals.',
    google: 'Google Sheets + project-tool integration', pairs: ['OrkaTask', 'OrkaGoals'], featured: true
  },
  {
    id: 'orka-ats', name: 'OrkaATS', status: 'Testing', priority: 'In validation',
    lane: 'current', groupId: 'hr',
    summary: 'Applicant pipeline tracking from pre-screening through onboarding.',
    google: 'Google Apps Script + Sheets', pairs: ['OrkaHR', 'OrkaPrompt'], featured: true
  },
  {
    id: 'orka-hr', name: 'OrkaHR', status: 'Production', priority: 'Available',
    lane: 'current', groupId: 'hr',
    summary: 'Employee records, contact cards, roles, and team identity in one workspace.',
    google: 'Google Forms + Sheets', pairs: ['OrkaATS', 'OrkaProcess'], featured: true
  },
  {
    id: 'orka-crm', name: 'OrkaCRM', status: 'Concept', priority: 'Planned',
    lane: 'later', groupId: 'business',
    summary: 'Contact, relationship, and deal-pipeline management for growing teams.',
    google: 'Google Sheets + web intake', pairs: ['OrkaSales', 'OrkaMarketing'], featured: true
  },
  {
    id: 'orka-sales', name: 'OrkaSales', status: 'Concept', priority: 'Planned',
    lane: 'later', groupId: 'business',
    summary: 'Sales intake, qualification, pipeline health, and opportunity triage.',
    google: 'Google Sheets + web intake', pairs: ['OrkaCRM', 'OrkaMarketing']
  },
  {
    id: 'orka-content', name: 'OrkaContent', status: 'Concept', priority: 'Planned',
    lane: 'later', groupId: 'marketing',
    summary: 'Content planning, production, approvals, and reusable messaging assets.',
    google: 'Google Docs + Drive', pairs: ['OrkaMarketing', 'OrkaSocial']
  },
  {
    id: 'orka-social', name: 'OrkaSocial', status: 'Design', priority: 'In design',
    lane: 'building', groupId: 'marketing',
    summary: 'Guided social-account setup, optimization, activity logs, and analytics links.',
    google: 'Google Sheets + Drive', pairs: ['OrkaContent', 'OrkaMarketing']
  },
  {
    id: 'orka-marketing', name: 'OrkaMarketing', status: 'Design', priority: 'In design',
    lane: 'building', groupId: 'marketing',
    summary: 'A guided campaign builder for audiences, journeys, channels, and deadlines.',
    google: 'Google Sheets + Docs + creative tools', pairs: ['OrkaSocial', 'OrkaCRM'], featured: true
  }
].map((product) => {
  const rolloutDate = ESTIMATED_ROLLOUTS[product.id] || null;
  return {
    ...product,
    group: ORKA_GROUP_BY_ID[product.groupId].label,
    rolloutDate,
    rolloutLabel: formatRolloutLabel(rolloutDate, product.status)
  };
});

export const PRODUCT_GROUP_FILTERS = [
  ['all', 'All'],
  ...ORKA_APP_GROUPS.map((group) => [group.id, group.filterLabel])
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
    return stageDifference || a.group.localeCompare(b.group) || a.name.localeCompare(b.name);
  })
  .map((product) => ({
    id: product.id,
    start: 1,
    width: ROADMAP_STATUS_META[product.status].progress
  }));

export const ORKA_PRODUCTS_BY_ID = Object.fromEntries(
  ORKA_PRODUCTS.map((product) => [product.id, product])
);
