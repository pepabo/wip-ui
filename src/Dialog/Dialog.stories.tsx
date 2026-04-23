import { useState } from 'react'

import { Button } from '../Button/Button'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

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

/**
 * ユーザーに情報を提示し、確認後に閉じるシンプルなダイアログ。
 *
 * @summary 情報提示のみのシンプルなダイアログ
 */
export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Open Dialog</Button>
        <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          <DialogDescription>This is a dialog with a title and description.</DialogDescription>
          <DialogFooter>
            <Button onPress={() => setIsOpen(false)}>Close</Button>
          </DialogFooter>
        </Dialog>
      </>
    )
  },
}

/**
 * 削除や送信など取り消しにくい操作の前にユーザーに確認を求める場面で使用。
 *
 * @summary 取り消しにくい操作の確認を求める場合
 */
export const WithActions: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Open Dialog</Button>
        <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
          </DialogHeader>
          <DialogDescription>Are you sure you want to proceed with this action?</DialogDescription>
          <DialogFooter>
            <Button appearance="outlined" onPress={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button color="interactive" onPress={() => setIsOpen(false)}>
              Confirm
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    )
  },
}

/**
 * 背景クリックやEscapeキーで閉じられないダイアログ。
 * 重要な操作の確認など、ユーザーに明示的な選択を求める場面で使用。
 *
 * @summary 閉じられないダイアログ
 */
export const NotDismissable: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Open Dialog</Button>
        <Dialog isOpen={isOpen} onOpenChange={setIsOpen} isDismissable={false}>
          <DialogHeader>
            <DialogTitle>Non-Dismissable Dialog</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            This dialog cannot be closed by clicking outside or pressing Escape.
          </DialogDescription>
          <DialogFooter>
            <Button onPress={() => setIsOpen(false)}>Close</Button>
          </DialogFooter>
        </Dialog>
      </>
    )
  },
}
