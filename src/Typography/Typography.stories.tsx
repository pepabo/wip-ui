import { Typography } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Data Display/Typography',
  component: Typography,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'],
    },
    density: {
      control: 'select',
      options: ['comfort', 'normal', 'dense'],
    },
    fontWeight: {
      control: 'select',
      options: ['normal', 'bold'],
    },
    color: {
      control: 'select',
      options: [
        'high_emphasis',
        'medium_emphasis',
        'low_emphasis',
        'informative',
        'positive',
        'notice',
        'negative',
      ],
    },
  },
} satisfies Meta<typeof Typography>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 特別な強調やサイズ指定が不要な場面で使用する基本テキスト。size=m, density=normal がデフォルト。
 *
 * @summary 特別な指定が不要な場面の基本テキスト
 */
export const Default: Story = {
  args: {
    children: 'This is a typography component',
  },
}

/**
 * 見出しやキーワードなど、他のテキストと差別化して強調したい場合に使用。
 *
 * @summary 他のテキストと差別化して強調したい場合
 */
export const Bold: Story = {
  args: {
    fontWeight: 'bold',
    children: 'Bold text',
  },
}

/**
 * ブログ記事やヘルプページなど、長文の読みやすさを重視したい場合に使用。
 *
 * @summary 長文の読みやすさを重視したい場合
 */
export const ComfortDensity: Story = {
  args: {
    density: 'comfort',
    children: 'Comfort density text with more line height',
  },
}

/**
 * UI ラベルやテーブルセルなど、限られたスペースにテキストを収めたい場合に使用。
 *
 * @summary 限られたスペースにテキストを収めたい場合
 */
export const DenseDensity: Story = {
  args: {
    density: 'dense',
    children: 'Dense density text with less line height',
  },
}

/**
 * キャプションや説明文など、メインコンテンツより優先度が低い情報の表示に使用。
 *
 * @summary 優先度が低い補足情報向け
 */
export const MediumEmphasis: Story = {
  args: {
    color: 'medium_emphasis',
    children: 'Medium emphasis text',
  },
}

/**
 * プレースホルダーや非活性ラベルなど、最も控えめに表示したい情報に使用。
 *
 * @summary 最も控えめに表示したい情報向け
 */
export const LowEmphasis: Story = {
  args: {
    color: 'low_emphasis',
    children: 'Low emphasis text',
  },
}

/**
 * ヘルプテキストやリンク的な案内など、情報提供を示したい場合に使用。
 *
 * @summary ヘルプや案内など情報提供を示す場合
 */
export const Informative: Story = {
  args: {
    color: 'informative',
    children: 'Informative text',
  },
}

/**
 * 「保存しました」など、操作の成功をテキストで示したい場合に使用。
 *
 * @summary 操作の成功をテキストで示す場合
 */
export const Positive: Story = {
  args: {
    color: 'positive',
    children: 'Positive text',
  },
}

/**
 * 「期限が近づいています」など、注意喚起のテキストに使用。
 *
 * @summary 注意喚起のテキスト
 */
export const Notice: Story = {
  args: {
    color: 'notice',
    children: 'Notice text',
  },
}

/**
 * バリデーションエラーやシステムエラーなど、問題をテキストで示す場合に使用。
 *
 * @summary 問題をテキストで示す場合
 */
export const Negative: Story = {
  args: {
    color: 'negative',
    children: 'Negative text',
  },
}

/**
 * component propでHTML要素を変更できる。見出しとして使う場合はh1-h6を指定。
 *
 * @summary HTML見出し要素として使用
 */
export const AsHeading: Story = {
  args: {
    component: 'h1',
    size: 'xxl',
    fontWeight: 'bold',
    children: 'This is a heading',
  },
}

/**
 * sizeにオブジェクトを渡してブレークポイントごとにサイズを変更。
 * モバイルではsmall、デスクトップではxxlのように段階的に拡大。
 *
 * @summary レスポンシブ対応のサイズ変更
 */
export const ResponsiveSize: Story = {
  args: {
    children: 'ブラウザの幅を変えてみてください',
  },
  render: () => (
    <Typography size={{ xxs: 's', m: 'l', xl: 'xxl' }}>ブラウザの幅を変えてみてください</Typography>
  ),
}

/**
 * 全サイズの一覧表示。サイズ選定時のリファレンスとして使用。
 */
export const AllSizes: Story = {
  tags: ['!manifest'],
  args: {
    children: '',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Typography size="xxs">Extra Extra Small (xxs)</Typography>
      <Typography size="xs">Extra Small (xs)</Typography>
      <Typography size="s">Small (s)</Typography>
      <Typography size="m">Medium (m)</Typography>
      <Typography size="l">Large (l)</Typography>
      <Typography size="xl">Extra Large (xl)</Typography>
      <Typography size="xxl">Extra Extra Large (xxl)</Typography>
      <Typography size="xxxl">Extra Extra Extra Large (xxxl)</Typography>
    </div>
  ),
}
