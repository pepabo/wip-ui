import { useState } from 'react'

import { Avatar } from '../../../Avatar'
import { Button } from '../../../Button'
import { Callout } from '../../../Callout'
import { Checkbox } from '../../../Checkbox'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../Dialog'
import { Divider } from '../../../Divider'
import { Icon } from '../../../Icon'
import { Stack } from '../../../Stack'
import { Sticker } from '../../../Sticker'
import { Switch } from '../../../Switch'
import { TextField } from '../../../TextField'
import { Typography } from '../../../Typography'
import { AppShell, avatarSrc } from './AppShell'
import {
  Card,
  CopyableValue,
  DefinitionRow,
  identityProviders,
  PageHeader,
  SectionTitle,
} from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Templates/Hosting/Account',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── データ ───

const linkStatus: Record<string, { linked: boolean; detail?: string }> = {
  google: { linked: true, detail: 'taro.yamada@gmail.com' },
  apple: { linked: false },
  x: { linked: false },
  discord: { linked: true, detail: 'taro#4821' },
}

const linkedAccounts = identityProviders
  .filter((provider) => provider.id in linkStatus)
  .map((provider) => ({ ...provider, ...linkStatus[provider.id] }))

const notifications = [
  { key: 'maintenance', label: 'メンテナンス・障害のお知らせ' },
  { key: 'billing', label: '請求・お支払いに関する通知' },
  { key: 'security', label: 'セキュリティに関する重要な通知' },
  { key: 'campaign', label: 'キャンペーン・新機能のご案内' },
] as const

type NotificationKey = (typeof notifications)[number]['key']

// ─── 部品 ───

const Header = () => (
  <PageHeader
    breadcrumbs={[{ label: 'ホーム', href: '#' }, { label: 'アカウント' }]}
    title="アカウント"
    description="ログインに使うメールアドレス、通知、外部アカウントの連携を管理します。"
  />
)

const ProfileCard = ({
  pendingEmail,
  onChangeEmail,
}: {
  pendingEmail?: string
  onChangeEmail: () => void
}) => (
  <Card>
    <Stack gap="m">
      <Stack flexDirection="row" gap="m" alignItems="center">
        <Avatar src={avatarSrc} alt="山田 太郎" size="m" />
        <Stack gap="xxs">
          <Typography size="l" fontWeight="bold" component="h2">
            山田 太郎
          </Typography>
          <Typography size="s" color="medium_emphasis">
            2024-04-01 に登録
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      <DefinitionRow term="アカウント ID">
        <CopyableValue value="acct_7f3a9c21" label="アカウント ID " />
      </DefinitionRow>
      <DefinitionRow term="メールアドレス">
        <Stack gap="xs">
          <Stack flexDirection="row" gap="s" alignItems="center">
            <Typography component="span">you@example.com</Typography>
            <Button appearance="outlined" size="s" onPress={onChangeEmail}>
              変更
            </Button>
          </Stack>
          {pendingEmail && (
            <Callout
              color="notice"
              action={
                <Button appearance="transparent" size="s">
                  再送
                </Button>
              }
            >
              {pendingEmail} に確認メールを送りました。メール内のリンクを開くと変更が完了します。
            </Callout>
          )}
        </Stack>
      </DefinitionRow>
      <DefinitionRow term="ログイン方法">
        <Stack flexDirection="row" gap="xs" alignItems="center">
          <Sticker color="positive" size="s">
            メールリンク
          </Sticker>
          <Sticker color="positive" size="s">
            Google
          </Sticker>
          <Sticker color="positive" size="s">
            Discord
          </Sticker>
        </Stack>
      </DefinitionRow>
    </Stack>
  </Card>
)

const NotificationCard = () => {
  const [items, setItems] = useState<Record<NotificationKey, boolean>>({
    maintenance: true,
    billing: true,
    security: true,
    campaign: false,
  })
  const values = Object.values(items)
  const all = values.every(Boolean)
  const none = values.every((v) => !v)
  const setAll = (checked: boolean) =>
    setItems(
      Object.fromEntries(notifications.map(({ key }) => [key, checked])) as Record<
        NotificationKey,
        boolean
      >
    )
  return (
    <Card>
      <Stack gap="m">
        <SectionTitle>メール通知</SectionTitle>
        <Stack gap="xs">
          <Checkbox isSelected={all} isIndeterminate={!all && !none} onChange={setAll}>
            すべてのメール通知
          </Checkbox>
          <Stack gap="xxs">
            {notifications.map(({ key, label }) => (
              <Checkbox
                key={key}
                isSelected={items[key]}
                onChange={(v) => setItems({ ...items, [key]: v })}
              >
                {label}
              </Checkbox>
            ))}
          </Stack>
        </Stack>
        <Divider />
        <Stack gap="xs">
          <Switch label="ログイン時に通知する" size="s" defaultSelected />
          <Switch label="サーバー停止・起動失敗を通知する" size="s" defaultSelected />
          <Switch label="Discord にも通知する" size="s" isDisabled />
          <Typography size="xxs" color="low_emphasis">
            Discord 通知はサーバーの「連携」設定で Webhook を登録すると有効になります。
          </Typography>
        </Stack>
      </Stack>
    </Card>
  )
}

const LinkedAccountsCard = () => (
  <Card>
    <Stack gap="m">
      <SectionTitle>外部アカウント連携</SectionTitle>
      <Typography size="s" color="medium_emphasis">
        連携したアカウントでログインできます。少なくとも 1 つのログイン方法を残す必要があります。
      </Typography>
      <Stack gap="s">
        {linkedAccounts.map((account, index) => (
          <Stack key={account.id} gap="s">
            {index > 0 && <Divider variant="inset" />}
            <Stack flexDirection="row" gap="m" alignItems="center" justifyContent="space-between">
              <Stack flexDirection="row" gap="m" alignItems="center">
                <Icon name={account.icon} size="m" />
                <Stack gap="xxs">
                  <Stack flexDirection="row" gap="xs" alignItems="center">
                    <Typography component="span" fontWeight="bold">
                      {account.label}
                    </Typography>
                    {account.linked && (
                      <Sticker color="positive" size="s">
                        連携済み
                      </Sticker>
                    )}
                  </Stack>
                  {account.detail && (
                    <Typography size="xs" color="medium_emphasis">
                      {account.detail}
                    </Typography>
                  )}
                </Stack>
              </Stack>
              {account.linked ? (
                <Button appearance="outlined" size="s">
                  解除
                </Button>
              ) : (
                <Button appearance="outlined" color="interactive" size="s">
                  連携する
                </Button>
              )}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  </Card>
)

const DangerCard = ({ onWithdraw }: { onWithdraw: () => void }) => (
  <Card outlined>
    <Stack gap="m">
      <SectionTitle>アカウントの削除</SectionTitle>
      <Callout
        color="negative"
        appearance="outline"
        action={
          <Button appearance="outlined" color="negative" size="s" onPress={onWithdraw}>
            退会手続きへ
          </Button>
        }
      >
        契約中のサービスがある場合は先に解約が必要です。削除後、同じメールアドレスで再登録しても契約や履歴は引き継がれません。
      </Callout>
    </Stack>
  </Card>
)

const ChangeEmailDialog = ({
  isOpen,
  onOpenChange,
  error,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  error?: string
}) => (
  <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
    <DialogHeader>
      <DialogTitle>メールアドレスを変更</DialogTitle>
    </DialogHeader>
    <DialogDescription>
      新しいメールアドレスに確認メールを送ります。リンクを開くまで変更は反映されません。
    </DialogDescription>
    <Stack gap="m">
      <TextField
        label="現在のメールアドレス"
        defaultValue="you@example.com"
        width="full"
        isReadOnly
      />
      <TextField
        label="新しいメールアドレス"
        placeholder="new@example.com"
        type="email"
        width="full"
        isRequired
        color={error ? 'negative' : 'neutral'}
        validationBehavior="aria"
        validate={() => error ?? null}
        defaultValue={error ? 'you@example.com' : undefined}
      />
    </Stack>
    <DialogFooter>
      <Button appearance="outlined" onPress={() => onOpenChange(false)}>
        キャンセル
      </Button>
      <Button color="interactive" onPress={() => onOpenChange(false)} isDisabled={Boolean(error)}>
        確認メールを送る
      </Button>
    </DialogFooter>
  </Dialog>
)

const WithdrawDialog = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) => (
  <Dialog isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} role="alertdialog">
    <DialogHeader>
      <DialogTitle>アカウントを削除しますか？</DialogTitle>
    </DialogHeader>
    <DialogDescription>
      契約中のサービスが 2 件あります。退会するには先にすべて解約してください。
    </DialogDescription>
    <Stack gap="m">
      <Callout color="negative">
        「example.com」「みんなのサバイバル」が契約中です。契約・お支払いから解約できます。
      </Callout>
      <Checkbox isDisabled>契約がすべて解約済みであることを確認しました</Checkbox>
    </Stack>
    <DialogFooter>
      <Button appearance="outlined" onPress={() => onOpenChange(false)}>
        閉じる
      </Button>
      <Button color="negative" isDisabled>
        アカウントを削除
      </Button>
    </DialogFooter>
  </Dialog>
)

const AccountScreen = ({
  emailError,
  pendingEmail,
  withdrawDialog = false,
}: {
  /** 渡すとメール変更ダイアログをエラー付きで開いた状態にする */
  emailError?: string
  pendingEmail?: string
  withdrawDialog?: boolean
}) => {
  const [isEmailOpen, setIsEmailOpen] = useState(emailError !== undefined)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(withdrawDialog)
  return (
    <AppShell active="account">
      <Header />
      <ProfileCard pendingEmail={pendingEmail} onChangeEmail={() => setIsEmailOpen(true)} />
      <NotificationCard />
      <LinkedAccountsCard />
      <DangerCard onWithdraw={() => setIsWithdrawOpen(true)} />
      <ChangeEmailDialog isOpen={isEmailOpen} onOpenChange={setIsEmailOpen} error={emailError} />
      <WithdrawDialog isOpen={isWithdrawOpen} onOpenChange={setIsWithdrawOpen} />
    </AppShell>
  )
}

// ─── ストーリー ───

/**
 * アカウント設定を 1 枚のページに縦積みにした画面。
 * 通知設定は親 Checkbox が indeterminate になる階層構造で、実際に操作して状態遷移を確認できる。
 *
 * @summary アカウント設定の一覧
 */
export const Default: Story = {
  render: () => <AccountScreen />,
}

/**
 * メールアドレス変更ダイアログで、現在と同じアドレスを入力した状態。
 * ダイアログ内のエラー表示と、エラー中は送信ボタンを disabled にする組み合わせを確認する。
 *
 * @summary メール変更の入力エラー
 */
export const ChangeEmailError: Story = {
  render: () => <AccountScreen emailError="現在のメールアドレスと同じです" />,
}

/**
 * 新しいアドレスに確認メールを送った直後。確認が完了するまで notice の Callout を出し続ける。
 *
 * @summary メール変更の確認待ち
 */
export const EmailChangePending: Story = {
  render: () => <AccountScreen pendingEmail="new@example.com" />,
}

/**
 * 契約が残っている状態で退会しようとしたときの alertdialog。
 * 進めない理由を negative の Callout で示し、確認 Checkbox と削除ボタンは disabled にする。
 *
 * @summary 契約が残っているときの退会ダイアログ
 */
export const WithdrawBlocked: Story = {
  render: () => <AccountScreen withdrawDialog />,
}
