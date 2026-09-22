'use client'

import React from 'react'
import { cn } from 'cn'

interface TimelineAnimationProps
  extends React.HTMLAttributes<HTMLDivElement> {
  timelineRef: React.RefObject<HTMLDivElement | null>
  animationNum: number
  as?: React.ElementType
}

export const TimelineAnimation = React.forwardRef<
  HTMLDivElement,
  TimelineAnimationProps
>(({ timelineRef, animationNum, as: Component = 'div', className, children, ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    if (!timelineRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1,
      }
    )

    observer.observe(timelineRef.current)
    return () => observer.disconnect()
  }, [timelineRef])

  return (
    <Component
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8',
        className
      )}
      style={{
        transitionDelay: `${animationNum * 100}ms`,
      }}
      {...props}
    >
      {children}
    </Component>
  )
})

TimelineAnimation.displayName = 'TimelineAnimation'