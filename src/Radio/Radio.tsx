'use client'

import { Radio as AriaRadio, type RadioProps as AriaRadioProps } from 'react-aria-components'
import clsx from 'clsx'

export type RadioProps = AriaRadioProps

export const Radio = ({ className, ...props }: RadioProps) => {
  return <AriaRadio className={clsx('wip-radio', className)} {...props} />
}
