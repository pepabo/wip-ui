import clsx from 'clsx'

import type { HTMLAttributes } from 'react'

export type DialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>

/**
 * Dialogの説明テキスト。ダイアログの本文を配置する。
 *
 * @summary ダイアログの説明テキスト
 */
export const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => {
  return <p className={clsx('wip-dialog-description', className)} {...props} />
}
