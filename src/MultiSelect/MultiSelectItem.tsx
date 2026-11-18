'use client'

import {
  ListBoxItem as AriaListBoxItem,
  type ListBoxItemProps as AriaListBoxItemProps,
  type Key,
} from 'react-aria-components'
import clsx from 'clsx'

import type { ReactNode } from 'react'

export interface MultiSelectItemProps
  extends Omit<AriaListBoxItemProps, 'id' | 'children' | 'className' | 'style' | 'href'> {
  /** MultiSelect の中で一意の id。選択の値になる */
  id: Key
  children: ReactNode
}

export const MultiSelectItem = ({ children, ...props }: MultiSelectItemProps) => {
  return (
    <AriaListBoxItem
      className="_item"
      textValue={typeof children === 'string' ? children : props.textValue}
      {...props}
    >
      {({ isSelected, isDisabled }) => (
        <>
          <span
            aria-hidden="true"
            className={clsx('wip-checkbox', '_checkbox', {
              '--selected': isSelected,
              '--disabled': isDisabled,
            })}
          />
          <span className="_item-label">{children}</span>
        </>
      )}
    </AriaListBoxItem>
  )
}
