import clsx from 'clsx'

import type { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {}

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
