import { Stack } from '../Stack'
import { Avatar } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentPropsWithoutRef } from 'react'

type AvatarStoryProps = ComponentPropsWithoutRef<'img'> & {
  size?: 'xs' | 's' | 'm' | 'l'
}

const meta: Meta<AvatarStoryProps> = {
  title: 'Components/Data Display/Avatar',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 's', 'm', 'l'],
    },
  },
}

export default meta
type Story = StoryObj<AvatarStoryProps>

export const Playground: Story = {
  render: (args) => <Avatar {...args} />,
  args: {
    src: 'https://i.pravatar.cc/150?img=1',
    alt: '山田 花子',
    size: 'm',
  },
}

export const Size: Story = {
  name: 'size',
  render: () => (
    <Stack flexDirection="row" gap="s" alignItems="center">
      <Avatar src="https://i.pravatar.cc/150?img=2" alt="鈴木 太郎" size="xs" />
      <Avatar src="https://i.pravatar.cc/150?img=3" alt="佐藤 次郎" size="s" />
      <Avatar src="https://i.pravatar.cc/150?img=1" alt="山田 花子" size="m" />
      <Avatar src="https://i.pravatar.cc/150?img=4" alt="田中 由紀" size="l" />
    </Stack>
  ),
}
