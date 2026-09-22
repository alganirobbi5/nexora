'use client'

import React from 'react'
import { cn } from 'cn'

interface MotionDrawerProps {
  children: React.ReactNode
  direction?: 'left' | 'right'
  width?: number
  contentClassName?: string
  btnClassName?: string
}

export const MotionDrawer = ({
  children,
  direction = 'left',
  width = 280,
  contentClassName = '',
  btnClassName = '',
}: MotionDrawerProps) => {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'relative z-50 flex items-center justify-center rounded-full p-2 transition-colors',
          'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          btnClassName
        )}
        aria-label="Open menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'relative z-50 flex items-center justify-center rounded-full p-2 transition-colors',
          'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          btnClassName
        )}
        aria-label="Open menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={cn(
          `fixed inset-y-0 ${direction === 'left' ? 'left-0' : 'right-0'} z-50 flex flex-col w-[${width}px] max-w-full`,
          'bg-surface border-r border-surface-border shadow-xl animate-slide-in-right',
          contentClassName
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-surface-border p-4">
            <span className="font-semibold">Menu</span>
            <button
              onClick={() => setOpen(false)}
              className={cn(
                'rounded-lg p-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
              aria-label="Close menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        </div>
      </aside>
    </>
  )
}