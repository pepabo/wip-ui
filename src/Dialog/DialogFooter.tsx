import clsx from 'clsx'

import type { HTMLAttributes } from 'react'

export type DialogFooterProps = HTMLAttributes<HTMLDivElement>

export const DialogFooter = ({ className, ...props }: DialogFooterProps) => {
  return <div className={clsx('wip-dialog-footer', className)} {...props} />
}
