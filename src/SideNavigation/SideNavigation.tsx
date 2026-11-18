import clsx from 'clsx'

import type { ReactNode } from 'react'

export interface SideNavigationProps {
  /** ナビゲーションの名前。読み上げで、ほかのナビゲーションと区別するために使う */
  'aria-label': string
  /** SideNavigationItem と SideNavigationSection */
  children: ReactNode
  /** 追加するクラス */
  className?: string
}

export const SideNavigation = ({ children, className, ...props }: SideNavigationProps) => {
  return (
    <nav className={clsx('wip-side-navigation', className)} {...props}>
      <ul className="_list">{children}</ul>
    </nav>
  )
}
