import type { ComponentProps } from 'react'

export interface PaperProps extends ComponentProps<'div'> {
  /** 影の強さ（0-6）。値が大きいほど浮き上がって見える */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /** trueにするとボーダー表示になり影が無効化される */
  outlined?: boolean
  /** trueにすると角丸を無効化する */
  square?: boolean
}

/**
 * 影やボーダーで浮き上がった面を表現するサーフェスコンポーネント。
 * カード的なUIの背景として使用。
 *
 * @summary 影付きサーフェス（カード背景）
 */
export function Paper({
  elevation = 1,
  outlined = false,
  square = false,
  className,
  ...props
}: PaperProps) {
  const effectiveElevation = outlined ? 0 : elevation
  const elevationClass = `wip-paper--elevation-${effectiveElevation}`
  const outlinedClass = outlined ? 'wip-paper--outlined' : ''
  const squareClass = square ? 'wip-paper--square' : ''
  const classes = ['wip-paper', elevationClass, outlinedClass, squareClass, className]
    .filter(Boolean)
    .join(' ')

  return <div className={classes} {...props} />
}
