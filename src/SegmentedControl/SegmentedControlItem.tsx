'use client'

import {
  ToggleButton as AriaToggleButton,
  type ToggleButtonProps as AriaToggleButtonProps,
  type Key,
} from 'react-aria-components'

import type { ReactNode } from 'react'

export interface SegmentedControlItemProps
  extends Omit<AriaToggleButtonProps, 'id' | 'children' | 'className' | 'style'> {
  /** SegmentedControl の中で一意の id。選択の値になる */
  id: Key
  children: ReactNode
}

export const SegmentedControlItem = ({ children, ...props }: SegmentedControlItemProps) => {
  return (
    <AriaToggleButton className="_item" {...props}>
      <span className="_label">{children}</span>
    </AriaToggleButton>
  )
}
