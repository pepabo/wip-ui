import { Avatar } from '../Avatar'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Paper } from '../Paper'
import { Stack } from '../Stack'
import { Sticker } from '../Sticker'
import { List, ListItem } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

// md の「面との関係」のとおり、Paper outlined の中に余白なしで入れる
const Card = ({ children }: { children: ReactNode }) => (
  <Paper outlined style={{ width: 400, overflow: 'hidden' }}>
    {children}
  </Paper>
)

const meta = {
  title: 'Components/Data Display/List',
  component: List,
  subcomponents: { ListItem },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: null,
  },
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    divider: true,
  },
  render: (args) => (
    <Card>
      <List {...args}>
        <ListItem href="#" trailing={<Icon name="chevron_right" size="s" aria-hidden="true" />}>
          プロフィール
        </ListItem>
        <ListItem href="#" trailing={<Icon name="chevron_right" size="s" aria-hidden="true" />}>
          通知
        </ListItem>
        <ListItem href="#" trailing={<Icon name="chevron_right" size="s" aria-hidden="true" />}>
          セキュリティ
        </ListItem>
      </List>
    </Card>
  ),
}

export const Divider: Story = {
  name: 'divider',
  render: () => (
    <Stack gap="m">
      <Card>
        <List divider>
          <ListItem>true</ListItem>
          <ListItem>true</ListItem>
        </List>
      </Card>
      <Card>
        <List divider={false}>
          <ListItem leading={<Avatar src="https://i.pravatar.cc/150?img=2" alt="" size="s" />}>
            false
          </ListItem>
          <ListItem leading={<Avatar src="https://i.pravatar.cc/150?img=3" alt="" size="s" />}>
            false
          </ListItem>
        </List>
      </Card>
    </Stack>
  ),
}

export const Leading: Story = {
  name: 'leading',
  render: () => (
    <Stack gap="m">
      <Card>
        <List>
          <ListItem leading={<Icon name="folder" />}>Icon</ListItem>
          <ListItem leading={<Icon name="bill" />}>Icon</ListItem>
        </List>
      </Card>
      <Card>
        <List>
          <ListItem leading={<Avatar src="https://i.pravatar.cc/150?img=1" alt="" size="s" />}>
            Avatar
          </ListItem>
          <ListItem leading={<Avatar src="https://i.pravatar.cc/150?img=4" alt="" size="s" />}>
            Avatar
          </ListItem>
        </List>
      </Card>
    </Stack>
  ),
}

export const Description: Story = {
  name: 'description',
  render: () => (
    <Card>
      <List>
        <ListItem>Google</ListItem>
        <ListItem description="example@gmail.com">Google</ListItem>
      </List>
    </Card>
  ),
}

export const Trailing: Story = {
  name: 'trailing',
  render: () => (
    <Card>
      <List>
        <ListItem trailing="2026/12/01">文字</ListItem>
        <ListItem
          trailing={
            <Sticker color="informative" size="s">
              現在のセッション
            </Sticker>
          }
        >
          Sticker
        </ListItem>
        <ListItem
          trailing={
            <Button appearance="transparent" color="negative" size="s">
              解除
            </Button>
          }
        >
          Button
        </ListItem>
      </List>
    </Card>
  ),
}

export const Href: Story = {
  name: 'href',
  render: () => (
    <Card>
      <List>
        <ListItem href="#" trailing={<Icon name="chevron_right" size="s" aria-hidden="true" />}>
          プロフィール
        </ListItem>
        <ListItem
          href="#"
          isDisabled
          trailing={<Icon name="chevron_right" size="s" aria-hidden="true" />}
        >
          isDisabled
        </ListItem>
      </List>
    </Card>
  ),
}

export const OnPress: Story = {
  name: 'onPress',
  render: () => (
    <Card>
      <List>
        <ListItem onPress={() => alert('押した')} description="押すとダイアログが開く">
          ブラウザ
        </ListItem>
        <ListItem onPress={() => alert('押した')} isDisabled>
          isDisabled
        </ListItem>
      </List>
    </Card>
  ),
}
