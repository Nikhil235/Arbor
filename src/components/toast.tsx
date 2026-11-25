import { createContext, useCallback, useContext, type ReactNode } from 'react'
import { Toaster, toast } from 'sonner'
import { X } from 'lucide-react'

export type ToastAction = {
  label: string
  onClick: () => void
}

export type ToastOptions = {
  action?: ToastAction
  duration?: number
}

type ToastContextValue = {
  notify: (message: string, options?: ToastOptions) => void
}

const ToastContext = createContext<ToastContextValue>({ notify: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const notify = useCallback((message: string, options?: ToastOptions) => {
    toast.custom(
      (id) => (
        <div
          role="status"
          className="flex items-center gap-3 rounded-full border border-white/15 bg-ink py-2.5 pl-4 pr-2.5 text-[13px] text-white shadow-[0_18px_40px_-14px_rgba(17,33,20,0.45)]"
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-lime" aria-hidden />
          <span className="min-w-0 flex-1 leading-snug">{message}</span>
          {options?.action && (
            <button
              type="button"
              onClick={() => {
                options.action?.onClick()
                toast.dismiss(id)
              }}
              className="shrink-0 rounded-full bg-white/12 px-2.5 py-1 text-[12px] font-medium text-lime transition-[transform,background-color] duration-[160ms] ease-[var(--ease-out)] hover:bg-white/20 active:scale-[0.97]"
            >
              {options.action.label}
            </button>
          )}
          <button
            type="button"
            onClick={() => toast.dismiss(id)}
            aria-label="Dismiss notification"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/70 transition-[transform,background-color,color] duration-[160ms] ease-[var(--ease-out)] hover:bg-white/10 hover:text-white active:scale-[0.95]"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      ),
      { duration: options?.duration ?? 4000 },
    )
  }, [])

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <Toaster position="bottom-right" offset={20} mobileOffset={16} visibleToasts={3} closeButton={false} />
    </ToastContext.Provider>
  )
}
