import clsx from 'clsx'

import { responsiveClasses } from '../utils/responsiveClasses'

import type { ComponentPropsWithoutRef } from 'react'
import type { Responsive } from '../types/responsive'

export type GridSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
export type GridOffset = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

export interface GridItemProps extends ComponentPropsWithoutRef<'div'> {
  /** 占有するカラム数（1-12）。レスポンシブ対応 */
  size?: Responsive<GridSize>
  /** 左側のオフセットカラム数。レスポンシブ対応 */
  offset?: Responsive<GridOffset>
}

export const GridItem = ({ children, size, offset, className, ...rest }: GridItemProps) => {
  const classNames = clsx(
    'wip-grid-item',
    responsiveClasses('col', size),
    responsiveClasses('offset', offset),
    className
  )

  return (
    <div className={classNames} {...rest}>
      {children}
    </div>
  )
}
