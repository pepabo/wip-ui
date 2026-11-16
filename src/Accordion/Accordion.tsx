'use client'

import {
  DisclosureGroup as AriaDisclosureGroup,
  type DisclosureGroupProps as AriaDisclosureGroupProps,
  type Key,
} from 'react-aria-components'
import clsx from 'clsx'

import type { ReactNode } from 'react'

export interface AccordionProps extends Omit<AriaDisclosureGroupProps, 'children'> {
  /** 複数のセクションを同時に開けるか */
  allowsMultipleExpanded?: boolean
  /** 最初に開いておくセクションの id */
  defaultExpandedKeys?: Iterable<Key>
  /** 開いているセクションの id。指定すると、開閉をサービスの側で管理する */
  expandedKeys?: Iterable<Key>
  /** セクションが開閉されたときに、開いているセクションの id を受け取る */
  onExpandedChange?: (keys: Set<Key>) => void
  /** すべてのセクションを使えない状態にするか */
  isDisabled?: boolean
  /** セクションの間に区切り線を入れるか */
  divided?: boolean
  /** AccordionItem */
  children: ReactNode
}

export const Accordion = ({
  // 別のセクションを開いたときに、見ていたセクションが勝手に閉じないよう、複数開けるのを初期値にする
  allowsMultipleExpanded = true,
  divided = false,
  className,
  children,
  ...props
}: AccordionProps) => {
  return (
    <AriaDisclosureGroup
      className={clsx('wip-accordion', divided && '-divided', className)}
      allowsMultipleExpanded={allowsMultipleExpanded}
      {...props}
    >
      {children}
    </AriaDisclosureGroup>
  )
}
