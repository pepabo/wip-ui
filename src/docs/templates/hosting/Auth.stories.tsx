import { Button } from '../../../Button'
import { Callout } from '../../../Callout'
import { Checkbox } from '../../../Checkbox'
import { Divider } from '../../../Divider'
import { Icon } from '../../../Icon'
import { Loader } from '../../../Loader'
import { Stack } from '../../../Stack'
import { TextField } from '../../../TextField'
import { Typography } from '../../../Typography'
import { AuthShell } from './AppShell'
import { Card, identityProviders } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Templates/Hosting/Auth',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── データ ───

const scopes = [
  { label: 'アカウント ID とメールアドレス', required: true },
  { label: '契約中のサービス一覧', required: true },
  { label: '支払い方法の参照', required: false },
]

// ─── 部品 ───

const ProviderButtons = () => (
  <Stack gap="xs">
    {identityProviders.map((provider) => (
      <Button
        key={provider.id}
        appearance="outlined"
        width="full"
        leading={<Icon name={provider.icon} size="s" />}
      >
        {provider.label} で続ける
      </Button>
    ))}
  </Stack>
)

// GAP-4
const OrDivider = () => (
  <Stack flexDirection="row" gap="s" alignItems="center">
    <Divider flexItem />
    <Typography size="xs" color="low_emphasis" component="span">
      または
    </Typography>
    <Divider flexItem />
  </Stack>
)

const Footer = () => (
  <Stack flexDirection="row" gap="xxs" alignItems="center" justifyContent="center">
    <Typography size="xs" color="medium_emphasis" component="span">
      続行すると
    </Typography>
    <Button appearance="transparent" size="s">
      利用規約
    </Button>
    <Typography size="xs" color="medium_emphasis" component="span">
      と
    </Typography>
    <Button appearance="transparent" size="s">
      プライバシーポリシー
    </Button>
    <Typography size="xs" color="medium_emphasis" component="span">
      に同意したものとみなします
    </Typography>
  </Stack>
)

const LoginCard = ({ sending = false, emailError }: { sending?: boolean; emailError?: string }) => (
  <Card elevation={2}>
    <Stack gap="l">
      <Stack gap="xxs">
        <Typography size="xxl" fontWeight="bold" component="h1">
          ログイン
        </Typography>
        <Typography size="s" color="medium_emphasis">
          パスワードは不要です。メールに届くリンクからログインします。
        </Typography>
      </Stack>
      <Stack gap="s">
        <TextField
          label="メールアドレス"
          placeholder="you@example.com"
          type="email"
          width="full"
          isRequired
          color={emailError ? 'negative' : 'neutral'}
          validationBehavior="aria"
          validate={() => emailError ?? null}
          defaultValue={emailError ? 'you@example' : undefined}
        />
        <Button
          color="interactive"
          width="full"
          size="l"
          isDisabled={sending}
          leading={sending ? <Loader size="s" /> : <Icon name="mail" size="s" />}
        >
          {sending ? '送信しています…' : 'ログインリンクを送る'}
        </Button>
      </Stack>
      <OrDivider />
      <ProviderButtons />
    </Stack>
  </Card>
)

// ─── ストーリー ───

/**
 * 共通認証のログイン画面。パスワードレス（マジックリンク）と外部 IdP を 1 枚のカードに載せる。
 * ログイン前の画面なのでサイドナビは無く、透明な AppBar と幅の狭い Container で組む。
 *
 * @summary マジックリンクと外部 IdP によるログイン
 */
export const Login: Story = {
  render: () => (
    <AuthShell>
      <LoginCard />
      <Footer />
    </AuthShell>
  ),
}

/**
 * メールアドレスの形式が不正なまま送信しようとした状態。
 * 認証画面のような部品が少ない画面で、エラーの赤がどこまで強く出るかを確認する。
 *
 * @summary メールアドレスの入力エラー
 */
export const LoginInvalidEmail: Story = {
  render: () => (
    <AuthShell>
      <LoginCard emailError="メールアドレスの形式が正しくありません" />
      <Footer />
    </AuthShell>
  ),
}

/**
 * 送信ボタンを押した直後。ボタンの中に Loader を入れて disabled にし、二重送信を防ぐ。
 *
 * @summary ログインリンクを送信中
 */
export const LoginSending: Story = {
  render: () => (
    <AuthShell>
      <LoginCard sending />
      <Footer />
    </AuthShell>
  ),
}

/**
 * ログインリンクを送った後の待機画面。ユーザーはこの画面を離れてメールを開くので、
 * 「何をすればよいか」と「届かないときの逃げ道」の 2 つだけを見せる。
 *
 * @summary ログインリンクの送信完了
 */
export const MagicLinkSent: Story = {
  render: () => (
    <AuthShell>
      <Card elevation={2}>
        <Stack gap="l">
          <Stack gap="xxs">
            <Typography size="xxl" fontWeight="bold" component="h1">
              メールを確認してください
            </Typography>
            <Typography size="s" color="medium_emphasis">
              you@example.com にログインリンクを送りました。リンクの有効期限は 15 分です。
            </Typography>
          </Stack>
          <Callout color="positive">
            メールが届いたら、リンクを開くだけでログインが完了します。このタブは閉じても構いません。
          </Callout>
          <Divider />
          <Stack gap="xs">
            <Typography size="s" fontWeight="bold">
              メールが届かない場合
            </Typography>
            <Typography size="xs" color="medium_emphasis" density="comfort">
              迷惑メールフォルダを確認してください。それでも届かない場合は、60 秒後に再送できます。
            </Typography>
            <Stack flexDirection="row" gap="s">
              <Button appearance="outlined" isDisabled>
                再送する（42 秒）
              </Button>
              <Button appearance="transparent" leading={<Icon name="arrow_left" size="s" />}>
                メールアドレスを変える
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </AuthShell>
  ),
}

/**
 * 新規登録。ログインとほぼ同じ構成だが、規約への同意を Checkbox で明示的に取る。
 * ログインと並べたときに、見出しと 1 つの Checkbox だけで画面の意味が変わることを確認する。
 *
 * @summary メールアドレスによる新規登録
 */
export const Signup: Story = {
  render: () => (
    <AuthShell>
      <Card elevation={2}>
        <Stack gap="l">
          <Stack gap="xxs">
            <Typography size="xxl" fontWeight="bold" component="h1">
              アカウントを作成
            </Typography>
            <Typography size="s" color="medium_emphasis">
              メールアドレスだけで始められます。10 日間の無料お試し期間があります。
            </Typography>
          </Stack>
          <Stack gap="s">
            <TextField
              label="メールアドレス"
              placeholder="you@example.com"
              type="email"
              width="full"
              isRequired
            />
            <Checkbox>利用規約とプライバシーポリシーに同意する</Checkbox>
            <Button color="interactive" width="full" size="l">
              確認メールを送る
            </Button>
          </Stack>
          <OrDivider />
          <ProviderButtons />
          <Stack flexDirection="row" gap="xxs" alignItems="center" justifyContent="center">
            <Typography size="xs" color="medium_emphasis" component="span">
              すでにアカウントをお持ちの方は
            </Typography>
            <Button appearance="transparent" size="s">
              ログイン
            </Button>
          </Stack>
        </Stack>
      </Card>
    </AuthShell>
  ),
}

/**
 * OIDC の同意画面。別サービスがこのアカウントの情報を求めているときに、
 * 何を渡すかを一覧で見せて許可・拒否を選ばせる。必須スコープは Checkbox を disabled + 選択済みにする。
 *
 * @summary 外部サービスへのアクセス許可（OIDC consent）
 */
export const Consent: Story = {
  render: () => (
    <AuthShell>
      <Card elevation={2}>
        <Stack gap="l">
          <Stack gap="xs" alignItems="center">
            <Stack flexDirection="row" gap="m" alignItems="center">
              <Icon name="pepapon" size="l" />
              <Icon name="arrow_right_left" size="m" />
              <Icon name="node" size="l" />
            </Stack>
            <Typography size="xl" fontWeight="bold" component="h1">
              for Gamers がアクセスを求めています
            </Typography>
            <Typography size="s" color="medium_emphasis">
              you@example.com としてログイン中
            </Typography>
          </Stack>
          <Stack gap="xs">
            <Typography size="s" fontWeight="bold">
              共有される情報
            </Typography>
            {scopes.map((scope) => (
              <Checkbox key={scope.label} defaultSelected isDisabled={scope.required}>
                {scope.label}
                {scope.required ? '（必須）' : ''}
              </Checkbox>
            ))}
          </Stack>
          <Callout color="neutral" appearance="outline">
            許可した内容はアカウント設定の「外部アカウント連携」からいつでも取り消せます。
          </Callout>
          <Stack flexDirection="row" gap="s">
            <Button appearance="outlined" width="half">
              拒否
            </Button>
            <Button color="interactive" width="half">
              許可する
            </Button>
          </Stack>
        </Stack>
      </Card>
    </AuthShell>
  ),
}

/**
 * セッションが切れた後に保護ページを開いたときの画面。
 * エラーではなく「もう一度ログイン」への導線として、notice の Callout と 1 つのボタンだけにする。
 *
 * @summary セッション期限切れ
 */
export const SessionExpired: Story = {
  render: () => (
    <AuthShell>
      <Card elevation={2}>
        <Stack gap="l" alignItems="center">
          <Icon name="clock" size="l" />
          <Stack gap="xxs" alignItems="center">
            <Typography size="xl" fontWeight="bold" component="h1">
              セッションの有効期限が切れました
            </Typography>
            <Typography size="s" color="medium_emphasis">
              安全のため、一定時間操作がないと自動的にログアウトします。
            </Typography>
          </Stack>
          <Callout color="notice">
            入力途中の内容は保存されていません。ログイン後にもう一度入力してください。
          </Callout>
          <Button color="interactive" size="l" width="full">
            もう一度ログイン
          </Button>
        </Stack>
      </Card>
    </AuthShell>
  ),
}
