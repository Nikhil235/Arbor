import { Link, useParams } from 'react-router'
import { ArrowLeft, ChevronRight, Clock, Lightbulb } from 'lucide-react'
import { HELP_ARTICLES, type HelpBlock } from '@/content/help'
import { ButtonLink, Container } from '@/components/ui'
import { useTitle } from '@/lib/useTitle'
import { NotFoundPage } from './NotFoundPage'

function Block({ block }: { block: HelpBlock }) {
  switch (block.type) {
    case 'p':
      return <p className="text-[16px] leading-[1.75] text-ink-secondary">{block.text}</p>
    case 'h2':
      return <h2 className="pt-4 text-[21px] font-medium tracking-[-0.015em] text-ink">{block.text}</h2>
    case 'steps':
      return (
        <ol className="space-y-3">
          {block.items.map((item, i) => (
            <li key={item} className="flex gap-3.5 text-[15.5px] leading-relaxed text-ink-secondary">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage text-[12px] font-medium tabular-nums text-forest">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
      )
    case 'list':
      return (
        <ul className="list-disc space-y-2 pl-5 text-[15.5px] leading-relaxed text-ink-secondary marker:text-moss">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )
    case 'tip':
      return (
        <aside className="flex gap-3 rounded-2xl border border-sage bg-sage/40 px-5 py-4">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-forest" aria-hidden />
          <p className="text-[14.5px] leading-relaxed text-ink">
            <span className="font-medium">Tip: </span>
            {block.text}
          </p>
        </aside>
      )
  }
}

export function HelpArticlePage() {
  const { slug } = useParams()
  const article = HELP_ARTICLES.find((a) => a.slug === slug)
  useTitle(article?.title ?? 'Article not found')

  if (!article) return <NotFoundPage />

  const related = HELP_ARTICLES.filter((a) => a.slug !== article.slug && a.category === article.category).concat(
    HELP_ARTICLES.filter((a) => a.slug !== article.slug && a.category !== article.category),
  ).slice(0, 3)

  return (
    <Container className="py-10 sm:py-14 lg:py-16">
      <nav aria-label="Breadcrumb" className="text-[13px] text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link to="/help" className="hover:text-ink">
              Help center
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5 text-soft" aria-hidden />
          <li>
            <Link to={`/help?category=${encodeURIComponent(article.category)}`} className="hover:text-ink">
              {article.category}
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5 text-soft" aria-hidden />
          <li aria-current="page" className="text-ink">
            {article.title}
          </li>
        </ol>
      </nav>

      <div className="mt-10 grid grid-cols-1 gap-14 lg:grid-cols-[1fr_300px]">
        <article className="max-w-[700px]">
          <h1 className="text-balance text-[34px] font-medium leading-[1.12] tracking-[-0.025em] text-ink sm:text-[42px]">
            {article.title}
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-muted">{article.summary}</p>
          <p className="mt-4 flex items-center gap-1.5 text-[13px] text-soft">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {article.minutes} min read · Preview documentation
          </p>
          <div className="mt-10 space-y-6 border-t border-line pt-10">
            {article.body.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
          <Link to="/help" className="mt-12 inline-flex items-center gap-1.5 text-[14px] font-medium text-forest hover:underline">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All articles
          </Link>
        </article>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-line bg-white p-6">
            <h2 className="text-[14px] font-medium text-ink">Related articles</h2>
            <ul className="mt-4 space-y-3">
              {related.map((a) => (
                <li key={a.slug}>
                  <Link to={`/help/${a.slug}`} className="text-[14px] leading-snug text-muted hover:text-forest">
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-forest p-6 text-white">
            <h2 className="text-[15px] font-medium">Still need help?</h2>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-sage/85">Our team can walk you through it.</p>
            <ButtonLink to="/contact?topic=support" variant="light" size="sm" className="mt-5">
              Contact support
            </ButtonLink>
          </div>
        </aside>
      </div>
    </Container>
  )
}
