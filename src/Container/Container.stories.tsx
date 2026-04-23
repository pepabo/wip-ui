import { Container } from './Container'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Layout/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 's', 'm', 'l', 'xl'],
    },
    isGapless: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Container>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 一般的なページレイアウトで使用する標準幅のコンテナ。
 *
 * @summary 一般的なページレイアウト向け
 */
export const Default: Story = {
  args: {
    children: <div style={{ background: '#e0e0e0', padding: '20px' }}>Container Content</div>,
  },
}

/**
 * ログインフォームやダイアログなど、狭い幅に収めたい場合に使用。
 *
 * @summary ログインフォームなど狭い幅向け
 */
export const ExtraSmall: Story = {
  args: {
    size: 'xs',
    children: <div style={{ background: '#e0e0e0', padding: '20px' }}>Extra Small Container</div>,
  },
}

/**
 * 記事本文やブログ投稿など、読みやすさを重視した幅で使用。
 *
 * @summary 記事本文など読みやすさ重視の幅向け
 */
export const Small: Story = {
  args: {
    size: 's',
    children: <div style={{ background: '#e0e0e0', padding: '20px' }}>Small Container</div>,
  },
}

/**
 * フォームページや設定画面など、標準より少し狭い幅で使用。
 *
 * @summary フォームページや設定画面向け
 */
export const Medium: Story = {
  args: {
    size: 'm',
    children: <div style={{ background: '#e0e0e0', padding: '20px' }}>Medium Container</div>,
  },
}

/**
 * ダッシュボードやポータルなど、情報量の多いページレイアウトで使用。
 *
 * @summary 情報量の多いページレイアウト向け
 */
export const Large: Story = {
  args: {
    size: 'l',
    children: <div style={{ background: '#e0e0e0', padding: '20px' }}>Large Container</div>,
  },
}

/**
 * 管理画面やデータテーブルなど、画面幅を最大限活用したい場合に使用。
 *
 * @summary 画面幅を最大限活用したい場合
 */
export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    children: <div style={{ background: '#e0e0e0', padding: '20px' }}>Extra Large Container</div>,
  },
}

/**
 * ヒーロー画像や全幅バナーなど、端から端までコンテンツを広げたい場合に使用。
 *
 * @summary 端から端までコンテンツを広げたい場合
 */
export const Gapless: Story = {
  args: {
    isGapless: true,
    children: <div style={{ background: '#e0e0e0', padding: '20px' }}>Gapless Container</div>,
  },
}
