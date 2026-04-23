import clsx from 'clsx'

import type { HTMLAttributes } from 'react'

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement>

/**
 * Dialogのヘッダー領域。DialogTitleを配置する。
 *
 * @summary ダイアログのヘッダー領域
 */
export const DialogHeader = ({ className, ...props }: DialogHeaderProps) => {
  return <div className={clsx('wip-dialog-header', className)} {...props} />
}
