'use client'

import {
  Dialog as AriaDialog,
  type DialogProps as AriaDialogProps,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  type ModalOverlayProps,
} from 'react-aria-components'
import clsx from 'clsx'

export type DialogProps = Omit<ModalOverlayProps, 'children'> & {
  children?: AriaDialogProps['children']
  role?: AriaDialogProps['role']
}

/**
 * モーダルダイアログコンポーネント。
 * 確認メッセージやフォーム入力など、ユーザーの注意を集中させる操作に使用。
 *
 * @summary モーダルダイアログ
 */
export const Dialog = ({
  className,
  isDismissable = true,
  children,
  role,
  ...props
}: DialogProps) => {
  return (
    <AriaModalOverlay
      isDismissable={isDismissable}
      className={clsx('wip-dialog-overlay', className)}
      {...props}
    >
      <AriaModal className="wip-dialog-modal">
        <AriaDialog className="wip-dialog" role={role}>
          {children}
        </AriaDialog>
      </AriaModal>
    </AriaModalOverlay>
  )
}
