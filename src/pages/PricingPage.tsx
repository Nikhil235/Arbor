import { useState } from 'react'
import { Link } from 'react-router'
import { Check, Minus } from 'lucide-react'
import { IMAGES } from '@/content/site'
import { COMPARISON, PLANS, type ComparisonValue } from '@/content/pricing'
import { ButtonLink, Container, FaqList, PageHero, PlaceholderNotice, Reveal, SectionHeading, cx, type FaqEntry } from '@/components/ui'
import { useTitle } from '@/lib/useTitle'

type Billing = 'monthly' | 'yearly'

const BILLING_FAQ: FaqEntry[] = [
  {
    question: 'Can we change plans later?',
    answer: 'Yes. The intention is that you can move between plans at any time, with changes reflected on your next bill.',
  },
  {
    question: 'How are seats counted?',
    answer: 'A seat is anyone on your team who signs in to Arbor. Read-only access and billing terms will be confirmed before launch.',
  },
  {
    question: 'Is yearly billing cheaper?',
    answer: 'In the example pricing shown here, paying yearly lowers the per-seat price. Final discounts will be confirmed at launch.',
  },
  {
    question: 'Which payment methods will be accepted?',
    answer: (
      <>
        Payment options haven&apos;t been finalized yet. If you have specific procurement requirements,{' '}
        <Link to="/contact" className="font-medium text-forest underline underline-offset-2">
          contact our team
        </Link>
        .
      </>
    ),
  },
]

function Cell({ value }: { value: ComparisonValue }) {
  if (value === true) return <Check className="mx-auto h-4 w-4 text-forest" aria-label="Included" />
  if (value === false) return <Minus className="mx-auto h-4 w-4 text-line-strong" aria-label="Not included" />
  return <span className="text-[13.5px] text-ink">{value}</span>
}

export function PricingPage() {
  useTitle('Pricing')
  const [billing, setBilling] = useState<Billing>('yearly')

  return (
    <>
      <PageHero
        image={IMAGES.canopy}
        eyebrow="Pricing"
        title="Simple plans that grow with your team"
        description="Start small, add automation and reporting as you grow, and talk to us when you need more control."
        overlap
      >
        <div
          role="radiogroup"
          aria-label="Billing period"
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
              e.preventDefault()
              setBilling((prev) => (prev === 'monthly' ? 'yearly' : 'monthly'))
            }
          }}
          className="glass-surface-dark mx-auto mt-8 inline-flex items-center rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-md"
        >
          {(['monthly', 'yearly'] as Billing[]).map((b) => (
            <button
              key={b}
              type="button"
              role="radio"
              aria-checked={billing === b}
              tabIndex={billing === b ? 0 : -1}
              onClick={() => setBilling(b)}
              className={cx(
                'rounded-full px-4 py-2 text-[13.5px] font-medium transition-[transform,background-color,color] duration-[160ms] ease-[var(--ease-out)] active:scale-[0.97]',
                billing === b ? 'bg-white text-ink shadow-xs' : 'text-white/85 hover:text-white',
              )}
            >
              {b === 'monthly' ? 'Monthly' : 'Yearly'}
              {b === 'yearly' && (
                <span
                  className={cx(
                    'ml-2 inline-block shrink-0 whitespace-nowrap rounded-full px-1.5 py-0.5 text-[10.5px]',
                    billing === b ? 'bg-sage text-forest' : 'bg-lime/25 text-lime',
                  )}
                >
                  Save 17%
                </span>
              )}
            </button>
          ))}
        </div>
      </PageHero>

      <Container className="relative z-10 -mt-24 sm:-mt-32">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {PLANS.map((plan, idx) => {
            const price = billing === 'monthly' ? plan.monthly : plan.yearly
            return (
              <Reveal key={plan.id} delay={idx * 70}>
                <article
                  className={cx(
                    'flex h-full flex-col rounded-3xl border p-7 sm:p-8',
                    plan.highlight
                      ? 'border-forest bg-forest text-white shadow-[0_24px_60px_-20px_rgba(18,36,21,0.45)]'
                      : 'border-line bg-white shadow-[0_18px_40px_-24px_rgba(18,36,21,0.2)]',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-[18px] font-medium">{plan.name}</h2>
                    {plan.highlight && (
                      <span className="shrink-0 whitespace-nowrap rounded-full bg-lime px-2.5 py-0.5 text-[11px] font-medium text-ink">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className={cx('mt-2 text-[14px] leading-relaxed', plan.highlight ? 'text-sage/85' : 'text-muted')}>
                    {plan.tagline}
                  </p>
                  <div className="mt-7 flex items-baseline gap-2 tabular-nums">
                    <span className="text-[44px] font-medium leading-none tracking-[-0.03em]">
                      {price === null ? 'Custom' : `$${price}`}
                    </span>
                    <span className={cx('text-[13px]', plan.highlight ? 'text-sage/75' : 'text-muted')}>{plan.unit}</span>
                  </div>
                  <p className={cx('mt-2 h-5 text-[12.5px] tabular-nums', plan.highlight ? 'text-sage/70' : 'text-soft')}>
                    {price ? (billing === 'yearly' ? `Billed yearly · $${price * 12} per seat` : 'Billed monthly') : ''}
                  </p>
                  <ButtonLink
                    to={plan.cta.to}
                    variant={plan.highlight ? 'light' : 'secondary'}
                    className="mt-6 w-full"
                    arrow
                  >
                    {plan.cta.label}
                  </ButtonLink>
                  <ul className={cx('mt-8 space-y-3 border-t pt-7', plan.highlight ? 'border-white/15' : 'border-line')}>
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[14px]">
                        <Check className={cx('mt-0.5 h-4 w-4 shrink-0', plan.highlight ? 'text-lime' : 'text-forest')} aria-hidden />
                        <span className={plan.highlight ? 'text-white/90' : 'text-ink-secondary'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            )
          })}
        </div>

        <PlaceholderNotice title="Example pricing." className="mx-auto mt-8 max-w-[720px]">
          Plans, prices and included features are illustrative and haven&apos;t been finalized. They&apos;ll be confirmed
          before launch.
        </PlaceholderNotice>
      </Container>

      {/* Comparison */}
      <Container className="py-20 lg:py-28">
        <Reveal>
          <SectionHeading eyebrow="Compare plans" title="What’s included in each plan" />
        </Reveal>
        <Reveal className="mt-12">
          <div className="overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <caption className="sr-only">Feature comparison across plans</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="w-[40%] px-6 py-5 text-[13px] font-medium text-muted">
                    Feature
                  </th>
                  {PLANS.map((p) => (
                    <th key={p.id} scope="col" className="px-4 py-5 text-center">
                      <span className="block text-[15px] font-medium text-ink">{p.name}</span>
                      <Link to={p.cta.to} className="mt-1 inline-block text-[12.5px] font-medium text-forest hover:underline">
                        {p.cta.label}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              {COMPARISON.map((group) => (
                <tbody key={group.group}>
                  <tr className="bg-paper">
                    <th colSpan={4} scope="colgroup" className="px-6 py-3 text-[11.5px] font-medium uppercase tracking-[0.1em] text-muted">
                      {group.group}
                    </th>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row.label} className="border-t border-line">
                      <th scope="row" className="px-6 py-4 text-[14px] font-normal text-ink-secondary">
                        {row.label}
                      </th>
                      {row.values.map((v, i) => (
                        <td key={i} className="px-4 py-4 text-center">
                          <Cell value={v} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </Reveal>
      </Container>

      <section className="mx-auto max-w-[820px] px-5 pb-20 sm:px-8 lg:pb-28">
        <Reveal className="mb-12">
          <SectionHeading eyebrow="Billing" title="Billing questions" />
        </Reveal>
        <FaqList items={BILLING_FAQ} />
      </section>
    </>
  )
}
