'use client'

import { Button as AriaButton, Heading as AriaHeading } from 'react-aria-components'
import clsx from 'clsx'

import { Icon } from '../Icon'

import type { ReactNode } from 'react'

export type AccordionTriggerHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6 | 'none'

export type AccordionTriggerIndicator = 'start' | 'end' | 'none'

export interface AccordionTriggerProps {
  /** トリガーを包む見出しのレベル。none のときは見出しにしない */
  headingLevel?: AccordionTriggerHeadingLevel
  /** 開閉の矢印を置く位置 */
  indicator?: AccordionTriggerIndicator
  /** トリガーに表示する内容 */
  children: ReactNode
  /** 追加するクラス */
  className?: string
}

export const AccordionTrigger = ({
  // アコーディオンの多くはページの中のセクションなので、見出しにするのを初期値にする
  headingLevel = 3,
  indicator = 'end',
  children,
  className,
}: AccordionTriggerProps) => {
  const button = (
    <AriaButton slot="trigger" className={clsx('_button', `-indicator-${indicator}`)}>
      {/* 先頭の矢印は右向きから下向きに、末尾の矢印は下向きから上向きに回す */}
      {/* 矢印の記号はアイコンの枠より小さく描かれるため、太字の見出しに負けないよう m にする */}
      {indicator === 'start' && (
        <Icon name="chevron_right" size="m" className="_indicator" aria-hidden="true" />
      )}
      <span className="_label">{children}</span>
      {indicator === 'end' && (
        <Icon name="chevron_down" size="m" className="_indicator" aria-hidden="true" />
      )}
    </AriaButton>
  )

  return headingLevel === 'none' ? (
    <div className={clsx('wip-accordion-trigger', className)}>{button}</div>
  ) : (
    <AriaHeading level={headingLevel} className={clsx('wip-accordion-trigger', className)}>
      {button}
    </AriaHeading>
  )
}
