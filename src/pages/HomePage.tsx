import { Link } from 'react-router'
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckSquare,
  Plug,
} from 'lucide-react'
import { IMAGES } from '@/content/site'
import {
  BotanicalBackdrop,
  ButtonLink,
  Container,
  Eyebrow,
  FaqList,
  Reveal,
  SampleBadge,
  SectionHeading,
  type FaqEntry,
} from '@/components/ui'
import {
  AnalyticsIllustration,
  AutomationIllustration,
  BusinessGrowthVisual,
  CollaborationIllustration,
  HeroDashboardPreview,
  PermissionsIllustration,
  WorkflowContactsPreview,
} from '@/components/previews'
import { useTitle } from '@/lib/useTitle'

const COMMITMENTS = [
  {
    title: 'One timeline per relationship',
    body: 'Keep contacts, companies, notes and deals linked without switching tabs.',
    to: '/product#contacts',
  },
  {
    title: 'Routing & follow-ups on autopilot',
    body: 'Trigger assignments and next steps from the moment a lead arrives.',
    to: '/product#automation',
  },
  {
    title: 'Bring or export CSV anytime',
    body: 'Start from your spreadsheet in minutes and keep full ownership of your records.',
    to: '/help/importing-contacts',
  },
]

const FEATURES = [
  {
    title: 'Automate repetitive sales tasks',
    body: 'Route inbound leads, trigger follow-up sequences and keep deal stages current without manual data entry.',
    to: '/product#automation',
    Illustration: AutomationIllustration,
  },
  {
    title: 'Work on accounts together',
    body: 'Sales, solutions and customer success share one account timeline, with @mentions and clear next steps.',
    to: '/product#collaboration',
    Illustration: CollaborationIllustration,
  },
  {
    title: 'See pipeline health in real time',
    body: 'Spot bottlenecks early with live conversion reporting, stage velocity and quota attainment at a glance.',
    to: '/product#analytics',
    Illustration: AnalyticsIllustration,
  },
  {
    title: 'Control who sees what',
    body: 'Role-based permissions keep sensitive deals and contracts visible only to the people who need them.',
    to: '/security',
    Illustration: PermissionsIllustration,
  },
]

const EXPLORE = [
  {
    eyebrow: 'Pricing',
    title: 'What does it cost?',
    body: 'Compare plans, see what each tier includes and switch between monthly and yearly billing.',
    to: '/pricing',
    cta: 'View pricing',
  },
  {
    eyebrow: 'Integrations',
    title: 'Will it fit our stack?',
    body: 'Browse the connection categories for email, calendar, chat, billing and more.',
    to: '/integrations',
    cta: 'Browse integrations',
  },
  {
    eyebrow: 'Demo',
    title: 'Can we see it first?',
    body: 'Book a 30-minute walkthrough tailored to how your team sells today.',
    to: '/demo',
    cta: 'Book a demo',
  },
]

const FAQ: FaqEntry[] = [
  {
    question: 'How do we move our existing customer data into Arbor?',
    answer: (
      <>
        Contacts, companies and deals can be imported from a CSV file, with a mapping step that matches your columns to
        Arbor fields. The{' '}
        <Link to="/help/importing-contacts" className="font-medium text-forest underline underline-offset-2">
          import guide
        </Link>{' '}
        walks through it step by step.
      </>
    ),
  },
  {
    question: 'Which tools does Arbor connect with?',
    answer: (
      <>
        We&apos;re finalizing the launch integrations. The{' '}
        <Link to="/integrations" className="font-medium text-forest underline underline-offset-2">
          integrations page
        </Link>{' '}
        shows the categories we&apos;re building toward. If a specific tool matters to you, mention it when you book a
        demo.
      </>
    ),
  },
  {
    question: 'Is there a free plan or trial?',
    answer: (
      <>
        Plans aren&apos;t final yet. The{' '}
        <Link to="/pricing" className="font-medium text-forest underline underline-offset-2">
          pricing page
        </Link>{' '}
        shows example tiers so you can see how Arbor is likely to be packaged.
      </>
    ),
  },
  {
    question: 'How is customer data protected?',
    answer: (
      <>
        Role-based permissions mean people only see the records they need. Full infrastructure and compliance details will
        be published on the{' '}
        <Link to="/security" className="font-medium text-forest underline underline-offset-2">
          security page
        </Link>{' '}
        once they&apos;ve been verified.
      </>
    ),
  },
  {
    question: 'Can different teams work in separate workspaces?',
    answer:
      'Yes. Arbor is designed so regional teams or business units can each have a workspace, while managers still see combined pipeline reporting across them.',
  },
]

export function HomePage() {
  useTitle()

  return (
    <>
      {/* Hero */}
      <section className="px-3 pt-3 sm:px-5 sm:pt-5">
        <div className="relative mx-auto max-w-[1260px]">
          <BotanicalBackdrop
            src={IMAGES.hero}
            eager
            overlayClassName="bg-gradient-to-b from-night/74 via-[#18341D]/56 to-night/84"
            className="pointer-events-none absolute inset-x-0 bottom-[150px] top-0 rounded-[28px] sm:bottom-[210px] lg:bottom-[250px]"
          />
          <div className="relative z-10 mx-auto max-w-[1180px] px-4 sm:px-8">
            <div className="mx-auto max-w-[760px] pb-12 pt-32 text-center sm:pb-16 sm:pt-40">
              <h1 className="text-balance text-[38px] font-medium leading-[1.07] tracking-[-0.025em] text-white sm:text-[52px] lg:text-[60px]">
                Strengthen customer relationships with a calmer CRM
              </h1>
              <p className="mx-auto mt-5 max-w-[540px] text-pretty text-[15.5px] leading-relaxed text-sage/90 sm:text-[17px]">
                Organize every conversation, automate repetitive follow-ups and give your team clear visibility from first
                touch to renewal.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <ButtonLink to="/signup" variant="light" size="lg" arrow>
                  Get started
                </ButtonLink>
                <ButtonLink to="/demo" variant="glass" size="lg">
                  Book a demo
                </ButtonLink>
              </div>
            </div>

            <div className="mb-3 flex justify-center">
              <SampleBadge light>Interactive preview · sample data</SampleBadge>
            </div>
            <HeroDashboardPreview />
          </div>
        </div>
      </section>

      {/* Editorial commitment strip */}
      <section className="mt-14 border-y border-line bg-paper/80 sm:mt-20">
        <Container className="py-8 sm:py-10">
          <Reveal>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
              {COMMITMENTS.map(({ title, body, to }, idx) => (
                <Link
                  key={title}
                  to={to}
                  className={
                    idx === 0
                      ? 'group block md:pr-8'
                      : idx === 1
                        ? 'group block md:px-8'
                        : 'group block md:pl-8'
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-[15px] font-medium text-ink transition-colors duration-[150ms] ease-[var(--ease-out)] group-hover:text-forest">
                      {title}
                    </h2>
                    <ArrowRight
                      className="h-3.5 w-3.5 shrink-0 text-soft transition-transform duration-[160ms] ease-[var(--ease-out)] hover-fine:group-hover:translate-x-0.5 group-hover:text-forest"
                      aria-hidden
                    />
                  </div>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{body}</p>
                </Link>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Feature grid */}
      <section id="features">
        <Container className="py-20 lg:py-28">
          <Reveal>
            <SectionHeading
              title="Less admin. Clearer pipeline. Better relationships."
              description="Workflows that remove busywork so your team can spend its time on the conversations that matter."
            />
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {FEATURES.map(({ title, body, to, Illustration }, idx) => (
              <Reveal key={title} delay={idx * 70}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-[border-color,box-shadow] duration-[200ms] ease-[var(--ease-out)] hover:border-line-hover hover:shadow-[0_14px_34px_-12px_rgba(23,37,28,0.08)]">
                  <Illustration />
                  <div className="flex flex-1 flex-col p-7 sm:p-8">
                    <h3 className="text-[19px] font-medium tracking-[-0.015em] text-ink">{title}</h3>
                    <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-muted">{body}</p>
                    <Link
                      to={to}
                      className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-forest"
                    >
                      Learn more
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-[160ms] ease-[var(--ease-out)] hover-fine:group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Workflow */}
      <section id="workflow" className="border-y border-line bg-paper">
        <Container className="py-20 lg:py-28">
          <Reveal className="mb-12 grid grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <Eyebrow>Unified workspace</Eyebrow>
              <h2 className="mt-3 text-balance text-[32px] font-medium leading-[1.13] tracking-[-0.025em] text-ink sm:text-[40px]">
                Designed to keep your entire team in sync
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:col-span-7">
              {[
                {
                  icon: BarChart3,
                  title: 'Live reporting',
                  body: 'Follow progression and rep activity without spreadsheet exports.',
                },
                {
                  icon: Plug,
                  title: 'Connected tools',
                  body: 'Log email and calendar touchpoints to one shared timeline.',
                },
                {
                  icon: CheckSquare,
                  title: 'Clear handoffs',
                  body: 'Turn call notes into assigned actions with full account context.',
                },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sage text-forest">
                    <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-[14.5px] font-medium text-ink">{title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <WorkflowContactsPreview />
          </Reveal>
        </Container>
      </section>

      {/* Growth */}
      <section id="growth">
        <Container className="py-20 lg:py-28">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <Eyebrow>Built for growth</Eyebrow>
              <h2 className="mt-3 text-balance text-[32px] font-medium leading-[1.13] tracking-[-0.025em] text-ink sm:text-[40px]">
                Everything you need to grow your business
              </h2>
              <div className="mt-9 divide-y divide-line border-y border-line">
                {[
                  [
                    'Close more deals',
                    'Prioritize high-intent accounts with clear stage visibility, deal scoring and timely follow-up reminders.',
                  ],
                  [
                    'Improve customer relationships',
                    'Keep every email, call summary, stakeholder and renewal milestone together in one shared record.',
                  ],
                  [
                    'Automate your workflow',
                    'Replace repetitive admin with trigger-based lead routing, instant task creation and live record updates.',
                  ],
                ].map(([title, body]) => (
                  <div key={title} className="py-5">
                    <h3 className="text-[16.5px] font-medium text-ink">{title}</h3>
                    <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={100} className="lg:col-span-7">
              <BusinessGrowthVisual />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Explore (warm botanical tonal band) */}
      <section className="border-y border-line bg-sage/45">
        <Container className="py-20 lg:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.35fr] lg:items-start lg:gap-16">
            <Reveal>
              <h2 className="text-balance text-[32px] font-medium leading-[1.13] tracking-[-0.025em] text-ink sm:text-[40px]">
                Answers to the questions teams ask first
              </h2>
              <p className="mt-4 max-w-[400px] text-pretty text-[15.5px] leading-relaxed text-muted">
                Cost, fit with your existing tools and a chance to see it working: each has its own dedicated page.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <div className="divide-y divide-line-strong/60 border-y border-line-strong/60">
                {EXPLORE.map(({ eyebrow, title, body, to, cta }) => (
                  <Link
                    key={title}
                    to={to}
                    className="group flex flex-col justify-between gap-4 py-6 transition-colors duration-[160ms] ease-[var(--ease-out)] sm:flex-row sm:items-center sm:gap-8"
                  >
                    <div className="min-w-0">
                      <span className="text-[11.5px] font-medium uppercase tracking-[0.12em] text-forest">
                        {eyebrow}
                      </span>
                      <h3 className="mt-1 text-[19px] font-medium tracking-[-0.015em] text-ink transition-colors duration-[150ms] ease-[var(--ease-out)] group-hover:text-forest">
                        {title}
                      </h3>
                      <p className="mt-1 max-w-[460px] text-[14px] leading-relaxed text-muted">{body}</p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-line-strong bg-white px-4 py-2 text-[13px] font-medium text-ink transition-[transform,border-color,color] duration-[160ms] ease-[var(--ease-out)] group-hover:border-forest group-hover:text-forest active:scale-[0.97] sm:self-center">
                      {cta}
                      <ArrowUpRight
                        className="h-3.5 w-3.5 transition-transform duration-[160ms] ease-[var(--ease-out)] hover-fine:group-hover:-translate-y-0.5 hover-fine:group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section id="faq">
        <Container className="py-20 lg:py-28">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[340px_1fr] lg:gap-16">
            <Reveal className="lg:sticky lg:top-28 lg:self-start">
              <h2 className="text-balance text-[32px] font-medium leading-[1.13] tracking-[-0.025em] text-ink sm:text-[40px]">
                Frequently asked questions
              </h2>
              <p className="mt-4 text-[14.5px] leading-relaxed text-muted">
                Still have questions?{' '}
                <Link to="/contact" className="font-medium text-forest underline underline-offset-2">
                  Contact us
                </Link>{' '}
                or browse the{' '}
                <Link to="/help" className="font-medium text-forest underline underline-offset-2">
                  help center
                </Link>
                .
              </p>
            </Reveal>
            <Reveal delay={60}>
              <FaqList items={FAQ} />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  )
}
