import { useEffect, useId, useRef, useState, type ComponentProps, type ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Info } from 'lucide-react'

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

/* ------------------------------------------------------------------ */
/* Brand                                                                */
/* ------------------------------------------------------------------ */

export function ArborLogo({ light = true }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <span
        className={cx(
          'flex h-7 w-7 items-center justify-center rounded-lg border transition-colors duration-[160ms] ease-[var(--ease-out)]',
          light ? 'border-white/25 bg-white/15 text-white' : 'border-forest bg-forest text-white',
        )}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="stroke-current">
          <path
            d="M19 5C11.5 5 6 9.5 6 17.5C6 18.3 6.1 19 6.2 19.5C14 19.5 19 14 19 6.5V5Z"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M5 19L14.5 9.5" strokeWidth="1.9" strokeLinecap="round" />
        </svg>
      </span>
      <span
        className={cx(
          'text-[18px] font-medium tracking-[-0.02em] transition-colors duration-[160ms] ease-[var(--ease-out)]',
          light ? 'text-white' : 'text-ink',
        )}
      >
        Arbor
      </span>
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Buttons                                                              */
/* ------------------------------------------------------------------ */

type ButtonVariant = 'primary' | 'secondary' | 'light' | 'glass' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-forest text-white hover:bg-forest-dark',
  secondary: 'bg-white text-ink border border-line hover:border-line-strong hover:bg-paper',
  light: 'bg-white text-ink hover:bg-mist shadow-sm',
  glass: 'glass-surface-dark bg-white/15 text-white border border-white/25 backdrop-blur-md hover:bg-white hover:text-ink',
  ghost: 'text-forest hover:bg-sage/70',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[13px]',
  md: 'px-5 py-2.5 text-[14px]',
  lg: 'px-6 py-3 text-[14.5px]',
}

export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', extra?: string) {
  return cx(
    'group inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[transform,background-color,border-color,color,box-shadow] duration-[160ms] ease-[var(--ease-out)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100',
    VARIANTS[variant],
    SIZES[size],
    extra,
  )
}

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, 'className'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  arrow?: boolean
  className?: string
}

export function ButtonLink({ variant, size, arrow, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link {...props} className={buttonClass(variant, size, className)}>
      {children}
      {arrow && (
        <ArrowRight
          className="h-4 w-4 transition-transform duration-[160ms] ease-[var(--ease-out)] hover-fine:group-hover:translate-x-0.5"
          aria-hidden
        />
      )}
    </Link>
  )
}

type ButtonProps = ComponentProps<'button'> & { variant?: ButtonVariant; size?: ButtonSize }

export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} {...props} className={buttonClass(variant, size, className)} />
}

/* ------------------------------------------------------------------ */
/* Layout primitives                                                    */
/* ------------------------------------------------------------------ */

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx('mx-auto max-w-[1180px] px-5 sm:px-8', className)}>{children}</div>
}

export function Eyebrow({ children, light, className }: { children: ReactNode; light?: boolean; className?: string }) {
  return (
    <span
      className={cx(
        'inline-block text-[12px] font-medium uppercase tracking-[0.12em]',
        light ? 'text-on-dark-muted' : 'text-muted',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'center' | 'left'
  className?: string
}) {
  return (
    <div className={cx(align === 'center' ? 'mx-auto max-w-[640px] text-center' : 'max-w-[560px]', className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        className={cx(
          'text-balance text-[32px] font-medium leading-[1.13] tracking-[-0.025em] text-ink sm:text-[42px]',
          eyebrow && 'mt-3',
        )}
      >
        {title}
      </h2>
      {description && <p className="mt-4 text-pretty text-[15.5px] leading-relaxed text-muted">{description}</p>}
    </div>
  )
}

/** Small chip marking content as illustrative rather than real. */
export function SampleBadge({ children = 'Sample data', light }: { children?: ReactNode; light?: boolean }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium',
        light ? 'border border-white/20 bg-white/10 text-white/90' : 'border border-line bg-white text-muted',
      )}
    >
      <span className={cx('h-1.5 w-1.5 rounded-full', light ? 'bg-lime' : 'bg-moss')} />
      {children}
    </span>
  )
}

/** Inline notice used for placeholder content that must be confirmed before launch. */
export function PlaceholderNotice({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div
      role="note"
      className={cx('flex gap-3 rounded-2xl border border-amber-border bg-amber-soft px-4 py-3.5 text-amber-ink', className)}
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div className="text-[13.5px] leading-relaxed">
        <span className="font-medium">{title}</span> <span className="text-amber-ink/90">{children}</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Imagery & motion                                                     */
/* ------------------------------------------------------------------ */

export function BotanicalBackdrop({
  src,
  alt = '',
  className,
  overlayClassName,
  eager,
  children,
}: {
  src: string
  alt?: string
  className?: string
  overlayClassName?: string
  eager?: boolean
  children?: ReactNode
}) {
  const [failed, setFailed] = useState(false)
  const hasExplicitPosition = /\b(absolute|fixed|sticky)\b/.test(className ?? '')
  return (
    <div
      className={cx(
        !hasExplicitPosition && 'relative',
        'overflow-hidden bg-gradient-to-br from-night via-forest-dark to-night',
        className,
      )}
    >
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={eager ? 'high' : 'auto'}
          onError={() => setFailed(true)}
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-center"
        />
      )}
      <div className={cx('pointer-events-none absolute inset-0', overlayClassName)} />
      {children}
    </div>
  )
}

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(
    () =>
      typeof window !== 'undefined' &&
      (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)),
  )

  useEffect(() => {
    if (visible) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [visible])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cx(
        'transition-[transform,opacity] duration-[550ms] ease-[var(--ease-out)]',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        className,
      )}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Page hero for interior pages                                         */
/* ------------------------------------------------------------------ */

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  children,
  overlap,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  image: string
  children?: ReactNode
  /** Extra bottom padding so following content can overlap the hero. */
  overlap?: boolean
}) {
  return (
    <section className="px-3 pt-3 sm:px-5 sm:pt-5">
      <BotanicalBackdrop
        src={image}
        eager
        overlayClassName="bg-gradient-to-b from-night/80 via-[#18341D]/70 to-night/90"
        className="mx-auto max-w-[1260px] rounded-[28px]"
      >
        <div
          className={cx(
            'relative z-10 mx-auto max-w-[760px] px-5 pt-36 text-center sm:px-8 sm:pt-40',
            overlap ? 'pb-36 sm:pb-44' : 'pb-16 sm:pb-24',
          )}
        >
          {eyebrow && <Eyebrow light>{eyebrow}</Eyebrow>}
          <h1 className="mt-3 text-balance text-[36px] font-medium leading-[1.08] tracking-[-0.025em] text-white sm:text-[50px] lg:text-[56px]">
            {title}
          </h1>
          {description && (
            <p className="mx-auto mt-5 max-w-[560px] text-pretty text-[15.5px] leading-relaxed text-sage/90 sm:text-[17px]">
              {description}
            </p>
          )}
          {children}
        </div>
      </BotanicalBackdrop>
    </section>
  )
}

/** Plain heading block for light-toned pages. */
export function LightPageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
}) {
  return (
    <Container className="pt-12 pb-10 sm:pt-16">
      <div className="max-w-[720px]">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="mt-3 text-balance text-[36px] font-medium leading-[1.08] tracking-[-0.025em] text-ink sm:text-[48px]">
          {title}
        </h1>
        {description && <p className="mt-4 max-w-[580px] text-pretty text-[16px] leading-relaxed text-muted">{description}</p>}
        {children}
      </div>
    </Container>
  )
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                  */
/* ------------------------------------------------------------------ */

export type FaqEntry = { question: string; answer: ReactNode }

export function FaqList({ items, defaultOpen = 0 }: { items: FaqEntry[]; defaultOpen?: number }) {
  const [open, setOpen] = useState(defaultOpen)
  const baseId = useId()

  return (
    <div className="border-t border-line">
      {items.map((item, idx) => {
        const isOpen = open === idx
        const buttonId = `${baseId}-btn-${idx}`
        const panelId = `${baseId}-panel-${idx}`

        return (
          <div key={item.question} className="border-b border-line">
            <h3>
              <button
                id={buttonId}
                type="button"
                onClick={() => setOpen(isOpen ? -1 : idx)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="group flex w-full items-center justify-between gap-6 rounded-lg py-6 text-left"
              >
                <span className="text-[16px] font-medium text-ink transition-colors duration-[160ms] ease-[var(--ease-out)] group-hover:text-forest sm:text-[17px]">
                  {item.question}
                </span>
                <span
                  aria-hidden
                  className={cx(
                    'relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color,border-color,color] duration-[180ms] ease-[var(--ease-out)] group-active:scale-95',
                    isOpen ? 'border-forest bg-forest text-white' : 'border-line bg-white text-ink group-hover:border-forest',
                  )}
                >
                  <span className="absolute h-[1.5px] w-3.5 rounded bg-current" />
                  <span
                    className={cx(
                      'absolute h-3.5 w-[1.5px] rounded bg-current transition-transform duration-[180ms] ease-[var(--ease-out)]',
                      isOpen && 'scale-y-0',
                    )}
                  />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!isOpen}
              className={cx(
                'grid transition-[grid-template-rows,opacity] duration-[220ms] ease-[var(--ease-out)]',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden" inert={!isOpen || undefined}>
                <div className="pb-6 pr-10 text-[15px] leading-relaxed text-muted">{item.answer}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
