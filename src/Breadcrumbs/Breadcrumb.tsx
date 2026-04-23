'use client'

import {
  Breadcrumb as AriaBreadcrumb,
  type LinkProps as AriaLinkProps,
  Link,
} from 'react-aria-components'
import clsx from 'clsx'

export type BreadcrumbProps = AriaLinkProps

/**
 * パンくずリストの個別項目。hrefを指定するとリンクになり、省略すると現在ページを示す。
 *
 * @summary パンくずリストの個別項目
 */
export const Breadcrumb = ({ className, ...props }: BreadcrumbProps) => {
  return (
    <AriaBreadcrumb className="_item">
      <Link className={clsx('_link', className)} {...props} />
    </AriaBreadcrumb>
  )
}
