import clsx from 'clsx'

import { responsiveClasses } from '../utils/responsiveClasses'

import type { ComponentPropsWithoutRef } from 'react'
import type { Responsive } from '../types/responsive'

export type GridAlignContent =
  | 'start'
  | 'end'
  | 'center'
  | 'stretch'
  | 'space-around'
  | 'space-between'
export type GridJustifyContent =
  | 'start'
  | 'end'
  | 'center'
  | 'stretch'
  | 'space-around'
  | 'space-between'
export type GridGapSize = 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl'
export type GridDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse'
export type GridWrap = 'wrap' | 'nowrap' | 'wrap-reverse'

export interface GridProps extends ComponentPropsWithoutRef<'div'> {
  /** グリッドアイテム間のスペース。レスポンシブ対応 */
  spacing?: Responsive<GridGapSize>
  /** trueにするとアイテム間のスペースを0にする */
  gapless?: boolean
  /** 複数行のアイテムの垂直方向の配置 */
  alignContent?: GridAlignContent
  /** アイテムの水平方向の配置 */
  justifyContent?: GridJustifyContent
  /** アイテムの並び方向 */
  direction?: GridDirection
  /** アイテムの折り返し設定 */
  wrap?: GridWrap
  /** グリッドのカラム数 */
  columns?: number
}

/**
 * 12カラムグリッドベースのレイアウトコンポーネント。
 * GridItemと組み合わせてレスポンシブなカラムレイアウトを構築する。
 *
 * @summary 12カラムグリッドレイアウト
 */
export const Grid = ({
  children,
  spacing,
  gapless = false,
  alignContent,
  justifyContent,
  direction = 'row',
  wrap = 'wrap',
  className,
  ...rest
}: GridProps) => {
  const classNames = clsx(
    'wip-grid-container',
    gapless && '-is-gapless',
    !gapless && responsiveClasses('spacing', spacing),
    alignContent && `-align-content-${alignContent}`,
    justifyContent && `-justify-content-${justifyContent}`,
    direction && `-direction-${direction}`,
    wrap && `-wrap-${wrap}`,
    className
  )

  return (
    <div className={classNames} {...rest}>
      {children}
    </div>
  )
}
