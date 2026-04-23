import { Icon } from '../Icon'
import { Typography } from '../Typography'
import { AppBar, AppBarLeading, AppBarTrailing } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Surfaces/AppBar',
  component: AppBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof AppBar>

export default meta
type Story = StoryObj<typeof meta>

const defaultChildren = (
  <>
    <AppBarLeading>
      <Typography size="m" fontWeight="bold">
        Title
      </Typography>
    </AppBarLeading>
    <AppBarTrailing>
      <Icon name="menu" size="m" />
    </AppBarTrailing>
  </>
)

/**
 * タイトルとアクションを両端に配置するページ上部のナビゲーションバー。
 *
 * @summary タイトルとアクションを配置するページ上部のバー
 */
export const Default: Story = {
  args: {
    children: defaultChildren,
  },
}

/**
 * アクションが不要でタイトルのみを表示したい場合に使用。
 *
 * @summary タイトルのみ表示したい場合
 */
export const LeadingOnly: Story = {
  args: {
    children: (
      <AppBarLeading>
        <Typography size="m" fontWeight="bold">
          Title
        </Typography>
      </AppBarLeading>
    ),
  },
}

/**
 * タイトル不要でアクションボタンのみを配置したい場合に使用。
 *
 * @summary アクションボタンのみ配置したい場合
 */
export const TrailingOnly: Story = {
  args: {
    children: (
      <AppBarTrailing>
        <Icon name="menu" size="m" />
      </AppBarTrailing>
    ),
  },
}

/**
 * ブランドカラーを前面に出してページの印象を強調したい場合に使用。
 *
 * @summary ブランドカラーを強調したい場合
 */
export const Filled: Story = {
  args: {
    appearance: 'filled',
    children: defaultChildren,
  },
}

/**
 * コンテンツと明確に区切りつつ、控えめな印象にしたい場合に使用。
 *
 * @summary 控えめな印象で区切りたい場合
 */
export const White: Story = {
  args: {
    appearance: 'white',
    children: defaultChildren,
  },
}

/**
 * ヒーロー画像やグラデーション背景の上に重ねたい場合に使用。
 *
 * @summary 背景コンテンツの上に重ねたい場合
 */
export const Transparent: Story = {
  args: {
    appearance: 'transparent',
    children: defaultChildren,
  },
}
