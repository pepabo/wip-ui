'use client'

import {
  Table as AriaTable,
  Cell,
  Column,
  ColumnResizer,
  ResizableTableContainer,
  Row,
  TableBody,
  TableHeader,
  TableLoadMoreItem,
  type TableProps,
} from 'react-aria-components'
import clsx from 'clsx'

import type { FC } from 'react'
import './_index.scss'

interface Props extends TableProps {}

/**
 * データを行列形式で表示するテーブルコンポーネント。
 * ソートや行選択などのインタラクションに対応。
 *
 * @summary データ表示用テーブル
 */
export const Table: FC<Props> = ({ className, children, ...props }) => {
  const classNames = clsx('wip-table', className)

  return (
    <AriaTable className={classNames} {...props}>
      {children}
    </AriaTable>
  )
}

export {
  Cell,
  Column,
  ColumnResizer,
  ResizableTableContainer,
  Row,
  TableBody,
  TableHeader,
  TableLoadMoreItem,
}

export type { Props as TableProps }
