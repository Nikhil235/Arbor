import { useEffect, type RefObject } from 'react'

/** Closes a popover on outside pointer-down or Escape. */
export function useDismiss(ref: RefObject<HTMLElement | null>, open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) close()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [ref, open, close])
}

export type PeriodKey = 'quarter' | 'month' | 'ytd'

export type DashboardPeriodData = {
  label: string
  kpis: { label: string; value: string; delta: string; positive: boolean }[]
  revenuePoints: { month: string; value: number; display: string; deals: number }[]
  goal: {
    title: string
    current: string
    target: string
    percent: number
    segments: { label: string; amount: string; pct: number; colorVar: string }[]
  }
}

export const DEMO_DASHBOARD_PERIODS: Record<PeriodKey, DashboardPeriodData> = {
  quarter: {
    label: 'This Quarter',
    kpis: [
      { label: 'Total Pipeline', value: '$1,284,500', delta: '+14.2%', positive: true },
      { label: 'Active Deals', value: '142', delta: '+8.4%', positive: true },
      { label: 'Win Rate', value: '34.8%', delta: '+2.1%', positive: true },
      { label: 'Avg. Sales Cycle', value: '18d', delta: '-3d', positive: true },
    ],
    revenuePoints: [
      { month: 'Jun', value: 118, display: '$118,400', deals: 19 },
      { month: 'Jul', value: 134, display: '$134,200', deals: 22 },
      { month: 'Aug', value: 129, display: '$129,800', deals: 21 },
      { month: 'Sep', value: 158, display: '$158,600', deals: 27 },
      { month: 'Oct', value: 176, display: '$176,900', deals: 31 },
      { month: 'Nov', value: 204, display: '$204,100', deals: 36 },
    ],
    goal: {
      title: 'Q4 Revenue Target',
      current: '$842,000',
      target: '$1,000,000',
      percent: 84,
      segments: [
        { label: 'Closed Won', amount: '$540,000', pct: 54, colorVar: 'var(--color-forest)' },
        { label: 'Committed', amount: '$192,000', pct: 19, colorVar: 'var(--color-moss)' },
        { label: 'Best Case', amount: '$110,000', pct: 11, colorVar: 'var(--color-lime)' },
      ],
    },
  },
  month: {
    label: 'Last 30 Days',
    kpis: [
      { label: 'Total Pipeline', value: '$468,900', delta: '+11.6%', positive: true },
      { label: 'Active Deals', value: '58', delta: '+6.0%', positive: true },
      { label: 'Win Rate', value: '36.4%', delta: '+3.2%', positive: true },
      { label: 'Avg. Sales Cycle', value: '16d', delta: '-2d', positive: true },
    ],
    revenuePoints: [
      { month: 'Wk 1', value: 92, display: '$92,100', deals: 11 },
      { month: 'Wk 2', value: 108, display: '$108,400', deals: 14 },
      { month: 'Wk 3', value: 121, display: '$121,000', deals: 15 },
      { month: 'Wk 4', value: 147, display: '$147,400', deals: 18 },
      { month: 'Wk 5', value: 162, display: '$162,800', deals: 20 },
      { month: 'Now', value: 185, display: '$185,200', deals: 23 },
    ],
    goal: {
      title: 'Monthly Quota',
      current: '$276,000',
      target: '$300,000',
      percent: 92,
      segments: [
        { label: 'Closed Won', amount: '$186,000', pct: 62, colorVar: 'var(--color-forest)' },
        { label: 'Committed', amount: '$54,000', pct: 18, colorVar: 'var(--color-moss)' },
        { label: 'Best Case', amount: '$36,000', pct: 12, colorVar: 'var(--color-lime)' },
      ],
    },
  },
  ytd: {
    label: 'Year to Date',
    kpis: [
      { label: 'Total Pipeline', value: '$4,820,000', delta: '+24.8%', positive: true },
      { label: 'Active Deals', value: '418', delta: '+19.1%', positive: true },
      { label: 'Win Rate', value: '33.5%', delta: '+4.0%', positive: true },
      { label: 'Avg. Sales Cycle', value: '19d', delta: '-4d', positive: true },
    ],
    revenuePoints: [
      { month: 'Q1', value: 110, display: '$890,000', deals: 84 },
      { month: 'Apr', value: 128, display: '$1,040,000', deals: 96 },
      { month: 'Jun', value: 146, display: '$1,190,000', deals: 108 },
      { month: 'Aug', value: 164, display: '$1,340,000', deals: 121 },
      { month: 'Oct', value: 188, display: '$1,520,000', deals: 136 },
      { month: 'Nov', value: 214, display: '$1,740,000', deals: 152 },
    ],
    goal: {
      title: 'Annual Revenue Plan',
      current: '$3,960,000',
      target: '$4,500,000',
      percent: 88,
      segments: [
        { label: 'Closed Won', amount: '$2,790,000', pct: 62, colorVar: 'var(--color-forest)' },
        { label: 'Committed', amount: '$720,000', pct: 16, colorVar: 'var(--color-moss)' },
        { label: 'Best Case', amount: '$450,000', pct: 10, colorVar: 'var(--color-lime)' },
      ],
    },
  },
}

export type Contact = {
  id: string
  name: string
  email: string
  company: string
  status: string
  value: string
  owner: string
}

export const DEMO_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Elena Rostova',
    email: 'elena@lindenbio.com',
    company: 'Linden Bio',
    status: 'Qualified',
    value: '$64,000',
    owner: 'Sarah J.',
  },
  {
    id: 'c2',
    name: 'Marcus Vance',
    email: 'mvance@kestrellabs.io',
    company: 'Kestrel Labs',
    status: 'Negotiation',
    value: '$128,500',
    owner: 'Clara L.',
  },
  {
    id: 'c3',
    name: 'Hannah Lindqvist',
    email: 'hannah@vervestudio.co',
    company: 'Verve Studio',
    status: 'Closed Won',
    value: '$48,000',
    owner: 'Sarah J.',
  },
  {
    id: 'c4',
    name: 'Devon Brooks',
    email: 'dbrooks@northfield.org',
    company: 'Northfield',
    status: 'Discovery',
    value: '$82,000',
    owner: 'Marcus R.',
  },
  {
    id: 'c5',
    name: 'Sora Takahashi',
    email: 'sora@monolithcloud.com',
    company: 'Monolith',
    status: 'Follow-up',
    value: '$55,400',
    owner: 'Clara L.',
  },
]

export type Deal = {
  id: string
  company: string
  value: string
  owner: string
  stage: number
}

export const PIPELINE_STAGES = ['Discovery', 'Qualified', 'Proposal', 'Closed Won']

export const DEMO_DEALS: Deal[] = [
  { id: 'd1', company: 'Northfield', value: '$82,000', owner: 'Marcus R.', stage: 0 },
  { id: 'd2', company: 'Fernway Co.', value: '$24,500', owner: 'Sarah J.', stage: 0 },
  { id: 'd3', company: 'Linden Bio', value: '$64,000', owner: 'Sarah J.', stage: 1 },
  { id: 'd4', company: 'Monolith', value: '$55,400', owner: 'Clara L.', stage: 1 },
  { id: 'd5', company: 'Kestrel Labs', value: '$128,500', owner: 'Clara L.', stage: 2 },
  { id: 'd6', company: 'Verve Studio', value: '$48,000', owner: 'Sarah J.', stage: 3 },
]

export type GrowthTask = { id: number; text: string; tag: string; done: boolean }

export const DEMO_GROWTH_TASKS: GrowthTask[] = [
  { id: 1, text: 'Executive sponsor alignment confirmed', tag: 'Completed', done: true },
  { id: 2, text: 'Send multi-year renewal terms to Linden Bio', tag: 'Due Today', done: false },
  { id: 3, text: 'Automated onboarding sequence queued', tag: 'Workflow', done: false },
]

export const WORKSPACE_OPTIONS = ['Arbor HQ', 'EMEA Enterprise', 'North America']

export const INITIAL_AUTOMATIONS = [
  {
    id: 'a1',
    name: 'Inbound enterprise routing',
    detail: 'Demo request & company size > 50 → assign AE',
    runs: 148,
    active: true,
  },
  {
    id: 'a2',
    name: 'Stale deal reminder',
    detail: 'No activity for 7 days in Proposal → notify owner',
    runs: 64,
    active: true,
  },
  {
    id: 'a3',
    name: 'Closed-won handoff',
    detail: 'Stage becomes Closed Won → create onboarding tasks',
    runs: 39,
    active: false,
  },
]
