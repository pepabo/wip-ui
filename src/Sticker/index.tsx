'use client'

import clsx from 'clsx'

import type { FC, HTMLAttributes, ReactNode } from 'react'
import './_index.scss'

type StickerColor = 'neutral' | 'informative' | 'positive' | 'negative' | 'notice' | 'attention'
type StickerSize = 's' | 'm'

interface Props extends HTMLAttributes<HTMLDivElement> {
  /** ステッカーのセマンティックカラー */
  color?: StickerColor
  /** ステッカーのサイズ */
  size?: StickerSize
  children: ReactNode
}

/**
 * ステータスやカテゴリを示す小さなラベルコンポーネント。
 * タグやバッジとして情報の分類表示に使用。
 *
 * @summary ステータスやカテゴリのラベル
 */
export const Sticker: FC<Props> = ({
  color = 'neutral',
  size = 'm',
  children,
  className,
  ...props
}) => {
  const classNames = clsx('wip-sticker', `-color-${color}`, `-size-${size}`, className)

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  )
}

export type { StickerColor, Props as StickerProps, StickerSize }
