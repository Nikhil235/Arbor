import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ArrowRight, Clock, Search, SearchX, X } from 'lucide-react'
import { IMAGES } from '@/content/site'
import { HELP_ARTICLES, HELP_CATEGORIES } from '@/content/help'
import { Button, ButtonLink, Container, PageHero, cx } from '@/components/ui'
import { pluralize } from '@/lib/format'
import { useTitle } from '@/lib/useTitle'

function parseCategory(raw: string | null): string | null {
  if (!raw) return null
  return HELP_CATEGORIES.some((c) => c.id === raw) ? raw : null
}

export function HelpPage() {
  useTitle('Help center')
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const category = parseCategory(params.get('category'))

  const updateParams = (nextQuery: string, nextCategory: string | null) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (nextQuery) next.set('q', nextQuery)
        else next.delete('q')
        if (nextCategory) next.set('category', nextCategory)
        else next.delete('category')
        return next
      },
      { replace: true },
    )
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return HELP_ARTICLES.filter(
      (a) =>
        (!category || a.category === category) &&
        (!q || a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q)),
    )
  }, [query, category])

  return (
    <>
      <PageHero
        image={IMAGES.canopy}
        eyebrow="Help center"
        title="How can we help?"
        description="Guides for setting up Arbor, organizing your data and getting more from your pipeline."
      >
        <div className="relative mx-auto mt-8 max-w-[480px]">
          <label htmlFor="help-search" className="sr-only">
            Search help articles
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            id="help-search"
            type="search"
            value={query}
            onChange={(e) => updateParams(e.target.value, category)}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && query) updateParams('', category)
            }}
            placeholder="Search for a topic, like “import”"
            className="w-full rounded-full border border-white/20 bg-white py-3.5 pl-11 pr-11 text-[14.5px] text-ink placeholder:text-soft focus:outline-none focus:ring-4 focus:ring-lime/30"
          />
          {query && (
            <button
              type="button"
              onClick={() => updateParams('', category)}
              aria-label="Clear help search"
              className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-[transform,background-color,color] duration-[160ms] ease-[var(--ease-out)] hover:bg-mist hover:text-ink active:scale-[0.95]"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
      </PageHero>

      <Container className="py-14 lg:py-20">
        <div role="group" aria-label="Filter by category" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {HELP_CATEGORIES.map((c) => {
            const count = HELP_ARTICLES.filter((a) => a.category === c.id).length
            const selected = category === c.id
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={selected}
                onClick={() => updateParams(query, selected ? null : c.id)}
                className={cx(
                  'rounded-2xl border p-5 text-left transition-[transform,background-color,border-color] duration-[160ms] ease-[var(--ease-out)] active:scale-[0.98]',
                  selected ? 'border-forest bg-sage/60' : 'border-line bg-white hover:border-line-hover',
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[15px] font-medium text-ink">{c.id}</span>
                  <span className="shrink-0 whitespace-nowrap text-[12px] tabular-nums text-soft">
                    {pluralize(count, 'article')}
                  </span>
                </span>
                <span className="mt-1.5 block text-[13.5px] leading-relaxed text-muted">{c.description}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-12 flex items-center justify-between">
          <h2 className="text-[18px] font-medium text-ink">{category ?? 'All articles'}</h2>
          <p className="text-[13px] tabular-nums text-muted" aria-live="polite">
            {pluralize(results.length, 'result')}
          </p>
        </div>

        {results.length > 0 ? (
          <ul className="mt-5 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
            {results.map((a) => (
              <li key={a.slug}>
                <Link
                  to={`/help/${a.slug}`}
                  className="group flex items-center gap-4 px-6 py-5 transition-colors duration-[150ms] ease-[var(--ease-out)] hover:bg-paper"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] text-soft">{a.category}</p>
                    <h3 className="mt-0.5 text-[15.5px] font-medium text-ink group-hover:text-forest">{a.title}</h3>
                    <p className="mt-1 text-[14px] text-muted">{a.summary}</p>
                  </div>
                  <span className="hidden shrink-0 items-center gap-1 whitespace-nowrap text-[12.5px] tabular-nums text-soft sm:flex">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    {a.minutes} min
                  </span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-soft transition-transform duration-[160ms] ease-[var(--ease-out)] hover-fine:group-hover:translate-x-0.5 group-hover:text-forest"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-5 flex flex-col items-center rounded-2xl border border-dashed border-line-strong bg-white px-6 py-16 text-center">
            <SearchX className="h-8 w-8 text-soft" aria-hidden />
            <h3 className="mt-4 text-[17px] font-medium text-ink">No articles found</h3>
            <p className="mt-1.5 max-w-[360px] text-[14px] text-muted">Try different keywords, or ask our team directly.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => updateParams('', null)}>
                Clear search
              </Button>
              <ButtonLink to="/contact?topic=support" size="sm">
                Contact support
              </ButtonLink>
            </div>
          </div>
        )}

        <p className="mt-10 text-center text-[13px] text-soft">
          Preview documentation: these guides describe Arbor&apos;s intended workflows and may change before launch.
        </p>
      </Container>
    </>
  )
}
