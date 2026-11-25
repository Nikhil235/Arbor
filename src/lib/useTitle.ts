import { useEffect } from 'react'

export function useTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · Arbor CRM` : 'Arbor CRM · A calmer CRM for customer relationships'
  }, [title])
}
