'use client'

import { Tabs as AriaTabs, type TabsProps as AriaTabsProps } from 'react-aria-components'

interface Props extends AriaTabsProps {
  ref?: React.Ref<HTMLDivElement>
}

export const Tabs = ({ ref, children, ...props }: Props) => {
  return (
    <AriaTabs className="wip-tab" ref={ref} {...props}>
      {children}
    </AriaTabs>
  )
}

export type { Props as TabsProps }
