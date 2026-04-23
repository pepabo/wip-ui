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

/**
 * ユーザー一覧やコメント欄など、一般的な場面で使用する標準サイズ。
 *
 * @summary 一般的な場面で使用する標準サイズ
 */
export const Default: Story = {
  render: (args) => <Avatar {...args} />,
  args: {
    src: 'https://i.pravatar.cc/150?img=1',
    alt: 'User avatar',
  },
}

/**
 * チャットのメッセージ欄やリスト内など、密な配置で使用。
 *
 * @summary 密な配置やインライン表示向け
 */
export const Small: Story = {
  render: (args) => <Avatar {...args} />,
  args: {
    src: 'https://i.pravatar.cc/150?img=3',
    alt: 'User avatar',
    size: 's',
  },
}

/**
 * プロフィールページやユーザー詳細など、ユーザーを目立たせたい場面で使用。
 *
 * @summary プロフィールなどユーザーを目立たせたい場面向け
 */
export const Large: Story = {
  render: (args) => <Avatar {...args} />,
  args: {
    src: 'https://i.pravatar.cc/150?img=4',
    alt: 'User avatar',
    size: 'l',
  },
}
