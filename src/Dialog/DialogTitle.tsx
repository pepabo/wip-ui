'use client'

import {
  Heading as AriaHeading,
  type HeadingProps as AriaHeadingProps,
} from 'react-aria-components'
import clsx from 'clsx'

export type DialogTitleProps = AriaHeadingProps

/**
 * Dialogのタイトルテキスト。DialogHeader内に配置する。
 *
 * @summary ダイアログのタイトル
 */
export const DialogTitle = ({ className, ...props }: DialogTitleProps) => {
  return <AriaHeading slot="title" className={clsx('wip-dialog-title', className)} {...props} />
}
