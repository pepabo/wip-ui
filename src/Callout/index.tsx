import React from 'react'
import clsx from 'clsx'

import { Icon } from '../Icon'

import type { HTMLAttributes } from 'react'
import './_index.scss'

type CalloutColor = 'informative' | 'neutral' | 'negative' | 'notice' | 'positive'
type CalloutAppearance = 'flat' | 'outline'

export interface CalloutProps extends HTMLAttributes<HTMLDivElement> {
  /** コールアウトのセマンティックカラー */
  color?: CalloutColor
  /** コールアウトの外観スタイル */
  appearance?: CalloutAppearance
  children: React.ReactNode
  /** 右側に表示するアクション要素（ボタンやアイコン） */
  action?: React.ReactNode
}

const getIcon = (color: CalloutColor) => {
  switch (color) {
    case 'negative':
    case 'notice':
      return 'exclamation_on_triangle'
    case 'positive':
      return 'check_on_circle'
    default:
      return 'info_on_circle'
  }
}

/**
 * 重要な情報やステータスをユーザーに伝えるコールアウトコンポーネント。
 * 色でメッセージの種類（情報・成功・警告・エラー）を表現。
 *
 * @summary 重要情報の通知バナー
 */
export const Callout = ({
  color = 'informative',
  appearance = 'flat',
  children,
  action,
  className,
  ...props
}: CalloutProps) => {
  const classNames = clsx(
    'wip-callout',
    `-color-${color}`,
    `-appearance-${appearance}`,
    action && '-has-action',
    className
  )

  const actionElement = action ? React.cloneElement(action as React.ReactElement) : null

  return (
    <div className={classNames} {...props}>
      <Icon name={getIcon(color)} className="wip-callout-icon" />
      <div className="wip-callout-content">{children}</div>
      {actionElement}
    </div>
  )
}
