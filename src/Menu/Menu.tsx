'use client'

import {
  Menu as AriaMenu,
  type MenuProps as AriaMenuProps,
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
} from 'react-aria-components'
import clsx from 'clsx'

export { MenuTrigger, type MenuTriggerProps } from 'react-aria-components'

export interface MenuProps<T extends object> extends AriaMenuProps<T> {
  /** トリガーに対してメニューを表示する位置 */
  placement?: AriaPopoverProps['placement']
}

export const Menu = <T extends object>({
  placement = 'bottom start',
  className,
  ...props
}: MenuProps<T>) => {
  return (
    <AriaPopover className="wip-menu-popover" placement={placement} offset={4}>
      <AriaMenu className={clsx('wip-menu', className)} {...props} />
    </AriaPopover>
  )
}
