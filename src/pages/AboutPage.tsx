import { Eye, Leaf, Layers, Users } from 'lucide-react'
import { IMAGES } from '@/content/site'
import { BotanicalBackdrop, ButtonLink, Container, Eyebrow, PageHero, PlaceholderNotice, Reveal, SectionHeading } from '@/components/ui'
import { useTitle } from '@/lib/useTitle'

const PRINCIPLES = [
  {
    icon: Leaf,
    title: 'Calm by default',
    body: 'Software that sales teams live in all day should feel quiet. We remove noise before we add features.',
  },
  {
    icon: Layers,
    title: 'Context over clicks',
    body: 'The right history should already be on the record. Nobody should have to hunt through tabs to prepare for a call.',
  },
  {
    icon: Eye,
    title: 'Honest by design',
    body: 'Clear pricing, clear data ownership and no claims we can’t back up — on this website or in the product.',
  },
]

export function AboutPage() {
  useTitle('About')
  return (
    <>
      <PageHero
        image={IMAGES.growthCard}
        eyebrow="About Arbor"
        title="We’re building the CRM we wanted to use"
        description="Customer relationships grow slowly and need steady attention. Arbor is designed to make that attention easier to give."
      />

      <Container className="py-20 lg:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <Eyebrow>The problem</Eyebrow>
            <h2 className="mt-3 text-balance text-[30px] font-medium leading-[1.15] tracking-[-0.02em] text-ink sm:text-[38px]">
              Most CRMs turn relationship work into data entry
            </h2>
          </Reveal>
          <Reveal delay={80} className="space-y-5 text-[16px] leading-relaxed text-muted lg:col-span-7">
            <p>
              Sales tools tend to grow by adding fields, tabs and dashboards until the people using them spend more time
              updating records than talking to customers. Context gets scattered across inboxes, spreadsheets and chat
              threads, and handoffs drop details that matter.
            </p>
            <p>
              Arbor takes the opposite approach: one shared timeline per relationship, automation for the repetitive
              steps, and reporting that updates itself. The goal is a workspace your team actually wants to open in the
              morning.
            </p>
            <PlaceholderNotice title="Company story placeholder.">
              Founding details, timeline and location will be added once confirmed.
            </PlaceholderNotice>
          </Reveal>
        </div>
      </Container>

      <section className="px-3 sm:px-5">
        <BotanicalBackdrop
          src={IMAGES.fern}
          overlayClassName="bg-gradient-to-r from-night/95 via-night/80 to-night/40"
          className="mx-auto max-w-[1260px] rounded-[28px]"
        >
          <div className="relative z-10 mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-28">
            <Eyebrow light>Our mission</Eyebrow>
            <p className="mt-4 max-w-[760px] text-balance text-[28px] font-medium leading-[1.25] tracking-[-0.02em] text-white sm:text-[40px]">
              Help every team give each customer relationship the steady care it needs to grow.
            </p>
          </div>
        </BotanicalBackdrop>
      </section>

      <Container className="py-20 lg:py-28">
        <Reveal>
          <SectionHeading eyebrow="Principles" title="How we make decisions" />
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PRINCIPLES.map(({ icon: Icon, title, body }, idx) => (
            <Reveal key={title} delay={idx * 80}>
              <div className="h-full rounded-2xl border border-line bg-white p-7">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage text-forest">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className="mt-6 text-[18px] font-medium text-ink">{title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>

      <Container className="pb-20 lg:pb-28">
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-10 rounded-3xl border border-line bg-paper p-8 sm:p-12 lg:grid-cols-2">
            <div>
              <Eyebrow>Team</Eyebrow>
              <h2 className="mt-3 text-[28px] font-medium tracking-[-0.02em] text-ink sm:text-[34px]">The people behind Arbor</h2>
              <p className="mt-3 max-w-[440px] text-[15px] leading-relaxed text-muted">
                Team profiles will appear here once they&apos;re ready to publish. In the meantime, the best way to meet us
                is a product walkthrough.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink to="/demo" arrow>
                  Book a demo
                </ButtonLink>
                <ButtonLink to="/contact" variant="secondary">
                  Contact us
                </ButtonLink>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3" aria-hidden>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex aspect-square flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-white"
                >
                  <Users className="h-5 w-5 text-line-strong" />
                  <span className="mt-2 h-1.5 w-10 rounded-full bg-mist" />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </>
  )
}
