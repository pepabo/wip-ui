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
  /** 外部のサイトを新しいタブで開く。末尾にアイコンを付ける */
  external?: boolean
}

export const Link: FC<Props> = ({
  children,
  color = 'neutral',
  external = false,
  className,
  ...props
}) => {
  const classNames = clsx('wip-link', `-color-${color}`, className)
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <AriaLink className={classNames} {...externalProps} {...props}>
      {(renderProps) => {
        const content = typeof children === 'function' ? children(renderProps) : children
        if (!external) return content
        return (
          <>
            {content}
            <Icon name="launch" className="_external-icon" aria-hidden="true" />
            <span className="_visually-hidden">（新しいタブで開く）</span>
          </>
        )
      }}
    </AriaLink>
  )
}

export type { LinkColor, Props as LinkProps }
