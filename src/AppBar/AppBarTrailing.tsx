import clsx from 'clsx'

import type { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {}

/**
 * AppBarの右側にコンテンツを配置するスロット。アクションアイコンやメニューに使用。
 *
 * @summary AppBarの右側スロット
 */
const AppBarTrailing = ({ children, className, ...props }: Props) => {
  const classNames = clsx('wip-app-bar-trailing', className)
  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  )
}

export { AppBarTrailing }
export type { Props as AppBarTrailingProps }
