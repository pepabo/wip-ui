'use client'

import { Link as AriaLink, type LinkProps as AriaLinkProps } from 'react-aria-components'
import clsx from 'clsx'

import { Icon } from '../Icon'

import type { ReactNode } from 'react'

export interface SideNavigationItemProps extends Omit<AriaLinkProps, 'children'> {
  /** 今表示しているページの項目か */
  isCurrent?: boolean
  /** 項目の先頭に表示するアイコン */
  leading?: ReactNode
  /** 項目の末尾に表示するアイコン */
  trailing?: ReactNode
  children: ReactNode
}

export const SideNavigationItem = ({
  isCurrent = false,
  leading,
  trailing,
  className,
  children,
  ...props
}: SideNavigationItemProps) => {
  // 新しいタブで開く項目は、Link と同じく、アイコンと読み上げ用の文をコンポーネントが付ける
  const opensInNewTab = props.target === '_blank'

  return (
    <li className="wip-side-navigation-item">
      <AriaLink
        className={clsx('_link', className)}
        aria-current={isCurrent ? 'page' : undefined}
        {...props}
      >
        {leading && (
          <span className="_leading" aria-hidden="true">
            {leading}
          </span>
        )}
        <span className="_label">
          {children}
          {opensInNewTab && <span className="_visually-hidden">（新しいタブで開く）</span>}
        </span>
        {trailing && (
          <span className="_trailing" aria-hidden="true">
            {trailing}
          </span>
        )}
        {opensInNewTab && (
          <span className="_trailing" aria-hidden="true">
            <Icon name="launch" />
          </span>
        )}
      </AriaLink>
    </li>
  )
}
