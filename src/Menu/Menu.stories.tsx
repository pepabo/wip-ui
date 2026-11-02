import { Button } from '../Button'
import { Grid, GridItem } from '../Grid'
import { Icon } from '../Icon'
import { Menu, MenuDivider, MenuItem, MenuSection, MenuTrigger } from './index'

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
] as const

const meta = {
  title: 'Components/Actions/Menu',
  component: Menu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: placements,
    },
  },
  args: {
    placement: 'bottom start',
  },
  render: (args) => (
    <MenuTrigger>
      <Button appearance="outlined">ファイルの操作</Button>
      <Menu {...args}>
        <MenuItem>編集</MenuItem>
        <MenuItem>複製</MenuItem>
        <MenuItem color="negative">削除</MenuItem>
      </Menu>
    </MenuTrigger>
  ),
} satisfies Meta<typeof Menu>

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
          <MenuTrigger>
            <Button appearance="outlined" width="full">
              {placement}
            </Button>
            <Menu placement={placement}>
              <MenuItem>編集</MenuItem>
              <MenuItem>複製</MenuItem>
            </Menu>
          </MenuTrigger>
        </GridItem>
      ))}
    </Grid>
  ),
}

export const ItemColor: Story = {
  name: 'MenuItem color',
  render: () => (
    <MenuTrigger>
      <Button appearance="outlined">ファイルの操作</Button>
      <Menu>
        <MenuItem color="neutral">neutral</MenuItem>
        <MenuItem color="negative">negative</MenuItem>
      </Menu>
    </MenuTrigger>
  ),
}

export const ItemLeadingAndTrailing: Story = {
  name: 'MenuItem leading / trailing',
  render: () => (
    <MenuTrigger>
      <Button appearance="outlined">ファイルの操作</Button>
      <Menu>
        <MenuItem leading={<Icon name="pencil" />}>編集</MenuItem>
        <MenuItem leading={<Icon name="copy" />}>複製</MenuItem>
        <MenuItem leading={<Icon name="share" />} trailing={<Icon name="launch" />}>
          別のタブで開く
        </MenuItem>
      </Menu>
    </MenuTrigger>
  ),
}

export const ItemIsDisabled: Story = {
  name: 'MenuItem isDisabled',
  render: () => (
    <MenuTrigger>
      <Button appearance="outlined">ファイルの操作</Button>
      <Menu>
        <MenuItem>編集</MenuItem>
        <MenuItem isDisabled>複製</MenuItem>
        <MenuItem color="negative" isDisabled>
          削除
        </MenuItem>
      </Menu>
    </MenuTrigger>
  ),
}

export const ItemDescription: Story = {
  name: 'MenuItem description',
  render: () => (
    <MenuTrigger>
      <Button appearance="outlined">ファイルの操作</Button>
      <Menu>
        <MenuItem description="最後に保存した内容に戻します">元に戻す</MenuItem>
        <MenuItem color="negative" isDisabled description="オーナーのみ実行できます">
          削除
        </MenuItem>
      </Menu>
    </MenuTrigger>
  ),
}

export const Section: Story = {
  name: 'MenuSection / MenuDivider',
  render: () => (
    <MenuTrigger>
      <Button appearance="outlined">その他の操作</Button>
      <Menu>
        <MenuSection title="ファイル">
          <MenuItem>編集</MenuItem>
          <MenuItem>複製</MenuItem>
        </MenuSection>
        <MenuSection title="共有">
          <MenuItem>リンクをコピー</MenuItem>
        </MenuSection>
        <MenuDivider />
        <MenuItem color="negative">削除</MenuItem>
      </Menu>
    </MenuTrigger>
  ),
}
