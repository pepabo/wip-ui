'use client'

import { useId } from 'react'
import {
  Label as AriaLabel,
  Meter as AriaMeter,
  type MeterProps as AriaMeterProps,
} from 'react-aria-components'
import clsx from 'clsx'

import { Icon } from '../Icon'

import type { ReactNode } from 'react'

export type MeterColor = 'neutral' | 'notice' | 'negative'

export type MeterSize = 's' | 'm'

export interface MeterProps extends Omit<AriaMeterProps, 'children'> {
  /** 今の値 */
  value?: number
  /** 範囲の最小値 */
  minValue?: number
  /** 範囲の最大値 */
  maxValue?: number
  /** 値の表示。指定しない場合は formatOptions の書式で表示する。読み上げにも使う */
  valueLabel?: string
  /** valueLabel を指定しない場合の、値の書式。初期値は % */
  formatOptions?: Intl.NumberFormatOptions
  /** メーターのラベル。指定すると、名前と値の文字をバーの上に出す */
  label?: string
  /** バーの下に表示する補足の文 */
  description?: ReactNode
  /** 値の状態を表す色 */
  color?: MeterColor
  /** バーの太さ */
  size?: MeterSize
}

export const Meter = ({
  label,
  description,
  color = 'neutral',
  size = 'm',
  className,
  'aria-describedby': ariaDescribedby,
  ...props
}: MeterProps) => {
  const descriptionId = useId()
  // 使う側が渡した説明と description の両方を、読み上げの説明として結び付ける
  const describedby =
    [ariaDescribedby, description ? descriptionId : undefined].filter(Boolean).join(' ') ||
    undefined

  return (
    <AriaMeter
      className={clsx('wip-meter', `-color-${color}`, `-size-${size}`, className)}
      aria-describedby={describedby}
      {...props}
    >
      {({ percentage, valueText }) => (
        <>
          {/* React Spectrum と同じく、label があるときだけ名前と値の文字を出す。ないときはバーだけにする */}
          {label && (
            <div className="_header">
              <AriaLabel className="_label">{label}</AriaLabel>
              <span className="_value">
                {/* 色だけに頼らないよう、注意と危険のときはアイコンも出す */}
                {color !== 'neutral' && (
                  <Icon name="exclamation_on_triangle" className="_icon" aria-hidden="true" />
                )}
                {valueText}
              </span>
            </div>
          )}
          <div className="_track">
            <div className="_fill" style={{ width: `${percentage}%` }} />
          </div>
          {description && (
            <span id={descriptionId} className="_description">
              {description}
            </span>
          )}
        </>
      )}
    </AriaMeter>
  )
}
