import { Stack } from '../Stack'
import { Typography } from '../Typography'
import { Meter } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Data Display/Meter',
  component: Meter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'ディスク使用量',
    value: 3.2,
    maxValue: 10,
    valueLabel: '3.2 GB / 10 GB',
    color: 'neutral',
    size: 'm',
  },
} satisfies Meta<typeof Meter>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Label: Story = {
  name: 'label',
  render: (args) => (
    <Stack gap="l">
      <Meter {...args} label="ディスク使用量" />
      <Stack gap="xxs">
        <Typography size="s">3.2 GB / 10 GB</Typography>
        <Meter {...args} label={undefined} aria-label="ディスク使用量" size="s" />
      </Stack>
    </Stack>
  ),
}

export const Color: Story = {
  name: 'color',
  render: (args) => (
    <Stack gap="l">
      <Meter {...args} color="neutral" value={3.2} valueLabel="3.2 GB / 10 GB" />
      <Meter
        {...args}
        color="notice"
        value={8.6}
        valueLabel="8.6 GB / 10 GB"
        description="残りが少なくなっています。不要なファイルを削除してください"
      />
      <Meter
        {...args}
        color="negative"
        value={10}
        valueLabel="10 GB / 10 GB"
        description="上限に達したため、ファイルを追加できません。不要なファイルを削除してください"
      />
    </Stack>
  ),
}

export const Size: Story = {
  name: 'size',
  render: (args) => (
    <Stack gap="l">
      <Meter {...args} size="m" label="m" />
      <Meter {...args} size="s" label="s" />
    </Stack>
  ),
}

export const ValueLabel: Story = {
  name: 'valueLabel',
  render: (args) => (
    <Stack gap="l">
      <Meter {...args} label="valueLabel を指定する" valueLabel="3.2 GB / 10 GB" />
      <Meter {...args} label="指定しない（% で表示）" valueLabel={undefined} />
    </Stack>
  ),
}

export const FormatOptions: Story = {
  name: 'formatOptions',
  render: (args) => (
    <Stack gap="l">
      <Meter
        {...args}
        label="指定しない（初期値）"
        value={32.46}
        maxValue={100}
        valueLabel={undefined}
      />
      <Meter
        {...args}
        label="小数第1位までの %"
        value={32.46}
        maxValue={100}
        valueLabel={undefined}
        formatOptions={{ style: 'percent', maximumFractionDigits: 1 }}
      />
    </Stack>
  ),
}

export const Description: Story = {
  name: 'description',
  args: {
    description: '1日1回、午前3時に更新されます',
  },
}
