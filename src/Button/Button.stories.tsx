import { Icon } from '../Icon'
import { Button } from './'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Actions/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['flat', 'outlined', 'transparent', 'white'],
    },
    color: {
      control: 'select',
      options: ['neutral', 'interactive', 'negative'],
    },
    size: {
      control: 'select',
      options: ['s', 'm', 'l'],
    },
    width: {
      control: 'select',
      options: ['auto', 'half', 'third', 'full'],
    },
    isDisabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 特定のスタイル指定が不要な場合に使用する基本ボタン。flat/neutral がデフォルトで適用される。
 *
 * @summary 特定のスタイル指定が不要な場合の基本ボタン
 */
export const Default: Story = {
  args: {
    children: 'Button',
  },
}

/**
 * 主要なアクションを示すインタラクティブカラーのボタン。
 * 1つのビューに1つだけ使用することを推奨。
 *
 * @summary 主要アクション向けのボタン
 */
export const Interactive: Story = {
  args: {
    children: 'Interactive Button',
    color: 'interactive',
  },
}

/**
 * アウトラインスタイルのボタン。背景色を持たずボーダーのみで表現。
 * 副次的なアクションに使用。
 *
 * @summary 副次的なアクション向けのボタン
 */
export const Outlined: Story = {
  args: {
    children: 'Outlined Button',
    appearance: 'outlined',
  },
}

/**
 * エラーや削除など、注意が必要な破壊的アクションに使用するボタン。
 *
 * @summary 破壊的アクション向けのボタン
 */
export const Negative: Story = {
  args: {
    children: 'Negative Button',
    color: 'negative',
  },
}

/**
 * テーブル行内のアクションなど、スペースが限られる場面で使用する小サイズボタン。
 *
 * @summary スペースが限られる場面向けの小サイズボタン
 */
export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 's',
  },
}

/**
 * CTAなど特に目立たせたいアクションに使用する大サイズボタン。
 *
 * @summary CTA など目立たせたいアクション向けの大サイズボタン
 */
export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'l',
  },
}

/**
 * 条件未達や処理中などユーザーが操作できない状態を示す。
 *
 * @summary 条件未達や処理中で操作できない場合
 */
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    isDisabled: true,
  },
}

/**
 * フォームの送信ボタンなど、親要素の幅いっぱいに広げたい場面で使用。
 *
 * @summary フォーム送信など幅いっぱいに広げたい場面向け
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
 * ツールバーなどテキストラベルが不要な場面で使用。必ず aria-label を付与してアクセシビリティを確保する。
 *
 * @summary テキストラベルが不要な場面向けのアイコンボタン
 */
export const IconOnly: Story = {
  args: {
    children: <Icon name="magnifying_glass" aria-hidden="true" />,
    appearance: 'flat',
    color: 'neutral',
    size: 'm',
    width: 'auto',
    isDisabled: false,
    iconOnly: true,
  },
}

/**
 * 保存や検索などアクションの意味をアイコンで視覚的に補強したい場合に使用。
 *
 * @summary アクションの意味をアイコンで視覚補強する場合
 */
export const WithLeadingIcon: Story = {
  args: {
    children: 'Save',
    leading: <Icon name="download" aria-hidden="true" />,
  },
}

/**
 * 「次へ」など方向性や遷移先を示したい場合に使用。
 *
 * @summary 方向性や遷移先をアイコンで示す場合
 */
export const WithTrailingIcon: Story = {
  args: {
    children: 'Next',
    trailing: <Icon name="arrow_right" aria-hidden="true" />,
  },
}

/**
 * 共有など複合的な意味を持つアクションで、前後のアイコンで文脈を補強する場合に使用。
 *
 * @summary 複合的な意味を前後のアイコンで補強する場合
 */
export const WithBothIcons: Story = {
  args: {
    children: 'Share',
    leading: <Icon name="share" aria-hidden="true" />,
    trailing: <Icon name="arrow_cross" aria-hidden="true" />,
  },
}
