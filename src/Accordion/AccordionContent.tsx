'use client'

import { DisclosurePanel as AriaDisclosurePanel } from 'react-aria-components'
import clsx from 'clsx'

import type { ReactNode } from 'react'

export interface AccordionContentProps {
  /** 開いたときに表示する内容 */
  children: ReactNode
  /** 追加するクラス */
  className?: string
}

export const AccordionContent = ({ children, className }: AccordionContentProps) => {
  return (
    <AriaDisclosurePanel className={clsx('wip-accordion-content', className)}>
      <div className="_inner">{children}</div>
    </AriaDisclosurePanel>
  )
}
