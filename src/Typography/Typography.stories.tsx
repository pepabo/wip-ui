import { Stack } from '../Stack'
import { Typography } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Data Display/Typography',
  component: Typography,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'],
    },
    density: {
      control: 'select',
      options: ['comfort', 'normal', 'dense'],
    },
    fontWeight: {
      control: 'select',
      options: ['normal', 'bold'],
    },
    color: {
      control: 'select',
      options: [
        'high_emphasis',
        'medium_emphasis',
        'low_emphasis',
        'informative',
        'positive',
        'notice',
        'negative',
      ],
    },
  },
  args: {
    children: 'テキスト',
  },
} satisfies Meta<typeof Typography>

export default meta
type Story = StoryObj<typeof meta>

const longText =
  'ご利用中のサービスの料金プランは、管理画面からいつでも変更できます。変更後のプランは翌月1日から適用され、日割りでの精算は行いません。'

export const Playground: Story = {
  args: {
    size: 'm',
    density: 'normal',
    fontWeight: 'normal',
    color: 'high_emphasis',
    component: 'p',
  },
}

export const Size: Story = {
  name: 'size',
  render: () => (
    <Stack gap="s">
      <Typography size="xxs">xxs</Typography>
      <Typography size="xs">xs</Typography>
      <Typography size="s">s</Typography>
      <Typography size="m">m</Typography>
      <Typography size="l">l</Typography>
      <Typography size="xl">xl</Typography>
      <Typography size="xxl">xxl</Typography>
      <Typography size="xxxl">xxxl</Typography>
    </Stack>
  ),
}

export const Density: Story = {
  name: 'density',
  render: () => (
    <Stack gap="s">
      <Typography density="comfort">comfort: {longText}</Typography>
      <Typography density="normal">normal: {longText}</Typography>
      <Typography density="dense">dense: {longText}</Typography>
    </Stack>
  ),
}

export const FontWeight: Story = {
  name: 'fontWeight',
  render: () => (
    <Stack gap="s">
      <Typography fontWeight="normal">normal</Typography>
      <Typography fontWeight="bold">bold</Typography>
    </Stack>
  ),
}

export const Color: Story = {
  name: 'color',
  render: () => (
    <Stack gap="s">
      <Typography color="high_emphasis">high_emphasis</Typography>
      <Typography color="medium_emphasis">medium_emphasis</Typography>
      <Typography color="low_emphasis">low_emphasis</Typography>
      <Typography color="informative">informative</Typography>
      <Typography color="positive">positive</Typography>
      <Typography color="notice">notice</Typography>
      <Typography color="negative">negative</Typography>
    </Stack>
  ),
}

export const Component: Story = {
  name: 'component',
  render: () => (
    <Stack gap="s">
      <Typography component="h2" size="xl" fontWeight="bold">
        h2
      </Typography>
      <Typography component="p">p</Typography>
      <Typography component="span">span</Typography>
    </Stack>
  ),
}
