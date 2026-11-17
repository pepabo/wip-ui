'use client'

import {
  MenuItem as AriaMenuItem,
  type MenuItemProps as AriaMenuItemProps,
  Text as AriaText,
} from 'react-aria-components'
import clsx from 'clsx'

import type { ReactNode } from 'react'

export type MenuItemColor = 'neutral' | 'negative'

export interface MenuItemProps extends Omit<AriaMenuItemProps, 'children'> {
  /** 項目の色。negative で削除などの破壊的な操作を表す */
  color?: MenuItemColor
  /** 項目の先頭に表示するアイコン */
  leading?: ReactNode
  /** 項目の末尾に表示する要素 */
  trailing?: ReactNode
  /** ラベルの下に表示する補足の文。押せない理由などを書く */
  description?: ReactNode
  children: ReactNode
}

export const MenuItem = ({
  color = 'neutral',
  leading,
  trailing,
  description,
  className,
  children,
  ...props
}: MenuItemProps) => {
  const textValue = props.textValue ?? (typeof children === 'string' ? children : undefined)
  return (
    <AriaMenuItem
      className={clsx('wip-menu-item', `-color-${color}`, className)}
      textValue={textValue}
      {...props}
    >
      {/* Icon はフォントの文字で描くため、読み上げに文字が混ざらないよう隠す */}
      {leading && (
        <span className="_leading" aria-hidden="true">
          {leading}
        </span>
      )}
      <span className="_body">
        <AriaText slot="label" className="_label">
          {children}
        </AriaText>
        {description && (
          <AriaText slot="description" className="_description">
            {description}
          </AriaText>
        )}
      </span>
      {trailing && (
        <span className="_trailing" aria-hidden="true">
          {trailing}
        </span>
      )}
    </AriaMenuItem>
  )
}
