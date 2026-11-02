'use client'

import {
  Heading as AriaHeading,
  type HeadingProps as AriaHeadingProps,
} from 'react-aria-components'
import clsx from 'clsx'

export type DialogTitleProps = AriaHeadingProps

export const DialogTitle = ({ className, ...props }: DialogTitleProps) => {
  return <AriaHeading slot="title" className={clsx('wip-dialog-title', className)} {...props} />
}
