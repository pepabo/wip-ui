import clsx from 'clsx'

import type { HTMLAttributes } from 'react'

export type DialogFooterProps = HTMLAttributes<HTMLDivElement>

/**
 * Dialogのフッター領域。アクションボタンを配置する。
 *
 * @summary ダイアログのフッター領域
 */
export const DialogFooter = ({ className, ...props }: DialogFooterProps) => {
  return <div className={clsx('wip-dialog-footer', className)} {...props} />
}
