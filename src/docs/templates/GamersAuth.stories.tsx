import { useState } from 'react'

import { Button, LinkButton } from '../../Button'
import { Callout } from '../../Callout'
import { Checkbox } from '../../Checkbox'
import { Container } from '../../Container'
import { Dialog, DialogFooter, DialogHeader, DialogTitle } from '../../Dialog'
import { Divider } from '../../Divider'
import { Grid, GridItem } from '../../Grid'
import { Paper } from '../../Paper'
import { Stack } from '../../Stack'
import { TextField } from '../../TextField'
import { Typography } from '../../Typography'
import createAccountImage from './assets/gamers/create-account.svg'
import discordLogo from './assets/gamers/external-idp/discord.svg'
import googleLogo from './assets/gamers/external-idp/google.svg'
import twitchLogo from './assets/gamers/external-idp/twitch.svg'
import { GamersPublicShell, GamersShell, useGamersNavigate } from './gamersShell'
import { CalloutBody } from './gameServer'
import { Card } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

/**
 * ゲーマーズのログイン前の画面（apollo/frontend/src/app/(application)/(public)）の再現。
 * 枠は (public)/layout.tsx（ロゴだけの GlobalHeader）。gamersShell.tsx の GamersPublicShell。
 * - login/page.tsx: Container maxWidth='sm' disableGutters mt 5 ＋ _components/LoginPaper・ExternalSignupModal
 * - login/authcode/view.tsx: Container maxWidth='sm' mt 5 ＋ _components/AuthcodePaper
 * - signup/page.tsx: Container maxWidth='sm' disableGutters mt 5 ＋ _components/SignupPaper
 * - signup/authcode/view.tsx: Container maxWidth='sm' mt 5 ＋ Paper
 * - (private)/signup/complete: (private) の layout（ユーザーメニュー付きの GlobalHeader）＋ Container maxWidth='sm' mt 5
 * - 共通: components/EmailTextField・ExternalIdpButtons・TurnstileWidget・AuthenticationCodeTextField
 *
 * 外部 IdP のボタンはフィーチャーフラグ gamers_external-idp-login が ON のときの表示。
 * ボタンが押せる状態は Turnstile を通ったあと（実物は通るまで送信ボタンと外部 IdP が押せない）。
 *
 * 実物と違って残っている点:
 * - MUI の maxWidth='sm'（600px）を Container の size="s" に、Paper の px 4〜6 を padding の xl〜xxl に寄せている。
 *   Paper の上下の余白（py 8〜10 / 10〜14）は左右と分けて指定できないので、左右と同じ値
 * - MUI の各要素の mt / mb は Stack の gap に寄せている
 * - Checkbox のラベルは実物では xs の文字。「利用規約」「プライバシーポリシー」は実物ではリンク（#0288D1）
 * - 外部 IdP のロゴは無効のときに薄くならない。スマホ幅でラベルを隠してロゴだけにする切り替えも無い
 * - Turnstile は Cloudflare が描く 300×65 の iframe。ここでは同じ大きさの枠だけを置く
 * - 認証コードの欄は実物では 56px 角・中央ぞろえ
 * - ダイアログは実物では fullWidth・600px
 */

const meta = {
  title: 'Templates/Gamers/Auth',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── 枠 ───

/** login・signup 系の page.tsx の Container（maxWidth='sm'） */
const PageContainer = ({
  gapless = false,
  children,
}: {
  gapless?: boolean
  children: ReactNode
}) => (
  <Container size="s" isGapless={gapless}>
    {children}
  </Container>
)

/** 各 Paper（variant='elevation'、px 4〜6） */
const AuthPaper = ({ children }: { children: ReactNode }) => (
  <Card elevation={1} padding={{ xxs: 'xl', m: 'xxl' }}>
    {children}
  </Card>
)

// ─── 部品 ───

/** 見出し。Typography variant='xxl' bold component='div' */
const PaperTitle = ({ children }: { children: string }) => (
  <Typography size="xxl" fontWeight="bold" component="h1">
    {children}
  </Typography>
)

/**
 * components/ExternalIdpButtons/model.ts。Google / Discord / Twitch の 3 つ。ロゴは実物と同じ public/external-idp/*.svg
 */
const gamersIdps: { label: string; logo: string }[] = [
  { label: 'Google', logo: googleLogo },
  { label: 'Discord', logo: discordLogo },
  { label: 'Twitch', logo: twitchLogo },
]

/** components/ExternalIdpButtons。Grid spacing 2 で等幅に横一列（3 分割）。variant='contained' color='secondary' */
const ExternalIdpButtons = ({ disabled }: { disabled: boolean }) => {
  const navigate = useGamersNavigate()
  return (
    <Grid spacing="m">
      {gamersIdps.map((idp) => (
        <GridItem key={idp.label} size={4}>
          <Button
            width="full"
            size="l"
            isDisabled={disabled}
            aria-label={idp.label}
            // 実物は initiateExternalLogin の認可 URL（各 IdP のページ）へ移る
            onPress={() => navigate('external')}
            leading={<img src={idp.logo} alt="" width={22} height={22} />}
          >
            {idp.label}
          </Button>
        </GridItem>
      ))}
    </Grid>
  )
}

/**
 * MUI の <Divider><Typography variant='s'>または</Typography></Divider>。線と文字を並べる。
 * 文字は縮まない GridItem（flex-shrink: 0）に入れて 1 行のまま保ち、左右の線が残りの幅に伸びる
 */
const OrDivider = () => (
  <Stack flexDirection="row" gap="s" alignItems="center">
    <Divider />
    <GridItem>
      <Typography size="s" component="span">
        または
      </Typography>
    </GridItem>
    <Divider />
  </Stack>
)

// Cloudflare Turnstile（300×65 の固定サイズ）の枠。外部ウィジェットを置く部品が無いので div で大きさだけ持つ
const turnstileStyle = { width: 300, height: 65 }

/** components/TurnstileWidget。中央寄せの div に Cloudflare が iframe を差し込む */
const TurnstileWidget = () => (
  <Stack alignItems="center">
    <Paper padding="none" outlined elevation={0}>
      <div style={turnstileStyle} />
    </Paper>
  </Stack>
)

/** components/EmailTextField。label・placeholder は既定値のまま */
const EmailTextField = () => (
  <TextField label="メールアドレス" placeholder="mail@pepabo.com" type="email" width="full" />
)

/** 利用規約・ニュースレターの 2 つの Checkbox（SignupPaper / ExternalSignupModal）。ニュースレターが先 */
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

/**
 * login/_components/ExternalSignupModal（パターン B）。外部 IdP で戻ってきたがアカウントが無いときに出る。
 * DialogContent: Alert（warning, outlined）→ 確認文（mt 2）→ Checkbox 2 つ（mt 2）。「作成」は同意するまで押せない
 */
const ExternalSignupModal = () => {
  const navigate = useGamersNavigate()
  const [agreed, setAgreed] = useState(false)
  const [open, setOpen] = useState(true)
  return (
    // 実物は onClose を渡しておらず、背景のクリックでは閉じない
    <Dialog isOpen={open} isDismissable={false}>
      <DialogHeader>
        <DialogTitle>アカウント作成</DialogTitle>
      </DialogHeader>
      <Stack gap="m">
        <Callout color="notice" appearance="outline">
          <CalloutBody title="ログイン情報が見つかりませんでした">
            選択されたアカウントでの登録は確認できませんでした
          </CalloutBody>
        </Callout>
        <Typography size="s" component="p">
          このままアカウントを新規作成しますか？
        </Typography>
        <ConsentCheckboxes agreed={agreed} onAgreed={setAgreed} />
      </Stack>
      {/* lib/dialog.ts: キャンセル = color='inherit' の文字だけ、確定 = outlined */}
      <DialogFooter>
        {/* 閉じると作成せずログイン画面に留まる（/login） */}
        <Button appearance="transparent" onPress={() => setOpen(false)}>
          閉じる
        </Button>
        {/* 作成すると /signup/complete へ */}
        <Button
          appearance="outlined"
          isDisabled={!agreed}
          onPress={() => navigate('signup-complete')}
        >
          作成
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

/**
 * login/_components/LoginPaper。見出し → LoginAlert（初期は無し）→ 外部 IdP（mt 3）→「または」（mt 3）
 * → フォーム（mt 3）: メールアドレス → Turnstile（mt 3）→ 送付ボタン（mt 5）
 */
const LoginPaper = () => {
  const navigate = useGamersNavigate()
  return (
    <AuthPaper>
      <Stack gap="l">
        <PaperTitle>ログイン</PaperTitle>
        <Stack gap="m">
          <Typography size="s" component="span">
            外部アカウントでログイン
          </Typography>
          <ExternalIdpButtons disabled={false} />
        </Stack>
        <OrDivider />
        <Stack gap="xxl">
          <Stack gap="l">
            <EmailTextField />
            <TurnstileWidget />
          </Stack>
          {/* 送ると /login/authcode へ */}
          <Button
            color="interactive"
            size="l"
            width="full"
            onPress={() => navigate('login-authcode')}
          >
            ログインメールを送付する
          </Button>
        </Stack>
      </Stack>
    </AuthPaper>
  )
}

/**
 * signup/_components/SignupPaper（外部 IdP が ON のとき）。見出し → 同意の Checkbox → 外部 IdP → 「または」
 * → メールアドレス → Turnstile → 送信（mt 5）→ ログイン（mt 1）。
 * 「アカウント登録メールを送信」と外部 IdP は、利用規約に同意するまで押せない
 */
const SignupPaper = () => {
  const navigate = useGamersNavigate()
  const [agreed, setAgreed] = useState(false)
  return (
    <AuthPaper>
      <Stack gap="l">
        <PaperTitle>アカウント作成</PaperTitle>
        <ConsentCheckboxes agreed={agreed} onAgreed={setAgreed} />
        <Stack gap="m">
          <Typography size="s" component="span">
            外部アカウントで登録
          </Typography>
          <ExternalIdpButtons disabled={!agreed} />
        </Stack>
        <OrDivider />
        <Stack gap="xxl">
          <Stack gap="l">
            <EmailTextField />
            <TurnstileWidget />
          </Stack>
          <Stack gap="xs">
            {/* 送ると /signup/authcode へ */}
            <Button
              color="interactive"
              size="l"
              width="full"
              isDisabled={!agreed}
              onPress={() => navigate('signup-authcode')}
            >
              アカウント登録メールを送信
            </Button>
            <LinkButton
              appearance="outlined"
              size="l"
              width="full"
              href="#login"
              onPress={() => navigate('login')}
            >
              ログイン
            </LinkButton>
          </Stack>
        </Stack>
      </Stack>
    </AuthPaper>
  )
}

/**
 * components/AuthenticationCodeTextField。「認証コード」（s bold, mb 2）→ 1 桁ずつの欄 6 つ（gap 1）→「認証」（mt 5）。
 * 6 桁が埋まるまで「認証」は押せない
 */
const AuthenticationCodeTextField = ({ onVerified }: { onVerified: () => void }) => {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const filled = digits.every((digit) => digit !== '')
  return (
    <Stack gap="xxl">
      <Stack gap="m">
        <Typography size="s" fontWeight="bold" component="span">
          認証コード
        </Typography>
        <Stack flexDirection="row" gap="xs" justifyContent="center">
          {digits.map((value, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: 桁の位置そのものが識別子
            <div key={index}>
              <TextField
                aria-label={`認証コード ${index + 1} 桁目`}
                inputMode="numeric"
                maxLength={1}
                width="full"
                size="l"
                value={value}
                onChange={(next) =>
                  setDigits((current) => current.map((d, i) => (i === index ? next : d)))
                }
              />
            </div>
          ))}
        </Stack>
      </Stack>
      <Button color="interactive" size="l" width="full" isDisabled={!filled} onPress={onVerified}>
        認証
      </Button>
    </Stack>
  )
}

/**
 * login/authcode/_components/AuthcodePaper と signup/authcode/view.tsx（見出しと 1 行目と再送信の行き先だけが違う）。
 * 見出し（mb 1）→ 説明 2 行（mb 4）→ Message（初期は無し）→ 認証コード（mt 3）→「メールを再送信」（mt 3）
 */
const AuthcodePaper = ({
  title,
  lead,
  resend,
  verified,
}: {
  title: string
  lead: string
  /** 「メールを再送信」の行き先 */
  resend: 'login' | 'signup'
  /** 認証が通ったあとの行き先 */
  verified: 'home' | 'signup-complete'
}) => {
  const navigate = useGamersNavigate()
  return (
    <AuthPaper>
      <Stack gap="xxl">
        <Stack gap="xs">
          <PaperTitle>{title}</PaperTitle>
          <Stack gap="xxs">
            <Typography size="s" component="span">
              {lead}
            </Typography>
            <Typography size="s" component="span">
              認証コードを入力して本人確認を完了させてください
            </Typography>
          </Stack>
        </Stack>
        <Stack gap="l">
          <AuthenticationCodeTextField onVerified={() => navigate(verified)} />
          <LinkButton
            appearance="outlined"
            size="l"
            width="full"
            href={`#${resend}`}
            onPress={() => navigate(resend)}
          >
            メールを再送信
          </LinkButton>
        </Stack>
      </Stack>
    </AuthPaper>
  )
}

// ─── ストーリー ───

/**
 * ゲーマーズのログイン（login）。外部 IdP 3 つ・「または」・メールアドレス・Turnstile・送付ボタンの順。
 *
 * @summary ゲーマーズのログイン
 */
export const GamersLogin: Story = {
  render: () => (
    <GamersPublicShell>
      <PageContainer gapless>
        <LoginPaper />
      </PageContainer>
    </GamersPublicShell>
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
    <GamersPublicShell>
      <PageContainer gapless>
        <LoginPaper />
      </PageContainer>
      <ExternalSignupModal />
    </GamersPublicShell>
  ),
}

/**
 * ログインメールを送ったあとの認証コード入力（login/authcode）。
 *
 * @summary ゲーマーズのログインの認証コード入力
 */
export const GamersLoginAuthcode: Story = {
  render: () => (
    <GamersPublicShell>
      <PageContainer>
        <AuthcodePaper
          title="ログイン"
          lead="入力されたメールアドレスに認証コードを送信しました"
          resend="login"
          verified="home"
        />
      </PageContainer>
    </GamersPublicShell>
  ),
}

/**
 * ゲーマーズの新規登録（signup）。利用規約に同意するまで、送信ボタンと外部 IdP は押せない。
 *
 * @summary ゲーマーズの新規登録
 */
export const GamersSignup: Story = {
  render: () => (
    <GamersPublicShell>
      <PageContainer gapless>
        <SignupPaper />
      </PageContainer>
    </GamersPublicShell>
  ),
}

/**
 * アカウント登録メールを送ったあとの認証コード入力（signup/authcode）。「再送信」は新規登録の画面へ戻る。
 *
 * @summary ゲーマーズの新規登録の認証コード入力
 */
export const GamersSignupAuthcode: Story = {
  render: () => (
    <GamersPublicShell>
      <PageContainer>
        <AuthcodePaper
          title="アカウント作成"
          lead="アカウント登録メールを送信しました"
          resend="signup"
          verified="signup-complete"
        />
      </PageContainer>
    </GamersPublicShell>
  ),
}

/**
 * アカウント作成の完了（(private)/signup/complete の SignupCompletePaper）。ログイン後の画面なので
 * ヘッダーにユーザーメニューが出る。見出し（xl）→ 250px のイラスト → 中央ぞろえの 2 行 →「申し込み画面へ」。
 *
 * @summary ゲーマーズのアカウント作成完了
 */
const SignupCompleteButton = () => {
  const navigate = useGamersNavigate()
  return (
    // 実物の entryPath（既定は /servers/new/game-select。?game・?plan があれば plan-select）
    <LinkButton
      color="interactive"
      size="l"
      width="full"
      href="#servers-new"
      onPress={() => navigate('server-new')}
    >
      申し込み画面へ
    </LinkButton>
  )
}

export const GamersSignupComplete: Story = {
  render: () => (
    <GamersShell>
      <PageContainer>
        <AuthPaper>
          <Stack gap="xl">
            <Typography size="xl" fontWeight="bold" component="h1">
              アカウント作成完了
            </Typography>
            <Stack gap="l">
              <Stack alignItems="center">
                <img src={createAccountImage} alt="アカウント作成完了" width={250} height={250} />
              </Stack>
              <Stack gap="m" alignItems="center">
                <Typography size="m" fontWeight="bold" component="span">
                  アカウント作成が完了しました
                </Typography>
                <Typography size="m" fontWeight="bold" component="span">
                  ゲームを楽しむためにサーバーを契約しましょう！
                </Typography>
              </Stack>
            </Stack>
            <SignupCompleteButton />
          </Stack>
        </AuthPaper>
      </PageContainer>
    </GamersShell>
  ),
}
