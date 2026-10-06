import { useState } from 'react'

import { Button } from '../../../Button'
import { Callout } from '../../../Callout'
import { Checkbox } from '../../../Checkbox'
import { Container } from '../../../Container'
import { Divider } from '../../../Divider'
import { Icon } from '../../../Icon'
import { Loader } from '../../../Loader'
import { Paper } from '../../../Paper'
import { Stack } from '../../../Stack'
import { Sticker } from '../../../Sticker'
import { TextField } from '../../../TextField'
import { Typography } from '../../../Typography'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

/**
 * lolipop-auth（auth.lolipop.jp）の再現。
 * 文言は src/features/* の実装から取っている。
 *
 * 注意: 実装に /consent の UI は存在しない（redirect の 1 行のみ）ため、同意画面は作っていない。
 */

const meta = {
  title: 'Templates/LolipopAuth/Auth',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// GAP-1 の回避策（Paper に padding が無い）
const insetStyle = { padding: 32 }

/** AuthLayout の再現。ロゴ + 中央寄せの白い面 + フッター */
const AuthLayout = ({ title, children }: { title?: ReactNode; children: ReactNode }) => (
  <Container size="s" component="main">
    <Stack gap="l" alignItems="center">
      <Stack flexDirection="row" gap="s" alignItems="center">
        <Icon name="pepapon" size="l" />
        <Typography size="l" fontWeight="bold" component="span">
          ロリポップ！
        </Typography>
      </Stack>
      <Paper elevation={1}>
        <div style={insetStyle}>
          <Stack gap="l">
            {title && (
              <Typography size="xxl" fontWeight="bold" component="h1">
                {title}
              </Typography>
            )}
            {children}
          </Stack>
        </div>
      </Paper>
    </Stack>
  </Container>
)

const OrDivider = () => (
  // GAP-4: Divider にラベルを入れられないので線と文字を分けている
  <Stack flexDirection="row" gap="s" alignItems="center">
    <Divider flexItem />
    <Typography size="xs" color="low_emphasis" component="span">
      または
    </Typography>
    <Divider flexItem />
  </Stack>
)

type Mode = 'login' | 'signup' | 'sent'

const IdpButtons = ({
  mode,
  disabled,
  lastUsed,
}: {
  mode: 'login' | 'signup'
  disabled?: boolean
  lastUsed?: 'google' | 'github'
}) => {
  const verb = mode === 'login' ? 'ログイン' : '登録'
  return (
    <Stack gap="xs">
      {(['google', 'github'] as const).map((id) => (
        <Stack key={id} gap="xxs">
          {lastUsed === id && (
            <Stack flexDirection="row">
              <Sticker color="neutral" size="s">
                前回使用
              </Sticker>
            </Stack>
          )}
          {/* GAP-5: アイコンセットに Google / GitHub が無い（GitHub だけ存在する） */}
          <Button
            appearance="outlined"
            width="full"
            isDisabled={disabled}
            leading={<Icon name={id === 'github' ? 'github' : 'launch'} size="s" />}
          >
            {id === 'github' ? 'GitHub' : 'Google'} で{verb}
          </Button>
        </Stack>
      ))}
    </Stack>
  )
}

const AuthScreen = () => {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [sentFrom, setSentFrom] = useState<'login' | 'signup'>('login')

  const send = (from: 'login' | 'signup') => {
    setSending(true)
    setSentFrom(from)
    setTimeout(() => {
      setSending(false)
      setMode('sent')
    }, 900)
  }

  if (mode === 'sent') {
    const label = sentFrom === 'login' ? 'ログイン' : '登録'
    return (
      <AuthLayout title={`${label}メールを送信しました`}>
        <Stack gap="m">
          <Typography>
            {email || 'example@example.com'} 宛に{label}メールを送信しました。
          </Typography>
          <Typography size="s" color="medium_emphasis">
            {sentFrom === 'login'
              ? 'メールを確認してリンクをクリックしてください。リンクの有効期限は送信から15分です。'
              : 'メール内のリンクをクリックすると登録が完了します。'}
          </Typography>
          <Divider />
          <Stack gap="xs">
            <Typography size="xs" color="low_emphasis">
              このモックではメールのリンクを押した先を確認できます。
            </Typography>
            <Stack flexDirection={{ xxs: 'column', s: 'row' }} gap="s">
              <Button appearance="outlined" width="half" onPress={() => setMode('login')}>
                ログイン画面に戻る
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </AuthLayout>
    )
  }

  const isLogin = mode === 'login'

  return (
    <AuthLayout title={isLogin ? 'ログイン' : '新規登録'}>
      <Stack gap="l">
        {!isLogin && (
          <Checkbox isSelected={agreed} onChange={setAgreed}>
            プライバシーポリシーに同意する
          </Checkbox>
        )}
        <IdpButtons
          mode={isLogin ? 'login' : 'signup'}
          disabled={!isLogin && !agreed}
          lastUsed={isLogin ? 'google' : undefined}
        />
        <OrDivider />
        <Stack gap="s">
          <TextField
            label="メールアドレス"
            placeholder="example@example.com"
            type="email"
            width="full"
            value={email}
            onChange={setEmail}
          />
          <Callout color="neutral" appearance="outline">
            ここに Cloudflare Turnstile が入る
          </Callout>
          <Button
            color="interactive"
            width="full"
            size="l"
            isDisabled={sending || (!isLogin && !agreed)}
            leading={sending ? <Loader size="s" /> : undefined}
            onPress={() => send(isLogin ? 'login' : 'signup')}
          >
            {sending ? '送信中…' : isLogin ? 'ログインメールを送信' : '登録メールを送信'}
          </Button>
        </Stack>
        {isLogin && (
          <Typography size="xs" color="medium_emphasis">
            ログインすることで、プライバシーポリシーに同意したものとみなされます。
          </Typography>
        )}
        <Stack flexDirection="row" gap="xxs" alignItems="center" justifyContent="center">
          <Typography size="xs" color="medium_emphasis" component="span">
            {isLogin ? 'アカウントをお持ちでない方は' : 'すでにアカウントをお持ちの方は'}
          </Typography>
          <Button
            appearance="transparent"
            size="s"
            onPress={() => setMode(isLogin ? 'signup' : 'login')}
          >
            {isLogin ? '新規登録' : 'ログイン'}
          </Button>
        </Stack>
      </Stack>
    </AuthLayout>
  )
}

// ─── ストーリー ───

/**
 * ログインと新規登録。実際に押して遷移する。
 *
 * - 下部のリンクでログインと新規登録が入れ替わる
 * - 新規登録はプライバシーポリシーに同意するまで IdP ボタンと送信ボタンが押せない
 * - 「ログインメールを送信」で送信中を挟んでから送信完了画面になる
 *
 * @summary ログイン・新規登録（操作できる）
 */
export const Default: Story = {
  render: () => <AuthScreen />,
}

/**
 * メールのリンクが無効だった・退会済み・セッション切れなど、リンクを開いた先で出る画面。
 * いずれもクリックでは到達せず URL で入るため、並べて確認する。
 *
 * @summary リンクを開いた先の通知画面
 */
export const Notices: Story = {
  render: () => (
    <Stack gap="xl">
      <AuthLayout title="ログインリンクが無効です">
        <Stack gap="m">
          <Typography>
            メールに記載されたログインリンクの有効期限が切れているか、すでに使用されています。お手数ですが、ログイン画面からもう一度ログインリンクを送信してください。
          </Typography>
          <Button color="interactive" width="full">
            ログイン画面へ
          </Button>
        </Stack>
      </AuthLayout>

      <AuthLayout title="すでに登録済みのメールアドレスです">
        <Stack gap="m">
          <Typography>
            you@example.com
            はすでに登録済みのメールアドレスです。ログイン画面からログインメールを送信し、届いたメールでログインしてください。別の方法（Google
            など）でログインしたい場合は、ログイン後にユーザー設定から連携を行なってください。
          </Typography>
          <Button color="interactive" width="full">
            ログイン画面へ
          </Button>
        </Stack>
      </AuthLayout>

      <AuthLayout title="セッションの有効期限が切れました">
        <Stack gap="m">
          <Typography>お手数ですが、もう一度ログインからやり直してください。</Typography>
          <Button color="interactive" width="full">
            ログインに戻る
          </Button>
        </Stack>
      </AuthLayout>

      <AuthLayout title="退会済みのアカウントです">
        <Stack gap="m">
          <Typography>
            このアカウントは退会済みです。復帰をご希望の場合は、お問い合わせください。
          </Typography>
          <Stack flexDirection={{ xxs: 'column', s: 'row' }} gap="s">
            <Button appearance="outlined" width="half">
              お問い合わせ
            </Button>
            <Button color="interactive" width="half">
              ログイン画面へ
            </Button>
          </Stack>
        </Stack>
      </AuthLayout>
    </Stack>
  ),
}
