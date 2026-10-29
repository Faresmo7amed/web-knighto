'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import d from './dash.module.css'

type Push = (message: string, kind?: 'ok' | 'error') => void
const ToastContext = createContext<Push>(() => {})

// Parent of every dashboard screen. Gives `useToast()` so any child can show a success or error toast.
export function ToastProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<{ id: number; message: string; kind: string }[]>([])
    const push = useCallback<Push>((message, kind = 'ok') => {
        const id = Math.random()
        setItems((list) => [...list, { id, message, kind }])
        setTimeout(() => setItems((list) => list.filter((item) => item.id !== id)), 4500)
    }, [])
    return (
        <ToastContext.Provider value={push}>
            {children}
            <div className={d.toasts} role="status" aria-live="polite">
                {items.map((item) => <div key={item.id} className={`${d.toast} ${item.kind === 'error' ? d.toastError : ''}`}>{item.message}</div>)}
            </div>
        </ToastContext.Provider>
    )
}

// Returns the function that shows a toast. Use inside any dashboard client component.
export const useToast = () => useContext(ToastContext)