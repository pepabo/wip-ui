'use client'

import {
  Disclosure as AriaDisclosure,
  type DisclosureProps as AriaDisclosureProps,
  type Key,
} from 'react-aria-components'
import clsx from 'clsx'

import type { ReactNode } from 'react'

// 開閉の状態は Accordion の expandedKeys で決まり、項目ごとの指定は効かないため外す
export interface AccordionItemProps
  extends Omit<
    AriaDisclosureProps,
    'children' | 'isExpanded' | 'defaultExpanded' | 'onExpandedChange'
  > {
  /** セクションの id。Accordion の defaultExpandedKeys と expandedKeys で、このセクションを指す */
  id?: Key
  /** セクションを使えない状態にするか */
  isDisabled?: boolean
  /** AccordionTrigger と AccordionContent */
  children: ReactNode
}

export const AccordionItem = ({ className, children, ...props }: AccordionItemProps) => {
  return (
    <AriaDisclosure className={clsx('wip-accordion-item', className)} {...props}>
      {children}
    </AriaDisclosure>
  )
}
