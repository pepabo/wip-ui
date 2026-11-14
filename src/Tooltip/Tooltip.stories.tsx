import { Button } from '../Button'
import { Grid, GridItem } from '../Grid'
import { Icon } from '../Icon'
import { Tooltip, type TooltipProps, TooltipTrigger } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const placements = [
  'bottom',
  'bottom start',
  'bottom end',
  'bottom left',
  'bottom right',
  'top',
  'top start',
  'top end',
  'top left',
  'top right',
  'left',
  'left top',
  'left bottom',
  'right',
  'right top',
  'right bottom',
  'start',
  'start top',
  'start bottom',
  'end',
  'end top',
  'end bottom',
] as const satisfies readonly NonNullable<TooltipProps['placement']>[]

const meta = {
  title: 'Components/Data Display/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: { description: '表示する補足の文' },
    placement: {
      description: 'ボタンに対して表示する位置',
      control: 'select',
      options: placements,
    },
    triggerRef: {
      description: '位置の基準にする要素の ref。TooltipTrigger 以外を基準にする場合に使う',
    },
    isEntering: { description: '表示のアニメーション中かどうか' },
    isExiting: { description: '非表示のアニメーション中かどうか' },
    UNSTABLE_portalContainer: { description: 'ツールチップを表示する先の要素' },
    className: { description: '追加するクラス' },
    style: { description: '追加するインラインスタイル' },
  },
  args: {
    placement: 'top',
    children: 'コピー',
  },
  render: (args) => (
    <TooltipTrigger>
      <Button iconOnly appearance="transparent" aria-label="コピー">
        <Icon name="copy" aria-hidden="true" />
      </Button>
      <Tooltip {...args} />
    </TooltipTrigger>
  ),
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Placement: Story = {
  name: 'placement',
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <Grid spacing="xl">
      {placements.map((placement) => (
        <GridItem key={placement} size={3}>
          <TooltipTrigger>
            <Button appearance="outlined" width="full">
              {placement}
            </Button>
            <Tooltip placement={placement}>補足の説明</Tooltip>
          </TooltipTrigger>
        </GridItem>
      ))}
    </Grid>
  ),
}
