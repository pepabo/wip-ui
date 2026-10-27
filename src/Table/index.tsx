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
