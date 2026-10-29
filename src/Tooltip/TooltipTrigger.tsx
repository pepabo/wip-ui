'use client'

import {
  TooltipTrigger as AriaTooltipTrigger,
  type TooltipTriggerComponentProps as AriaTooltipTriggerProps,
} from 'react-aria-components'

export type TooltipTriggerProps = AriaTooltipTriggerProps

export const TooltipTrigger = ({ delay = 0, closeDelay = 0, ...props }: TooltipTriggerProps) => {
  return <AriaTooltipTrigger delay={delay} closeDelay={closeDelay} {...props} />
}
