import { useState } from 'react'

import { Button, LinkButton } from '../../Button'
import { Callout } from '../../Callout'
import { Checkbox } from '../../Checkbox'
import { Dialog, DialogFooter, DialogHeader, DialogTitle } from '../../Dialog'
import { Divider } from '../../Divider'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Paper } from '../../Paper'
import { Stack } from '../../Stack'
import { TextField } from '../../TextField'
import { Typography } from '../../Typography'
import { AuthShell } from './AppShell'
import { CalloutBody } from './gameServer'
import { Card } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import type { IconName } from '../../Icon'

/**
 * ログイン前の画面の再現。2 つのアプリの実画面をそのまま写している。
 *
 * ロリポップ！for Gamers（apollo/frontend/src/app/(application)/(public)）
 * - login: _components/LoginPaper・ExternalSignupModal
 * - login/authcode: _components/AuthcodePaper
 * - signup: _components/SignupPaper
 * - signup/authcode: view.tsx
 * - signup/complete: (private)/signup/complete/_components/SignupCompletePaper
 * - 共通: components/EmailTextField・ExternalIdpButtons・TurnstileWidget・AuthenticationCodeTextField
 *
 * ロリポップ！デプロイナウ（hosting-deploy-now/frontend）
 * - features/Auth（dex モード専用のログイン。本番の /login は lolipop へ転送するだけで画面を持たない）
 * - features/Signup（lolipop モード）
 */

const meta = {
  title: 'Templates/Auth',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

type AlertContent = { title: string; message?: string }

// ─── ゲーマーズの部品 ───

/** MUI の Alert variant='outlined'。GAP-NEW: Callout にタイトルの枠が無い（CalloutBody で組む） */
const AlertBox = ({
  alert,
  color,
}: {
  alert: AlertContent
  color: 'negative' | 'positive' | 'notice'
}) => (
  <Callout color={color} appearance="outline">
    <CalloutBody title={alert.title}>{alert.message}</CalloutBody>
  </Callout>
)

/** 見出し（Typography variant='xxl' bold）と、その下の説明 */
const PaperTitle = ({ title, lines }: { title: string; lines?: string[] }) => (
  <Stack gap="xs">
    <Typography size="xxl" fontWeight="bold" component="h1">
      {title}
    </Typography>
    {lines && (
      <Stack gap="xxs">
        {lines.map((line) => (
          <Typography key={line} size="s" component="span">
            {line}
          </Typography>
        ))}
      </Stack>
    )}
  </Stack>
)

/**
 * components/ExternalIdpButtons/model.ts。Google / Discord / Twitch の 3 つ。
 * GAP-5: Google のアイコンが無い。GAP-NEW: Twitch のアイコンも無い。どちらも launch で代用している。
 * parts.tsx の identityProviders（Google / Apple / X / LINE / Discord）は実物と違うので使わない。
 */
const gamersIdps: { label: string; icon: IconName }[] = [
  { label: 'Google', icon: 'launch' },
  { label: 'Discord', icon: 'discord' },
  { label: 'Twitch', icon: 'launch' },
]

/**
 * components/ExternalIdpButtons。等幅で横一列（3 分割）。Turnstile を通るまで押せない。
 * 実物はスマホ幅でラベルを隠してロゴだけにするが、Button にその切り替えが無いので常にラベルを出す。
 */
const ExternalIdpButtons = ({ disabled }: { disabled: boolean }) => (
  <Grid spacing="s">
    {gamersIdps.map((idp) => (
      <GridItem key={idp.label} size={4}>
        <Button
          width="full"
          size="l"
          isDisabled={disabled}
          aria-label={idp.label}
          leading={<Icon name={idp.icon} size="s" />}
        >
          {idp.label}
        </Button>
      </GridItem>
    ))}
  </Grid>
)

const noWrapStyle = { whiteSpace: 'nowrap' } as const // GAP-4

/** MUI の <Divider>または</Divider>。GAP-4: Divider に文字を入れられないので線と文字を並べる */
const OrDivider = () => (
  <Stack flexDirection="row" gap="s" alignItems="center">
    <Divider flexItem />
    <Typography size="s" component="span">
      {/* GAP-4: 線に挟まれた文字が縮んで 1 文字ずつ折り返すので、折り返さない指定を足している */}
      <span style={noWrapStyle}>または</span>
    </Typography>
    <Divider flexItem />
  </Stack>
)

// GAP-NEW: 外部ウィジェット（Cloudflare Turnstile、300×65 の固定サイズ）を置く枠が無い。
// 実物は中央寄せの div に Cloudflare が iframe を差し込む。ここでは同じ大きさの枠だけを置く。
const turnstileStyle = { width: 300, height: 65 } // GAP-NEW: 外部ウィジェットの枠

/** components/TurnstileWidget。中身は Cloudflare が描くので、ここでは枠だけ */
const TurnstileWidget = () => (
  <Stack alignItems="center">
    <Paper outlined elevation={0}>
      <div style={turnstileStyle} />
    </Paper>
  </Stack>
)

/** components/EmailTextField。label・placeholder は既定値のまま */
const EmailTextField = () => (
  <TextField label="メールアドレス" placeholder="mail@pepabo.com" type="email" width="full" />
)

/**
 * 利用規約・ニュースレターの 2 つの Checkbox（SignupPaper / ExternalSignupModal）。
 * GAP-NEW: 文中のリンクが無い。「利用規約」「プライバシーポリシー」は本来リンク。
 */
const ConsentCheckboxes = ({
  agreed,
  onAgreed,
}: {
  agreed: boolean
  onAgreed: (value: boolean) => void
}) => (
  <Stack gap="xs">
    <Checkbox defaultSelected>サービスからのニュースレターを受信する</Checkbox>
    <Checkbox isSelected={agreed} onChange={onAgreed}>
      利用規約 と プライバシーポリシー に同意する
    </Checkbox>
  </Stack>
)

// GAP-NEW: Dialog に幅の指定が無い。Backup と同じく中身を包んで MUI の fullWidth（600px）に寄せている
const dialogWidthStyle = { width: 552, maxWidth: '100%' } // GAP-NEW: Dialog に幅が無い

/**
 * login/_components/ExternalSignupModal（パターン B）。外部 IdP で戻ってきたがアカウントが無いときに出る。
 * 「作成」は同意するまで押せない。
 */
const ExternalSignupModal = () => {
  const [agreed, setAgreed] = useState(false)
  return (
    // 実物は onClose を渡しておらず、背景のクリックでは閉じない
    <Dialog isOpen isDismissable={false}>
      <div style={dialogWidthStyle}>
        <DialogHeader>
          <DialogTitle>アカウント作成</DialogTitle>
        </DialogHeader>
        <Stack gap="m">
          <AlertBox
            color="notice"
            alert={{
              title: 'ログイン情報が見つかりませんでした',
              message: '選択されたアカウントでの登録は確認できませんでした',
            }}
          />
          <Typography size="s" component="span">
            このままアカウントを新規作成しますか？
          </Typography>
          <ConsentCheckboxes agreed={agreed} onAgreed={setAgreed} />
        </Stack>
        {/* lib/dialog.ts: キャンセル = 文字だけ、確定 = 枠線 */}
        <DialogFooter>
          <Button appearance="transparent">閉じる</Button>
          <Button appearance="outlined" isDisabled={!agreed}>
            作成
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  )
}

/**
 * login/_components/LoginPaper（フィーチャーフラグ gamers_external-idp-login が ON で、外部 IdP が出るとき）。
 * 実物の Paper は余白が px 48 / py 80 と広い。GAP-1 の Card は 24px 固定なので詰まって見える。
 */
const LoginPaper = () => (
  <Card elevation={1}>
    <Stack gap="l">
      <PaperTitle title="ログイン" />
      <Stack gap="l">
        <Stack gap="m">
          <Typography size="s" component="span">
            外部アカウントでログイン
          </Typography>
          <ExternalIdpButtons disabled={false} />
        </Stack>
        <OrDivider />
      </Stack>
      <Stack gap="l">
        <EmailTextField />
        <TurnstileWidget />
        <Button color="interactive" size="l" width="full">
          ログインメールを送付する
        </Button>
      </Stack>
    </Stack>
  </Card>
)

/**
 * signup/_components/SignupPaper（フラグが ON のとき）。同意の Checkbox が外部 IdP の前に来る。
 * 「アカウント登録メールを送信」と外部 IdP は、利用規約に同意するまで押せない。
 */
const SignupPaper = () => {
  const [agreed, setAgreed] = useState(false)
  return (
    <Card elevation={1}>
      <Stack gap="l">
        <PaperTitle title="アカウント作成" />
        <ConsentCheckboxes agreed={agreed} onAgreed={setAgreed} />
        <Stack gap="m">
          <Typography size="s" component="span">
            外部アカウントで登録
          </Typography>
          <ExternalIdpButtons disabled={!agreed} />
        </Stack>
        <OrDivider />
        <EmailTextField />
        <TurnstileWidget />
        <Stack gap="s">
          <Button color="interactive" size="l" width="full" isDisabled={!agreed}>
            アカウント登録メールを送信
          </Button>
          <LinkButton appearance="outlined" size="l" width="full" href="#login">
            ログイン
          </LinkButton>
        </Stack>
      </Stack>
    </Card>
  )
}

// GAP-NEW: 1 桁ずつの入力欄（OTP / PIN 入力）が無い。TextField を 6 つ並べ、幅を 56px に絞っている。
// 実物は数字以外を弾く・入力で次の欄へ移る・6 桁の貼り付けで自動送信する、を自前で持っている。
const digitStyle = { width: 56 } // GAP-NEW: 1 桁の入力欄

/** components/AuthenticationCodeTextField。6 桁が埋まるまで「認証」は押せない */
const AuthenticationCodeTextField = () => (
  <Stack gap="l">
    <Stack gap="s">
      <Typography size="s" fontWeight="bold" component="span">
        認証コード
      </Typography>
      <Stack flexDirection="row" gap="xs" justifyContent="center">
        {['1', '2', '3', '4', '5', '6'].map((digit) => (
          <div key={digit} style={digitStyle}>
            <TextField
              aria-label={`認証コード ${digit} 桁目`}
              inputMode="numeric"
              maxLength={1}
              width="full"
              size="l"
            />
          </div>
        ))}
      </Stack>
    </Stack>
    <Button color="interactive" size="l" width="full" isDisabled>
      認証
    </Button>
  </Stack>
)

/** login/authcode/_components/AuthcodePaper と signup/authcode/view.tsx（見出しと説明だけが違う） */
const AuthcodePaper = ({
  title,
  lead,
  resendHref,
}: {
  title: string
  lead: string
  resendHref: string
}) => (
  <Card elevation={1}>
    <Stack gap="l">
      <PaperTitle
        title={title}
        lines={[lead, '認証コードを入力して本人確認を完了させてください']}
      />
      <AuthenticationCodeTextField />
      <LinkButton appearance="outlined" size="l" width="full" href={resendHref}>
        メールを再送信
      </LinkButton>
    </Stack>
  </Card>
)

// ─── デプロイナウの部品 ───

/**
 * features/Auth・features/Signup の共通の枠（max-w-sm の白いカードに中央寄せで積む）。
 * 実物は Tailwind の rounded-lg border shadow-sm。Card の outlined で近づけている。
 * 実物のカード幅は 384px（max-w-sm）で、AuthShell の Container より狭い。
 */
const DeployNowCard = ({ children }: { children: ReactNode }) => (
  <Card outlined elevation={1}>
    <Stack gap="m" alignItems="center">
      {children}
    </Stack>
  </Card>
)

// ─── ストーリー ───

/**
 * ゲーマーズのログイン（login）。外部 IdP 3 つ・「または」・メールアドレス・Turnstile・送付ボタンの順。
 *
 * @summary ゲーマーズのログイン
 */
export const GamersLogin: Story = {
  render: () => (
    <AuthShell>
      <LoginPaper />
    </AuthShell>
  ),
}

/**
 * 外部 IdP でログインしたがアカウントが無かったとき（?signup_pending=1）のアカウント作成モーダル。
 * 利用規約に同意すると「作成」が押せる。
 *
 * @summary ゲーマーズの外部 IdP からのアカウント作成
 */
export const GamersExternalSignupModal: Story = {
  render: () => (
    <AuthShell>
      <LoginPaper />
      <ExternalSignupModal />
    </AuthShell>
  ),
}

/**
 * ログインメールを送ったあとの認証コード入力（login/authcode）。
 *
 * @summary ゲーマーズのログインの認証コード入力
 */
export const GamersLoginAuthcode: Story = {
  render: () => (
    <AuthShell>
      <AuthcodePaper
        title="ログイン"
        lead="入力されたメールアドレスに認証コードを送信しました"
        resendHref="#login"
      />
    </AuthShell>
  ),
}

/**
 * ゲーマーズの新規登録（signup）。利用規約に同意するまで、送信ボタンと外部 IdP は押せない。
 *
 * @summary ゲーマーズの新規登録
 */
export const GamersSignup: Story = {
  render: () => (
    <AuthShell>
      <SignupPaper />
    </AuthShell>
  ),
}

/**
 * アカウント登録メールを送ったあとの認証コード入力（signup/authcode）。「再送信」は新規登録の画面へ戻る。
 *
 * @summary ゲーマーズの新規登録の認証コード入力
 */
export const GamersSignupAuthcode: Story = {
  render: () => (
    <AuthShell>
      <AuthcodePaper
        title="アカウント作成"
        lead="アカウント登録メールを送信しました"
        resendHref="#signup"
      />
    </AuthShell>
  ),
}

/**
 * アカウント作成の完了（(private)/signup/complete）。申し込み画面へ進ませる。
 * 実物は見出しの下に 250px のイラスト（create-account.svg）がある。
 * GAP-NEW: イラストを置く枠（とイラストの素材）が無いので省いている。
 *
 * @summary ゲーマーズのアカウント作成完了
 */
export const GamersSignupComplete: Story = {
  render: () => (
    <AuthShell>
      <Card elevation={1}>
        <Stack gap="l">
          <Typography size="xl" fontWeight="bold" component="h1">
            アカウント作成完了
          </Typography>
          <Stack gap="s" alignItems="center">
            <Typography size="m" fontWeight="bold" component="span">
              アカウント作成が完了しました
            </Typography>
            <Typography size="m" fontWeight="bold" component="span">
              ゲームを楽しむためにサーバーを契約しましょう！
            </Typography>
          </Stack>
          <LinkButton color="interactive" size="l" width="full" href="#servers-new">
            申し込み画面へ
          </LinkButton>
        </Stack>
      </Card>
    </AuthShell>
  ),
}

/**
 * デプロイナウのログイン（features/Auth）。dex モード（ローカル開発）専用の画面で、
 * 本番の /login は lolipop のログイン入口へ転送するだけで画面を持たない。
 *
 * @summary デプロイナウのログイン（dex）
 */
export const DeployNowLogin: Story = {
  render: () => (
    <AuthShell>
      <DeployNowCard>
        <Typography size="xl" fontWeight="bold" component="h1">
          deploy-now にログイン
        </Typography>
        <Typography size="s" color="low_emphasis" component="span">
          Dex で認証してから続行してください。
        </Typography>
        {/* 実物は Tailwind で黒地のボタン（bg-neutral-900）を手組みしている */}
        <LinkButton width="full" href="#api-auth-login">
          Dex でログイン
        </LinkButton>
        <Callout color="informative" appearance="flat">
          {/* GAP-20: 等幅フォントが無い。実物は dev@example.com と password を font-mono の code で出す */}
          <Typography size="s" component="span">
            開発環境では dev@example.com / password で入れます。
          </Typography>
        </Callout>
      </DeployNowCard>
    </AuthShell>
  ),
}

/**
 * デプロイナウの新規登録（features/Signup の lolipop モード）。ロリポップ！ID の登録入口へ送る。
 * 「ログイン」は本来文中のリンク。GAP-NEW: 文中のリンクが無いので、文と transparent のボタンを並べている。
 *
 * @summary デプロイナウの新規登録
 */
export const DeployNowSignup: Story = {
  render: () => (
    <AuthShell>
      <DeployNowCard>
        <Typography size="xl" fontWeight="bold" component="h1">
          ロリポップ！デプロイナウに新規登録
        </Typography>
        <Typography size="s" color="low_emphasis" component="span">
          ロリポップ！ID で認証して新規登録を進めてください。
        </Typography>
        <LinkButton width="full" href="#lolipop-signup">
          ロリポップ！ID で新規登録
        </LinkButton>
        <Stack flexDirection="row" gap="xxs" alignItems="center">
          <Typography size="s" color="low_emphasis" component="span">
            すでにアカウントをお持ちの方は
          </Typography>
          <LinkButton appearance="transparent" size="s" href="#login">
            ログイン
          </LinkButton>
        </Stack>
      </DeployNowCard>
    </AuthShell>
  ),
}
