import clsx from 'clsx'

import type { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLElement> {
  /** AppBarの外観スタイル */
  appearance?: 'filled' | 'white' | 'transparent'
  /** AppBarの配置方法 */
  position?: 'fixed' | 'relative'
}

/**
 * ページ上部に配置するナビゲーションバー。
 * タイトルやアクションボタンを左右に配置できる。
 *
 * @summary ページ上部のナビゲーションバー
 */
const AppBar = ({
  appearance = 'white',
  position = 'relative',
  className,
  children,
  ...props
}: Props) => {
  const classNames = clsx(
    'wip-app-bar',
    `-appearance-${appearance}`,
    `-position-${position}`,
    className
  )

  return (
    <header className={classNames} {...props}>
      <div className="_content">{children}</div>
    </header>
  )
}

export { AppBar }
export type { Props as AppBarProps }
