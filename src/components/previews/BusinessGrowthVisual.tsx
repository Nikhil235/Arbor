import { useState } from 'react'
import { Check } from 'lucide-react'
import { IMAGES } from '@/content/site'
import { BotanicalBackdrop } from '@/components/ui'
import { DEMO_GROWTH_TASKS, type GrowthTask } from './previewData'

/**
 * Business Growth Floating Interface Card over Botanical Image
 */
export function BusinessGrowthVisual() {
  const [growthTasks, setGrowthTasks] = useState<GrowthTask[]>(DEMO_GROWTH_TASKS)

  const toggleItem = (id: number) => {
    setGrowthTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  return (
    <BotanicalBackdrop
      src={IMAGES.growthCard}
      alt=""
      overlayClassName="bg-gradient-to-t from-night/70 via-forest-dark/25 to-transparent"
      className="flex min-h-[410px] items-end justify-center rounded-2xl p-5 shadow-[0_20px_45px_-15px_rgba(18,36,21,0.14)] sm:min-h-[460px] sm:p-8"
    >
      <div className="glass-surface relative z-10 w-full max-w-[440px] rounded-xl border border-line bg-white/95 p-5 shadow-lg backdrop-blur-md sm:p-6">
        {/* Card Header with Team Avatars & Live Status */}
        <div className="flex items-start justify-between gap-3 border-b border-line pb-4">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-muted">Account Momentum</div>
            <div
              className="mt-0.5 truncate text-[15px] font-medium tabular-nums text-ink"
              title="Enterprise Expansion · $96,000"
            >
              Enterprise Expansion · $96,000
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="flex -space-x-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest text-[10.5px] font-medium text-white ring-2 ring-white">
                SJ
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lime text-[10.5px] font-semibold text-ink ring-2 ring-white">
                DM
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sage text-[10.5px] font-medium text-forest ring-2 ring-white">
                ER
              </span>
            </div>
          </div>
        </div>

        {/* Status Indicator Strip */}
        <div className="my-3.5 flex items-center justify-between gap-2 rounded-lg border border-sage bg-canvas px-3 py-2 text-[12px]">
          <span className="flex items-center gap-2 font-medium tabular-nums text-ink">
            <span className="h-2 w-2 shrink-0 rounded-full bg-forest" />
            Health Score: 96 / 100
          </span>
          <span className="shrink-0 whitespace-nowrap rounded-full bg-sage px-2 py-0.5 text-[11px] font-medium text-forest">
            On Track
          </span>
        </div>

        {/* Interactive Next-Step Tasks */}
        <div className="space-y-1.5">
          {growthTasks.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleItem(item.id)}
              aria-pressed={item.done}
              className="flex w-full items-center justify-between gap-2.5 rounded-lg p-2 text-left transition-[transform,background-color] duration-[160ms] ease-[var(--ease-out)] hover:bg-canvas active:scale-[0.98]"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors duration-[150ms] ease-[var(--ease-out)] ${
                    item.done ? 'border-forest bg-forest text-white' : 'border-line-strong bg-white'
                  }`}
                >
                  {item.done && <Check className="h-2.5 w-2.5" strokeWidth={2.5} aria-hidden />}
                </span>
                <span
                  title={item.text}
                  className={`truncate text-[12.5px] ${item.done ? 'line-through text-soft' : 'text-ink'}`}
                >
                  {item.text}
                </span>
              </span>
              <span className="shrink-0 whitespace-nowrap rounded bg-mist px-2 py-0.5 text-[10.5px] text-ink-secondary">
                {item.tag}
              </span>
            </button>
          ))}
        </div>
      </div>
    </BotanicalBackdrop>
  )
}
