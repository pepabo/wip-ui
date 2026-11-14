'use client'

import clsx from 'clsx'

import type { FC, HTMLAttributes } from 'react'
import './_index.scss'

type StatusIndicatorColor = 'neutral' | 'informative' | 'positive' | 'negative' | 'notice'

// children は受け取らない。文言は label で渡す
interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** 状態を表す色 */
  color?: StatusIndicatorColor
  /** 処理中であることを、丸の代わりに回る印で示す */
  isPending?: boolean
  /** 状態の文言。指定しない場合は丸だけを表示する */
  label?: string
}

export const StatusIndicator: FC<Props> = ({
  color = 'neutral',
  isPending = false,
  label,
  className,
  'aria-label': ariaLabel,
  ...props
}) => {
  return (
    <span className={clsx('wip-status-indicator', `-color-${color}`, className)} {...props}>
      <span className={isPending ? '_spinner' : '_dot'} aria-hidden="true" />
      {label ? (
        <span className="_label">{label}</span>
      ) : (
        // 丸だけのときは、aria-label の文言を見えない文字として置く。
        // role="img" で名前を付けると「画像」と読まれるため、前後の文字とつながって読まれる形にする
        <span className="_hidden-label">{ariaLabel}</span>
      )}
    </span>
  )
}

export type { StatusIndicatorColor, Props as StatusIndicatorProps }
