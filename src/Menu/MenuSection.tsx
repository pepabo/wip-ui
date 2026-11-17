'use client'

import {
  Header as AriaHeader,
  MenuSection as AriaMenuSection,
  type MenuSectionProps as AriaMenuSectionProps,
} from 'react-aria-components'
import clsx from 'clsx'

import type { ReactNode } from 'react'

export interface MenuSectionProps<T extends object>
  extends Omit<AriaMenuSectionProps<T>, 'children'> {
  /** まとまりの見出し */
  title: string
  children: ReactNode
}

export const MenuSection = <T extends object>({
  title,
  className,
  children,
  ...props
}: MenuSectionProps<T>) => {
  return (
    <AriaMenuSection className={clsx('wip-menu-section', className)} {...props}>
      <AriaHeader className="_title">{title}</AriaHeader>
      {children}
    </AriaMenuSection>
  )
}
