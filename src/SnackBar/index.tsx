'use client'

import {
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  type ToastOptions as AriaToastOptions,
  UNSTABLE_ToastQueue as AriaToastQueue,
  UNSTABLE_ToastRegion as AriaToastRegion,
  type ToastRegionProps as AriaToastRegionProps,
  Button,
  Text,
} from 'react-aria-components'
import { flushSync } from 'react-dom'
import clsx from 'clsx'

import { Icon } from '../Icon'
import './_index.scss'

type SnackBarState = 'positive' | 'negative' | 'notice' | 'neutral'

interface SnackBarContent {
  message: string
  state?: SnackBarState
}

type Props = Omit<AriaToastRegionProps<SnackBarContent>, 'children'>

export class SnackBarQueue extends AriaToastQueue<SnackBarContent> {
  constructor() {
    super({
      wrapUpdate(fn) {
        if ('startViewTransition' in document) {
          document.startViewTransition(() => {
            flushSync(fn)
          })
        } else {
          fn()
        }
      },
    })
  }

  add(content: SnackBarContent, options?: AriaToastOptions) {
    return super.add(content, {
      timeout: 6000,
      ...options,
    })
  }
}

const getIcon = (state: SnackBarState = 'positive') => {
  switch (state) {
    case 'neutral':
      return null
    case 'negative':
      return 'info_on_circle'
    case 'notice':
      return 'exclamation_on_triangle'
    default:
      return 'check_on_circle'
  }
}

/**
 * 一時的な通知メッセージを表示するスナックバーコンポーネント。
 * SnackBarQueueと組み合わせて使用し、自動的に消えるフィードバックを提供。
 *
 * @summary 一時的な通知メッセージ
 */
export const SnackBar = ({ queue, ...props }: Props) => {
  return (
    <AriaToastRegion queue={queue} {...props} className="wip-snackbar-region">
      {({ toast }) => {
        const icon = getIcon(toast.content.state)
        return (
          <AriaToast
            style={{ viewTransitionName: toast.key }}
            toast={toast}
            className={clsx('wip-snackbar', `-state-${toast.content.state ?? 'positive'}`)}
          >
            <AriaToastContent className="wip-snackbar-content">
              {icon && <Icon name={icon} className="wip-snackbar-icon" />}
              <Text slot="title">{toast.content.message}</Text>
            </AriaToastContent>
            <Button slot="close" className="wip-snackbar-close-button">
              閉じる
            </Button>
          </AriaToast>
        )
      }}
    </AriaToastRegion>
  )
}

export type { SnackBarContent, Props as SnackBarProps }
