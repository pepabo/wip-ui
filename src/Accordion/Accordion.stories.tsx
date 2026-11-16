import { Stack } from '../Stack'
import { Typography } from '../Typography'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Surfaces/Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    allowsMultipleExpanded: true,
    divided: false,
    isDisabled: false,
    children: (
      <>
        <AccordionItem id="users">
          <AccordionTrigger>追加済みのユーザー</AccordionTrigger>
          <AccordionContent>
            <Typography>ユーザーの一覧</Typography>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="ports">
          <AccordionTrigger>開放済みのポート</AccordionTrigger>
          <AccordionContent>
            <Typography>ポートの一覧</Typography>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="backups">
          <AccordionTrigger>バックアップ</AccordionTrigger>
          <AccordionContent>
            <Typography>バックアップの設定</Typography>
          </AccordionContent>
        </AccordionItem>
      </>
    ),
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const AllowsMultipleExpanded: Story = {
  name: 'allowsMultipleExpanded',
  render: (args) => (
    <Stack gap="m">
      <Accordion {...args} allowsMultipleExpanded defaultExpandedKeys={['true-1', 'true-2']}>
        <AccordionItem id="true-1">
          <AccordionTrigger>true（初期値）：1つめ</AccordionTrigger>
          <AccordionContent>
            <Typography>ほかのセクションを開いても閉じない</Typography>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="true-2">
          <AccordionTrigger>true（初期値）：2つめ</AccordionTrigger>
          <AccordionContent>
            <Typography>ほかのセクションを開いても閉じない</Typography>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion {...args} allowsMultipleExpanded={false} defaultExpandedKeys={['false-1']}>
        <AccordionItem id="false-1">
          <AccordionTrigger>false：1つめ</AccordionTrigger>
          <AccordionContent>
            <Typography>ほかのセクションを開くと閉じる</Typography>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="false-2">
          <AccordionTrigger>false：2つめ</AccordionTrigger>
          <AccordionContent>
            <Typography>ほかのセクションを開くと閉じる</Typography>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Stack>
  ),
}

export const DefaultExpandedKeys: Story = {
  name: 'defaultExpandedKeys',
  render: (args) => (
    <Accordion {...args} defaultExpandedKeys={['users']}>
      <AccordionItem id="users">
        <AccordionTrigger>defaultExpandedKeys に含める</AccordionTrigger>
        <AccordionContent>
          <Typography>開いた状態で表示する</Typography>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem id="ports">
        <AccordionTrigger>含めない</AccordionTrigger>
        <AccordionContent>
          <Typography>閉じた状態で表示する</Typography>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const Divided: Story = {
  name: 'divided',
  render: (args) => (
    <Stack gap="m">
      <Accordion {...args} divided>
        <AccordionItem>
          <AccordionTrigger>true：1つめ</AccordionTrigger>
          <AccordionContent>
            <Typography>セクションの間に区切り線を入れる</Typography>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem>
          <AccordionTrigger>true：2つめ</AccordionTrigger>
          <AccordionContent>
            <Typography>セクションの間に区切り線を入れる</Typography>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion {...args} divided={false}>
        <AccordionItem>
          <AccordionTrigger>false（初期値）：1つめ</AccordionTrigger>
          <AccordionContent>
            <Typography>区切り線を入れない</Typography>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem>
          <AccordionTrigger>false（初期値）：2つめ</AccordionTrigger>
          <AccordionContent>
            <Typography>区切り線を入れない</Typography>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Stack>
  ),
}

export const ItemIsDisabled: Story = {
  name: 'AccordionItem isDisabled',
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem isDisabled>
        <AccordionTrigger>isDisabled</AccordionTrigger>
        <AccordionContent>
          <Typography>開けない</Typography>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem>
        <AccordionTrigger>なし</AccordionTrigger>
        <AccordionContent>
          <Typography>開ける</Typography>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const TriggerIndicator: Story = {
  name: 'AccordionTrigger indicator',
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem>
        <AccordionTrigger indicator="end">end（初期値）</AccordionTrigger>
        <AccordionContent>
          <Typography>末尾に矢印を置く</Typography>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem>
        <AccordionTrigger indicator="start">start</AccordionTrigger>
        <AccordionContent>
          <Typography>先頭に矢印を置く</Typography>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem>
        <AccordionTrigger indicator="none">none</AccordionTrigger>
        <AccordionContent>
          <Typography>矢印を置かない</Typography>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
