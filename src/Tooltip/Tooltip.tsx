'use client'

import {
  Tooltip as AriaTooltip,
  type TooltipProps as AriaTooltipProps,
} from 'react-aria-components'
import clsx from 'clsx'

export type TooltipProps = AriaTooltipProps

export const Tooltip = ({ offset = 4, className, ...props }: TooltipProps) => {
  return <AriaTooltip className={clsx('wip-tooltip', className)} offset={offset} {...props} />
}
