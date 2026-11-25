import { useState } from 'react'
import { Calendar, Check, GitBranch, ShieldCheck, Sparkles } from 'lucide-react'

const showcaseSlotClass =
  'flex min-h-[248px] w-full items-center justify-center border-b border-line bg-sage-soft/75 p-6'

/**
 * Custom Product Illustrations for the 2x2 Feature Grid
 */
export function AutomationIllustration() {
  return (
    <div className={showcaseSlotClass}>
      <div className="mx-auto flex w-full max-w-[330px] flex-col items-center">
        {/* Node 1: Trigger */}
        <div className="flex w-full items-center justify-between gap-2 rounded-xl border border-line bg-white px-3.5 py-2.5 shadow-2xs">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-sage text-forest">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
            </span>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-soft">Trigger</div>
              <div className="truncate text-[12px] font-medium text-ink">Inbound Demo Request</div>
            </div>
          </div>
          <span className="shrink-0 whitespace-nowrap rounded-full bg-sage px-2 py-0.5 text-[10.5px] font-medium text-forest">
            Active
          </span>
        </div>

        {/* Connector Line */}
        <div className="relative h-4 w-[1.5px] bg-line-hover">
          <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-forest" />
        </div>

        {/* Node 2: Condition */}
        <div className="flex w-full items-center justify-between gap-2 rounded-xl border border-line bg-white px-3.5 py-2.5 shadow-2xs">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-mist text-forest">
              <GitBranch className="h-3.5 w-3.5" aria-hidden />
            </span>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-soft">Condition</div>
              <div className="truncate text-[12px] font-medium text-ink">Company Size &gt; 50</div>
            </div>
          </div>
          <span className="shrink-0 whitespace-nowrap rounded-full border border-line bg-canvas px-2 py-0.5 text-[10.5px] text-muted">
            Matched
          </span>
        </div>

        {/* Connector Line */}
        <div className="relative h-4 w-[1.5px] bg-line-hover">
          <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-forest" />
        </div>

        {/* Node 3: Action */}
        <div className="flex w-full items-center justify-between gap-2 rounded-xl border border-forest/25 bg-white px-3.5 py-2.5 shadow-2xs">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-forest text-white">
              <Check className="h-3.5 w-3.5" aria-hidden />
            </span>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-soft">Action</div>
              <div className="truncate text-[12px] font-medium text-ink">Assign AE &amp; Sequence</div>
            </div>
          </div>
          <span className="shrink-0 whitespace-nowrap rounded-full bg-lime/45 px-2 py-0.5 text-[10.5px] font-medium text-ink">
            Auto-routed
          </span>
        </div>
      </div>
    </div>
  )
}

export function CollaborationIllustration() {
  const [tasks, setTasks] = useState([
    { id: 1, label: 'Send revised enterprise proposal', done: true },
    { id: 2, label: 'Complete security questionnaire', done: true },
    { id: 3, label: 'Schedule executive kickoff call', done: false },
  ])

  const toggleTask = (id: number) => {
    setTasks((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)))
  }

  return (
    <div className={showcaseSlotClass}>
      <div className="mx-auto w-full max-w-[340px] space-y-2.5">
        {/* Assignment Banner with Overlapping Avatars */}
        <div className="flex items-center justify-between gap-2.5 rounded-xl border border-line bg-white p-3 shadow-2xs">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex shrink-0 -space-x-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-forest text-[10px] font-medium text-white ring-2 ring-white">
                MR
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime text-[10px] font-semibold text-ink ring-2 ring-white">
                CL
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sage text-[10px] font-medium text-forest ring-2 ring-white">
                +2
              </span>
            </div>
            <p className="truncate text-[11.5px] leading-snug text-ink" title="Marcus assigned Q4 Renewal to Clara">
              <span className="font-medium">Marcus</span> assigned{' '}
              <span className="font-medium text-forest">Q4 Renewal</span> to Clara
            </p>
          </div>
          <span className="shrink-0 text-[10px] text-soft">2m</span>
        </div>

        {/* Interactive Checklist */}
        <div className="space-y-1 rounded-xl border border-line bg-white p-2.5 shadow-2xs">
          {tasks.map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => toggleTask(task.id)}
              aria-pressed={task.done}
              className="group flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left transition-[transform,background-color] duration-[160ms] ease-[var(--ease-out)] hover:bg-canvas active:scale-[0.98]"
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors duration-[150ms] ease-[var(--ease-out)] ${
                  task.done
                    ? 'border-forest bg-forest text-white'
                    : 'border-line-strong bg-white group-hover:border-forest'
                }`}
              >
                {task.done && <Check className="h-2.5 w-2.5" strokeWidth={2.5} aria-hidden />}
              </span>
              <span
                className={`min-w-0 truncate text-[12px] transition-colors duration-[150ms] ease-[var(--ease-out)] ${
                  task.done ? 'line-through text-soft' : 'text-ink'
                }`}
                title={task.label}
              >
                {task.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AnalyticsIllustration() {
  const [range, setRange] = useState<'30d' | '90d'>('30d')
  const points =
    range === '30d'
      ? [
          { x: 18, y: 74 },
          { x: 72, y: 62 },
          { x: 126, y: 66 },
          { x: 180, y: 44 },
          { x: 234, y: 34 },
          { x: 288, y: 18 },
        ]
      : [
          { x: 18, y: 80 },
          { x: 72, y: 70 },
          { x: 126, y: 52 },
          { x: 180, y: 48 },
          { x: 234, y: 26 },
          { x: 288, y: 14 },
        ]

  const pathD = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <div className={showcaseSlotClass}>
      <div className="mx-auto w-full max-w-[340px] rounded-xl border border-line bg-white p-4 shadow-2xs">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[11px] text-muted">Net Pipeline Velocity</div>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="tabular-nums text-[18px] font-medium text-ink">
                {range === '30d' ? '$184.2k' : '$512.8k'}
              </span>
              <span className="tabular-nums rounded bg-sage px-1.5 py-0.5 text-[11px] font-medium text-forest">
                {range === '30d' ? '+28.4%' : '+34.1%'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setRange(range === '30d' ? '90d' : '30d')}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-line bg-canvas px-2.5 py-1 text-[11px] text-ink-secondary transition-[transform,background-color] duration-[160ms] ease-[var(--ease-out)] hover:bg-sage/60 active:scale-[0.97]"
          >
            <Calendar className="h-3 w-3 text-forest" aria-hidden />
            <span>{range === '30d' ? 'Last 30 days' : 'Last 90 days'}</span>
          </button>
        </div>

        <svg
          viewBox="0 0 306 92"
          className="h-[86px] w-full overflow-visible"
          role="img"
          aria-label="Analytics trend chart"
        >
          {[22, 48, 74].map((y) => (
            <line key={y} x1="12" y1={y} x2="294" y2={y} stroke="var(--color-line)" strokeWidth="1" />
          ))}
          <path
            d={pathD}
            fill="none"
            stroke="var(--color-forest)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map((p, idx) => (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r={idx === points.length - 1 ? '4' : '3'}
              fill={idx === points.length - 1 ? 'var(--color-lime)' : '#FFFFFF'}
              stroke="var(--color-forest)"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>
    </div>
  )
}

export function PermissionsIllustration() {
  const roles = [
    { role: 'Admin', scope: 'All workspaces & settings', level: 3 },
    { role: 'Sales manager', scope: 'Team pipeline & reports', level: 2 },
    { role: 'Account executive', scope: 'Own deals & contacts', level: 1 },
  ]

  return (
    <div className={showcaseSlotClass}>
      <div className="mx-auto w-full max-w-[340px] rounded-xl border border-line bg-white p-4 shadow-2xs">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-[11px] text-muted">Workspace roles</div>
            <div className="mt-0.5 text-[15px] font-medium text-ink">Who can see what</div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-sage px-2 py-0.5 text-[10.5px] font-medium text-forest">
            <ShieldCheck className="h-3 w-3" aria-hidden />
            Role-based
          </span>
        </div>
        <ul className="mt-3.5 divide-y divide-line border-t border-line">
          {roles.map((r) => (
            <li key={r.role} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <div className="text-[12px] font-medium text-ink">{r.role}</div>
                <div className="truncate text-[11px] text-muted" title={r.scope}>
                  {r.scope}
                </div>
              </div>
              <span className="flex shrink-0 gap-0.5" aria-label={`Access level ${r.level} of 3`}>
                {[1, 2, 3].map((n) => (
                  <span
                    key={n}
                    className={`h-3 w-1.5 rounded-sm ${n <= r.level ? 'bg-forest' : 'bg-sage'}`}
                  />
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
