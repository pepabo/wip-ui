'use client'

import { Link as AriaLink, type LinkProps as AriaLinkProps } from 'react-aria-components'
import clsx from 'clsx'

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
        <span className="_label">{children}</span>
        {trailing && (
          <span className="_trailing" aria-hidden="true">
            {trailing}
          </span>
        )}
      </AriaLink>
    </li>
  )
}
