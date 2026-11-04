import { useState } from 'react'

import { Button } from '../../Button'
import { Checkbox } from '../../Checkbox'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../Dialog'
import { Divider } from '../../Divider'
import { Icon } from '../../Icon'
import { Stack } from '../../Stack'
import { TextField } from '../../TextField'
import { Typography } from '../../Typography'
import discordLogo from './assets/gamers/external-idp/discord.svg'
import googleLogo from './assets/gamers/external-idp/google.svg'
import twitchLogo from './assets/gamers/external-idp/twitch.svg'
import { GamersPageContainer, GamersShell, useGamersNavigate } from './gamersShell'
import { Card } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

/**
 * ゲーマーズの「アカウント」（apollo/frontend/src/app/(application)/(private)/account）。
 * (private)/layout.tsx の GlobalHeader の下に置く。サイドバーは無い。
 * - account/page.tsx: Container maxWidth='md'（mt 5）に AccountHeader → AccountPaper、AccountLeaveDialog
 * - update-email/page.tsx・update-opt-email-notification/page.tsx: Container maxWidth='sm'（mt 5）に戻るボタン（mb 3）→ Paper
 *
 * 実物と違って残っている点:
 * - Paper の余白。実物は左右 px 4〜6・上下 py 4（アカウント）／py 10〜14（変更のページ）と縦横で違うが、ここでは四辺同じ
 * - 各段の余白。実物は段の下 mb 5（40px）・区切り線の下 pt 2 ＋ mt 1（24px）。ここでは線の上 xl（32px）・線の下 l（24px）
 * - 見出し（h1・h2・h3）。実物の MUI Typography は margin 0。Typography の見出しには UA の margin（上下 0.67〜0.83em）が残り、
 *   段の中の見出しの上下が実物より開く。p は UA の margin が残らない div にしている
 * - 各段は実物では xs（縦積み）のとき左寄せ、md 以上で縦の中央にそろう（alignItems {md: 'center'}）。
 *   Stack の alignItems がレスポンシブにならないので center のまま（GAP-17）。狭い幅では右のボタンが中央に寄る
 * - 外部アカウント連携のプロバイダ名の枠は実物では幅 150px 固定で、表示名の頭がそろう。ここでは幅を固定していない
 * - 外部アカウントの表示名は実物では 1 行で省略（ellipsis）。ここでは折り返す
 * - 外部アカウントのロゴは実物では object-fit: contain
 * - Dialog は実物では fullWidth（600px）。ここでは中身の幅
 * - 変更のページの「送信」「保存」の上は実物では mt 5（40px）。Stack の gap は xl（32px）
 */

const meta = {
  title: 'Templates/Gamers/Account',
  // テンプレートはロリポップのトンマナを確かめる場所なので、フレーバーを lolipop に固定する
  globals: { flavor: 'lolipop' },
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── データ ───

const account = { id: 'ac-1f7e3b9d2c', email: 'you@example.com', newsletter: true }

/** components/ExternalIdpButtons/model.ts の externalIdpProviders（Google・Discord・Twitch の順） */
const externalProviders: { label: string; logo: string; linked?: string }[] = [
  { label: 'Google', logo: googleLogo, linked: 'you@example.com' },
  { label: 'Discord', logo: discordLogo, linked: 'lolipop_taro' },
  { label: 'Twitch', logo: twitchLogo },
]

// ─── アカウント ───

/** AccountPaper の 1 段。見出し（m の太字の h2）と値、右に操作。sm 以上で横並び */
const AccountRow = ({
  title,
  children,
  action,
}: {
  title: string
  children?: ReactNode
  action?: ReactNode
}) => (
  // 実物は xs のときの見出しの塊の下が mb 1（8px）
  <Stack
    flexDirection={{ xxs: 'column', s: 'row' }}
    gap="xs"
    justifyContent="space-between"
    alignItems="center"
  >
    <Stack gap="xs">
      <Typography fontWeight="bold" component="h2">
        {title}
      </Typography>
      {children}
    </Stack>
    {action}
  </Stack>
)

/** account/_components/ExternalIdentitiesSection。連携の解除は確認を挟まず、押すとすぐ解除する */
const ExternalIdentitiesSection = () => {
  const navigate = useGamersNavigate()
  return (
    // 実物は見出しの mb 1（8px）＋行の py 1.5（12px）。行の間は区切り線と py 1.5
    <Stack gap="m">
      <Typography fontWeight="bold" component="h2">
        外部アカウント連携
      </Typography>
      <Stack gap="s">
        {externalProviders.map((p, i) => (
          <Stack key={p.label} gap="s">
            {i > 0 && <Divider />}
            {/* 実物は xs で縦積み（gap 1 = 8px）、sm 以上で横並び（gap 0。左右は space-between で離れる） */}
            <Stack
              flexDirection={{ xxs: 'column', s: 'row' }}
              gap="xs"
              justifyContent="space-between"
              alignItems="center"
            >
              {/* 実物は xs で gap 0.5（4px）、sm 以上で gap 1.5（12px） */}
              <Stack
                flexDirection={{ xxs: 'column', s: 'row' }}
                gap={{ xxs: 'xxs', s: 's' }}
                alignItems="center"
              >
                <Stack flexDirection="row" gap="s" alignItems="center">
                  <img src={p.logo} alt={p.label} width={22} height={22} />
                  <Typography size="s" component="span">
                    {p.label}
                  </Typography>
                </Stack>
                <Typography size="s" component="span">
                  {p.linked ?? '未連携'}
                </Typography>
              </Stack>
              {p.linked ? (
                <Button appearance="outlined" color="negative">
                  解除
                </Button>
              ) : (
                // 実物は外部の認可画面（authUrl）へ移る
                <Button appearance="outlined" onPress={() => navigate('external')}>
                  連携
                </Button>
              )}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}

/** account/page.tsx。AccountHeader（戻るボタン mb 3 → xxl の h1、mb 3）→ AccountPaper */
const AccountPage = ({ leaveDialogOpen = false }: { leaveDialogOpen?: boolean }) => {
  const navigate = useGamersNavigate()
  const [leaving, setLeaving] = useState(leaveDialogOpen)
  return (
    <GamersPageContainer maxWidth="md">
      <Stack gap="l">
        {/* AccountHeader。/home へ戻る */}
        <Stack flexDirection="row">
          <Button
            appearance="outlined"
            leading={<Icon name="arrow_left" size="s" />}
            onPress={() => navigate('home')}
          >
            サーバー
          </Button>
        </Stack>
        <Typography size="xxl" fontWeight="bold" component="h1">
          アカウント
        </Typography>
        {/* AccountPaper */}
        <Card padding={{ xxs: 'xl', m: 'xxl' }}>
          {/* 段の下（区切り線の上）は xl、区切り線の下は l */}
          <Stack gap="l">
            <Stack gap="xl">
              <AccountRow title="アカウントID">
                <Typography size="s" component="div">
                  {account.id}
                </Typography>
              </AccountRow>
              <Divider />
            </Stack>
            <Stack gap="xl">
              <AccountRow
                title="メールアドレス"
                action={
                  <Button appearance="outlined" onPress={() => navigate('account-update-email')}>
                    変更
                  </Button>
                }
              >
                <Typography size="s" component="div">
                  {account.email}
                </Typography>
              </AccountRow>
              <Divider />
            </Stack>
            <Stack gap="xl">
              <ExternalIdentitiesSection />
              <Divider />
            </Stack>
            <Stack gap="xl">
              <AccountRow
                title="メール受信設定"
                action={
                  <Button appearance="outlined" onPress={() => navigate('account-newsletter')}>
                    変更
                  </Button>
                }
              >
                <Typography size="s" fontWeight="bold" component="h3">
                  ニュースレター
                </Typography>
                <Typography size="s" component="div">
                  {account.newsletter ? '受信する' : '受信しない'}
                </Typography>
              </AccountRow>
              <Divider />
            </Stack>
            <AccountRow
              title="アカウント削除"
              action={
                <Button appearance="outlined" color="negative" onPress={() => setLeaving(true)}>
                  削除
                </Button>
              }
            />
          </Stack>
        </Card>
      </Stack>
      {leaving && <AccountLeaveDialog onClose={() => setLeaving(false)} />}
    </GamersPageContainer>
  )
}

// ─── 変更のページ ───

/** UpdateEmailBackButton・UpdateOptEmailNotificationBackButton。/account へ戻る */
const BackButton = () => {
  const navigate = useGamersNavigate()
  return (
    <Stack flexDirection="row">
      <Button
        appearance="outlined"
        leading={<Icon name="arrow_left" size="s" />}
        onPress={() => navigate('account')}
      >
        戻る
      </Button>
    </Stack>
  )
}

/** update-email/page.tsx（Container maxWidth='sm'）と UpdateEmailPaper */
const UpdateEmailPage = () => (
  <GamersPageContainer maxWidth="sm">
    <Stack gap="l">
      <BackButton />
      <Card padding={{ xxs: 'xl', m: 'xxl' }}>
        {/* 実物は説明の mb 3 ＋フォームの mt 3（48px） */}
        <Stack gap="xxl">
          <Stack gap="l">
            <Typography size="xl" fontWeight="bold" component="div">
              メールアドレス変更
            </Typography>
            <Typography size="s" component="div">
              入力したメールアドレスにメールアドレス変更メールが送付されます
            </Typography>
            {/* UpdateEmailMessage（送信の結果）はここに出る。初期状態では何も出ない */}
          </Stack>
          <Stack gap="xl">
            <TextField
              label="メールアドレス"
              placeholder="mail@pepabo.com"
              type="email"
              width="full"
            />
            <Button color="interactive" size="l" width="full">
              メールアドレス変更メールを送信
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  </GamersPageContainer>
)

/** update-opt-email-notification/page.tsx と UpdateOptEmailNotificationPaper（components/CheckboxItem。題も説明も m） */
const UpdateNewsletterPage = () => (
  <GamersPageContainer maxWidth="sm">
    <Stack gap="l">
      <BackButton />
      <Card padding={{ xxs: 'xl', m: 'xxl' }}>
        {/* 実物は題の mb 3 ＋フォームの mt 3（48px）。CheckboxItem と保存の間は spacing 5（40px） */}
        <Stack gap="xxl">
          <Typography size="xl" fontWeight="bold" component="div">
            メール受信設定
          </Typography>
          <Stack gap="xl">
            {/* CheckboxItem：題と説明はそれぞれ py 1（間 16px）、説明とチェックボックスの間 8px */}
            <Stack gap="xs">
              <Stack gap="m">
                <Typography fontWeight="bold" component="div">
                  ニュースレター
                </Typography>
                <Typography component="div">
                  クーポンや最新アップデート情報などをお届けします。
                </Typography>
              </Stack>
              <Checkbox defaultSelected={account.newsletter}>受信する</Checkbox>
            </Stack>
            <Button color="interactive" size="l" width="full">
              保存
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  </GamersPageContainer>
)

/** account/_components/AccountLeaveDialog。入力が一致するまで削除を押せない */
const AccountLeaveDialog = ({ onClose }: { onClose: () => void }) => (
  <Dialog isOpen onOpenChange={(open) => !open && onClose()}>
    <DialogHeader>
      <DialogTitle>アカウント削除</DialogTitle>
    </DialogHeader>
    <Stack gap="l">
      <DialogDescription>
        誤操作を防止するためご利用のメールアドレスをご入力ください
      </DialogDescription>
      <TextField
        label="ご利用のメールアドレス"
        placeholder="mail@pepabo.com"
        type="email"
        width="full"
      />
    </Stack>
    <DialogFooter>
      <Button appearance="transparent" onPress={onClose}>
        閉じる
      </Button>
      {/* 削除に成功すると /login?leave_account=success へ移る */}
      <Button appearance="outlined" color="negative" isDisabled>
        削除
      </Button>
    </DialogFooter>
  </Dialog>
)

// ─── ストーリー ───

/**
 * アカウント（アカウントID・メールアドレス・外部アカウント連携・メール受信設定・アカウント削除）。
 *
 * @summary アカウント
 */
export const Default: Story = {
  render: () => (
    <GamersShell>
      <AccountPage />
    </GamersShell>
  ),
}

/**
 * メールアドレス変更。アカウントの「メールアドレス」の「変更」から入る。
 *
 * @summary メールアドレス変更
 */
export const UpdateEmail: Story = {
  render: () => (
    <GamersShell>
      <UpdateEmailPage />
    </GamersShell>
  ),
}

/**
 * メール受信設定。アカウントの「メール受信設定」の「変更」から入る。
 *
 * @summary メール受信設定
 */
export const NewsletterSettings: Story = {
  render: () => (
    <GamersShell>
      <UpdateNewsletterPage />
    </GamersShell>
  ),
}

/**
 * アカウント削除の確認。ご利用のメールアドレスを入れるまで「削除」は押せない。
 *
 * @summary アカウント削除の確認
 */
export const LeaveAccount: Story = {
  render: () => (
    <GamersShell>
      <AccountPage leaveDialogOpen />
    </GamersShell>
  ),
}
