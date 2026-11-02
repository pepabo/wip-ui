import clsx from 'clsx'

import type { HTMLAttributes } from 'react'

export type DialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>

export const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => {
  return <p className={clsx('wip-dialog-description', className)} {...props} />
}
