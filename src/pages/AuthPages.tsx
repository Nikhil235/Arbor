import type { ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { IMAGES } from '@/content/site'
import { PLANS } from '@/content/pricing'
import { ArborLogo, BotanicalBackdrop, Button } from '@/components/ui'
import { BackendNotice, CheckboxField, ErrorSummary, PasswordField, TextField } from '@/components/form'
import { email, password, required, submitWithoutBackend, useForm } from '@/lib/forms'
import { useTitle } from '@/lib/useTitle'

const AUTH_DEPENDENCY = 'an authentication backend'

function AuthLayout({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_minmax(0,0.9fr)]">
      <div className="flex flex-col px-5 py-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between">
          <Link to="/" aria-label="Arbor home" className="rounded-lg">
            <ArborLogo light={false} />
          </Link>
          <Link to="/" className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-ink">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Back to site
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-12">
          <h1 className="text-[30px] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[34px]">{title}</h1>
          {description && <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{description}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 text-center text-[13.5px] text-muted">{footer}</div>}
        </div>

        <p className="text-center text-[12px] text-soft">
          <Link to="/privacy" className="hover:text-ink">
            Privacy
          </Link>
          <span className="mx-2">·</span>
          <Link to="/terms" className="hover:text-ink">
            Terms
          </Link>
          <span className="mx-2">·</span>
          <Link to="/help" className="hover:text-ink">
            Help
          </Link>
        </p>
      </div>

      <div className="hidden p-4 lg:block">
        <BotanicalBackdrop
          src={IMAGES.fern}
          eager
          overlayClassName="bg-gradient-to-t from-night/85 via-night/20 to-transparent"
          className="flex h-full min-h-[600px] items-end rounded-[28px] p-10"
        >
          <div className="relative z-10 max-w-[420px]">
            <p className="text-[28px] font-medium leading-[1.2] tracking-[-0.02em] text-white">
              Every relationship, organized and growing.
            </p>
            <p className="mt-3 text-[14.5px] leading-relaxed text-sage/85">
              Contacts, pipeline and follow-ups in one calm workspace your whole team can share.
            </p>
          </div>
        </BotanicalBackdrop>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

export function SignupPage() {
  useTitle('Create your account')
  const [params] = useSearchParams()
  const plan = PLANS.find((p) => p.id === params.get('plan'))

  const form = useForm(
    { name: '', email: '', password: '', company: '', terms: false as boolean },
    {
      name: required('Enter your name.'),
      email,
      password,
      terms: required('Accept the terms to create an account.'),
    },
  )
  const { values, errors, setValue, blur } = form

  return (
    <AuthLayout
      title="Create your Arbor workspace"
      description="Set up your team’s workspace in a few minutes."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-forest hover:underline">
            Log in
          </Link>
        </>
      }
    >
      {plan && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-line bg-white px-4 py-3 text-[13.5px]">
          <span className="text-muted">
            Selected plan: <span className="font-medium text-ink">{plan.name}</span>
          </span>
          <Link to="/pricing" className="font-medium text-forest hover:underline">
            Change
          </Link>
        </div>
      )}
      <form noValidate onSubmit={form.handleSubmit(() => form.setStatus(submitWithoutBackend()))} className="space-y-5">
        {form.status === 'invalid' && (
          <ErrorSummary
            errors={errors}
            labels={{ name: 'Full name', email: 'Work email', password: 'Password', terms: 'Terms' }}
            summaryRef={form.summaryRef}
          />
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
        <PasswordField
          name="password"
          label="Password"
          autoComplete="new-password"
          maxLength={128}
          hint="At least 10 characters, including a letter and a number."
          value={values.password}
          onChange={(e) => setValue('password', e.target.value)}
          onBlur={() => blur('password')}
          error={errors.password}
        />
        <TextField
          name="company"
          label="Company"
          optional
          autoComplete="organization"
          maxLength={120}
          value={values.company}
          onChange={(e) => setValue('company', e.target.value)}
        />
        <CheckboxField
          name="terms"
          checked={values.terms}
          onChange={(v) => setValue('terms', v)}
          error={errors.terms}
        >
          I agree to the{' '}
          <Link to="/terms" className="font-medium text-forest underline underline-offset-2">
            terms of service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="font-medium text-forest underline underline-offset-2">
            privacy policy
          </Link>
          .
        </CheckboxField>
        {form.status === 'not-configured' && <BackendNotice action="Account creation" dependency={AUTH_DEPENDENCY} />}
        <Button type="submit" size="lg" className="w-full">
          Create account
        </Button>
      </form>
    </AuthLayout>
  )
}

/* ------------------------------------------------------------------ */

export function LoginPage() {
  useTitle('Log in')
  const form = useForm(
    { email: '', password: '' },
    { email, password: required('Enter your password.') },
  )
  const { values, errors, setValue, blur } = form

  return (
    <AuthLayout
      title="Welcome back"
      description="Log in to your Arbor workspace."
      footer={
        <>
          New to Arbor?{' '}
          <Link to="/signup" className="font-medium text-forest hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form noValidate onSubmit={form.handleSubmit(() => form.setStatus(submitWithoutBackend()))} className="space-y-5">
        {form.status === 'invalid' && (
          <ErrorSummary errors={errors} labels={{ email: 'Email', password: 'Password' }} summaryRef={form.summaryRef} />
        )}
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
        <PasswordField
          name="password"
          label="Password"
          autoComplete="current-password"
          maxLength={128}
          labelAside={
            <Link to="/forgot-password" className="text-[12.5px] font-medium text-forest hover:underline">
              Forgot password?
            </Link>
          }
          value={values.password}
          onChange={(e) => setValue('password', e.target.value)}
          onBlur={() => blur('password')}
          error={errors.password}
        />
        {form.status === 'not-configured' && <BackendNotice action="Signing in" dependency={AUTH_DEPENDENCY} />}
        <Button type="submit" size="lg" className="w-full">
          Log in
        </Button>
      </form>
    </AuthLayout>
  )
}

/* ------------------------------------------------------------------ */

export function ForgotPasswordPage() {
  useTitle('Reset your password')
  const form = useForm({ email: '' }, { email })
  const { values, errors, setValue, blur } = form

  return (
    <AuthLayout
      title="Forgot your password?"
      description="Enter the email you use for Arbor and we’ll send you a link to reset it."
      footer={
        <Link to="/login" className="inline-flex items-center gap-1.5 font-medium text-forest hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Back to log in
        </Link>
      }
    >
      <form noValidate onSubmit={form.handleSubmit(() => form.setStatus(submitWithoutBackend()))} className="space-y-5">
        {form.status === 'invalid' && (
          <ErrorSummary errors={errors} labels={{ email: 'Email' }} summaryRef={form.summaryRef} />
        )}
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
        {form.status === 'not-configured' && (
          <BackendNotice action="Sending password reset emails" dependency={AUTH_DEPENDENCY} />
        )}
        <Button type="submit" size="lg" className="w-full">
          Send reset link
        </Button>
      </form>
    </AuthLayout>
  )
}

/* ------------------------------------------------------------------ */

export function ResetPasswordPage() {
  useTitle('Choose a new password')
  const [params] = useSearchParams()
  const hasToken = Boolean(params.get('token'))

  const form = useForm(
    { password: '', confirm: '' },
    {
      password,
      confirm: (value, values) =>
        !value ? 'Confirm your new password.' : value !== values.password ? 'Passwords don’t match.' : undefined,
    },
  )
  const { values, errors, setValue, blur } = form

  return (
    <AuthLayout
      title="Choose a new password"
      description="Pick something you haven’t used for Arbor before."
      footer={
        <Link to="/login" className="inline-flex items-center gap-1.5 font-medium text-forest hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Back to log in
        </Link>
      }
    >
      {!hasToken && (
        <div role="note" className="mb-6 rounded-xl border border-line bg-white px-4 py-3 text-[13px] leading-relaxed text-muted">
          This page is normally opened from the link in a password reset email. If you need a new link,{' '}
          <Link to="/forgot-password" className="font-medium text-forest underline underline-offset-2">
            request one here
          </Link>
          .
        </div>
      )}
      <form noValidate onSubmit={form.handleSubmit(() => form.setStatus(submitWithoutBackend()))} className="space-y-5">
        {form.status === 'invalid' && (
          <ErrorSummary
            errors={errors}
            labels={{ password: 'New password', confirm: 'Confirm password' }}
            summaryRef={form.summaryRef}
          />
        )}
        <PasswordField
          name="password"
          label="New password"
          autoComplete="new-password"
          maxLength={128}
          hint="At least 10 characters, including a letter and a number."
          value={values.password}
          onChange={(e) => setValue('password', e.target.value)}
          onBlur={() => blur('password')}
          error={errors.password}
        />
        <PasswordField
          name="confirm"
          label="Confirm password"
          autoComplete="new-password"
          maxLength={128}
          value={values.confirm}
          onChange={(e) => setValue('confirm', e.target.value)}
          onBlur={() => blur('confirm')}
          error={errors.confirm}
        />
        {form.status === 'not-configured' && <BackendNotice action="Resetting passwords" dependency={AUTH_DEPENDENCY} />}
        <Button type="submit" size="lg" className="w-full">
          Update password
        </Button>
      </form>
    </AuthLayout>
  )
}
