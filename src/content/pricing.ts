/**
 * Example pricing. These tiers and prices are placeholders and must be
 * replaced with confirmed figures before launch.
 */
export type Plan = {
  id: string
  name: string
  tagline: string
  monthly: number | null
  yearly: number | null
  unit: string
  cta: { label: string; to: string }
  highlight?: boolean
  features: string[]
}

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For individuals and small teams getting organized.',
    monthly: 0,
    yearly: 0,
    unit: 'up to 2 seats',
    cta: { label: 'Get started', to: '/signup?plan=starter' },
    features: ['Contacts and companies', 'One sales pipeline', 'CSV import', 'Task reminders'],
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'For growing teams that want automation and reporting.',
    monthly: 29,
    yearly: 24,
    unit: 'per seat / month',
    cta: { label: 'Get started', to: '/signup?plan=growth' },
    highlight: true,
    features: [
      'Everything in Starter',
      'Unlimited pipelines',
      'Workflow automation',
      'Live analytics dashboards',
      'Shared workspaces',
    ],
  },
  {
    id: 'scale',
    name: 'Scale',
    tagline: 'For larger organizations with advanced control needs.',
    monthly: null,
    yearly: null,
    unit: 'tailored to your team',
    cta: { label: 'Talk to sales', to: '/demo' },
    features: ['Everything in Growth', 'Advanced roles and permissions', 'Multiple workspaces', 'Guided onboarding'],
  },
]

export type ComparisonValue = boolean | string

export const COMPARISON: { group: string; rows: { label: string; values: [ComparisonValue, ComparisonValue, ComparisonValue] }[] }[] =
  [
    {
      group: 'Core CRM',
      rows: [
        { label: 'Contacts & companies', values: [true, true, true] },
        { label: 'Sales pipelines', values: ['1', 'Unlimited', 'Unlimited'] },
        { label: 'CSV import & export', values: [true, true, true] },
        { label: 'Tasks & reminders', values: [true, true, true] },
      ],
    },
    {
      group: 'Productivity',
      rows: [
        { label: 'Workflow automation', values: [false, true, true] },
        { label: 'Analytics dashboards', values: ['Basic', 'Full', 'Full'] },
        { label: 'Shared workspaces', values: [false, true, true] },
      ],
    },
    {
      group: 'Administration',
      rows: [
        { label: 'Roles & permissions', values: ['Standard', 'Standard', 'Advanced'] },
        { label: 'Multiple workspaces', values: [false, false, true] },
        { label: 'Guided onboarding', values: [false, false, true] },
      ],
    },
  ]
