type GraphemeSegment = { segment: string }
type SegmenterInstance = { segment: (input: string) => Iterable<GraphemeSegment> }
type SegmenterConstructor = new (locales?: string, options?: { granularity: 'grapheme' }) => SegmenterInstance

const pluralRules = new Intl.PluralRules('en-US')
const SegmenterCtor = (Intl as unknown as { Segmenter?: SegmenterConstructor }).Segmenter
const graphemeSegmenter = typeof SegmenterCtor === 'function' ? new SegmenterCtor('en', { granularity: 'grapheme' }) : null
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const NAME_SUFFIXES = new Set(['jr', 'jr.', 'sr', 'sr.', 'ii', 'iii', 'iv', 'v', 'phd', 'md'])

/** Returns a count paired with the grammatically correct singular or plural label. */
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count.toLocaleString('en-US')} ${pluralRules.select(count) === 'one' ? singular : plural}`
}

/** Extracts up to two grapheme-safe initials, ignoring trailing generational suffixes. */
export function getInitials(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (words.length === 0) return '?'

  const meaningful =
    words.length > 1 && NAME_SUFFIXES.has(words[words.length - 1].toLowerCase()) ? words.slice(0, -1) : words

  const firstGrapheme = (word: string): string => {
    if (!graphemeSegmenter) return Array.from(word)[0] ?? ''
    for (const seg of graphemeSegmenter.segment(word)) {
      return seg.segment
    }
    return ''
  }

  if (meaningful.length === 1) {
    const graphemes = graphemeSegmenter
      ? Array.from(graphemeSegmenter.segment(meaningful[0]), (s) => s.segment)
      : Array.from(meaningful[0])
    if (graphemes.length === 0) return '?'
    return graphemes.slice(0, 2).join('').toLocaleUpperCase()
  }

  const first = firstGrapheme(meaningful[0])
  const last = firstGrapheme(meaningful[meaningful.length - 1])
  return `${first}${last}`.toLocaleUpperCase() || '?'
}

/** Formats USD currency amounts with locale grouping and no trailing cents. */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}
