import { Link } from 'react-router'
import { BadgeCheck, Download, KeyRound, ShieldCheck, Bug, UserCog } from 'lucide-react'
import { IMAGES } from '@/content/site'
import { ButtonLink, Container, PageHero, PlaceholderNotice, Reveal, SectionHeading } from '@/components/ui'
import { useTitle } from '@/lib/useTitle'

const PRACTICES = [
  {
    icon: UserCog,
    title: 'Role-based access',
    body: 'Admins decide who can view, edit or export records. Account executives can be limited to their own deals while managers see the whole team.',
  },
  {
    icon: KeyRound,
    title: 'Account protection',
    body: 'Passwords must meet minimum length and complexity rules. Additional sign-in options will be documented here as they become available.',
  },
  {
    icon: Download,
    title: 'Your data stays yours',
    body: 'Contacts, companies and deals can be exported to CSV at any time, so you’re never locked in.',
  },
  {
    icon: Bug,
    title: 'Reporting a vulnerability',
    body: 'If you believe you’ve found a security issue, please contact us privately before disclosing it publicly.',
  },
]

export function SecurityPage() {
  useTitle('Security')
  return (
    <>
      <PageHero
        image={IMAGES.canopy}
        eyebrow="Security"
        title="How Arbor approaches security"
        description="An overview of how access, accounts and customer data are handled in Arbor."
      />

      <Container className="py-14 lg:py-20">
        <PlaceholderNotice title="Draft security overview." className="mx-auto max-w-[820px]">
          This page describes Arbor&apos;s intended product controls. Infrastructure details such as hosting, encryption
          and backups will be added once verified.
        </PlaceholderNotice>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {PRACTICES.map(({ icon: Icon, title, body }, idx) => (
            <Reveal key={title} delay={idx * 60}>
              <div className="h-full rounded-2xl border border-line bg-white p-7 sm:p-8">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage text-forest">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
                </span>
                <h2 className="mt-6 text-[18px] font-medium text-ink">{title}</h2>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>

      <Container className="pb-20 lg:pb-28">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border border-line bg-paper p-8 sm:p-10">
              <BadgeCheck className="h-6 w-6 text-forest" strokeWidth={1.75} aria-hidden />
              <SectionHeading
                align="left"
                title="Compliance & certifications"
                description="Arbor doesn’t currently list any compliance certifications. We’ll only publish certifications here once an independent audit has been completed."
                className="mt-4 [&_h2]:text-[26px] sm:[&_h2]:text-[30px]"
              />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="h-full rounded-3xl bg-forest p-8 text-white sm:p-10">
              <ShieldCheck className="h-6 w-6 text-lime" strokeWidth={1.75} aria-hidden />
              <h2 className="mt-4 text-[26px] font-medium tracking-[-0.02em] sm:text-[30px]">Security review questions?</h2>
              <p className="mt-3 max-w-[440px] text-[15px] leading-relaxed text-sage/85">
                If you&apos;re evaluating Arbor for your organization, tell us what your review requires and we&apos;ll
                answer as specifically as we can.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink to="/contact?topic=other" variant="light" arrow>
                  Contact us
                </ButtonLink>
                <Link to="/privacy" className="inline-flex items-center px-3 text-[14px] font-medium text-white/85 hover:text-white">
                  Privacy policy
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </>
  )
}
