import { Stack } from '../Stack'
import { TextField } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Forms/TextField',
  component: TextField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['s', 'm', 'l'],
    },
    width: {
      control: 'select',
      options: ['auto', 'full', 'half', 'third'],
    },
    color: {
      control: 'select',
      options: ['neutral', 'negative'],
    },
    component: {
      control: 'select',
      options: ['input', 'textarea'],
    },
  },
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    label: 'メールアドレス',
    caption: '例：email@example.com',
    placeholder: 'email@example.com',
    size: 'm',
    width: 'auto',
    color: 'neutral',
    component: 'input',
    isRequired: false,
    isDisabled: false,
    isReadOnly: false,
  },
}

export const Label: Story = {
  name: 'label',
  render: () => <TextField label="氏名" placeholder="山田 太郎" />,
}

export const Caption: Story = {
  name: 'caption',
  render: () => (
    <TextField
      label="ユーザー名"
      caption="半角英数字 20 文字以内で入力してください"
      placeholder="pepabo"
    />
  ),
}

export const Placeholder: Story = {
  name: 'placeholder',
  render: () => <TextField label="メールアドレス" placeholder="email@example.com" />,
}

export const Size: Story = {
  name: 'size',
  render: () => (
    <Stack gap="s">
      <TextField label="s" size="s" placeholder="入力してください" />
      <TextField label="m" size="m" placeholder="入力してください" />
      <TextField label="l" size="l" placeholder="入力してください" />
    </Stack>
  ),
}

export const Width: Story = {
  name: 'width',
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <Stack gap="s">
      <TextField label="auto" width="auto" placeholder="入力してください" />
      <TextField label="third" width="third" placeholder="入力してください" />
      <TextField label="half" width="half" placeholder="入力してください" />
      <TextField label="full" width="full" placeholder="入力してください" />
    </Stack>
  ),
}

export const Color: Story = {
  name: 'color',
  render: () => (
    <Stack gap="s">
      <TextField label="neutral" color="neutral" placeholder="入力してください" />
      <TextField label="negative" color="negative" placeholder="入力してください" />
    </Stack>
  ),
}

export const Component: Story = {
  name: 'component',
  render: () => (
    <Stack gap="s">
      <TextField label="input" component="input" placeholder="1 行のテキスト" />
      <TextField label="textarea" component="textarea" placeholder="複数行のテキスト" />
    </Stack>
  ),
}

export const IsRequired: Story = {
  name: 'isRequired',
  render: () => <TextField label="氏名" placeholder="山田 太郎" isRequired />,
}

export const IsDisabled: Story = {
  name: 'isDisabled',
  render: () => <TextField label="氏名" defaultValue="山田 太郎" isDisabled />,
}

export const IsReadOnly: Story = {
  name: 'isReadOnly',
  render: () => (
    <TextField
      label="会員番号"
      caption="この項目は変更できません"
      defaultValue="123456"
      isReadOnly
    />
  ),
}

export const DefaultValue: Story = {
  name: 'defaultValue',
  render: () => <TextField label="氏名" defaultValue="山田 太郎" />,
}

export const Validate: Story = {
  name: 'validate',
  render: () => (
    <TextField
      label="ユーザー名"
      caption="半角英数字 20 文字以内で入力してください"
      defaultValue="ぺぱぼ"
      validate={(value) => (/^[a-zA-Z0-9]*$/.test(value) ? null : '半角英数字で入力してください')}
      validationBehavior="aria"
    />
  ),
}
