'use client'

import { Switch as AriaSwitch, type SwitchProps as AriaSwitchProps } from 'react-aria-components'
import clsx from 'clsx'

import { Typography } from '../Typography'

import type { ReactNode } from 'react'
import type { SwitchColor, SwitchSize } from './types'
import './_index.scss'

export type { SwitchColor, SwitchSize }

interface SwitchProps extends AriaSwitchProps {
  /** スイッチのラベルテキスト */
  label?: ReactNode
  /** スイッチのサイズ */
  size?: SwitchSize
  /** スイッチの色テーマ */
  color?: SwitchColor
}

/**
 * ON/OFFの切り替えに使用するスイッチコンポーネント。
 * 設定の有効/無効など即時反映される操作に使用。
 *
 * @summary ON/OFF切り替えスイッチ
 */
export const Switch = ({
  label,
  size = 'm',
  color = 'neutral',
  className,
  ...props
}: SwitchProps) => {
  return (
    <AriaSwitch {...props} className={clsx('aria-switch', className)}>
      <div className={clsx('wip-switch', `-size-${size}`, `-color-${color}`)}>
        <div className="_thumb" />
      </div>
      {label && (
        <Typography component="span" className="-label">
          {label}
        </Typography>
      )}
    </AriaSwitch>
  )
}

export type { SwitchProps }
