import { Link } from 'react-router'
import { CalendarClock, ClipboardList, MessagesSquare } from 'lucide-react'
import { Button, Container, Eyebrow, SampleBadge } from '@/components/ui'
import { BackendNotice, ChoiceGroup, ErrorSummary, SelectField, TextAreaField, TextField } from '@/components/form'
import { PipelineBoardPreview } from '@/components/previews'
import { email, required, submitWithoutBackend, useForm } from '@/lib/forms'
import { useTitle } from '@/lib/useTitle'

const LABELS: Record<string, string> = {
  name: 'Full name',
  email: 'Work email',
  company: 'Company',
  teamSize: 'Team size',
  focus: 'Main focus',
}

const STEPS = [
  {
    icon: ClipboardList,
    title: 'We review your request',
    body: 'Someone from our team reads your answers so the walkthrough reflects how you sell today.',
  },
  {
    icon: CalendarClock,
    title: 'You pick a time',
    body: 'We email you a link to choose a 30-minute slot that works for your team.',
  },
  {
    icon: MessagesSquare,
    title: 'A focused walkthrough',
    body: 'We show Arbor using a pipeline like yours, then answer questions about setup and pricing.',
  },
]

export function DemoPage() {
  useTitle('Book a demo')
  const form = useForm(
    { name: '', email: '', company: '', teamSize: '', focus: '', message: '' },
    {
      name: required('Enter your full name.'),
      email,
      company: required('Enter your company name.'),
      teamSize: required('Choose your team size.'),
      focus: required('Choose what you’d like to focus on.'),
    },
  )
  const { values, errors, setValue, blur } = form

  return (
    <Container className="py-12 sm:py-16 lg:py-20">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_520px] lg:gap-16">
        <div>
          <Eyebrow>Book a demo</Eyebrow>
          <h1 className="mt-3 text-balance text-[36px] font-medium leading-[1.08] tracking-[-0.025em] text-ink sm:text-[48px]">
            See Arbor with a pipeline like yours
          </h1>
          <p className="mt-4 max-w-[520px] text-[16px] leading-relaxed text-muted">
            Tell us a little about your team and we&apos;ll tailor a 30-minute walkthrough to the way you work.
          </p>

          <h2 className="mt-12 text-[14px] font-medium text-ink">What happens next</h2>
          <ol className="mt-5 space-y-6">
            {STEPS.map(({ icon: Icon, title, body }, idx) => (
              <li key={title} className="flex gap-4">
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage text-forest">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-forest text-[10.5px] font-medium text-white">
                    {idx + 1}
                  </span>
                </span>
                <div>
                  <h3 className="text-[15px] font-medium text-ink">{title}</h3>
                  <p className="mt-1 max-w-[420px] text-[14px] leading-relaxed text-muted">{body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 hidden lg:block">
            <div className="mb-3">
              <SampleBadge>Preview · sample data</SampleBadge>
            </div>
            <PipelineBoardPreview />
          </div>
        </div>

        <div className="lg:pt-2">
          <form
            noValidate
            onSubmit={form.handleSubmit(() => form.setStatus(submitWithoutBackend()))}
            className="space-y-5 rounded-3xl border border-line bg-white p-6 shadow-[0_24px_60px_-30px_rgba(18,36,21,0.25)] sm:p-8 lg:sticky lg:top-28"
          >
            <div>
              <h2 className="text-[20px] font-medium tracking-[-0.015em] text-ink">Request your demo</h2>
              <p className="mt-1 text-[13.5px] text-muted">Takes about a minute. All fields are required unless marked.</p>
            </div>

            {form.status === 'invalid' && (
              <ErrorSummary errors={errors} labels={LABELS} summaryRef={form.summaryRef} />
            )}

            <TextField
              name="name"
              label="Full name"
              autoComplete="name"
              maxLength={120}
              value={values.name}
              onChange={(e) => setValue('name', e.target.value)}
              onBlur={() => blur('name')}
              error={errors.name}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                name="email"
                type="email"
                label="Work email"
                autoComplete="email"
                placeholder="you@company.com"
                maxLength={254}
                value={values.email}
                onChange={(e) => setValue('email', e.target.value)}
                onBlur={() => blur('email')}
                error={errors.email}
              />
              <TextField
                name="company"
                label="Company"
                autoComplete="organization"
                maxLength={120}
                value={values.company}
                onChange={(e) => setValue('company', e.target.value)}
                onBlur={() => blur('company')}
                error={errors.company}
              />
            </div>
            <ChoiceGroup
              name="teamSize"
              label="Team size"
              options={['1–10', '11–50', '51–200', '200+']}
              value={values.teamSize}
              onChange={(v) => setValue('teamSize', v)}
              error={errors.teamSize}
            />
            <SelectField
              name="focus"
              label="Main focus"
              placeholder="Choose one"
              options={[
                { value: 'pipeline', label: 'Pipeline visibility' },
                { value: 'automation', label: 'Automating follow-ups' },
                { value: 'reporting', label: 'Reporting & forecasting' },
                { value: 'migration', label: 'Moving from another CRM' },
                { value: 'other', label: 'Something else' },
              ]}
              value={values.focus}
              onChange={(e) => setValue('focus', e.target.value)}
              onBlur={() => blur('focus')}
              error={errors.focus}
            />
            <TextAreaField
              name="message"
              label="Anything we should know?"
              optional
              rows={3}
              maxLength={2000}
              value={values.message}
              onChange={(e) => setValue('message', e.target.value)}
            />

            {form.status === 'not-configured' && (
              <BackendNotice action="Demo booking" dependency="a form-handling backend" />
            )}

            <Button type="submit" size="lg" className="w-full">
              Request demo
            </Button>
            <p className="text-center text-[12.5px] text-muted">
              We&apos;ll only use your details to arrange your demo. See our{' '}
              <Link to="/privacy" className="underline underline-offset-2 hover:text-ink">
                privacy policy
              </Link>
              .
            </p>
          </form>
        </div>
      </div>
    </Container>
  )
}
