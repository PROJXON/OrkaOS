/**
 * Public OrkaOS product catalog
 * -----------------------------
 * The public ecosystem stays at exactly 20 apps. Public roadmap language is
 * intentionally external-facing: Orka AI is in Production (active development),
 * while the remaining apps are presented as Design & Testing unless newer
 * approved public status information is supplied.
 *
 * No speculative rollout dates are published in this pass.
 */

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

const PUBLIC_DEFAULT_STATUS = 'Design';

export const ORKA_PRODUCTS = [
  {
    // Keep the legacy internal id for compatibility while consolidating the public product under Orka AI.
    // Orka AI intentionally leads the public catalog.
    id: 'orka-aria', name: 'Orka AI', status: 'Production', publicStatus: 'Production', priority: 'Priority 1 · Production', groupId: 'it',
    summary: 'An onboard CTO for small Google Workspace teams: inventory the AI and automation already available, measure adoption and unrealized hours, and advise on tech-stack impact.',
    google: 'Google Workspace · read-only signals · AWS analysis', pairs: ['OrkaPrompt', 'OrkaOS'], featured: true, ai: true
  },
  {
    id: 'orka-vault', name: 'OrkaVault', groupId: 'it',
    summary: 'Secure access management and credential sharing for small teams.',
    google: 'Google Workspace + secure app layer', pairs: ['OrkaSOP', 'OrkaOS'], featured: true
  },
  {
    id: 'orka-prompt', name: 'OrkaPrompt', groupId: 'it',
    summary: 'A version-controlled prompt catalog for reusable, stage-based AI workflows.',
    google: 'Google Docs + Drive', pairs: ['Orka AI', 'OrkaTask'], ai: true
  },
  {
    id: 'orka-os', name: 'OrkaOS', publicStatus: 'Design & Testing', priority: 'Priority 4 · Design & Testing', groupId: 'ops',
    summary: 'The modular operating-system hub connecting Google Workspace and Orka apps.',
    google: 'Google Workspace + AWS', pairs: ['OrkaVault', 'Orka AI'], featured: true
  },
  {
    id: 'orka-chat', name: 'OrkaChat', groupId: 'ops',
    summary: 'Team communication that keeps shared Google Drive context connected to conversation.',
    google: 'Google Drive + communication layer', pairs: ['OrkaProject', 'OrkaFlow']
  },
  {
    id: 'orka-sop', name: 'OrkaSOP', publicStatus: 'Design & Testing', priority: 'Priority 2 · Design & Testing', groupId: 'ops',
    summary: 'Living standard operating procedures with ownership and review-health signals.',
    google: 'Google Docs + company index', pairs: ['OrkaProcess', 'OrkaFlow'], featured: true
  },
  {
    id: 'orka-task', name: 'OrkaTask', groupId: 'ops',
    summary: 'Kanban-style task management built for clear ownership and fast handoffs.',
    google: 'Google Workspace + task app layer', pairs: ['OrkaProject', 'OrkaFlow'], featured: true
  },
  {
    id: 'orka-goals', name: 'OrkaGoals', groupId: 'ops',
    summary: 'Personal and team goal planning with visible progress and accountability.',
    google: 'Google Workspace', pairs: ['OrkaTask', 'OrkaHR']
  },
  {
    id: 'orka-legal', name: 'OrkaLegal', groupId: 'ops',
    summary: 'Contracts, agreements, compliance records, and renewal visibility.',
    google: 'Google Docs + Drive', pairs: ['OrkaFinance', 'OrkaVault']
  },
  {
    id: 'orka-finance', name: 'OrkaFinance', groupId: 'ops',
    summary: 'Budgeting, expenses, revenue tracking, and financial reporting.',
    google: 'Google Sheets + web app', pairs: ['OrkaLegal', 'OrkaSales']
  },
  {
    id: 'orka-flow', name: 'OrkaFlow', publicStatus: 'Design & Testing', priority: 'Priority 3 · Design & Testing', groupId: 'ops',
    summary: 'Meeting facilitation, decisions, action items, and structured handoffs.',
    google: 'Google Docs + Calendar', pairs: ['OrkaTask', 'OrkaProcess']
  },
  {
    id: 'orka-process', name: 'OrkaProcess', groupId: 'ops',
    summary: 'Process mapping and improvement workflows that connect policies, SOPs, and repeatable execution.',
    google: 'Google Workspace', pairs: ['OrkaSOP', 'OrkaFlow']
  },
  {
    id: 'orka-project', name: 'OrkaProject', groupId: 'ops',
    summary: 'Structured project planning with drafts, ownership, deadlines, and health signals.',
    google: 'Google Sheets + project-tool integration', pairs: ['OrkaTask', 'OrkaGoals'], featured: true
  },
  {
    id: 'orka-ats', name: 'OrkaATS', groupId: 'hr',
    summary: 'Applicant pipeline tracking from pre-screening through onboarding.',
    google: 'Google Apps Script + Sheets', pairs: ['OrkaHR', 'OrkaPrompt'], featured: true
  },
  {
    id: 'orka-hr', name: 'OrkaHR', groupId: 'hr',
    summary: 'Employee records, contact cards, roles, and team identity in one workspace.',
    google: 'Google Forms + Sheets', pairs: ['OrkaATS', 'OrkaProcess'], featured: true
  },
  {
    id: 'orka-crm', name: 'OrkaCRM', groupId: 'business',
    summary: 'Contact, relationship, and deal-pipeline management for growing teams.',
    google: 'Google Sheets + web intake', pairs: ['OrkaSales', 'OrkaMarketing'], featured: true
  },
  {
    id: 'orka-sales', name: 'OrkaSales', groupId: 'business',
    summary: 'Sales intake, qualification, pipeline health, and opportunity triage.',
    google: 'Google Sheets + web intake', pairs: ['OrkaCRM', 'OrkaMarketing']
  },
  {
    id: 'orka-content', name: 'OrkaContent', groupId: 'marketing',
    summary: 'Content planning, production, approvals, and reusable messaging assets.',
    google: 'Google Docs + Drive', pairs: ['OrkaMarketing', 'OrkaSocial']
  },
  {
    id: 'orka-social', name: 'OrkaSocial', groupId: 'marketing',
    summary: 'Guided social-account setup, optimization, activity logs, and analytics links.',
    google: 'Google Sheets + Drive', pairs: ['OrkaContent', 'OrkaMarketing']
  },
  {
    id: 'orka-marketing', name: 'OrkaMarketing', groupId: 'marketing',
    summary: 'A guided campaign builder for audiences, journeys, channels, and deadlines.',
    google: 'Google Sheets + Docs + creative tools', pairs: ['OrkaSocial', 'OrkaCRM'], featured: true
  }
].map((product) => {
  const status = product.status || PUBLIC_DEFAULT_STATUS;
  const priority = product.priority || (status === 'Production' ? 'Production' : 'Design & Testing');
  const publicStatus = product.publicStatus || (status === 'Production' ? 'Production' : 'Design & Testing');
  return {
    ...product,
    // Reserved for the approved three-letter identifier mapping. Null keeps current icon treatment until supplied.
    shortCode: product.shortCode || null,
    status,
    publicStatus,
    priority,
    lane: status === 'Production' ? 'current' : 'building',
    group: ORKA_GROUP_BY_ID[product.groupId].label,
    rolloutDate: null,
    rolloutLabel: status === 'Production' ? 'Active development' : 'TBD / planning'
  };
});

export const PRODUCT_GROUP_FILTERS = [
  ['all', 'All'],
  ...ORKA_APP_GROUPS.map((group) => [group.id, group.filterLabel])
];

export const ROADMAP_PHASES = [
  { id: 'design', label: '1 · Design & Testing' },
  { id: 'production', label: '2 · Production' }
];

export const ROADMAP_STATUS_META = {
  Design: { barLabel: 'Design & Testing', barClass: 'design', pillClass: 'status-design', progress: 55 },
  Production: { barLabel: 'Production', barClass: 'production', pillClass: 'status-production', progress: 82 }
};

const ROADMAP_PRIORITY = ['orka-aria', 'orka-sop', 'orka-flow', 'orka-os'];

export const ROADMAP_SEQUENCE = [...ORKA_PRODUCTS]
  .sort((a, b) => {
    const aPriority = ROADMAP_PRIORITY.indexOf(a.id);
    const bPriority = ROADMAP_PRIORITY.indexOf(b.id);
    if (aPriority !== -1 || bPriority !== -1) {
      if (aPriority === -1) return 1;
      if (bPriority === -1) return -1;
      return aPriority - bPriority;
    }
    return a.group.localeCompare(b.group) || a.name.localeCompare(b.name);
  })
  .map((product) => ({
    id: product.id,
    start: 1,
    width: ROADMAP_STATUS_META[product.status].progress
  }));

export const ORKA_PRODUCTS_BY_ID = Object.fromEntries(
  ORKA_PRODUCTS.map((product) => [product.id, product])
);
