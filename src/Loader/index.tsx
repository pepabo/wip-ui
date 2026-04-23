import clsx from 'clsx'

import type { HTMLAttributes } from 'react'
import './_index.scss'

export type LoaderSize = 's' | 'm' | 'l' | 'xl' | 'xxl'

export interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  /** ローダーのサイズ */
  size?: LoaderSize
  /** ローダーの下に表示するメッセージテキスト */
  message?: string
}

/**
 * データ読み込み中の待機状態を示すローダーコンポーネント。
 * メッセージ付きで処理内容を伝えることも可能。
 *
 * @summary 読み込み中の待機インジケーター
 */
export const Loader = ({ size = 'm', message, className, ...props }: LoaderProps) => {
  return (
    <div className={clsx('wip-loader', `-size-${size}`, className)} {...props}>
      <div className="wip-loader__spinner" />
      {message && <div className="wip-loader__message">{message}</div>}
    </div>
  )
}
