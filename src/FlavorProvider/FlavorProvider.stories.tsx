import { Button } from '../Button'
import { FlavorProvider } from './FlavorProvider'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Introduction/FlavorProvider',
  component: FlavorProvider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    flavor: {
      control: 'select',
      options: ['pepper', 'minne', 'apollo', 'nachiguro', 'flippers', 'kung-pu', 'lolipop'],
    },
    children: {
      control: false,
    },
  },
} satisfies Meta<typeof FlavorProvider>

export default meta
type Story = StoryObj<typeof meta>

/**
 * アプリ全体で単一のフレーバーを固定したい場合に使用。
 * 多くのアプリは1つのフレーバーで完結するため、これが最も基本的なパターン。
 *
 * @summary アプリ全体に単一フレーバーを適用
 */
export const Default: Story = {
  args: {
    flavor: 'pepper',
    children: <Button color="interactive">Action</Button>,
  },
}

/**
 * マルチブランドサイトや既存フレーバーから新フレーバーへの段階移行など、
 * 1ページ内で領域ごとに異なるフレーバーを適用したい場合に使用。
 *
 * @summary 1ページ内で複数フレーバーを併用
 */
export const Coexistence: Story = {
  args: {
    flavor: 'pepper',
  },
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <FlavorProvider flavor="pepper">
        <Button color="interactive">pepper</Button>
      </FlavorProvider>
      <FlavorProvider flavor="minne">
        <Button color="interactive">minne</Button>
      </FlavorProvider>
      <FlavorProvider flavor="apollo">
        <Button color="interactive">apollo</Button>
      </FlavorProvider>
    </div>
  ),
}
