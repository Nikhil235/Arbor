import type { LucideIcon } from 'lucide-react'
import {
  CalendarDays,
  Code2,
  CreditCard,
  FileSignature,
  FileSpreadsheet,
  Headphones,
  Inbox,
  ListChecks,
  MessageSquare,
  Video,
  Webhook,
  FormInput,
} from 'lucide-react'

/**
 * Integration categories Arbor is planning to support. No specific vendor is
 * listed as supported until the integration has actually shipped.
 */
export type Integration = {
  id: string
  name: string
  category: string
  description: string
  icon: LucideIcon
}

export const INTEGRATION_CATEGORIES = ['All', 'Communication', 'Productivity', 'Revenue', 'Data & developer'] as const

export const INTEGRATIONS: Integration[] = [
  {
    id: 'email',
    name: 'Email inbox sync',
    category: 'Communication',
    description: 'Log sent and received emails to the matching contact and deal timeline automatically.',
    icon: Inbox,
  },
  {
    id: 'calendar',
    name: 'Calendar sync',
    category: 'Communication',
    description: 'Attach meetings to accounts and create follow-up tasks when a meeting ends.',
    icon: CalendarDays,
  },
  {
    id: 'chat',
    name: 'Team chat notifications',
    category: 'Communication',
    description: 'Post deal updates and won-deal alerts to the channels your team already watches.',
    icon: MessageSquare,
  },
  {
    id: 'video',
    name: 'Video meetings',
    category: 'Communication',
    description: 'Add meeting links to scheduled calls and save call notes back to the record.',
    icon: Video,
  },
  {
    id: 'tasks',
    name: 'Project & task tools',
    category: 'Productivity',
    description: 'Hand closed deals over to delivery teams by creating projects from a won opportunity.',
    icon: ListChecks,
  },
  {
    id: 'spreadsheets',
    name: 'Spreadsheet sync',
    category: 'Productivity',
    description: 'Keep a live spreadsheet of pipeline data for ad-hoc analysis and sharing.',
    icon: FileSpreadsheet,
  },
  {
    id: 'forms',
    name: 'Forms & lead capture',
    category: 'Productivity',
    description: 'Turn website form submissions into new contacts and route them to the right owner.',
    icon: FormInput,
  },
  {
    id: 'billing',
    name: 'Billing & payments',
    category: 'Revenue',
    description: 'Show invoices, subscription status and payment history alongside each account.',
    icon: CreditCard,
  },
  {
    id: 'esign',
    name: 'E-signature',
    category: 'Revenue',
    description: 'Send contracts for signature and move the deal forward when they come back signed.',
    icon: FileSignature,
  },
  {
    id: 'helpdesk',
    name: 'Help desk',
    category: 'Revenue',
    description: 'Surface open support tickets on account records so renewals have full context.',
    icon: Headphones,
  },
  {
    id: 'webhooks',
    name: 'Webhooks',
    category: 'Data & developer',
    description: 'Notify your own systems when records are created, updated or change stage.',
    icon: Webhook,
  },
  {
    id: 'api',
    name: 'REST API',
    category: 'Data & developer',
    description: 'Read and write contacts, companies and deals from your own tools and scripts.',
    icon: Code2,
  },
]
