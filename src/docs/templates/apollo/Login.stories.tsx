import { AppBar, AppBarLeading } from '../../../AppBar'
import { Button } from '../../../Button'
import { Callout } from '../../../Callout'
import { Container } from '../../../Container'
import { Divider } from '../../../Divider'
import { Icon } from '../../../Icon'
import { Page } from '../../../Page'
import { Paper } from '../../../Paper'
import { Stack } from '../../../Stack'
import { TextField } from '../../../TextField'
import { Typography } from '../../../Typography'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import type { IconName } from '../../../Icon'

const meta = {
  title: 'Templates/Apollo/Login',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const idpProviders: { id: string; label: string; icon: IconName }[] = [
  { id: 'google', label: 'Google', icon: 'launch' },
  { id: 'apple', label: 'Apple', icon: 'apple' },
  { id: 'x', label: 'X', icon: 'x' },
  { id: 'line', label: 'LINE', icon: 'line' },
  { id: 'discord', label: 'Discord', icon: 'discord' },
]

const AppShell = ({ children }: { children: ReactNode }) => (
  <Page>
    <AppBar appearance="white" position="relative">
      <AppBarLeading>
        <Typography size="l" fontWeight="bold">
          GAMERS
        </Typography>
      </AppBarLeading>
    </AppBar>
    <Container size="s" component="main">
      {children}
    </Container>
  </Page>
)

const LoginForm = ({ alert }: { alert?: ReactNode }) => (
  <Paper elevation={1} padding="l">
    <Stack gap="l">
      <Typography size="xxl" fontWeight="bold" component="h1">
        ログイン
      </Typography>

      {alert}

      <Stack gap="s">
        <Typography size="s">外部アカウントでログイン</Typography>
        <Stack flexDirection="row" gap="xs" justifyContent="center">
          {idpProviders.map((p) => (
            <Button
              key={p.id}
              appearance="outlined"
              size="m"
              iconOnly
              aria-label={`${p.label}でログイン`}
            >
              <Icon name={p.icon} size="m" />
            </Button>
          ))}
        </Stack>
      </Stack>

      {/* Divider はラベル付き（<Divider>または</Divider>）に対応していないため
          区切り線と文字を分けて置いている */}
      <Stack gap="xs" alignItems="center">
        <Divider />
        <Typography size="s" color="medium_emphasis">
          または
        </Typography>
      </Stack>

      <Stack gap="l">
        <TextField
          label="メールアドレス"
          caption="ご登録済みのメールアドレスにログイン用のリンクを送ります"
          placeholder="you@example.com"
          width="full"
          size="l"
        />
        <Button color="interactive" size="l" width="full">
          ログインメールを送付する
        </Button>
      </Stack>

      <Stack gap="xs" alignItems="center">
        <Typography size="xs" color="medium_emphasis">
          アカウントをお持ちでない方
        </Typography>
        <Button appearance="transparent" color="interactive" size="s">
          新規登録はこちら
        </Button>
      </Stack>
    </Stack>
  </Paper>
)

/**
 * Apollo のログイン画面。外部 IdP とメールリンク認証の 2 経路を提示する導線。
 * apollo フレーバーに切り替えると実サービスと同じダークな面と紫のブランド色になる。
 *
 * @summary Apollo のログイン画面
 */
export const Default: Story = {
  render: () => (
    <AppShell>
      <LoginForm />
    </AppShell>
  ),
}

/**
 * ログインリンクを送信した直後の状態。
 * 送信結果はフォームを消さずに Callout で重ねて伝える方針を確認するために存在する。
 *
 * @summary 送信完了を通知した状態
 */
export const MailSent: Story = {
  render: () => (
    <AppShell>
      <LoginForm
        alert={
          <Callout color="positive">
            ログイン用のメールを送信しました。メール内のリンクからログインしてください。
          </Callout>
        }
      />
    </AppShell>
  ),
}

/**
 * 認証に失敗した状態。
 * negative の Callout がダークな面の上でも十分なコントラストを保てるかの確認用。
 *
 * @summary 認証失敗を通知した状態
 */
export const LoginFailed: Story = {
  render: () => (
    <AppShell>
      <LoginForm
        alert={
          <Callout color="negative">
            リンクの有効期限が切れています。お手数ですが、もう一度ログインをやり直してください。
          </Callout>
        }
      />
    </AppShell>
  ),
}
