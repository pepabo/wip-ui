'use client'

import {
  Breadcrumbs as AriaBreadcrumbs,
  type BreadcrumbsProps as AriaBreadcrumbsProps,
} from 'react-aria-components'
import clsx from 'clsx'

export type BreadcrumbsProps<T extends object> = AriaBreadcrumbsProps<T>

/**
 * ページ階層をナビゲーションリンクとして表示するパンくずリストコンポーネント。
 * ユーザーが現在位置を把握し、上位ページに戻れるようにする。
 *
 * @summary ページ階層のパンくずリスト
 */
export const Breadcrumbs = <T extends object>({ className, ...props }: BreadcrumbsProps<T>) => {
  return (
    <div className="wip-breadcrumbs">
      <AriaBreadcrumbs className={clsx('_list', className)} {...props} />
    </div>
  )
}
