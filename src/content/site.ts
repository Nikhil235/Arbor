import canopy from '@/assets/canopy.jpg'
import fern from '@/assets/fern.jpg'

export const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=2000&q=80',
  workflowFrame:
    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1800&q=80',
  growthCard:
    'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?auto=format&fit=crop&w=1400&q=80',
  footer: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1800&q=80',
  canopy,
  fern,
}

export type NavItem = {
  label: string
  to: string
  description?: string
  /** Planned page that has not been built yet; rendered as non-interactive. */
  soon?: boolean
}

export type NavGroup = {
  label: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Product',
    items: [
      { label: 'Product overview', to: '/product', description: 'Everything Arbor brings together' },
      { label: 'Contact management', to: '/product#contacts', description: 'One shared record per relationship' },
      { label: 'Sales pipeline', to: '/product#pipeline', description: 'Stages your team can actually see' },
      { label: 'Automation', to: '/product#automation', description: 'Routing and follow-ups on autopilot' },
      { label: 'Analytics', to: '/product#analytics', description: 'Live pipeline and revenue reporting' },
    ],
  },
  {
    label: 'Solutions',
    items: [
      { label: 'Sales teams', to: '/product#sales-teams', description: 'Structure for growing revenue teams' },
      { label: 'Small businesses', to: '/product#small-business', description: 'A CRM that stays out of the way' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { label: 'Help center', to: '/help', description: 'Guides for setting up Arbor' },
      { label: 'Integrations', to: '/integrations', description: 'Connect the tools you use' },
      { label: 'Blog', to: '/blog', soon: true },
      { label: 'Customer stories', to: '/customers', soon: true },
    ],
  },
]

export const FOOTER_COLUMNS: { title: string; links: NavItem[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Overview', to: '/product' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Integrations', to: '/integrations' },
      { label: 'Book a demo', to: '/demo' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Sales teams', to: '/product#sales-teams' },
      { label: 'Small businesses', to: '/product#small-business' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Security', to: '/security' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help center', to: '/help' },
      { label: 'Privacy policy', to: '/privacy' },
      { label: 'Terms of service', to: '/terms' },
    ],
  },
]

export const DEMO_DISCLOSURE =
  'Arbor is a concept product. Interface previews use sample data, and pricing, integrations, company and policy details are placeholders pending confirmation.'
