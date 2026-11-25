import { useSearchParams } from 'react-router'
import { CheckCircle2 } from 'lucide-react'
import { ButtonLink, Container, PlaceholderNotice } from '@/components/ui'
import { useTitle } from '@/lib/useTitle'

const COPY: Record<string, { title: string; body: string }> = {
  demo: {
    title: 'Thanks for requesting a demo',
    body: 'We’ll review your details and email you a link to choose a time that suits your team.',
  },
  contact: {
    title: 'Thanks for getting in touch',
    body: 'Your message is with our team. We’ll reply to the email address you provided.',
  },
}

export function ThankYouPage() {
  useTitle('Thank you')
  const [params] = useSearchParams()
  const copy = COPY[params.get('form') ?? ''] ?? {
    title: 'Thank you',
    body: 'We’ve got what we need and will be in touch soon.',
  }

  return (
    <Container className="py-20 sm:py-28">
      <div className="mx-auto max-w-[560px] text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage text-forest">
          <CheckCircle2 className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="mt-6 text-balance text-[34px] font-medium leading-[1.12] tracking-[-0.025em] text-ink sm:text-[42px]">
          {copy.title}
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-muted">{copy.body}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink to="/" arrow>
            Back to home
          </ButtonLink>
          <ButtonLink to="/help" variant="secondary">
            Browse the help center
          </ButtonLink>
        </div>
        <PlaceholderNotice title="Confirmation template." className="mt-12 text-left">
          This page is shown after a successful submission once form handling is connected. Forms on this site don&apos;t
          send data yet.
        </PlaceholderNotice>
      </div>
    </Container>
  )
}
