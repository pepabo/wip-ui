import { Loader } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Feedback/Loader',
  component: Loader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['s', 'm', 'l', 'xl', 'xxl'],
    },
    message: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Loader>

export default meta
type Story = StoryObj<typeof meta>

/**
 * API レスポンス待ちなど、データ読み込み中であることをユーザーに伝える場合に使用。
 *
 * @summary データ読み込み中を伝える場合
 */
export const Default: Story = {
  args: {},
}

/**
 * ボタン内やテキストのインラインなど、限られたスペースで読み込み中を示す場合に使用。
 *
 * @summary 限られたスペースで読み込み中を示す場合
 */
export const Small: Story = {
  args: {
    size: 's',
  },
}

/**
 * セクション全体やカード内など、広い領域の読み込み中を示す場合に使用。
 *
 * @summary 広い領域の読み込み中を示す場合
 */
export const Large: Story = {
  args: {
    size: 'l',
  },
}

/**
 * ページ全体のオーバーレイなど、画面を覆って待機を示す場合に使用。
 *
 * @summary 画面全体を覆って待機を示す場合
 */
export const ExtraExtraLarge: Story = {
  args: {
    size: 'xxl',
  },
}

/**
 * 「読み込み中...」など、待機中の処理内容をテキストで補足したい場合に使用。
 *
 * @summary 待機中の処理内容をテキストで補足する場合
 */
export const WithMessage: Story = {
  args: {
    message: 'Loading...',
  },
}

/**
 * ファイルアップロードの進捗など、詳細な処理状況をユーザーに伝えたい場合に使用。
 *
 * @summary 詳細な処理状況を伝えたい場合
 */
export const WithLongMessage: Story = {
  args: {
    message: 'Please wait while we process your request',
    size: 'l',
  },
}

/** Mediumサイズ */
export const Medium: Story = {
  tags: ['!manifest'],
  args: { size: 'm' },
}

/** Extra Largeサイズ */
export const ExtraLarge: Story = {
  tags: ['!manifest'],
  args: { size: 'xl' },
}
