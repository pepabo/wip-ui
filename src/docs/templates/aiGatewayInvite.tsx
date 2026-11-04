import { useState } from 'react'

import { Button } from '../../Button'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../Dialog'
import { Icon } from '../../Icon'
import { Paper } from '../../Paper'
import { Select, SelectItem } from '../../Select'
import { Stack } from '../../Stack'
import { Tab, TabList, Tabs } from '../../Tab'
import { TextField } from '../../TextField'
import { Typography } from '../../Typography'

/**
 * AI ゲートウェイの「メンバーを招待する」の流れ（features/AccountMembers/index.tsx の招待の Dialog と IssuedSecretDialog）。
 * 組織のメンバーの画面（Members.stories.tsx）と、Sidebar のユーザーメニューの「組織へ招待する」
 * （shared/ui/UserMenu が AccountMembers を dialogOnly・openInviteOnLoad で描く）の両方から開く。
 *
 * - 「メールで招待」: ロール（招待できるロールが 2 つ以上のとき）と宛先。「招待メールを送信する」で送り、ダイアログを閉じる
 * - 「URLで招待」: 説明だけ。「招待URLを発行する」で招待のダイアログを閉じ、発行した URL のダイアログを開く
 *
 * 表せなかったもの:
 * - GAP: Dialog に幅の口が無い。実物は招待 520px・発行した URL 560px
 * - GAP: 宛先の欄（InviteEmailField）は複数の宛先をチップで並べる欄（Enter・カンマで確定、最大 50 件）。TextField で代用している
 * - GAP: 実物は 2 つの TabPanel を重ねて常に描き、タブを替えても高さを変えない。ここでは TabPanel を使わず、
 *   選んだタブの中身だけをタブの下に置いている（Tabs の中に Select を置くと落ちる）
 * - GAP: 発行した URL の面（shared/ui/CopyableValue）は実物では gray[50] の地・等幅 12px の文字・右に CopyButton（押すと check に変わる）
 * - GAP: SuccessMark（回って出る緑の check の印）。check_on_circle を positive の色で置いている
 * - 送信の結果（「n件の招待メールを送信しました」のスナックバー・送れなかった宛先の Callout）は出さない
 */

const invitationUrl =
  'https://ai-gateway.lolipop.jp/invite#token=octi_g1_8c0f3a2e-5b1d-4c7a-9e2f-1a3b5c7d9e0f_Qx7mK2pL9vR4tY8wZ1nB5cH3jF6gD0sA2eU4iO7yT9r'

/** shared/ui/IssuedSecretDialog（IssuedSecretPanel）。コピーするまで外側を押しても Escape でも閉じない */
export const IssuedUrlDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [copied, setCopied] = useState(false)
  return (
    <Dialog
      isOpen={isOpen}
      isDismissable={false}
      isKeyboardDismissDisabled={!copied}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogHeader>
        <Stack flexDirection="row" gap="xs" alignItems="center">
          <DialogTitle>招待URLを発行しました</DialogTitle>
          <Typography component="span" color="positive">
            <Icon name="check_on_circle" size="l" />
          </Typography>
        </Stack>
        <DialogDescription>
          このURLは一度だけ表示されます。閉じる前にコピーしてください。
        </DialogDescription>
      </DialogHeader>
      {/* shared/ui/CopyableValue。枠線の面の中に値と、右に CopyButton */}
      <Paper outlined padding="xs">
        <Stack flexDirection="row" gap="xs" alignItems="center" justifyContent="space-between">
          <Typography size="xs" component="span">
            {invitationUrl}
          </Typography>
          <Button
            iconOnly
            appearance="transparent"
            color="neutral"
            size="s"
            aria-label={copied ? '招待URLをコピーしました' : '招待URLをコピーする'}
            onPress={() => setCopied(true)}
          >
            <Icon name={copied ? 'check' : 'copy'} size="s" />
          </Button>
        </Stack>
      </Paper>
      <DialogFooter>
        <Button color="neutral" onPress={onClose}>
          閉じる
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

/** 招待の Dialog。フッターの確定はタブで「招待メールを送信する」と「招待URLを発行する」に替わる */
export const InviteDialog = ({
  isOpen,
  onClose,
  initialMode = 'email',
  initialIssued = false,
}: {
  isOpen: boolean
  onClose: () => void
  /** 最初に選んでおくタブ */
  initialMode?: 'email' | 'url'
  /** 招待 URL を発行した後のダイアログを開いた状態で始める */
  initialIssued?: boolean
}) => {
  const [mode, setMode] = useState(initialMode)
  const [email, setEmail] = useState('')
  const [issued, setIssued] = useState(initialIssued)
  const close = () => {
    setMode('email')
    setEmail('')
    onClose()
  }
  return (
    <>
      <Dialog isOpen={isOpen && !issued} onOpenChange={(open) => !open && close()}>
        <DialogHeader>
          <DialogTitle>メンバーを招待する</DialogTitle>
        </DialogHeader>
        <Stack gap="s">
          <DialogDescription>メールで招待するか、招待URLを発行して共有します。</DialogDescription>
          <Tabs
            selectedKey={mode}
            onSelectionChange={(key) => setMode(String(key) === 'url' ? 'url' : 'email')}
          >
            <TabList aria-label="招待方法">
              <Tab id="email">メールで招待</Tab>
              <Tab id="url">URLで招待</Tab>
            </TabList>
          </Tabs>
          {mode === 'email' ? (
            <Stack gap="s">
              {/* 招待できるロールが 2 つ以上あるときだけ出る。既定はメンバー */}
              <Select label="ロール" width="full" defaultSelectedKey="member">
                <SelectItem id="owner">オーナー</SelectItem>
                <SelectItem id="member">メンバー</SelectItem>
              </Select>
              <TextField
                label="招待メールの宛先"
                placeholder="member@example.com"
                type="email"
                width="full"
                value={email}
                onChange={setEmail}
              />
            </Stack>
          ) : (
            <Typography size="s" color="medium_emphasis">
              招待URLを発行して、参加してほしい方へ共有します。URLを知っている人がメンバーとして参加できます。
            </Typography>
          )}
        </Stack>
        <DialogFooter>
          <Button appearance="transparent" color="neutral" onPress={close}>
            キャンセル
          </Button>
          {mode === 'email' ? (
            // 宛先が 1 つも無いあいだは押せない
            <Button color="neutral" isDisabled={email.trim() === ''} onPress={close}>
              招待メールを送信する
            </Button>
          ) : (
            <Button color="neutral" onPress={() => setIssued(true)}>
              招待URLを発行する
            </Button>
          )}
        </DialogFooter>
      </Dialog>
      <IssuedUrlDialog
        isOpen={isOpen && issued}
        onClose={() => {
          setIssued(false)
          close()
        }}
      />
    </>
  )
}
