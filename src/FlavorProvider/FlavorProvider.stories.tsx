import { Button } from '../Button'
import { Stack } from '../Stack'
import { Sticker } from '../Sticker'
import { TextField } from '../TextField'
import { Typography } from '../Typography'
import { FlavorProvider } from './FlavorProvider'

import type { Meta, StoryObj } from '@storybook/react-vite'

const flavors = [
  { flavor: 'lolipop', label: 'lolipop（ロリポップ！）' },
  { flavor: 'apollo', label: 'apollo（ゲーマーズ）' },
  { flavor: 'pepper', label: 'pepper（既定・利用実績なし）' },
  { flavor: 'minne', label: 'minne（利用実績なし）' },
  { flavor: 'nachiguro', label: 'nachiguro（利用実績なし）' },
  { flavor: 'flippers', label: 'flippers（利用実績なし）' },
  { flavor: 'kung-pu', label: 'kung-pu（利用実績なし）' },
] as const

const Sample = () => (
  <Stack gap="m">
    <Typography component="span" size="xl" fontWeight="bold">
      見出し
    </Typography>
    <Typography>本文のテキストです。フレーバーによって、色や形が変わります。</Typography>
    <Stack flexDirection="row" gap="s">
      <Button color="interactive">保存</Button>
      <Button appearance="outlined">キャンセル</Button>
      <Button color="negative">削除</Button>
    </Stack>
    <TextField label="メールアドレス" placeholder="email@example.com" />
    <Stack flexDirection="row" gap="s">
      <Sticker color="positive">稼働中</Sticker>
      <Sticker color="notice">要確認</Sticker>
      <Sticker color="negative">停止中</Sticker>
    </Stack>
  </Stack>
)

const meta = {
  title: 'Introduction/FlavorProvider',
  component: FlavorProvider,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    flavor: {
      control: 'select',
      options: flavors.map(({ flavor }) => flavor),
    },
    children: {
      control: false,
    },
  },
} satisfies Meta<typeof FlavorProvider>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    flavor: 'lolipop',
    children: <Sample />,
  },
}

export const Flavor: Story = {
  name: 'flavor',
  render: () => (
    <Stack gap="xl">
      {flavors.map(({ flavor, label }) => (
        <Stack key={flavor} gap="s">
          <Typography component="h3" size="l" fontWeight="bold">
            {label}
          </Typography>
          <FlavorProvider flavor={flavor}>
            <Sample />
          </FlavorProvider>
        </Stack>
      ))}
    </Stack>
  ),
}
