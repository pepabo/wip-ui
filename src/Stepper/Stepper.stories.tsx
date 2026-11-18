import { Stack } from '../Stack'
import { Stepper, StepperItem } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Data Display/Stepper',
  component: Stepper,
  subcomponents: { StepperItem },
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    activeIndex: 0,
    'aria-label': '手順',
    children: null,
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof Stepper>

export default meta
type Story = StoryObj<typeof meta>

const items = [
  <StepperItem key="plan">プランを選ぶ</StepperItem>,
  <StepperItem key="account">アカウントを入力</StepperItem>,
  <StepperItem key="payment">支払い方法を登録</StepperItem>,
  <StepperItem key="confirm">内容を確認</StepperItem>,
]

export const Playground: Story = {
  args: {
    activeIndex: 1,
    orientation: 'horizontal',
    'aria-label': '申し込みの手順',
    children: items,
  },
}

export const ActiveIndex: Story = {
  name: 'activeIndex',
  render: () => (
    <Stack gap="xl">
      <Stepper activeIndex={0} aria-label="申し込みの手順">
        {items}
      </Stepper>
      <Stepper activeIndex={2} aria-label="申し込みの手順">
        {items}
      </Stepper>
      <Stepper activeIndex={4} aria-label="申し込みの手順">
        {items}
      </Stepper>
    </Stack>
  ),
}

export const Orientation: Story = {
  name: 'orientation',
  render: () => (
    <Stack gap="xl">
      <Stepper activeIndex={1} orientation="horizontal" aria-label="申し込みの手順">
        {items}
      </Stepper>
      <Stepper activeIndex={1} orientation="vertical" aria-label="申し込みの手順">
        {items}
      </Stepper>
    </Stack>
  ),
}

export const ItemDescription: Story = {
  name: 'StepperItem description',
  render: () => (
    <Stack gap="xl">
      <Stepper activeIndex={1} aria-label="独自ドメインの設定手順">
        <StepperItem description="DNS に CNAME レコードを追加します">レコードを追加</StepperItem>
        <StepperItem description="証明書の発行を待っています">証明書を発行</StepperItem>
        <StepperItem description="公開先を新しいドメインに切り替えます">
          公開先を切り替え
        </StepperItem>
      </Stepper>
      <Stepper activeIndex={1} orientation="vertical" aria-label="独自ドメインの設定手順">
        <StepperItem description="DNS に CNAME レコードを追加します">レコードを追加</StepperItem>
        <StepperItem description="証明書の発行を待っています">証明書を発行</StepperItem>
        <StepperItem description="公開先を新しいドメインに切り替えます">
          公開先を切り替え
        </StepperItem>
      </Stepper>
    </Stack>
  ),
}

export const ItemIsInvalid: Story = {
  name: 'StepperItem isInvalid',
  render: () => (
    <Stepper activeIndex={2} aria-label="申し込みの手順">
      <StepperItem>プランを選ぶ</StepperItem>
      <StepperItem isInvalid description="入力に不備があります">
        アカウントを入力
      </StepperItem>
      <StepperItem>支払い方法を登録</StepperItem>
      <StepperItem>内容を確認</StepperItem>
    </Stepper>
  ),
}
