import { useRef, useState } from 'react'
import { ArrowUpRight, Check, Eye, MessageSquarePlus, MoreHorizontal, RotateCcw } from 'lucide-react'
import { IMAGES } from '@/content/site'
import { BotanicalBackdrop, SampleBadge, cx } from '@/components/ui'
import { useToast } from '@/components/toast'
import { getInitials, pluralize } from '@/lib/format'
import { DEMO_CONTACTS, useDismiss, type Contact } from './previewData'

const STATUS_STYLES: Record<string, string> = {
  Qualified: 'bg-sage text-forest',
  Negotiation: 'bg-lime/40 text-ink',
  'Closed Won': 'bg-forest text-white',
  Discovery: 'bg-mist text-ink-secondary',
  'Follow-up': 'bg-amber-soft text-amber-ink',
}

/**
 * Interactive CRM Contacts Table inside Botanical Frame.
 * Hardened against long names, unbreakable emails, bottom-row menu clipping,
 * empty filter matches, and small touch targets.
 */
export function WorkflowContactsPreview() {
  const { notify } = useToast()
  const [contacts, setContacts] = useState<Contact[]>(DEMO_CONTACTS)
  const [selectedIds, setSelectedIds] = useState<string[]>(['c2'])
  const [statusFilter, setStatusFilter] = useState('All')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [modified, setModified] = useState(false)
  const tableRef = useRef<HTMLDivElement>(null)
  useDismiss(tableRef, openMenuId !== null, () => setOpenMenuId(null))

  const resetContacts = () => {
    setModified(false)
    setStatusFilter('All')
    setOpenMenuId(null)
    setContacts(DEMO_CONTACTS)
    setSelectedIds(['c2'])
  }

  const visibleContacts =
    statusFilter === 'All' ? contacts : contacts.filter((c) => c.status === statusFilter)

  const allSelected =
    visibleContacts.length > 0 && visibleContacts.every((c) => selectedIds.includes(c.id))

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(visibleContacts.map((c) => c.id))
    }
  }

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const advanceStage = (contact: Contact) => {
    const stages = ['Discovery', 'Qualified', 'Negotiation', 'Closed Won']
    const previousStage = contact.status
    const nextStage = stages[(stages.indexOf(contact.status) + 1) % stages.length]
    setContacts((prev) => prev.map((c) => (c.id === contact.id ? { ...c, status: nextStage } : c)))
    setModified(true)
    setOpenMenuId(null)
    notify(`Moved ${contact.name} to "${nextStage}"`, {
      action: {
        label: 'Undo',
        onClick: () => {
          setContacts((prev) => prev.map((c) => (c.id === contact.id ? { ...c, status: previousStage } : c)))
        },
      },
    })
  }

  return (
    <BotanicalBackdrop
      src={IMAGES.workflowFrame}
      alt=""
      overlayClassName="bg-gradient-to-br from-night/68 via-forest-dark/55 to-night/78"
      className="rounded-3xl px-4 pb-4 pt-7 shadow-[0_20px_50px_-15px_rgba(18,36,21,0.18)] sm:px-8 sm:pb-8 sm:pt-10 lg:px-10 lg:pb-10 lg:pt-12"
    >
      <div className="relative z-10 mb-3.5 flex flex-wrap items-center justify-between gap-2 text-[12px] text-on-dark-muted">
        <span className="font-medium tracking-[-0.01em] text-white/90">Shared team pipeline</span>
        <SampleBadge light>Sample contacts · fictional companies</SampleBadge>
      </div>
      <div ref={tableRef} className="relative z-10 rounded-2xl border border-line bg-white shadow-lg">
        {/* Table Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-2xl border-b border-line bg-paper px-4 py-3.5 sm:px-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[13.5px] font-medium text-ink">Active Pipeline Contacts</span>
            <span className="whitespace-nowrap rounded-full bg-sage px-2 py-0.5 text-[11px] font-medium tabular-nums text-forest">
              {pluralize(visibleContacts.length, 'record')}
            </span>
            {selectedIds.length > 0 && (
              <span className="text-[11px] tabular-nums text-muted">· {selectedIds.length} selected</span>
            )}
            {modified && (
              <button
                type="button"
                onClick={resetContacts}
                className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-2.5 py-0.5 text-[11px] font-medium text-ink-secondary transition-[transform,border-color,color] duration-[160ms] ease-[var(--ease-out)] hover:border-line-strong hover:text-ink active:scale-[0.97]"
              >
                <RotateCcw className="h-3 w-3" aria-hidden />
                Reset
              </button>
            )}
          </div>

          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
            {['All', 'Qualified', 'Negotiation', 'Closed Won'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                aria-pressed={statusFilter === st}
                className={cx(
                  'whitespace-nowrap rounded-lg px-2.5 py-1 text-[11.5px] transition-[transform,background-color,border-color,color] duration-[160ms] ease-[var(--ease-out)] active:scale-[0.97]',
                  statusFilter === st
                    ? 'bg-forest font-medium text-white'
                    : 'border border-line bg-white text-muted hover:text-ink',
                )}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Scrollable Table Container */}
        <div className="overflow-x-auto rounded-b-2xl">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-white text-[11px] uppercase tracking-wider text-muted">
                <th className="w-12 py-3 pl-4 pr-2">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    aria-label="Select all contacts"
                    aria-pressed={allSelected}
                    className="-m-2 inline-flex p-2.5 transition-transform duration-[160ms] ease-[var(--ease-out)] active:scale-[0.95]"
                  >
                    <span
                      className={cx(
                        'flex h-4 w-4 items-center justify-center rounded border transition-colors duration-[150ms] ease-[var(--ease-out)]',
                        allSelected
                          ? 'border-forest bg-forest text-white'
                          : 'border-line-strong bg-white hover:border-forest',
                      )}
                    >
                      {allSelected && <Check className="h-2.5 w-2.5" strokeWidth={2.5} aria-hidden />}
                    </span>
                  </button>
                </th>
                <th className="px-3 py-3 font-medium">Contact</th>
                <th className="px-3 py-3 font-medium">Company</th>
                <th className="px-3 py-3 font-medium">Stage</th>
                <th className="px-3 py-3 font-medium">Deal Value</th>
                <th className="px-3 py-3 font-medium">Owner</th>
                <th className="py-3 pl-3 pr-5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-[13px]">
              {visibleContacts.length > 0 ? (
                visibleContacts.map((contact, rowIdx) => {
                  const isSelected = selectedIds.includes(contact.id)
                  const openUpward = rowIdx >= visibleContacts.length - 2 && visibleContacts.length > 2
                  return (
                    <tr
                      key={contact.id}
                      className={cx(
                        'transition-colors duration-[150ms] ease-[var(--ease-out)]',
                        isSelected ? 'bg-sage-soft' : 'hover:bg-paper',
                      )}
                    >
                      <td className="py-3.5 pl-4 pr-2 align-top">
                        <button
                          type="button"
                          onClick={() => toggleRow(contact.id)}
                          aria-label={`Select ${contact.name}`}
                          aria-pressed={isSelected}
                          className="-m-2 inline-flex p-2.5 transition-transform duration-[160ms] ease-[var(--ease-out)] active:scale-[0.95]"
                        >
                          <span
                            className={cx(
                              'flex h-4 w-4 items-center justify-center rounded border transition-colors duration-[150ms] ease-[var(--ease-out)]',
                              isSelected
                                ? 'border-forest bg-forest text-white'
                                : 'border-line-strong bg-white hover:border-forest',
                            )}
                          >
                            {isSelected && <Check className="h-2.5 w-2.5" strokeWidth={2.5} aria-hidden />}
                          </span>
                        </button>
                      </td>

                      <td className="px-3 py-3.5 align-top">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage text-[11.5px] font-medium text-forest">
                            {getInitials(contact.name)}
                          </span>
                          <div className="min-w-0 max-w-[240px]">
                            <div className="font-medium leading-snug text-ink">{contact.name}</div>
                            <div className="mt-0.5 text-[11.5px] leading-snug text-muted [overflow-wrap:anywhere]">
                              {contact.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="max-w-[180px] px-3 py-3.5 align-top font-medium text-ink-secondary">
                        <span className="line-clamp-2" title={contact.company}>
                          {contact.company}
                        </span>
                      </td>

                      <td className="px-3 py-3.5 align-top">
                        <span
                          className={cx(
                            'inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11.5px] font-medium',
                            STATUS_STYLES[contact.status] || 'bg-sage text-forest',
                          )}
                        >
                          {contact.status}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-3 py-3.5 align-top font-medium tabular-nums text-ink">
                        {contact.value}
                      </td>

                      <td className="whitespace-nowrap px-3 py-3.5 align-top text-[12.5px] text-muted">
                        {contact.owner}
                      </td>

                      <td className="relative py-2.5 pl-3 pr-4 text-right align-top">
                        <button
                          type="button"
                          onClick={() => setOpenMenuId(openMenuId === contact.id ? null : contact.id)}
                          aria-label={`Actions for ${contact.name}`}
                          aria-expanded={openMenuId === contact.id}
                          aria-haspopup="menu"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted transition-[transform,background-color,color] duration-[160ms] ease-[var(--ease-out)] hover:bg-sage/70 hover:text-ink active:scale-[0.95]"
                        >
                          <MoreHorizontal className="h-4 w-4" aria-hidden />
                        </button>

                        {openMenuId === contact.id && (
                          <div
                            role="menu"
                            className={cx(
                              'popover-surface absolute right-4 z-30 w-44 rounded-xl border border-line bg-white py-1.5 text-left shadow-lg',
                              openUpward ? 'bottom-full mb-1 origin-bottom-right' : 'top-12 origin-top-right',
                            )}
                          >
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setOpenMenuId(null)
                                notify(`Opened profile for ${contact.name}`)
                              }}
                              className="flex w-full items-center gap-2 px-3 py-2 text-[12px] text-ink transition-colors hover:bg-canvas"
                            >
                              <Eye className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden />
                              View Profile
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setOpenMenuId(null)
                                notify(`Logged follow-up note for ${contact.company}`)
                              }}
                              className="flex w-full items-center gap-2 px-3 py-2 text-[12px] text-ink transition-colors hover:bg-canvas"
                            >
                              <MessageSquarePlus className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden />
                              Log Activity
                            </button>
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => advanceStage(contact)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-[12px] font-medium text-forest transition-colors hover:bg-canvas"
                            >
                              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                              Move Stage
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-[14px] font-medium text-ink">No contacts in &ldquo;{statusFilter}&rdquo;</p>
                    <p className="mt-1 text-[12.5px] text-muted">
                      Try switching back to All or resetting the sample records.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (statusFilter !== 'All') setStatusFilter('All')
                        else resetContacts()
                      }}
                      className="mt-4 inline-flex items-center rounded-full border border-line bg-paper px-3.5 py-1.5 text-[12px] font-medium text-ink transition-[transform,border-color] duration-[160ms] ease-[var(--ease-out)] hover:border-line-strong active:scale-[0.97]"
                    >
                      {statusFilter !== 'All' ? 'Show all records' : 'Reset sample contacts'}
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </BotanicalBackdrop>
  )
}
