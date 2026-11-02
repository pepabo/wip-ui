import { useState } from 'react'

import { Button } from '../Button/Button'
import { Stack } from '../Stack'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { DialogProps } from './index'

const meta = {
  title: 'Components/Feedback/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

type ExampleProps = Omit<DialogProps, 'isOpen' | 'onOpenChange' | 'children'> & {
  triggerLabel: string
}

const InfoDialog = ({ triggerLabel, ...props }: ExampleProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onPress={() => setIsOpen(true)}>{triggerLabel}</Button>
      <Dialog {...props} isOpen={isOpen} onOpenChange={setIsOpen}>
        <DialogHeader>
          <DialogTitle>メンテナンスのお知らせ</DialogTitle>
        </DialogHeader>
        <DialogDescription>10月30日 2:00〜4:00 は、管理画面を利用できません。</DialogDescription>
        <DialogFooter>
          <Button onPress={() => setIsOpen(false)}>閉じる</Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}

const ConfirmDialog = ({ triggerLabel, ...props }: ExampleProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onPress={() => setIsOpen(true)}>{triggerLabel}</Button>
      <Dialog {...props} isOpen={isOpen} onOpenChange={setIsOpen}>
        <DialogHeader>
          <DialogTitle>このファイルを削除しますか？</DialogTitle>
        </DialogHeader>
        <DialogDescription>削除したファイルは元に戻せません。</DialogDescription>
        <DialogFooter>
          <Button appearance="outlined" onPress={() => setIsOpen(false)} autoFocus>
            キャンセル
          </Button>
          <Button color="negative" onPress={() => setIsOpen(false)}>
            削除
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}

export const Playground: Story = {
  args: {
    isDismissable: true,
    role: 'dialog',
  },
  argTypes: {
    isDismissable: {
      control: 'boolean',
    },
    role: {
      control: 'select',
      options: ['dialog', 'alertdialog'],
    },
  },
  render: (args) => <InfoDialog {...args} triggerLabel="ダイアログを開く" />,
}

export const IsDismissable: Story = {
  name: 'isDismissable',
  render: () => (
    <Stack flexDirection="row" gap="s">
      <InfoDialog isDismissable triggerLabel="true" />
      <ConfirmDialog isDismissable={false} triggerLabel="false" />
    </Stack>
  ),
}

export const Role: Story = {
  name: 'role',
  render: () => (
    <Stack flexDirection="row" gap="s">
      <InfoDialog role="dialog" triggerLabel="dialog" />
      <ConfirmDialog role="alertdialog" isDismissable={false} triggerLabel="alertdialog" />
    </Stack>
  ),
}
