'use client'

import { Link as AriaLink, type LinkProps as AriaLinkProps } from 'react-aria-components'
import clsx from 'clsx'

import type { FC, ReactNode } from 'react'
import type { ButtonAppearance, ButtonColor, ButtonSize, ButtonWidth } from './types'

interface Props extends AriaLinkProps {
  /** ボタンの外観スタイル */
  appearance?: ButtonAppearance
  /** ボタンの色テーマ */
  color?: ButtonColor
  /** ボタンのサイズ */
  size?: ButtonSize
  /** ボタンの幅 */
  width?: ButtonWidth
  /**
   * アイコンのみ表示する際はtrueを指定し、適切なaria-labelなどを付与してください
   */
  iconOnly?: boolean
  /**
   * ボタンの先頭のアイコンを表示する要素
   */
  leading?: ReactNode
  /**
   * ボタンの末尾のアイコンを表示する要素
   */
  trailing?: ReactNode
}

/**
 * ページ遷移を伴うボタン風のリンクコンポーネント。
 * アクションの実行にはButtonを使用してください。
 *
 * @summary ページ遷移を伴うボタン風リンク
 */
export const LinkButton: FC<Props> = ({
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
    <AriaLink className={classNames} {...props}>
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
    </AriaLink>
  )
}

export type { Props as LinkButtonProps }
