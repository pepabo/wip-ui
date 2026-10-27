import clsx from 'clsx'

import type { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {}

const AppBarLeading = ({ children, className, ...props }: Props) => {
  const classNames = clsx('wip-app-bar-leading', className)
  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  )
}

export { AppBarLeading }
export type { Props as AppBarLeadingProps }
