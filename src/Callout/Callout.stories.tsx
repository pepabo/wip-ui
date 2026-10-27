import { Button } from '../Button'
import { Icon } from '../Icon'
import { Stack } from '../Stack'
import { Callout } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Feedback/Callout',
  component: Callout,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    children: null,
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['informative', 'neutral', 'negative', 'notice', 'positive'],
    },
    appearance: {
      control: 'select',
      options: ['flat', 'outline'],
    },
  },
} satisfies Meta<typeof Callout>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    children: 'メンテナンスのため、10月30日 2:00〜4:00 はサービスを利用できません。',
    color: 'informative',
    appearance: 'flat',
  },
}

export const Color: Story = {
  name: 'color',
  render: () => (
    <Stack gap="s">
      <Callout color="informative">informative</Callout>
      <Callout color="positive">positive</Callout>
      <Callout color="negative">negative</Callout>
      <Callout color="notice">notice</Callout>
      <Callout color="neutral">neutral</Callout>
    </Stack>
  ),
}

export const Appearance: Story = {
  name: 'appearance',
  render: () => (
    <Stack gap="s">
      <Callout appearance="flat">flat</Callout>
      <Callout appearance="outline">outline</Callout>
    </Stack>
  ),
}

export const Action: Story = {
  name: 'action',
  render: () => (
    <Stack gap="s">
      <Callout
        color="negative"
        action={
          <Button appearance="outlined" color="negative">
            再試行
          </Button>
        }
      >
        データを読み込めませんでした。
      </Callout>
      <Callout
        color="notice"
        action={
          <Button appearance="transparent" size="s" iconOnly aria-label="閉じる">
            <Icon name="cross" aria-hidden="true" />
          </Button>
        }
      >
        10月30日 2:00〜4:00 は、管理画面を利用できません。
      </Callout>
    </Stack>
  ),
}
