'use client'

import { Radio as AriaRadio, type RadioProps as AriaRadioProps } from 'react-aria-components'
import clsx from 'clsx'

export type RadioProps = AriaRadioProps

/**
 * 単一選択のためのラジオボタンコンポーネント。
 * RadioGroup内で使用し、排他的な選択肢を提供する。
 *
 * @summary 単一選択のラジオボタン
 */
export const Radio = ({ className, ...props }: RadioProps) => {
  return <AriaRadio className={clsx('wip-radio', className)} {...props} />
}
