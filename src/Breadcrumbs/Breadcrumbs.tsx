'use client'

import {
  Breadcrumbs as AriaBreadcrumbs,
  type BreadcrumbsProps as AriaBreadcrumbsProps,
} from 'react-aria-components'
import clsx from 'clsx'

export type BreadcrumbsProps<T extends object> = AriaBreadcrumbsProps<T>

export const Breadcrumbs = <T extends object>({ className, ...props }: BreadcrumbsProps<T>) => {
  return (
    <div className="wip-breadcrumbs">
      <AriaBreadcrumbs className={clsx('_list', className)} {...props} />
    </div>
  )
}
