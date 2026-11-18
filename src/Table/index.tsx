'use client'

import {
  Cell as AriaCell,
  type CellProps as AriaCellProps,
  Column as AriaColumn,
  type ColumnProps as AriaColumnProps,
  Table as AriaTable,
  type TableProps as AriaTableProps,
  ColumnResizer,
  ResizableTableContainer,
  Row,
  TableBody,
  TableHeader,
  TableLoadMoreItem,
} from 'react-aria-components'
import clsx from 'clsx'

import type { FC } from 'react'
import './_index.scss'

type TableAlign = 'start' | 'center' | 'end'

interface Props extends AriaTableProps {}

export const Table: FC<Props> = ({ className, children, ...props }) => {
  return (
    // 列が置いた場所の幅に収まらないときは、表の中で横にスクロールさせる
    <div className="wip-table-container">
      <AriaTable className={clsx('wip-table', className)} {...props}>
        {children}
      </AriaTable>
    </div>
  )
}

interface ColumnProps extends Omit<AriaColumnProps, 'className'> {
  /** 列の見出しの文字の寄せ。数値や金額の列は end にする */
  align?: TableAlign
  className?: string
}

export const Column: FC<ColumnProps> = ({ align = 'start', className, ...props }) => {
  return <AriaColumn className={clsx(`-align-${align}`, className)} {...props} />
}

interface CellProps extends Omit<AriaCellProps, 'className'> {
  /** セルの文字の寄せ。同じ列の Column と同じ値にする */
  align?: TableAlign
  className?: string
}

export const Cell: FC<CellProps> = ({ align = 'start', className, ...props }) => {
  return <AriaCell className={clsx(`-align-${align}`, className)} {...props} />
}

export { ColumnResizer, ResizableTableContainer, Row, TableBody, TableHeader, TableLoadMoreItem }

export type { Props as TableProps, ColumnProps, CellProps, TableAlign }
