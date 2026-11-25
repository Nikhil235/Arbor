import { useMemo, useRef, useState, type KeyboardEvent } from 'react'
import {
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  Kanban,
  LayoutDashboard,
  Search,
  Users,
  Workflow,
  X,
} from 'lucide-react'
import { cx } from '@/components/ui'
import { useToast } from '@/components/toast'
import { getInitials, pluralize } from '@/lib/format'
import {
  DEMO_CONTACTS,
  DEMO_DASHBOARD_PERIODS,
  DEMO_DEALS,
  INITIAL_AUTOMATIONS,
  PIPELINE_STAGES,
  WORKSPACE_OPTIONS,
  useDismiss,
  type PeriodKey,
} from './previewData'

type ChartPoint = { month: string; value: number; display: string; deals: number; x: number; y: number; idx: number }
type NavView = 'Dashboard' | 'Pipeline' | 'Contacts' | 'Automations' | 'Analytics'

const NAV_ITEMS: { name: NavView; icon: typeof LayoutDashboard }[] = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Pipeline', icon: Kanban },
  { name: 'Contacts', icon: Users },
  { name: 'Automations', icon: Workflow },
  { name: 'Analytics', icon: BarChart3 },
]

/**
 * Interactive CRM Dashboard Preview overlapping the Hero.
 * All 5 sidebar modules, workspace picker, live search, period switcher,
 * and keyboard-accessible chart points respond to user input.
 */
export function HeroDashboardPreview() {
  const { notify } = useToast()
  const [activeNav, setActiveNav] = useState<NavView>('Dashboard')
  const [period, setPeriod] = useState<PeriodKey>('quarter')
  const [hoveredIdx, setHoveredIdx] = useState(4)
  const [workspaceOpen, setWorkspaceOpen] = useState(false)
  const [workspace, setWorkspace] = useState(WORKSPACE_OPTIONS[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [automations, setAutomations] = useState(INITIAL_AUTOMATIONS)
  const [miniDeals, setMiniDeals] = useState(DEMO_DEALS)

  const workspaceRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useDismiss(workspaceRef, workspaceOpen, () => setWorkspaceOpen(false))
  useDismiss(searchRef, searchFocused, () => setSearchFocused(false))

  const data = DEMO_DASHBOARD_PERIODS[period]
  const points = data.revenuePoints

  // Build smooth SVG path coordinates inside 520 x 165 viewBox
  const width = 520
  const height = 165
  const padX = 24
  const padTop = 18
  const padBottom = 26
  const minVal = 75
  const maxVal = 230

  const coords: ChartPoint[] = points.map((pt, idx) => {
    const x = padX + (idx / Math.max(1, points.length - 1)) * (width - padX * 2)
    const norm = (pt.value - minVal) / (maxVal - minVal)
    const y = height - padBottom - norm * (height - padTop - padBottom)
    return { ...pt, x, y, idx }
  })

  const buildSmoothPath = (pts: ChartPoint[]) => {
    if (!pts.length) return ''
    let d = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i]
      const next = pts[i + 1]
      const midX = (curr.x + next.x) / 2
      d += ` C ${midX} ${curr.y}, ${midX} ${next.y}, ${next.x} ${next.y}`
    }
    return d
  }

  const linePath = buildSmoothPath(coords)
  const areaPath =
    coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x} ${height - padBottom} L ${coords[0].x} ${height - padBottom} Z`
      : ''
  const clampedHoveredIdx = Math.min(hoveredIdx, Math.max(0, coords.length - 1))
  const activePoint = coords[clampedHoveredIdx]

  const rawTotalPct = data.goal.segments.reduce((sum, s) => sum + Math.max(0, s.pct), 0)
  const scaleFactor = rawTotalPct > 100 ? 100 / rawTotalPct : 1

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return []
    const contactMatches = DEMO_CONTACTS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q),
    )
      .slice(0, 3)
      .map((c) => ({ id: c.id, title: c.name, subtitle: `${c.company} · ${c.status}`, target: 'Contacts' as NavView }))
    const dealMatches = miniDeals
      .filter((d) => d.company.toLowerCase().includes(q) || d.value.toLowerCase().includes(q))
      .slice(0, 3)
      .map((d) => ({
        id: d.id,
        title: d.company,
        subtitle: `${d.value} · ${PIPELINE_STAGES[d.stage]}`,
        target: 'Pipeline' as NavView,
      }))
    return [...contactMatches, ...dealMatches].slice(0, 5)
  }, [searchQuery, miniDeals])

  const handleChartKeyDown = (e: KeyboardEvent<SVGGElement>, idx: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      setHoveredIdx(Math.min(coords.length - 1, idx + 1))
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      setHoveredIdx(Math.max(0, idx - 1))
    }
  }

  const toggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a
        const nextActive = !a.active
        notify(`${a.name} ${nextActive ? 'enabled' : 'paused'}`)
        return { ...a, active: nextActive }
      }),
    )
  }

  const advanceMiniDeal = (dealId: string) => {
    const target = miniDeals.find((d) => d.id === dealId)
    if (!target || target.stage >= PIPELINE_STAGES.length - 1) return
    const prevStage = target.stage
    const nextStage = prevStage + 1
    setMiniDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, stage: nextStage } : d)))
    notify(`${target.company} moved to ${PIPELINE_STAGES[nextStage]}`, {
      action: {
        label: 'Undo',
        onClick: () => setMiniDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, stage: prevStage } : d))),
      },
    })
  }

  return (
    <div className="mx-auto w-full max-w-[1060px] overflow-hidden rounded-2xl border border-line bg-white text-left shadow-[0_24px_60px_-15px_rgba(18,36,21,0.16)]">
      <div className="flex min-h-[480px] flex-col md:flex-row">
        {/* Left Narrow Sidebar */}
        <aside className="flex w-full shrink-0 flex-row justify-between gap-3 border-b border-line bg-paper p-3.5 md:w-[205px] md:flex-col md:border-b-0 md:border-r">
          <div className="flex w-full flex-row items-center gap-3 md:flex-col md:items-stretch">
            {/* Workspace Selector */}
            <div className="relative min-w-0 max-w-[175px] md:max-w-none" ref={workspaceRef}>
              <button
                type="button"
                aria-expanded={workspaceOpen}
                aria-haspopup="listbox"
                onClick={() => setWorkspaceOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-2 rounded-lg border border-line bg-white px-2.5 py-2 text-left transition-[transform,border-color] duration-[160ms] ease-[var(--ease-out)] hover:border-line-strong active:scale-[0.98]"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-forest text-[11px] font-semibold text-white">
                    {getInitials(workspace).slice(0, 1)}
                  </span>
                  <span className="truncate text-[12.5px] font-medium text-ink" title={workspace}>
                    {workspace}
                  </span>
                </span>
                <ChevronDown
                  className={cx(
                    'h-3.5 w-3.5 shrink-0 text-muted transition-transform duration-[180ms] ease-[var(--ease-out)]',
                    workspaceOpen && 'rotate-180',
                  )}
                  aria-hidden
                />
              </button>

              {workspaceOpen && (
                <div
                  role="listbox"
                  aria-label="Select workspace"
                  className="popover-surface origin-top-left absolute left-0 top-full z-20 mt-1.5 w-56 rounded-xl border border-line bg-white py-1 shadow-lg"
                >
                  {WORKSPACE_OPTIONS.map((ws) => {
                    const selected = workspace === ws
                    return (
                      <button
                        key={ws}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => {
                          setWorkspace(ws)
                          setWorkspaceOpen(false)
                        }}
                        className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-[12px] text-ink transition-colors hover:bg-canvas"
                      >
                        <span className="min-w-0 truncate" title={ws}>
                          {ws}
                        </span>
                        {selected && <Check className="h-3.5 w-3.5 shrink-0 text-forest" aria-hidden />}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Navigation Items */}
            <nav aria-label="CRM Preview Navigation" className="no-scrollbar flex gap-1 overflow-x-auto md:flex-col">
              {NAV_ITEMS.map(({ name, icon: Icon }) => {
                const isActive = activeNav === name
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setActiveNav(name)}
                    aria-pressed={isActive}
                    className={cx(
                      'flex items-center gap-2.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[12.5px] transition-[transform,background-color,color] duration-[160ms] ease-[var(--ease-out)] active:scale-[0.98]',
                      isActive ? 'bg-sage font-medium text-forest' : 'text-ink-secondary hover:bg-mist hover:text-ink',
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} aria-hidden />
                    <span>{name}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Sidebar Bottom Quota Card (Desktop) */}
          <div className="hidden border-t border-line pt-3 md:block">
            <div className="rounded-xl border border-line bg-white p-2.5">
              <div className="mb-1.5 flex items-center justify-between text-[11px]">
                <span className="text-muted">Team Seats</span>
                <span className="font-medium tabular-nums text-ink">18 / 25</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-sage">
                <div
                  className="h-full origin-left rounded-full bg-forest transition-transform duration-[280ms] ease-[var(--ease-out)]"
                  style={{ transform: 'scaleX(0.72)' }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Workspace Panel */}
        <div className="flex min-w-0 flex-1 flex-col bg-white">
          {/* Top Toolbar */}
          <div className="flex h-12 items-center justify-between gap-3 border-b border-line px-4 sm:px-6">
            <div ref={searchRef} className="relative max-w-[280px] flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" aria-hidden />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSearchFocused(true)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setSearchQuery('')
                    setSearchFocused(false)
                  }
                }}
                placeholder="Search deals, contacts..."
                aria-label="Search CRM preview"
                className="w-full rounded-lg border border-line bg-canvas py-1 pl-8 pr-11 text-[12px] text-ink placeholder:text-soft focus:border-forest focus:outline-none"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    searchInputRef.current?.focus()
                  }}
                  aria-label="Clear search"
                  className="absolute right-1.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded text-muted hover:bg-mist hover:text-ink"
                >
                  <X className="h-3 w-3" aria-hidden />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => searchInputRef.current?.focus()}
                  aria-label="Focus preview search"
                  className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-line bg-white px-1 text-[10px] text-soft hover:text-ink sm:inline-block"
                >
                  ⌘K
                </button>
              )}

              {searchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 top-full z-30 mt-1.5 w-full min-w-[240px] rounded-xl border border-line bg-white py-1.5 shadow-lg">
                  {searchResults.length > 0 ? (
                    searchResults.map((res) => (
                      <button
                        key={`${res.target}-${res.id}`}
                        type="button"
                        onClick={() => {
                          setActiveNav(res.target)
                          setSearchFocused(false)
                          notify(`Opened ${res.title} in ${res.target}`)
                        }}
                        className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left hover:bg-canvas"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[12px] font-medium text-ink">{res.title}</span>
                          <span className="block truncate text-[11px] text-muted">{res.subtitle}</span>
                        </span>
                        <span className="shrink-0 rounded-full bg-sage px-2 py-0.5 text-[10px] font-medium text-forest">
                          {res.target}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-[12px] text-muted">No matches for “{searchQuery}”</div>
                  )}
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2.5">
              <span className="hidden items-center gap-1.5 rounded-full bg-sage/80 px-2.5 py-1 text-[11px] font-medium text-forest sm:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-forest" />
                {activeNav}
              </span>

              <button
                type="button"
                onClick={() => notify('3 new deal updates (sample notification)')}
                aria-label="Notifications"
                className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-secondary transition-[transform,background-color] duration-[160ms] ease-[var(--ease-out)] hover:bg-canvas active:scale-[0.95]"
              >
                <Bell className="h-3.5 w-3.5" aria-hidden />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-lime ring-2 ring-white" />
              </button>

              <div className="flex items-center gap-2 pl-1">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest text-[11px] font-medium text-white">
                  SJ
                </div>
                <span className="hidden text-[12px] font-medium text-ink sm:inline">Sarah Jenkins</span>
              </div>
            </div>
          </div>

          {/* Active Module Body */}
          <div className="flex-1 space-y-5 p-4 sm:p-6">
            {activeNav === 'Dashboard' && (
              <>
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <h2 className="text-[18px] font-medium tracking-[-0.02em] text-ink sm:text-[20px]">
                      Good morning, Sarah.
                    </h2>
                    <p className="mt-0.5 truncate text-[12px] text-muted" title={workspace}>
                      {workspace} · Pipeline health is up 14% compared to last period.
                    </p>
                  </div>

                  <div className="inline-flex shrink-0 items-center self-start rounded-lg border border-line bg-canvas p-0.5">
                    {(Object.entries(DEMO_DASHBOARD_PERIODS) as [PeriodKey, (typeof DEMO_DASHBOARD_PERIODS)[PeriodKey]][]).map(
                      ([key, cfg]) => (
                        <button
                          key={key}
                          type="button"
                          aria-pressed={period === key}
                          onClick={() => setPeriod(key)}
                          className={cx(
                            'rounded-md px-2.5 py-1 text-[11.5px] whitespace-nowrap transition-[transform,background-color,color,border-color] duration-[160ms] ease-[var(--ease-out)] active:scale-[0.97]',
                            period === key
                              ? 'border border-line bg-white font-medium text-ink shadow-xs'
                              : 'border border-transparent text-muted hover:text-ink',
                          )}
                        >
                          {cfg.label}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* Four Compact KPI Cards */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {data.kpis.map((kpi) => (
                    <div
                      key={kpi.label}
                      className="min-w-0 rounded-xl border border-line bg-paper/60 p-3.5 transition-colors duration-[150ms] ease-[var(--ease-out)] hover:bg-white"
                    >
                      <div className="truncate text-[11px] font-normal text-muted">{kpi.label}</div>
                      <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-1.5">
                        <span className="truncate text-[17px] font-medium tabular-nums tracking-[-0.02em] text-ink sm:text-[19px]">
                          {kpi.value}
                        </span>
                        <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded bg-sage px-1.5 py-0.5 text-[10.5px] font-medium tabular-nums text-forest">
                          {kpi.delta}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Split: Revenue Performance Area Chart + Sales Goal Panel */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                  {/* Left (~65%): Revenue Performance Area Chart */}
                  <div className="flex flex-col justify-between rounded-xl border border-line bg-white p-4 lg:col-span-8">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-[13px] font-medium text-ink">Revenue Performance</div>
                        <div className="text-[11px] text-muted">
                          Hover, tap, or use arrow keys to inspect closed revenue
                        </div>
                      </div>
                      {activePoint && (
                        <div
                          aria-live="polite"
                          className="flex items-center gap-2 rounded-lg border border-line bg-canvas px-2.5 py-1 tabular-nums"
                        >
                          <span className="h-2 w-2 shrink-0 rounded-full bg-forest" />
                          <span className="text-[11px] text-muted">{activePoint.month}:</span>
                          <span className="text-[12px] font-medium text-ink">{activePoint.display}</span>
                          <span className="text-[10.5px] font-medium text-forest">
                            ({pluralize(activePoint.deals, 'deal')})
                          </span>
                        </div>
                      )}
                    </div>

                    {coords.length > 0 && activePoint && (
                      <div className="w-full overflow-hidden">
                        <svg
                          viewBox={`0 0 ${width} ${height}`}
                          className="h-[155px] w-full overflow-visible"
                          role="img"
                          aria-label="Revenue performance area chart"
                        >
                          <defs>
                            <linearGradient id="arborAreaGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="var(--color-forest)" stopOpacity="0.18" />
                              <stop offset="70%" stopColor="var(--color-lime)" stopOpacity="0.08" />
                              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                            </linearGradient>
                          </defs>

                          {[0.2, 0.5, 0.8].map((ratio, i) => {
                            const yLine = padTop + ratio * (height - padTop - padBottom)
                            return (
                              <line
                                key={i}
                                x1={padX}
                                y1={yLine}
                                x2={width - padX}
                                y2={yLine}
                                stroke="var(--color-line)"
                                strokeWidth="1"
                              />
                            )
                          })}

                          <path d={areaPath} fill="url(#arborAreaGrad)" />
                          <path
                            d={linePath}
                            fill="none"
                            stroke="var(--color-forest)"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                          />

                          <line
                            x1={activePoint.x}
                            y1={activePoint.y}
                            x2={activePoint.x}
                            y2={height - padBottom}
                            stroke="var(--color-forest)"
                            strokeOpacity="0.25"
                            strokeDasharray="3 3"
                          />

                          {coords.map((pt) => {
                            const isSelected = pt.idx === clampedHoveredIdx
                            return (
                              <g
                                key={pt.month}
                                tabIndex={0}
                                role="button"
                                aria-label={`${pt.month}: ${pt.display}, ${pluralize(pt.deals, 'deal')}`}
                                aria-pressed={isSelected}
                                className="cursor-pointer outline-none focus-visible:outline-none"
                                onMouseEnter={() => setHoveredIdx(pt.idx)}
                                onFocus={() => setHoveredIdx(pt.idx)}
                                onClick={() => setHoveredIdx(pt.idx)}
                                onKeyDown={(e) => handleChartKeyDown(e, pt.idx)}
                              >
                                <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />
                                {isSelected && (
                                  <circle cx={pt.x} cy={pt.y} r="8" fill="var(--color-lime)" fillOpacity="0.32" />
                                )}
                                <circle
                                  cx={pt.x}
                                  cy={pt.y}
                                  r={isSelected ? '4.5' : '3'}
                                  fill={isSelected ? 'var(--color-lime)' : '#FFFFFF'}
                                  stroke="var(--color-forest)"
                                  strokeWidth="2"
                                />
                                <text
                                  x={pt.x}
                                  y={height - 6}
                                  textAnchor="middle"
                                  fontSize="10.5"
                                  fill={isSelected ? 'var(--color-ink)' : 'var(--color-soft)'}
                                  fontWeight={isSelected ? '600' : '400'}
                                >
                                  {pt.month}
                                </text>
                              </g>
                            )
                          })}
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Right (~35%): Sales Goal Panel */}
                  <div className="flex flex-col justify-between rounded-xl border border-line bg-paper/50 p-4 lg:col-span-4">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-[13px] font-medium text-ink" title={data.goal.title}>
                          {data.goal.title}
                        </span>
                        <span className="shrink-0 whitespace-nowrap rounded-full bg-sage px-2 py-0.5 text-[11px] font-medium tabular-nums text-forest">
                          {data.goal.percent}%
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-baseline gap-1.5 tabular-nums">
                        <span className="text-[20px] font-medium tracking-[-0.02em] text-ink">
                          {data.goal.current}
                        </span>
                        <span className="text-[11.5px] text-muted">of {data.goal.target}</span>
                      </div>

                      <div className="mt-3 flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full bg-sage p-0.5">
                        {data.goal.segments.map((seg) => {
                          const clampedWidth = Math.max(0, seg.pct * scaleFactor)
                          return (
                            <div
                              key={seg.label}
                              style={{ width: `${clampedWidth}%` }}
                              className="h-full overflow-hidden rounded-full"
                              title={`${seg.label}: ${seg.amount}`}
                            >
                              <div
                                className="h-full w-full origin-left rounded-full transition-transform duration-[280ms] ease-[var(--ease-out)]"
                                style={{
                                  backgroundColor: seg.colorVar,
                                  transform: `scaleX(${clampedWidth > 0 ? 1 : 0})`,
                                }}
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 border-t border-line pt-3">
                      {data.goal.segments.map((seg) => (
                        <div key={seg.label} className="flex items-center justify-between gap-2 text-[11.5px]">
                          <span className="flex min-w-0 items-center gap-2 text-ink-secondary">
                            <span
                              className="h-2 w-2 shrink-0 rounded-full"
                              style={{ backgroundColor: seg.colorVar }}
                            />
                            <span className="truncate">{seg.label}</span>
                          </span>
                          <span className="shrink-0 font-medium tabular-nums text-ink">{seg.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeNav === 'Pipeline' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h2 className="text-[18px] font-medium tracking-[-0.02em] text-ink">Sales Pipeline</h2>
                    <p className="text-[12px] text-muted">Click any open deal card to advance its stage</p>
                  </div>
                  <span className="rounded-full bg-sage px-2.5 py-0.5 text-[11px] font-medium tabular-nums text-forest">
                    {pluralize(miniDeals.length, 'deal')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {PIPELINE_STAGES.map((stage, sIdx) => {
                    const stageDeals = miniDeals.filter((d) => d.stage === sIdx)
                    return (
                      <div key={stage} className="min-w-0 rounded-xl border border-line bg-canvas p-2.5">
                        <div className="mb-2 flex items-center justify-between px-1 text-[11.5px]">
                          <span className="truncate font-medium text-ink-secondary">{stage}</span>
                          <span className="tabular-nums text-soft">{stageDeals.length}</span>
                        </div>
                        <div className="space-y-2">
                          {stageDeals.map((deal) => {
                            const done = deal.stage === PIPELINE_STAGES.length - 1
                            return (
                              <button
                                key={deal.id}
                                type="button"
                                disabled={done}
                                onClick={() => advanceMiniDeal(deal.id)}
                                className="w-full rounded-lg border border-line bg-white p-2.5 text-left transition-[transform,border-color] duration-[160ms] ease-[var(--ease-out)] enabled:hover:border-forest/40 enabled:active:scale-[0.98] disabled:cursor-default"
                              >
                                <div className="truncate text-[12px] font-medium text-ink" title={deal.company}>
                                  {deal.company}
                                </div>
                                <div className="mt-1 flex items-center justify-between gap-1 text-[11px] tabular-nums text-muted">
                                  <span className="truncate">{deal.value}</span>
                                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage text-[9px] font-medium text-forest">
                                    {getInitials(deal.owner)}
                                  </span>
                                </div>
                              </button>
                            )
                          })}
                          {stageDeals.length === 0 && (
                            <div className="rounded-lg border border-dashed border-line-strong py-5 text-center text-[11px] text-soft">
                              No deals
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {activeNav === 'Contacts' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h2 className="text-[18px] font-medium tracking-[-0.02em] text-ink">Contacts</h2>
                    <p className="text-[12px] text-muted">Shared relationship records for {workspace}</p>
                  </div>
                  <span className="rounded-full bg-sage px-2.5 py-0.5 text-[11px] font-medium tabular-nums text-forest">
                    {pluralize(DEMO_CONTACTS.length, 'contact')}
                  </span>
                </div>
                <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
                  {DEMO_CONTACTS.map((c) => (
                    <li key={c.id} className="flex items-start justify-between gap-3 px-4 py-3 hover:bg-paper">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage text-[10.5px] font-medium text-forest">
                          {getInitials(c.name)}
                        </span>
                        <div className="min-w-0">
                          <div className="truncate text-[12.5px] font-medium text-ink" title={c.name}>
                            {c.name}
                          </div>
                          <div className="text-[11px] text-muted [overflow-wrap:anywhere]">{c.email}</div>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2.5">
                        <span className="hidden text-[12px] font-medium tabular-nums text-ink sm:inline">
                          {c.value}
                        </span>
                        <span className="whitespace-nowrap rounded-full bg-sage px-2 py-0.5 text-[10.5px] font-medium text-forest">
                          {c.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeNav === 'Automations' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-[18px] font-medium tracking-[-0.02em] text-ink">Workflow Automations</h2>
                  <p className="text-[12px] text-muted">Toggle any rule to preview live workspace controls</p>
                </div>
                <ul className="space-y-2.5">
                  {automations.map((rule) => (
                    <li
                      key={rule.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper/60 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-[13px] font-medium text-ink">{rule.name}</span>
                          <span className="shrink-0 whitespace-nowrap rounded-full bg-sage px-2 py-0.5 text-[10px] font-medium tabular-nums text-forest">
                            {pluralize(rule.runs, 'run')}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-[11.5px] text-muted" title={rule.detail}>
                          {rule.detail}
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={rule.active}
                        aria-label={`Toggle ${rule.name}`}
                        onClick={() => toggleAutomation(rule.id)}
                        className={cx(
                          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-[180ms] ease-[var(--ease-out)] active:scale-[0.97]',
                          rule.active ? 'border-forest bg-forest' : 'border-line-strong bg-mist',
                        )}
                      >
                        <span
                          className={cx(
                            'h-4 w-4 rounded-full bg-white shadow-xs transition-transform duration-[180ms] ease-[var(--ease-out)]',
                            rule.active ? 'translate-x-5' : 'translate-x-1',
                          )}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeNav === 'Analytics' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-[18px] font-medium tracking-[-0.02em] text-ink">Stage Conversion</h2>
                  <p className="text-[12px] text-muted">Live conversion breakdown for {data.label}</p>
                </div>
                <div className="space-y-3 rounded-xl border border-line bg-paper/50 p-4">
                  {[
                    { label: 'Discovery → Qualified', pct: 68, count: 96 },
                    { label: 'Qualified → Proposal', pct: 54, count: 52 },
                    { label: 'Proposal → Closed Won', pct: 35, count: 36 },
                  ].map((row) => (
                    <div key={row.label} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2 text-[12px]">
                        <span className="font-medium text-ink">{row.label}</span>
                        <span className="tabular-nums text-muted">
                          {row.pct}% ({pluralize(row.count, 'deal')})
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-sage">
                        <div
                          className="h-full origin-left rounded-full bg-forest transition-transform duration-[280ms] ease-[var(--ease-out)]"
                          style={{ transform: `scaleX(${row.pct / 100})` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
