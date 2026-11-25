import { useCallback, useRef, useState, type FormEvent } from 'react'

export type FormValues = Record<string, string | boolean>
export type Validator<T extends FormValues> = (value: T[keyof T], values: T) => string | undefined
export type Rules<T extends FormValues> = { [K in keyof T]?: Validator<T> }
export type Errors<T> = Partial<Record<keyof T, string>>

/* Validators ---------------------------------------------------------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const required =
  (message = 'This field is required.') =>
  (value: unknown) =>
    (typeof value === 'string' ? value.trim() : value) ? undefined : message

export const email = (value: unknown) => {
  const v = String(value ?? '').trim()
  if (!v) return 'Enter your email address.'
  return EMAIL_RE.test(v) ? undefined : 'Enter a valid email address, like name@company.com.'
}

export const minLength = (n: number, label = 'This field') => (value: unknown) =>
  String(value ?? '').trim().length >= n ? undefined : `${label} must be at least ${n} characters.`

export const password = (value: unknown) => {
  const v = String(value ?? '')
  if (!v) return 'Create a password.'
  if (v.length < 10) return 'Use at least 10 characters.'
  if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return 'Include at least one letter and one number.'
  return undefined
}

export const all =
  (...validators: ((value: unknown) => string | undefined)[]) =>
  (value: unknown) => {
    for (const v of validators) {
      const result = v(value)
      if (result) return result
    }
    return undefined
  }

/* Hook ------------------------------------------------------------------ */

export type SubmitStatus = 'idle' | 'invalid' | 'not-configured'

export function useForm<T extends FormValues>(initial: T, rules: Rules<T>) {
  const [values, setValues] = useState<T>(initial)
  const [errors, setErrors] = useState<Errors<T>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const summaryRef = useRef<HTMLDivElement>(null)

  const validateField = useCallback(
    (name: keyof T, next: T) => rules[name]?.(next[name], next),
    [rules],
  )

  const setValue = useCallback(
    <K extends keyof T>(name: K, value: T[K]) => {
      setValues((prev) => {
        const next = { ...prev, [name]: value }
        // Revalidate live only once the field has been visited.
        if (touched[name]) setErrors((e) => ({ ...e, [name]: validateField(name, next) }))
        return next
      })
      if (status === 'not-configured') setStatus('idle')
    },
    [touched, validateField, status],
  )

  const blur = useCallback(
    (name: keyof T) => {
      setTouched((t) => ({ ...t, [name]: true }))
      setErrors((e) => ({ ...e, [name]: validateField(name, values) }))
    },
    [validateField, values],
  )

  const handleSubmit = (onValid: (values: T) => void) => (event: FormEvent) => {
    event.preventDefault()
    const nextErrors: Errors<T> = {}
    for (const key of Object.keys(rules) as (keyof T)[]) {
      const message = validateField(key, values)
      if (message) nextErrors[key] = message
    }
    setErrors(nextErrors)
    setTouched(Object.fromEntries(Object.keys(rules).map((k) => [k, true])) as Partial<Record<keyof T, boolean>>)

    if (Object.keys(nextErrors).length > 0) {
      setStatus('invalid')
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    onValid(values)
  }

  const visibleErrors = Object.fromEntries(
    Object.entries(errors).filter(([k, v]) => v && touched[k as keyof T]),
  ) as Errors<T>

  return { values, errors: visibleErrors, setValue, blur, handleSubmit, status, setStatus, summaryRef }
}

/**
 * No form-handling backend is configured for this site. Rather than faking a
 * success response, every submission resolves to `not-configured` so the UI
 * can tell the visitor that nothing was sent.
 */
export function submitWithoutBackend(): SubmitStatus {
  return 'not-configured'
}
