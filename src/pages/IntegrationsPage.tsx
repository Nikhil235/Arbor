import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { Search, SearchX, X } from 'lucide-react'
import { IMAGES } from '@/content/site'
import { INTEGRATIONS, INTEGRATION_CATEGORIES } from '@/content/integrations'
import { Button, ButtonLink, Container, PageHero, PlaceholderNotice, cx } from '@/components/ui'
import { pluralize } from '@/lib/format'
import { useTitle } from '@/lib/useTitle'

type Category = (typeof INTEGRATION_CATEGORIES)[number]

function parseCategory(raw: string | null): Category {
  return INTEGRATION_CATEGORIES.includes(raw as Category) ? (raw as Category) : 'All'
}

export function IntegrationsPage() {
  useTitle('Integrations')
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const category = parseCategory(params.get('category'))

  const updateParams = (nextQuery: string, nextCategory: Category) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (nextQuery) next.set('q', nextQuery)
        else next.delete('q')
        if (nextCategory !== 'All') next.set('category', nextCategory)
        else next.delete('category')
        return next
      },
      { replace: true },
    )
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return INTEGRATIONS.filter(
      (i) =>
        (category === 'All' || i.category === category) &&
        (!q ||
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)),
    )
  }, [query, category])

  const reset = () => updateParams('', 'All')

  return (
    <>
      <PageHero
        image={IMAGES.canopy}
        eyebrow="Integrations"
        title="Connect Arbor to the way you already work"
        description="Bring email, calendars, billing and more into one customer timeline, so your team stops copying data between tools."
      >
        <div className="relative mx-auto mt-8 max-w-[480px]">
          <label htmlFor="integration-search" className="sr-only">
            Search integrations
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            id="integration-search"
            type="search"
            value={query}
            onChange={(e) => updateParams(e.target.value, category)}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && query) updateParams('', category)
            }}
            placeholder="Search by name or what it does"
            className="w-full rounded-full border border-white/20 bg-white py-3.5 pl-11 pr-11 text-[14.5px] text-ink placeholder:text-soft focus:outline-none focus:ring-4 focus:ring-lime/30"
          />
          {query && (
            <button
              type="button"
              onClick={() => updateParams('', category)}
              aria-label="Clear integration search"
              className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-[transform,background-color,color] duration-[160ms] ease-[var(--ease-out)] hover:bg-mist hover:text-ink active:scale-[0.95]"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
      </PageHero>

      <Container className="py-14 lg:py-20">
        <PlaceholderNotice title="Planned integrations." className="mb-10">
          These are the connection types Arbor is being built to support. Specific apps will be listed here once each
          integration is available.
        </PlaceholderNotice>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div role="group" aria-label="Filter by category" className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
            {INTEGRATION_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => updateParams(query, c)}
                className={cx(
                  'whitespace-nowrap rounded-full px-4 py-2 text-[13.5px] transition-[transform,background-color,border-color,color] duration-[160ms] ease-[var(--ease-out)] active:scale-[0.97]',
                  category === c ? 'bg-forest font-medium text-white' : 'border border-line bg-white text-muted hover:text-ink',
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <p className="text-[13px] tabular-nums text-muted" aria-live="polite">
            {pluralize(results.length, 'integration')}
          </p>
        </div>

        {results.length > 0 ? (
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map(({ id, name, category: cat, description, icon: Icon }) => (
              <li
                key={id}
                className="flex flex-col rounded-2xl border border-line bg-white p-6 transition-colors duration-[160ms] ease-[var(--ease-out)] hover:border-line-hover"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sage text-forest">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="shrink-0 whitespace-nowrap rounded-full border border-line bg-paper px-2.5 py-0.5 text-[11px] font-medium text-muted">
                    Planned
                  </span>
                </div>
                <h2 className="mt-5 text-[16px] font-medium text-ink">{name}</h2>
                <p className="mt-0.5 text-[12px] text-soft">{cat}</p>
                <p className="mt-3 text-[14px] leading-relaxed text-muted">{description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-line-strong bg-white px-6 py-16 text-center">
            <SearchX className="h-8 w-8 text-soft" aria-hidden />
            <h2 className="mt-4 text-[17px] font-medium text-ink">
              {query ? `No integrations match “${query}”` : 'No integrations match this category'}
            </h2>
            <p className="mt-1.5 max-w-[380px] text-[14px] text-muted">
              Try a broader search, or tell us which tool you need so we can prioritize it.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button variant="secondary" size="sm" onClick={reset}>
                Clear filters
              </Button>
              <ButtonLink to="/contact?topic=integration" size="sm">
                Request an integration
              </ButtonLink>
            </div>
          </div>
        )}

        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-3xl border border-line bg-paper p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-[22px] font-medium tracking-[-0.015em] text-ink">Need a specific tool?</h2>
            <p className="mt-1.5 max-w-[480px] text-[14.5px] text-muted">
              Tell us what your team relies on. Requests directly shape which integrations we build first.
            </p>
          </div>
          <ButtonLink to="/contact?topic=integration" arrow>
            Request an integration
          </ButtonLink>
        </div>
      </Container>
    </>
  )
}
