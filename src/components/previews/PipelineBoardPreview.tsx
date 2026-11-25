import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { useToast } from '@/components/toast'
import { getInitials, pluralize } from '@/lib/format'
import { DEMO_DEALS, PIPELINE_STAGES, type Deal } from './previewData'

/**
 * Kanban-style pipeline preview. Cards can be advanced to the next stage,
 * undone via Sonner toast actions, or reset back to sample data.
 */
export function PipelineBoardPreview() {
  const { notify } = useToast()
  const [deals, setDeals] = useState<Deal[]>(DEMO_DEALS)
  const [modified, setModified] = useState(false)

  const resetDeals = () => {
    setModified(false)
    setDeals(DEMO_DEALS)
  }

  const advance = (deal: Deal) => {
    if (deal.stage >= PIPELINE_STAGES.length - 1) return
    const previousStage = deal.stage
    const nextStage = deal.stage + 1
    setDeals((prev) => prev.map((d) => (d.id === deal.id ? { ...d, stage: nextStage } : d)))
    setModified(true)
    notify(`${deal.company} moved to ${PIPELINE_STAGES[nextStage]}`, {
      action: {
        label: 'Undo',
        onClick: () => {
          setDeals((prev) => prev.map((d) => (d.id === deal.id ? { ...d, stage: previousStage } : d)))
        },
      },
    })
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[13.5px] font-medium text-ink">Q4 New Business</div>
          <div className="text-[11.5px] text-muted">Select a card to move it forward</div>
        </div>
        <div className="flex items-center gap-2">
          {modified && (
            <button
              type="button"
              onClick={resetDeals}
              className="inline-flex items-center gap-1 rounded-full border border-line bg-paper px-2.5 py-1 text-[11px] font-medium text-ink-secondary transition-[transform,border-color,color] duration-[160ms] ease-[var(--ease-out)] hover:border-line-strong hover:text-ink active:scale-[0.97]"
            >
              <RotateCcw className="h-3 w-3" aria-hidden />
              Reset
            </button>
          )}
          <span className="whitespace-nowrap rounded-full bg-sage px-2.5 py-0.5 text-[11px] font-medium tabular-nums text-forest">
            {pluralize(deals.length, 'deal')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {PIPELINE_STAGES.map((stage, idx) => {
          const items = deals.filter((d) => d.stage === idx)
          return (
            <div key={stage} className="min-w-0 rounded-xl bg-canvas p-2.5">
              <div className="mb-2 flex items-center justify-between gap-2 px-1">
                <span className="truncate text-[11.5px] font-medium text-ink-secondary">{stage}</span>
                <span className="shrink-0 text-[11px] tabular-nums text-soft">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((deal) => {
                  const done = deal.stage === PIPELINE_STAGES.length - 1
                  return (
                    <button
                      key={deal.id}
                      type="button"
                      onClick={() => advance(deal)}
                      disabled={done}
                      className="w-full min-w-0 rounded-lg border border-line bg-white p-2.5 text-left transition-[transform,border-color] duration-[160ms] ease-[var(--ease-out)] enabled:hover:border-forest/40 enabled:active:scale-[0.98] disabled:cursor-default"
                    >
                      <div className="truncate text-[12px] font-medium text-ink" title={deal.company}>
                        {deal.company}
                      </div>
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <span className="truncate text-[11.5px] tabular-nums text-ink-secondary" title={deal.value}>
                          {deal.value}
                        </span>
                        <span
                          title={deal.owner}
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-medium ${
                            done ? 'bg-forest text-white' : 'bg-sage text-forest'
                          }`}
                        >
                          {getInitials(deal.owner)}
                        </span>
                      </div>
                    </button>
                  )
                })}
                {items.length === 0 && (
                  <div className="rounded-lg border border-dashed border-line-strong py-4 text-center text-[11px] text-soft">
                    No deals
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
