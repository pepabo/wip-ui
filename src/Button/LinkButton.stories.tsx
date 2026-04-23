import { Icon } from '../Icon'
import { LinkButton } from './'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Actions/LinkButton',
  component: LinkButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LinkButton>

export default meta

type Story = StoryObj<typeof meta>

/**
 * 特定のスタイル指定が不要なページ遷移に使用する基本リンクボタン。アクション実行には Button を使用する。
 *
 * @summary 特定のスタイル指定が不要なページ遷移向け
 */
export const Default: Story = {
  args: {
    children: 'Button',
  },
}

/**
 * 主要なナビゲーションアクションに使用するインタラクティブカラーのリンクボタン。
 *
 * @summary 主要ナビゲーション向け
 */
export const Interactive: Story = {
  args: {
    children: 'Interactive Button',
    color: 'interactive',
  },
}

/**
 * アウトラインスタイルのリンクボタン。副次的なナビゲーションに使用。
 *
 * @summary 副次的なナビゲーション向け
 */
export const Outlined: Story = {
  args: {
    children: 'Outlined Button',
    appearance: 'outlined',
  },
}

/**
 * 注意を要する遷移先へのリンクボタン。
 *
 * @summary 注意を要するナビゲーション向け
 */
export const Negative: Story = {
  args: {
    children: 'Negative Button',
    color: 'negative',
  },
}

/**
 * テーブル行内やインラインなど、スペースが限られる場面でのページ遷移に使用。
 *
 * @summary スペースが限られる場面でのページ遷移向け
 */
export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 's',
  },
}

/**
 * ランディングページのCTAなど、特に目立たせたいページ遷移に使用。
 *
 * @summary CTA など目立たせたいページ遷移向け
 */
export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'l',
  },
}

/**
 * 権限不足やリンク切れなど、遷移先が利用できない状態を示す。
 *
 * @summary 遷移先が利用できない場合
 */
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    isDisabled: true,
  },
}

/**
 * モバイルのナビゲーションなど、親要素の幅いっぱいに広げたい場面で使用。
 *
 * @summary 幅いっぱいに広げたいナビゲーション向け
 */
export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    width: 'full',
  },
  parameters: {
    layout: 'padded',
  },
}

/**
 * 全propsを自由に変更できるプレイグラウンド。開発時の動作確認用。
 */
export const Playground: Story = {
  tags: ['!manifest'],
  args: {
    children: 'Playground Button',
    appearance: 'flat',
    color: 'neutral',
    size: 'm',
    width: 'auto',
    isDisabled: false,
  },
}

/**
 * ツールバーなどテキストラベルが不要な場面でのページ遷移に使用。必ず aria-label を付与してアクセシビリティを確保する。
 *
 * @summary テキストラベルが不要な場面でのページ遷移向け
 */
export const IconOnly: Story = {
  args: {
    href: '#',
    iconOnly: true,
    'aria-label': '検索',
    children: <Icon name="magnifying_glass" aria-hidden="true" />,
  },
}

/**
 * 遷移先の意味をアイコンで視覚的に補強したい場合に使用。
 *
 * @summary 遷移先の意味をアイコンで視覚補強する場合
 */
export const WithLeadingIcon: Story = {
  args: {
    href: '#',
    children: 'Save',
    leading: <Icon name="download" aria-hidden="true" />,
  },
}

/**
 * 外部リンクや「次へ」など方向性を示したい場合に使用。
 *
 * @summary 外部リンクや方向性をアイコンで示す場合
 */
export const WithTrailingIcon: Story = {
  args: {
    href: '#',
    children: 'Next',
    trailing: <Icon name="arrow_right" aria-hidden="true" />,
  },
}

/**
 * 複合的な意味を持つ遷移で、前後のアイコンで文脈を補強する場合に使用。
 *
 * @summary 複合的な意味を前後のアイコンで補強する場合
 */
export const WithBothIcons: Story = {
  args: {
    href: '#',
    children: 'Share',
    leading: <Icon name="share" aria-hidden="true" />,
    trailing: <Icon name="arrow_cross" aria-hidden="true" />,
  },
}
