import { useEffect, useState, type ComponentType } from 'react'
import { Check, Rocket, Store } from 'lucide-react'
import { IMAGES } from '@/content/site'
import { ButtonLink, Container, Eyebrow, PageHero, Reveal, SampleBadge, SectionHeading, cx } from '@/components/ui'
import {
  AnalyticsIllustration,
  AutomationIllustration,
  CollaborationIllustration,
  HeroDashboardPreview,
  PipelineBoardPreview,
  WorkflowContactsPreview,
} from '@/components/previews'
import { useTitle } from '@/lib/useTitle'

type Section = {
  id: string
  label: string
  title: string
  body: string
  points: string[]
  Preview: ComponentType
  /** Illustrations carry their own padded frame; full-width previews do not. */
  framed?: boolean
}

const SECTIONS: Section[] = [
  {
    id: 'contacts',
    label: 'Contact management',
    title: 'One shared record for every relationship',
    body: 'Every person and company gets a single timeline, so anyone picking up an account can see what happened and what comes next.',
    points: ['Contacts linked to companies and deals', 'Filter and bulk-select records', 'Ownership and stage on every row'],
    Preview: WorkflowContactsPreview,
  },
  {
    id: 'pipeline',
    label: 'Sales pipeline',
    title: 'Stages your whole team can actually see',
    body: 'Lay out your sales process as a board, move deals forward in a click and spot stalled opportunities before they go cold.',
    points: ['Custom stages for each pipeline', 'Deal value and owner at a glance', 'Multiple pipelines per workspace'],
    Preview: PipelineBoardPreview,
  },
  {
    id: 'automation',
    label: 'Automation',
    title: 'Routing and follow-ups that run themselves',
    body: 'Build simple trigger, condition and action rules that assign leads, create tasks and start sequences without anyone lifting a finger.',
    points: ['Visual trigger → condition → action builder', 'Automatic lead assignment', 'Task creation from deal changes'],
    Preview: AutomationIllustration,
    framed: true,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    title: 'Live reporting without spreadsheet exports',
    body: 'Pipeline value, win rate, sales cycle length and quota progress update as your team works, so forecasts stay grounded in reality.',
    points: ['Pipeline velocity and conversion trends', 'Quota and target tracking', 'Switch between time ranges instantly'],
    Preview: AnalyticsIllustration,
    framed: true,
  },
  {
    id: 'collaboration',
    label: 'Collaboration',
    title: 'Work on accounts together, not in parallel',
    body: 'Assign owners, mention teammates and keep a shared checklist of next steps on every deal so handoffs never drop the ball.',
    points: ['Assignments and @mentions', 'Shared next-step checklists', 'Activity history on each record'],
    Preview: CollaborationIllustration,
    framed: true,
  },
]

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])
  return active
}

const SECTION_IDS = SECTIONS.map((s) => s.id)

export function ProductPage() {
  useTitle('Product')
  const active = useActiveSection(SECTION_IDS)

  return (
    <>
      <PageHero
        image={IMAGES.canopy}
        eyebrow="Product overview"
        title="Everything your team needs to manage customer relationships"
        description="Contacts, pipeline, automation, reporting and collaboration in one calm, connected workspace."
        overlap
      >
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink to="/signup" variant="light" size="lg" arrow>
            Get started
          </ButtonLink>
          <ButtonLink to="/demo" variant="glass" size="lg">
            Book a demo
          </ButtonLink>
        </div>
      </PageHero>

      <Container className="-mt-28 sm:-mt-36 relative z-10">
        <div className="mb-3 flex justify-center">
          <SampleBadge>Interactive preview · sample data</SampleBadge>
        </div>
        <HeroDashboardPreview />
      </Container>

      <Container className="py-20 lg:py-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
          <nav aria-label="Product sections" className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>Explore the product</Eyebrow>
            <ul className="no-scrollbar mt-4 flex gap-2 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-visible">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={active === s.id ? 'true' : undefined}
                    className={cx(
                      'block whitespace-nowrap rounded-full border px-3.5 py-2 text-[13.5px] transition-colors duration-[150ms] ease-[var(--ease-out)] lg:rounded-xl lg:border-0 lg:border-l-2 lg:rounded-l-none',
                      active === s.id
                        ? 'border-forest bg-sage/60 font-medium text-forest lg:bg-transparent'
                        : 'border-line bg-white text-muted hover:text-ink lg:border-line lg:bg-transparent',
                    )}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-24 lg:space-y-32">
            {SECTIONS.map(({ id, label, title, body, points, Preview, framed }) => (
              <section key={id} id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28">
                <Reveal>
                  <Eyebrow>{label}</Eyebrow>
                  <h2
                    id={`${id}-title`}
                    className="mt-3 max-w-[560px] text-balance text-[28px] font-medium leading-[1.15] tracking-[-0.02em] text-ink sm:text-[34px]"
                  >
                    {title}
                  </h2>
                  <p className="mt-4 max-w-[600px] text-[15.5px] leading-relaxed text-muted">{body}</p>
                  <ul className="mt-6 grid gap-2.5 sm:grid-cols-3">
                    {points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-[13.5px] text-ink-secondary">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" aria-hidden />
                        {p}
                      </li>
                    ))}
                  </ul>
                </Reveal>
                <Reveal delay={80} className="mt-8">
                  {framed ? (
                    <div className="overflow-hidden rounded-2xl border border-line bg-white [&>div]:border-b-0">
                      <Preview />
                    </div>
                  ) : (
                    <Preview />
                  )}
                </Reveal>
              </section>
            ))}
          </div>
        </div>
      </Container>

      {/* Solutions */}
      <section className="border-t border-line bg-paper">
        <Container className="py-20 lg:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Solutions"
              title="Built for the way your team works"
              description="Arbor scales from a founder tracking a handful of deals to a sales org running multiple pipelines."
            />
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              {
                id: 'sales-teams',
                icon: Rocket,
                title: 'For sales teams',
                body: 'Give managers a live view of every rep’s pipeline and give reps fewer fields to update.',
                points: [
                  'Team pipelines with shared stage definitions',
                  'Automatic lead routing by territory or size',
                  'Quota tracking and forecast roll-ups',
                  'Roles that keep sensitive deals private',
                ],
              },
              {
                id: 'small-business',
                icon: Store,
                title: 'For small businesses',
                body: 'A CRM you can set up in an afternoon, without an administrator or a lengthy onboarding project.',
                points: [
                  'Import contacts from a spreadsheet',
                  'Ready-made pipeline you can rename',
                  'Follow-up reminders so nothing slips',
                  'Simple reports on what’s closing',
                ],
              },
            ].map(({ id, icon: Icon, title, body, points }, idx) => (
              <Reveal key={id} delay={idx * 80}>
                <article id={id} className="h-full scroll-mt-28 rounded-2xl border border-line bg-white p-7 sm:p-9">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage text-forest">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="mt-6 text-[22px] font-medium tracking-[-0.015em] text-ink">{title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{body}</p>
                  <ul className="mt-6 space-y-2.5 border-t border-line pt-6">
                    {points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-[14px] text-ink-secondary">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" aria-hidden />
                        {p}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
