import { Paper } from './Paper'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Surfaces/Paper',
  component: Paper,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    elevation: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6],
    },
    outlined: {
      control: 'boolean',
    },
    square: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Paper>

export default meta
type Story = StoryObj<typeof meta>

const content = <div style={{ padding: '20px' }}>Paper component content</div>

/**
 * カードやパネルなど、背景から軽く浮き上がらせたいコンテンツの囲みに使用。
 *
 * @summary 背景から軽く浮き上がらせたいコンテンツ向け
 */
export const Default: Story = {
  args: {
    children: content,
  },
}

/**
 * 影による強調が不要で、背景色のみでコンテンツ領域を区別したい場合に使用。
 *
 * @summary 背景色のみで領域を区別したい場合
 */
export const Elevation0: Story = {
  args: {
    elevation: 0,
    children: content,
  },
}

/**
 * ホバー時の強調や重要なカードなど、標準より目立たせたい場合に使用。
 *
 * @summary 標準より目立たせたい場合
 */
export const Elevation3: Story = {
  args: {
    elevation: 3,
    children: content,
  },
}

/**
 * ダイアログやドロワーなど、最前面に浮かぶ要素に使用。通常は Dialog 等のコンポーネントが内部で設定するため直接指定は稀。
 *
 * @summary 最前面に浮かぶ要素向け（通常はコンポーネントが内部設定）
 */
export const Elevation6: Story = {
  args: {
    elevation: 6,
    children: content,
  },
}

/**
 * 影を使わず、ボーダーで控えめにコンテンツ領域を区切りたい場合に使用。
 *
 * @summary ボーダーで控えめに区切りたい場合
 */
export const Outlined: Story = {
  args: {
    outlined: true,
    children: content,
  },
}

/**
 * 画面端に接するレイアウトなど、角丸が不要な場面で使用。
 *
 * @summary 角丸が不要な場面向け
 */
export const Square: Story = {
  args: {
    square: true,
    children: content,
  },
}

/**
 * テーブルや全幅パネルなど、ボーダーで区切りつつ角丸が不要な場面で使用。
 *
 * @summary ボーダーで区切りつつ角丸が不要な場面向け
 */
export const OutlinedSquare: Story = {
  args: {
    outlined: true,
    square: true,
    children: content,
  },
}

/** elevation=1 */
export const Elevation1: Story = {
  tags: ['!manifest'],
  args: { elevation: 1, children: content },
}

/** elevation=2 */
export const Elevation2: Story = {
  tags: ['!manifest'],
  args: { elevation: 2, children: content },
}

/** elevation=4 */
export const Elevation4: Story = {
  tags: ['!manifest'],
  args: { elevation: 4, children: content },
}

/** elevation=5 */
export const Elevation5: Story = {
  tags: ['!manifest'],
  args: { elevation: 5, children: content },
}
