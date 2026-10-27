'use client'

import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components'
import clsx from 'clsx'

import type { FC, ReactNode } from 'react'
import type { ButtonAppearance, ButtonColor, ButtonSize, ButtonWidth } from './types'

interface Props extends AriaButtonProps {
  /** ボタンの外観スタイル */
  appearance?: ButtonAppearance
  /** ボタンの色テーマ */
  color?: ButtonColor
  /** ボタンのサイズ */
  size?: ButtonSize
  /** ボタンの幅 */
  width?: ButtonWidth
  /** アイコンのみで表示する */
  iconOnly?: boolean
  /** ボタンの先頭に表示するアイコン */
  leading?: ReactNode
  /** ボタンの末尾に表示するアイコン */
  trailing?: ReactNode
}

export const Button: FC<Props> = ({
  children,
  appearance = 'flat',
  color = 'neutral',
  size = 'm',
  width = 'auto',
  iconOnly = false,
  leading,
  trailing,
  className,
  ...props
}) => {
  const classNames = clsx(
    'wip-button',
    `-appearance-${appearance}`,
    `-color-${color}`,
    `-size-${size}`,
    `-width-${width}`,
    className
  )

  // leading または trailing が指定されている場合
  const hasSlots = leading !== undefined || trailing !== undefined

  return (
    <AriaButton className={classNames} {...props}>
      {(renderProps) => {
        const content = typeof children === 'function' ? children(renderProps) : children

        if (hasSlots) {
          return (
            <>
              {leading && <div className="_leading">{leading}</div>}
              {content && <div className="_body">{content}</div>}
              {trailing && <div className="_trailing">{trailing}</div>}
            </>
          )
        }

        // 従来の children のみを使用する場合
        const bodyClassName = clsx('_body', iconOnly && '_leading')
        return <div className={bodyClassName}>{content}</div>
      }}
    </AriaButton>
  )
}

export type { Props as ButtonProps }
