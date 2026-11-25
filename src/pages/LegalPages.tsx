import { Link } from 'react-router'
import { Container, LightPageHeader, PlaceholderNotice } from '@/components/ui'
import { useTitle } from '@/lib/useTitle'

type LegalSection = { id: string; title: string; covers: string }

function LegalDocument({ title, intro, sections }: { title: string; intro: string; sections: LegalSection[] }) {
  useTitle(title)
  return (
    <>
      <LightPageHeader eyebrow="Legal" title={title} description={intro}>
        <p className="mt-4 text-[13px] text-soft">Last updated: not yet published</p>
      </LightPageHeader>
      <Container className="pb-20 lg:pb-28">
        <PlaceholderNotice title="This is not a legal document." className="mb-12 max-w-[820px]">
          It&apos;s a placeholder outline showing the structure this page will follow. The final wording must be written
          or reviewed by qualified legal counsel and reflect how Arbor actually operates.
        </PlaceholderNotice>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr] lg:gap-16">
          <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[11.5px] font-medium uppercase tracking-[0.12em] text-soft">On this page</p>
            <ol className="mt-4 space-y-2 border-l border-line">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="-ml-px block border-l border-transparent pl-4 text-[13.5px] text-muted hover:border-forest hover:text-ink">
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <article className="max-w-[720px] space-y-12">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <h2 className="text-[22px] font-medium tracking-[-0.015em] text-ink">
                  {i + 1}. {s.title}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  <span className="font-medium text-ink">To be drafted.</span> This section will cover {s.covers}
                </p>
              </section>
            ))}
            <p className="border-t border-line pt-8 text-[14.5px] text-muted">
              Questions about this policy?{' '}
              <Link to="/contact" className="font-medium text-forest underline underline-offset-2">
                Contact us
              </Link>
              .
            </p>
          </article>
        </div>
      </Container>
    </>
  )
}

export function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy policy"
      intro="How Arbor collects, uses and protects personal information."
      sections={[
        { id: 'scope', title: 'Who this policy applies to', covers: 'website visitors, people who request demos, and customers using the Arbor product.' },
        { id: 'collection', title: 'Information we collect', covers: 'the categories of personal data collected through forms, accounts and product usage.' },
        { id: 'use', title: 'How we use information', covers: 'the purposes for processing data and the legal bases relied on.' },
        { id: 'sharing', title: 'Sharing and service providers', covers: 'which third parties may process data on Arbor’s behalf and why.' },
        { id: 'retention', title: 'Data retention', covers: 'how long each type of data is kept and how it is deleted.' },
        { id: 'rights', title: 'Your rights', covers: 'how to access, correct, export or delete your personal data.' },
        { id: 'cookies', title: 'Cookies', covers: 'any cookies or similar technologies used on this website.' },
        { id: 'changes', title: 'Changes to this policy', covers: 'how updates to this policy will be communicated.' },
      ]}
    />
  )
}

export function TermsPage() {
  return (
    <LegalDocument
      title="Terms of service"
      intro="The agreement between Arbor and the people and organizations that use it."
      sections={[
        { id: 'acceptance', title: 'Accepting these terms', covers: 'when these terms apply and who is bound by them.' },
        { id: 'accounts', title: 'Accounts and workspaces', covers: 'account registration, workspace ownership and administrator responsibilities.' },
        { id: 'acceptable-use', title: 'Acceptable use', covers: 'what users may and may not do with the service.' },
        { id: 'customer-data', title: 'Customer data', covers: 'ownership of data entered into Arbor and how it may be exported.' },
        { id: 'billing', title: 'Plans, billing and cancellation', covers: 'subscription terms, payment, renewals and cancellations.' },
        { id: 'availability', title: 'Service availability', covers: 'any commitments about availability, maintenance and support.' },
        { id: 'liability', title: 'Limitation of liability', covers: 'the limits on each party’s liability.' },
        { id: 'termination', title: 'Termination', covers: 'how either party may end the agreement and what happens to data afterwards.' },
      ]}
    />
  )
}
