import { Sticker } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Data Display/Sticker',
  component: Sticker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['neutral', 'informative', 'positive', 'negative', 'notice', 'attention'],
    },
    size: {
      control: 'select',
      options: ['s', 'm'],
    },
  },
} satisfies Meta<typeof Sticker>

export default meta
type Story = StoryObj<typeof meta>

/**
 * タグやラベルなど、ステータスを持たない分類表示に使用する基本形。
 *
 * @summary ステータスを持たない分類表示向け
 */
export const Default: Story = {
  args: {
    children: 'Default',
  },
}

/**
 * 「ベータ版」「新機能」など、情報を補足するラベルとして使用。
 *
 * @summary 情報を補足するラベルとして使用
 */
export const Informative: Story = {
  args: {
    color: 'informative',
    children: 'Informative',
  },
}

/**
 * 「稼働中」「承認済み」など、正常・肯定的な状態を示すラベルとして使用。
 *
 * @summary 正常・肯定的な状態を示すラベル
 */
export const Positive: Story = {
  args: {
    color: 'positive',
    children: 'Positive',
  },
}

/**
 * 「停止中」「エラー」など、異常・否定的な状態を示すラベルとして使用。
 *
 * @summary 異常・否定的な状態を示すラベル
 */
export const Negative: Story = {
  args: {
    color: 'negative',
    children: 'Negative',
  },
}

/**
 * 「要確認」「期限切れ間近」など、注意が必要な状態を示すラベルとして使用。
 *
 * @summary 注意が必要な状態を示すラベル
 */
export const Notice: Story = {
  args: {
    color: 'notice',
    children: 'Notice',
  },
}

/**
 * 「おすすめ」「人気」など、ユーザーの注意を積極的に引きたい場合に使用。
 *
 * @summary ユーザーの注意を積極的に引きたい場合
 */
export const Attention: Story = {
  args: {
    color: 'attention',
    children: 'Attention',
  },
}

/**
 * テーブル内やリスト項目など、スペースが限られる場面で使用。
 *
 * @summary スペースが限られる場面向け
 */
export const Small: Story = {
  args: {
    size: 's',
    children: 'Small',
  },
}

/**
 * 全カラーの一覧表示。カラー選定時のリファレンス用。
 */
export const AllColors: Story = {
  tags: ['!manifest'],
  args: {
    children: 'Sticker',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      <Sticker color="neutral">Neutral</Sticker>
      <Sticker color="informative">Informative</Sticker>
      <Sticker color="positive">Positive</Sticker>
      <Sticker color="negative">Negative</Sticker>
      <Sticker color="notice">Notice</Sticker>
      <Sticker color="attention">Attention</Sticker>
    </div>
  ),
}
