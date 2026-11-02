import clsx from 'clsx'

import type { HTMLAttributes } from 'react'

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement>

export const DialogHeader = ({ className, ...props }: DialogHeaderProps) => {
  return <div className={clsx('wip-dialog-header', className)} {...props} />
}
