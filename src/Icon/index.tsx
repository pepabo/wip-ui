import clsx from 'clsx'

import type { HTMLAttributes } from 'react'
import './_index.scss'

export type IconName =
  | 'apple'
  | 'arrow_cross'
  | 'arrow_down'
  | 'arrow_drop_down'
  | 'arrow_drop_left'
  | 'arrow_drop_right'
  | 'arrow_drop_up'
  | 'arrow_left'
  | 'arrow_order'
  | 'arrow_right'
  | 'arrow_right_left'
  | 'arrow_up'
  | 'balloon'
  | 'bell'
  | 'bill'
  | 'bullet_circle'
  | 'calendar'
  | 'camera'
  | 'cart'
  | 'check'
  | 'check_on_circle'
  | 'chevron_double'
  | 'chevron_down'
  | 'chevron_left'
  | 'chevron_right'
  | 'chevron_up'
  | 'circle'
  | 'clip'
  | 'clock'
  | 'code'
  | 'copy'
  | 'cross'
  | 'cross_on_circle'
  | 'discord'
  | 'download'
  | 'drag_handle'
  | 'ellipsis_horizontal'
  | 'ellipsis_horizontal_on_circle'
  | 'ellipsis_vertical'
  | 'exclamation_on_triangle'
  | 'facebook'
  | 'figma'
  | 'first_page'
  | 'folder'
  | 'funnel'
  | 'garbage_can'
  | 'gear'
  | 'github'
  | 'hatena_bookmark'
  | 'heart'
  | 'heart_border'
  | 'home'
  | 'image'
  | 'in'
  | 'info_on_circle'
  | 'instagram'
  | 'last_page'
  | 'launch'
  | 'line'
  | 'location_pin'
  | 'lock'
  | 'magnifying_glass'
  | 'mail'
  | 'megaphone'
  | 'menu'
  | 'mic'
  | 'minus'
  | 'minus_on_circle'
  | 'misskey'
  | 'multi_pane'
  | 'node'
  | 'note'
  | 'notion'
  | 'out'
  | 'outside'
  | 'parameters'
  | 'pencil'
  | 'people'
  | 'pepapon'
  | 'person'
  | 'person_plus'
  | 'phone'
  | 'plus'
  | 'plus_on_circle'
  | 'podcast'
  | 'qr_code'
  | 'qr_code_scanner'
  | 'question_on_circle'
  | 'receipt'
  | 'roller'
  | 'rss_feed'
  | 'share'
  | 'spotify'
  | 'star'
  | 'tiktok'
  | 'upload'
  | 'x'
  | 'youtube'

export type IconSize = 's' | 'm' | 'l'

const iconSizeMap: Record<IconSize, string> = {
  s: '16px',
  m: '24px',
  l: '32px',
}

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  /** 表示するアイコンの名前 */
  name: IconName
  /** アイコンのサイズ。s=16px, m=24px, l=32px */
  size?: IconSize
  /** アイコンの色。CSSカラー値を指定 */
  color?: string
}

/**
 * Inhouse Iconsフォントを使用したアイコンコンポーネント。
 * ボタンやナビゲーションなどの装飾に使用。
 *
 * @summary Inhouse Iconsによるアイコン表示
 */
export const Icon = ({ name, className, size, color, ...props }: IconProps) => {
  const fontSize = size ? iconSizeMap[size] : undefined

  return (
    <span
      className={clsx('wip-icon', className)}
      data-icon={name}
      style={{ fontSize, color }}
      {...props}
    />
  )
}
