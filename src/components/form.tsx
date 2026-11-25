import { useId, useState, type ComponentProps, type ReactNode, type RefObject } from 'react'
import { AlertCircle, Eye, EyeOff, PlugZap } from 'lucide-react'
import { cx } from './ui'

const controlBase =
  'w-full rounded-xl border bg-white px-3.5 py-2.5 text-[14.5px] text-ink placeholder:text-soft transition-[border-color,box-shadow] duration-[150ms] ease-[var(--ease-out)] focus:outline-none focus:ring-4'

function controlClass(invalid: boolean) {
  return cx(
    controlBase,
    invalid
      ? 'border-danger focus:border-danger focus:ring-danger/10'
      : 'border-line hover:border-line-strong focus:border-forest focus:ring-forest/10',
  )
}

type FieldShellProps = {
  id: string
  label: string
  error?: string
  hint?: ReactNode
  optional?: boolean
  labelAside?: ReactNode
  children: ReactNode
}

function FieldShell({ id, label, error, hint, optional, labelAside, children }: FieldShellProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-medium text-ink">
          {label}
          {optional && <span className="ml-1.5 font-normal text-soft">(optional)</span>}
        </label>
        {labelAside}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-[12.5px] text-danger">
          <AlertCircle className="mt-[1px] h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-[12.5px] text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

function describedBy(id: string, error?: string, hint?: ReactNode) {
  if (error) return `${id}-error`
  if (hint) return `${id}-hint`
  return undefined
}

type TextFieldProps = Omit<ComponentProps<'input'>, 'id'> & {
  name: string
  label: string
  error?: string
  hint?: ReactNode
  optional?: boolean
  labelAside?: ReactNode
}

export function TextField({ name, label, error, hint, optional, labelAside, className, ...props }: TextFieldProps) {
  const id = `field-${name}`
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} labelAside={labelAside}>
      <input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        required={!optional}
        className={cx(controlClass(!!error), className)}
        {...props}
      />
    </FieldShell>
  )
}

export function PasswordField(props: Omit<TextFieldProps, 'type'>) {
  const [visible, setVisible] = useState(false)
  const id = `field-${props.name}`
  return (
    <FieldShell id={id} label={props.label} error={props.error} hint={props.hint} labelAside={props.labelAside}>
      <div className="relative">
        <input
          id={id}
          name={props.name}
          type={visible ? 'text' : 'password'}
          aria-invalid={props.error ? true : undefined}
          aria-describedby={describedBy(id, props.error, props.hint)}
          required
          value={props.value}
          onChange={props.onChange}
          onBlur={props.onBlur}
          autoComplete={props.autoComplete}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          className={cx(controlClass(!!props.error), 'pr-11')}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition-[transform,background-color,color] duration-[160ms] ease-[var(--ease-out)] hover:bg-mist hover:text-ink active:scale-[0.95]"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </FieldShell>
  )
}

type TextAreaFieldProps = Omit<ComponentProps<'textarea'>, 'id'> & {
  name: string
  label: string
  error?: string
  hint?: ReactNode
  optional?: boolean
}

export function TextAreaField({ name, label, error, hint, optional, ...props }: TextAreaFieldProps) {
  const id = `field-${name}`
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional}>
      <textarea
        id={id}
        name={name}
        rows={4}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        required={!optional}
        className={cx(controlClass(!!error), 'resize-y')}
        {...props}
      />
    </FieldShell>
  )
}

type SelectFieldProps = Omit<ComponentProps<'select'>, 'id'> & {
  name: string
  label: string
  options: { value: string; label: string }[]
  placeholder?: string
  error?: string
  hint?: ReactNode
  optional?: boolean
}

export function SelectField({ name, label, options, placeholder, error, hint, optional, ...props }: SelectFieldProps) {
  const id = `field-${name}`
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional}>
      <select
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        required={!optional}
        className={cx(
          controlClass(!!error),
          "appearance-none bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23525e54' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E\")] bg-[length:16px] bg-[right_0.85rem_center] bg-no-repeat pr-10",
          !props.value && 'text-soft',
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-ink">
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

/** Segmented radio group rendered as pills, backed by native radio inputs. */
export function ChoiceGroup({
  name,
  label,
  options,
  value,
  onChange,
  error,
}: {
  name: string
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
  error?: string
}) {
  const groupId = useId()
  return (
    <fieldset
      id={`field-${name}`}
      tabIndex={-1}
      aria-describedby={error ? `${groupId}-error` : undefined}
      className="outline-none"
    >
      <legend className="mb-1.5 text-[13px] font-medium text-ink">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const checked = value === opt
          return (
            <label
              key={opt}
              className={cx(
                'cursor-pointer rounded-full border px-3.5 py-2 text-[13px] transition-[transform,background-color,border-color,color] duration-[160ms] ease-[var(--ease-out)] active:scale-[0.97] has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-forest/15',
                checked
                  ? 'border-forest bg-sage font-medium text-forest'
                  : 'border-line bg-white text-muted hover:border-line-strong hover:text-ink',
              )}
            >
              <input
                type="radio"
                name={name}
                value={opt}
                checked={checked}
                onChange={() => onChange(opt)}
                className="sr-only"
              />
              {opt}
            </label>
          )
        })}
      </div>
      {error && (
        <p id={`${groupId}-error`} className="mt-1.5 flex items-start gap-1.5 text-[12.5px] text-danger">
          <AlertCircle className="mt-[1px] h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </fieldset>
  )
}

export function CheckboxField({
  name,
  label,
  checked,
  onChange,
  error,
  children,
}: {
  name: string
  label?: string
  checked: boolean
  onChange: (checked: boolean) => void
  error?: string
  children?: ReactNode
}) {
  const id = `field-${name}`
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5 text-[13.5px] leading-snug text-ink-secondary">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-line-strong accent-forest"
        />
        <span>{children ?? label}</span>
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 pl-6.5 text-[12.5px] text-danger">
          <AlertCircle className="mt-[1px] h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  )
}

/** Lists validation errors after a failed submit and links each to its field. */
export function ErrorSummary({
  errors,
  labels,
  summaryRef,
}: {
  errors: Partial<Record<string, string>>
  labels: Record<string, string>
  summaryRef: RefObject<HTMLDivElement | null>
}) {
  const entries = Object.entries(errors).filter(([, v]) => v)
  if (entries.length === 0) return null
  return (
    <div
      ref={summaryRef}
      tabIndex={-1}
      role="alert"
      className="notice-enter rounded-2xl border border-danger/25 bg-danger-soft px-4 py-3.5 text-[13.5px] text-danger outline-none"
    >
      <p className="font-medium">
        Please fix {entries.length === 1 ? 'this field' : `these ${entries.length} fields`} to continue:
      </p>
      <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
        {entries.map(([name, message]) => (
          <li key={name}>
            <a href={`#field-${name}`} className="underline underline-offset-2 hover:no-underline">
              {labels[name] ?? name}
            </a>
            : {message}
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Shown after a valid submission when no backend is connected. Makes it
 * explicit that nothing was sent instead of simulating success.
 */
export function BackendNotice({ action, dependency }: { action: string; dependency: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="notice-enter flex gap-3 rounded-2xl border border-amber-border bg-amber-soft px-4 py-3.5 text-amber-ink"
    >
      <PlugZap className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div className="text-[13.5px] leading-relaxed">
        <p className="font-medium">Your details look good, but nothing was sent.</p>
        <p className="mt-0.5 text-amber-ink/90">
          {action} isn&apos;t available yet because {dependency} hasn&apos;t been connected to this site. Your entries are
          still in the form.
        </p>
      </div>
    </div>
  )
}
