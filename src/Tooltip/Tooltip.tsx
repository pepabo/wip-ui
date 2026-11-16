'use client'

import {
  Tooltip as AriaTooltip,
  type TooltipProps as AriaTooltipProps,
} from 'react-aria-components'
import clsx from 'clsx'

// トリガーとの距離は固定で、使う側に変えさせない
export type TooltipProps = Omit<AriaTooltipProps, 'offset' | 'crossOffset'>

export const Tooltip = ({ className, ...props }: TooltipProps) => {
  return <AriaTooltip className={clsx('wip-tooltip', className)} offset={4} {...props} />
}
