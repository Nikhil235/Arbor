import { Link, useSearchParams } from 'react-router'
import { ArrowRight, BookOpen, Briefcase, LifeBuoy } from 'lucide-react'
import { Button, Container, LightPageHeader, PlaceholderNotice } from '@/components/ui'
import { BackendNotice, ErrorSummary, SelectField, TextAreaField, TextField } from '@/components/form'
import { all, email, minLength, required, submitWithoutBackend, useForm } from '@/lib/forms'
import { useTitle } from '@/lib/useTitle'

const TOPICS = [
  { value: 'sales', label: 'Sales & pricing' },
  { value: 'support', label: 'Product support' },
  { value: 'integration', label: 'Integration request' },
  { value: 'partnership', label: 'Partnerships' },
  { value: 'other', label: 'Something else' },
]

const LABELS: Record<string, string> = { name: 'Name', email: 'Email', topic: 'Topic', message: 'Message' }

export function ContactPage() {
  useTitle('Contact')
  const [params] = useSearchParams()
  const initialTopic = TOPICS.some((t) => t.value === params.get('topic')) ? params.get('topic')! : ''

  const form = useForm(
    { name: '', email: '', company: '', topic: initialTopic, message: '' },
    {
      name: required('Enter your name.'),
      email,
      topic: required('Choose a topic.'),
      message: all(required('Enter a message.'), minLength(20, 'Your message')),
    },
  )
  const { values, errors, setValue, blur } = form

  return (
    <>
      <LightPageHeader
        eyebrow="Contact"
        title="Talk to the Arbor team"
        description="Questions about plans, setup or a specific integration? Choose the best route below or send us a message."
      />

      <Container className="pb-20 lg:pb-28">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            {
              icon: Briefcase,
              title: 'Sales',
              body: 'See Arbor in action and get answers about plans for your team.',
              to: '/demo',
              cta: 'Book a demo',
            },
            {
              icon: LifeBuoy,
              title: 'Support',
              body: 'Already using Arbor? Start with our guides, then message us if you’re stuck.',
              to: '/help',
              cta: 'Visit help center',
            },
            {
              icon: BookOpen,
              title: 'Security',
              body: 'Reviewing Arbor for your organization? Start with our security overview.',
              to: '/security',
              cta: 'Read security overview',
            },
          ].map(({ icon: Icon, title, body, to, cta }) => (
            <Link
              key={title}
              to={to}
              className="group flex flex-col rounded-2xl border border-line bg-white p-6 transition-colors duration-[160ms] ease-[var(--ease-out)] hover:border-line-hover"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage text-forest">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
              </span>
              <h2 className="mt-5 text-[17px] font-medium text-ink">{title}</h2>
              <p className="mt-1.5 flex-1 text-[14px] leading-relaxed text-muted">{body}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-forest">
                {cta}
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-[160ms] ease-[var(--ease-out)] hover-fine:group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
          <form
            noValidate
            onSubmit={form.handleSubmit(() => form.setStatus(submitWithoutBackend()))}
            className="space-y-5 rounded-3xl border border-line bg-white p-6 sm:p-8"
          >
            <div>
              <h2 className="text-[20px] font-medium tracking-[-0.015em] text-ink">Send a message</h2>
              <p className="mt-1 text-[13.5px] text-muted">All fields are required unless marked.</p>
            </div>

            {form.status === 'invalid' && <ErrorSummary errors={errors} labels={LABELS} summaryRef={form.summaryRef} />}

            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                name="name"
                label="Name"
                autoComplete="name"
                maxLength={120}
                value={values.name}
                onChange={(e) => setValue('name', e.target.value)}
                onBlur={() => blur('name')}
                error={errors.name}
              />
              <TextField
                name="email"
                type="email"
                label="Email"
                autoComplete="email"
                maxLength={254}
                value={values.email}
                onChange={(e) => setValue('email', e.target.value)}
                onBlur={() => blur('email')}
                error={errors.email}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                name="company"
                label="Company"
                optional
                autoComplete="organization"
                maxLength={120}
                value={values.company}
                onChange={(e) => setValue('company', e.target.value)}
              />
              <SelectField
                name="topic"
                label="Topic"
                placeholder="Choose a topic"
                options={TOPICS}
                value={values.topic}
                onChange={(e) => setValue('topic', e.target.value)}
                onBlur={() => blur('topic')}
                error={errors.topic}
              />
            </div>
            <TextAreaField
              name="message"
              label="Message"
              rows={5}
              maxLength={2000}
              hint={
                values.message.trim().length > 0 && values.message.trim().length < 20
                  ? `At least ${20 - values.message.trim().length} more characters needed.`
                  : 'A few sentences on what you need help with.'
              }
              value={values.message}
              onChange={(e) => setValue('message', e.target.value)}
              onBlur={() => blur('message')}
              error={errors.message}
            />

            {form.status === 'not-configured' && <BackendNotice action="Sending messages" dependency="a form-handling backend" />}

            <Button type="submit" size="lg">
              Send message
            </Button>
          </form>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-line bg-paper p-6 sm:p-8">
              <h2 className="text-[15px] font-medium text-ink">Company details</h2>
              <dl className="mt-5 space-y-4 text-[14px]">
                {[
                  ['Email', 'To be confirmed'],
                  ['Office', 'To be confirmed'],
                  ['Hours', 'To be confirmed'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[12px] uppercase tracking-[0.1em] text-soft">{k}</dt>
                    <dd className="mt-0.5 text-muted">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <PlaceholderNotice title="Placeholder details.">
              Company contact information hasn&apos;t been provided yet and will be added before launch.
            </PlaceholderNotice>
          </aside>
        </div>
      </Container>
    </>
  )
}
