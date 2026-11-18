'use client'

import { Children, createContext, isValidElement, type ReactNode, useContext } from 'react'
import clsx from 'clsx'

type StepperOrientation = 'horizontal' | 'vertical'
type StepState = 'completed' | 'current' | 'upcoming'

export interface StepperProps {
  /** 現在のステップの位置。0 始まり */
  activeIndex: number
  /** 並べる向き */
  orientation?: StepperOrientation
  /** 手順全体の、支援技術向けの名前 */
  'aria-label': string
  /** 追加するクラス */
  className?: string
  /** StepperItem */
  children: ReactNode
}

interface StepContextValue {
  number: number
  state: StepState
}

const StepContext = createContext<StepContextValue>({ number: 1, state: 'upcoming' })

export const useStepContext = () => useContext(StepContext)

const stateOf = (index: number, activeIndex: number): StepState => {
  if (index < activeIndex) return 'completed'
  if (index === activeIndex) return 'current'
  return 'upcoming'
}

export const Stepper = ({
  activeIndex,
  orientation = 'horizontal',
  'aria-label': ariaLabel,
  className,
  children,
}: StepperProps) => {
  const items = Children.toArray(children).filter(isValidElement)

  return (
    <ol
      className={clsx('wip-stepper', `-orientation-${orientation}`, className)}
      aria-label={ariaLabel}
    >
      {items.map((child, index) => (
        <StepContext.Provider
          key={child.key ?? index}
          value={{ number: index + 1, state: stateOf(index, activeIndex) }}
        >
          {child}
        </StepContext.Provider>
      ))}
    </ol>
  )
}

export type { StepperOrientation }
