'use client'

import { Tabs as AriaTabs, type TabsProps as AriaTabsProps } from 'react-aria-components'

interface Props extends AriaTabsProps {
  ref?: React.Ref<HTMLDivElement>
}

/**
 * タブ切り替えUIのルートコンポーネント。TabList・Tab・TabPanelを内包する。
 *
 * @summary タブ切り替えUIのルート
 */
export const Tabs = ({ ref, children, ...props }: Props) => {
  return (
    <AriaTabs className="wip-tab" ref={ref} {...props}>
      {children}
    </AriaTabs>
  )
}

export type { Props as TabsProps }
