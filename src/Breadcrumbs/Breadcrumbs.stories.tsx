import { Breadcrumb, Breadcrumbs } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Navigation/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isDisabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Breadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    isDisabled: false,
  },
  render: (args) => (
    <nav aria-label="パンくずリスト">
      <Breadcrumbs {...args}>
        <Breadcrumb href="/">ホーム</Breadcrumb>
        <Breadcrumb href="/products">商品一覧</Breadcrumb>
        <Breadcrumb>商品詳細</Breadcrumb>
      </Breadcrumbs>
    </nav>
  ),
}
