import { Divider } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Data Display/Divider',
  component: Divider,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    variant: {
      control: 'select',
      options: ['fullWidth', 'inset', 'middle'],
    },
    absolute: {
      control: 'boolean',
    },
    flexItem: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

/**
 * セクション間を明確に分離したい場合に使用する水平区切り線。
 *
 * @summary セクション間を明確に分離したい場合
 */
export const Default: Story = {
  render: () => (
    <div>
      <div style={{ padding: '10px' }}>Content above</div>
      <Divider />
      <div style={{ padding: '10px' }}>Content below</div>
    </div>
  ),
}

/**
 * ツールバーやヘッダーなど、横並びの要素グループを区切りたい場合に使用。
 *
 * @summary 横並びの要素グループを区切りたい場合
 */
export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', height: '100px' }}>
      <div style={{ padding: '0 20px' }}>Left content</div>
      <Divider orientation="vertical" flexItem />
      <div style={{ padding: '0 20px' }}>Right content</div>
    </div>
  ),
}

/**
 * リストやメニューなど、アイコン領域を避けてテキスト部分のみを区切りたい場合に使用。
 *
 * @summary アイコン領域を避けて区切りたい場合
 */
export const Inset: Story = {
  render: () => (
    <div>
      <div style={{ padding: '10px' }}>Inset divider</div>
      <Divider variant="inset" />
      <div style={{ padding: '10px' }}>Content below</div>
    </div>
  ),
}

/**
 * 左右に余白を設けて控えめに区切りたい場合に使用。
 *
 * @summary 控えめに区切りたい場合
 */
export const Middle: Story = {
  render: () => (
    <div>
      <div style={{ padding: '10px' }}>Middle divider</div>
      <Divider variant="middle" />
      <div style={{ padding: '10px' }}>Content below</div>
    </div>
  ),
}

/**
 * 水平方向のfullWidth区切り線。
 */
export const Horizontal: Story = {
  tags: ['!manifest'],
  render: () => (
    <div>
      <div style={{ padding: '10px' }}>Content above</div>
      <Divider orientation="horizontal" />
      <div style={{ padding: '10px' }}>Content below</div>
    </div>
  ),
}

/**
 * fullWidthバリアントの区切り線。
 */
export const FullWidth: Story = {
  tags: ['!manifest'],
  render: () => (
    <div>
      <div style={{ padding: '10px' }}>Full width divider</div>
      <Divider variant="fullWidth" />
      <div style={{ padding: '10px' }}>Content below</div>
    </div>
  ),
}
