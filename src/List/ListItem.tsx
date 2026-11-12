'use client'

import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
} from 'react-aria-components'
import clsx from 'clsx'

import type { ReactNode } from 'react'

export interface ListItemProps extends Omit<AriaLinkProps, 'children' | 'className' | 'style'> {
  /** 行の先頭に表示するアイコンや Avatar */
  leading?: ReactNode
  /** ラベルの下に表示する補足の文 */
  description?: ReactNode
  /** 行の右端に表示する要素 */
  trailing?: ReactNode
  /** 追加するクラス */
  className?: string
  children: ReactNode
}

export const ListItem = ({
  leading,
  description,
  trailing,
  className,
  children,
  // リンクだけが持つ props。ボタンの行には渡さない
  href,
  hrefLang,
  target,
  rel,
  download,
  ping,
  referrerPolicy,
  routerOptions,
  onClick,
  ...props
}: ListItemProps) => {
  const content = (
    <>
      {/* Icon はフォントの文字で描くため、読み上げに文字が混ざらないよう隠す */}
      {leading && (
        <span className="_leading" aria-hidden="true">
          {leading}
        </span>
      )}
      <span className="_body">
        <span className="_label">{children}</span>
        {description && <span className="_description">{description}</span>}
      </span>
      {trailing && <span className="_trailing">{trailing}</span>}
    </>
  )

  // href があればリンク、onPress があればボタン、どちらもなければ押せない行にする
  const row = href ? (
    <AriaLink
      className="_row -interactive"
      href={href}
      hrefLang={hrefLang}
      target={target}
      rel={rel}
      download={download}
      ping={ping}
      referrerPolicy={referrerPolicy}
      routerOptions={routerOptions}
      onClick={onClick}
      {...props}
    >
      {content}
    </AriaLink>
  ) : props.onPress ? (
    // Link と Button の props は、onClick などの DOM のイベントの要素の型だけが違う。動きは同じなので読み替える
    <AriaButton className="_row -interactive" {...(props as unknown as AriaButtonProps)}>
      {content}
    </AriaButton>
  ) : (
    <div className="_row">{content}</div>
  )

  return <li className={clsx('wip-list-item', className)}>{row}</li>
}
