import { useEffect, useRef, useState, type ElementType, type ReactNode, type RefObject } from 'react'
import type { JSX } from 'react'
import { cx } from '../lib/utils'

interface Props {
  children: ReactNode
  delay?: number
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function Reveal({ children, delay = 0, className, as: Tag = 'div' }: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const Component = Tag as unknown as ElementType
  return (
    <Component
      ref={ref as RefObject<HTMLElement>}
      className={cx('transition-all duration-700 ease-out', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3', className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  )
}
