import { AppBar, AppBarLeading, AppBarTrailing } from '../../../AppBar'
import { Button } from '../../../Button'
import { Callout } from '../../../Callout'
import { Checkbox } from '../../../Checkbox'
import { Container } from '../../../Container'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../Dialog'
import { Divider } from '../../../Divider'
import { Icon } from '../../../Icon'
import { Page } from '../../../Page'
import { Paper } from '../../../Paper'
import { Stack } from '../../../Stack'
import { Sticker } from '../../../Sticker'
import { Switch } from '../../../Switch'
import { Typography } from '../../../Typography'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import type { IconName } from '../../../Icon'

const meta = {
  title: 'Templates/Apollo/Account',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── データ ───

const linkedAccounts: { id: string; label: string; icon: IconName; linked: boolean }[] = [
  { id: 'google', label: 'Google', icon: 'launch', linked: true },
  { id: 'apple', label: 'Apple', icon: 'apple', linked: false },
  { id: 'x', label: 'X', icon: 'x', linked: false },
  { id: 'discord', label: 'Discord', icon: 'discord', linked: true },
]

// ─── 部品 ───

const AppShell = ({ children }: { children: ReactNode }) => (
  <Page>
    <AppBar appearance="white" position="relative">
      <AppBarLeading>
        <Typography size="l" fontWeight="bold">
          GAMERS
        </Typography>
      </AppBarLeading>
      <AppBarTrailing>
        <Stack flexDirection="row" gap="xs" alignItems="center">
          <Button appearance="transparent" size="s" iconOnly aria-label="お知らせ">
            <Icon name="bell" size="m" />
          </Button>
          <Button appearance="transparent" size="s" iconOnly aria-label="アカウントメニュー">
            <Icon name="person" size="m" />
          </Button>
        </Stack>
      </AppBarTrailing>
    </AppBar>
    <Container size="m" component="main">
      {children}
    </Container>
  </Page>
)

// 実アプリは Paper 1 枚の中を Divider で区切る構成（アカウントID / メールアドレス /
// メール受信設定 / アカウント削除）。カードを複数並べる形ではない。
const AccountRow = ({
  title,
  children,
  action,
}: {
  title: string
  children: ReactNode
  action?: ReactNode
}) => (
  <Stack flexDirection="row" justifyContent="space-between" alignItems="center" gap="m">
    <Stack gap="xxs">
      <Typography size="m" fontWeight="bold" component="h2">
        {title}
      </Typography>
      {children}
    </Stack>
    {action}
  </Stack>
)

const AccountBody = ({ alert }: { alert?: ReactNode }) => (
  <Stack gap="l">
    <Typography size="xxxl" fontWeight="bold" component="h1">
      アカウント
    </Typography>

    {alert}

    <Paper elevation={1} padding="l">
      <Stack gap="l">
        <AccountRow title="アカウントID">
          <Typography size="s">gm-4821-9930</Typography>
        </AccountRow>

        <Divider />

        <AccountRow
          title="メールアドレス"
          action={
            <Button appearance="outlined" size="s">
              変更
            </Button>
          }
        >
          <Typography size="s">shotaro-imamura@pepabo.com</Typography>
        </AccountRow>

        <Divider />

        <AccountRow
          title="メール受信設定"
          action={
            <Switch color="interactive" size="m" defaultSelected aria-label="メール受信設定" />
          }
        >
          <Typography size="s" color="medium_emphasis">
            サービスからのお知らせをメールで受け取る
          </Typography>
        </AccountRow>

        <Divider />

        <AccountRow
          title="アカウント削除"
          action={
            <Button appearance="outlined" color="negative" size="s">
              削除
            </Button>
          }
        >
          <Typography size="s" color="medium_emphasis">
            削除するとすべてのサーバーとバックアップが失われ、復元できません。
          </Typography>
        </AccountRow>
      </Stack>
    </Paper>

    <Paper elevation={1} padding="l">
      <Stack gap="l">
        <Typography size="m" fontWeight="bold" component="h2">
          外部アカウント連携
        </Typography>
        <Stack gap="m">
          {linkedAccounts.map((a) => (
            <Stack
              key={a.id}
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              gap="m"
            >
              <Stack flexDirection="row" gap="xs" alignItems="center">
                <Icon name={a.icon} size="m" />
                <Typography size="s">{a.label}</Typography>
                {a.linked && (
                  <Sticker color="positive" size="s">
                    すでに連携済み
                  </Sticker>
                )}
              </Stack>
              <Button appearance={a.linked ? 'outlined' : 'flat'} color="neutral" size="s">
                {a.linked ? '解除' : '連携する'}
              </Button>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Paper>
  </Stack>
)

/**
 * Apollo のアカウント設定。基本情報・外部連携・支払い・通知を縦に積んだ設定画面。
 * 同じ SectionCard を 5 回繰り返す構成なので、面の階層と余白が
 * フレーバー切り替えで崩れないかの確認に向く。
 *
 * @summary Apollo のアカウント設定画面
 */
export const Default: Story = {
  render: () => (
    <AppShell>
      <AccountBody />
    </AppShell>
  ),
}

/**
 * 決済が失敗している状態。ページ先頭の警告とカード横のステッカーが連動する。
 * negative がダークな面の上で十分に目立つかの確認用。
 *
 * @summary 決済失敗が起きている状態
 */
export const PaymentFailed: Story = {
  render: () => (
    <AppShell>
      <AccountBody
        alert={
          <Callout color="negative">
            クレジットカードの決済に失敗しました。9 月 10
            日までに更新がない場合、サーバーは停止します。
          </Callout>
        }
      />
    </AppShell>
  ),
}

/**
 * 退会確認のダイアログを開いた状態。
 * Dialog がページ本体より一段浮いた面として見えるかを確認するために存在する。
 *
 * @summary 退会確認ダイアログを開いた状態
 */
export const WithdrawDialog: Story = {
  render: () => (
    <AppShell>
      <AccountBody />
      <Dialog isOpen isDismissable>
        <DialogHeader>
          <DialogTitle>本当に退会しますか？</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <Stack gap="m">
            <Typography size="s">
              契約中のサーバー 3 台とバックアップ 12
              件がすべて削除されます。この操作は取り消せません。
            </Typography>
            <Checkbox>削除されるデータについて理解しました</Checkbox>
          </Stack>
        </DialogDescription>
        <DialogFooter>
          <Button appearance="outlined" color="neutral">
            キャンセル
          </Button>
          <Button color="negative">退会する</Button>
        </DialogFooter>
      </Dialog>
    </AppShell>
  ),
}
