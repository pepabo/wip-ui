import clsx from 'clsx'

import { responsiveClasses } from '../utils/responsiveClasses'

import type { ElementType, FC, HTMLAttributes, ReactNode } from 'react'
import type { Responsive } from '../types/responsive'
import './_index.scss'

type TypographySize = 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl'
type TypographyDensity = 'comfort' | 'normal' | 'dense'
type TypographyFontWeight = 'normal' | 'bold'
type TypographyColor =
  | 'high_emphasis'
  | 'medium_emphasis'
  | 'low_emphasis'
  | 'informative'
  | 'positive'
  | 'notice'
  | 'negative'

interface Props extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  /** テキストのサイズ。レスポンシブ対応でブレークポイントごとに指定可能 */
  size?: Responsive<TypographySize>
  /** 行間の密度 */
  density?: TypographyDensity
  /** フォントの太さ */
  fontWeight?: TypographyFontWeight
  /** テキストのセマンティックカラー */
  color?: TypographyColor
  /** レンダリングするHTML要素 */
  component?: ElementType
}

/**
 * テキストの表示に使用するタイポグラフィコンポーネント。
 * サイズ・密度・色・太さを統一的に管理し、レスポンシブ対応も可能。
 *
 * @summary テキスト表示のためのタイポグラフィ
 */
export const Typography: FC<Props> = ({
  children,
  size = 'm',
  density = 'normal',
  fontWeight = 'normal',
  color = 'high_emphasis',
  component: Component = 'p',
  className,
}) => {
  const classNames = clsx(
    'wip-typography',
    responsiveClasses('size', size, 'm'),
    `-density-${density}`,
    `-font-weight-${fontWeight}`,
    `-color-${color}`,
    className
  )

  return <Component className={classNames}>{children}</Component>
}

export type {
  TypographySize,
  TypographyDensity,
  TypographyFontWeight,
  TypographyColor,
  Props as TypographyProps,
}
