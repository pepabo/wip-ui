'use client'

import { Link as AriaLink, type LinkProps as AriaLinkProps } from 'react-aria-components'
import clsx from 'clsx'

import { Icon } from '../Icon'

import type { FC } from 'react'
import './_index.scss'

type LinkColor = 'neutral' | 'white'

interface Props extends AriaLinkProps {
  /** リンクの色。white は暗い背景の上に置くときに使う */
  color?: LinkColor
  /** target が _blank のときに付く、新しいタブで開くことを示すアイコンを消す */
  hideNewTabIcon?: boolean
}

export const Link: FC<Props> = ({
  children,
  color = 'neutral',
  hideNewTabIcon = false,
  className,
  ...props
}) => {
  const classNames = clsx('wip-link', `-color-${color}`, className)
  const opensInNewTab = props.target === '_blank'

  return (
    <AriaLink className={classNames} {...props}>
      {(renderProps) => {
        const content = typeof children === 'function' ? children(renderProps) : children
        if (!opensInNewTab) return content
        return (
          <>
            {content}
            {!hideNewTabIcon && <Icon name="launch" className="_new-tab-icon" aria-hidden="true" />}
            <span className="_visually-hidden">（新しいタブで開く）</span>
          </>
        )
      }}
    </AriaLink>
  )
}

export type { LinkColor, Props as LinkProps }
