import { Link } from 'react-router'
import { ButtonLink, Container } from '@/components/ui'
import { useTitle } from '@/lib/useTitle'

const SUGGESTIONS = [
  { label: 'Product overview', to: '/product' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Help center', to: '/help' },
  { label: 'Contact us', to: '/contact' },
]

export function NotFoundPage() {
  useTitle('Page not found')
  return (
    <Container className="py-20 sm:py-28">
      <div className="mx-auto max-w-[560px] text-center">
        <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-moss">Error 404</p>
        <h1 className="mt-4 text-balance text-[38px] font-medium leading-[1.08] tracking-[-0.025em] text-ink sm:text-[52px]">
          This path has grown over
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Try one of these instead.
        </p>
        <ul className="mt-8 flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <li key={s.to}>
              <Link
                to={s.to}
                className="inline-block rounded-full border border-line bg-white px-4 py-2 text-[13.5px] text-ink-secondary transition-[transform,border-color,color] duration-[160ms] ease-[var(--ease-out)] hover:border-forest/30 hover:text-forest active:scale-[0.97]"
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
        <ButtonLink to="/" className="mt-10" arrow>
          Back to home
        </ButtonLink>
      </div>
    </Container>
  )
}
