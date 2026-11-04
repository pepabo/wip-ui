import { LinkButton } from '../../Button'
import { Callout } from '../../Callout'
import { Typography } from '../../Typography'
import { DeployNowBareShell, DeployNowCard, useDeployNowNavigate } from './deployNowShell'

import type { Meta, StoryObj } from '@storybook/react-vite'

/**
 * デプロイナウ（hosting-deploy-now/frontend）のログイン前の画面。
 * - features/Auth（dex モード専用のログイン。本番の /login は lolipop のログイン入口へ転送するだけで画面を持たない）
 * - features/Signup（lolipop モード）
 * どちらも app/(dashboard)/layout.tsx の直下で、AppBar を持たない。枠は DeployNowBareShell と DeployNowCard。
 * 実物のボタンは Tailwind の黒地（bg-neutral-900・h-10・w-full・text-sm font-medium）の a を手組みしている。
 * GAP: Button の size m は高さ 40px（h-10）と合うが文字が 16px、size s は文字が 14px（text-sm）だが高さが 32px で、
 *      両方を同時に合わせられない。高さを合わせて size m（既定）にしている。font-medium（500）も出せない
 */

const meta = {
  title: 'Templates/DeployNow/Auth',
  // テンプレートはロリポップのトンマナを確かめる場所なので、フレーバーを lolipop に固定する
  globals: { flavor: 'lolipop' },
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const LoginScreen = () => {
  const navigate = useDeployNowNavigate()
  return (
    <DeployNowCard>
      <Typography size="xl" fontWeight="bold" component="h1">
        deploy-now にログイン
      </Typography>
      <Typography size="s" color="low_emphasis">
        Dex で認証してから続行してください。
      </Typography>
      {/* 実物は /api/auth/login へフルリロードで移り、認証が済むとプロジェクト一覧へ戻る */}
      <LinkButton
        href="#"
        appearance="flat"
        color="neutral"
        width="full"
        onPress={() => navigate('projects')}
      >
        Dex でログイン
      </LinkButton>
      <Callout color="informative" appearance="flat">
        {/* GAP-20: 等幅フォントが無い。実物は dev@example.com と password を font-mono の code で出す */}
        <Typography size="s">開発環境では dev@example.com / password で入れます。</Typography>
      </Callout>
    </DeployNowCard>
  )
}

// 実物の素の a は Tailwind の preflight で、色を親から継ぎ、下線が無い
const inheritLinkStyle = { color: 'inherit', textDecoration: 'none' } as const

const SignupScreen = () => {
  const navigate = useDeployNowNavigate()
  return (
    <DeployNowCard>
      <Typography size="xl" fontWeight="bold" component="h1">
        ロリポップ！デプロイナウに新規登録
      </Typography>
      <Typography size="s" color="low_emphasis">
        ロリポップ！ID で認証して新規登録を進めてください。
      </Typography>
      {/* 実物は lolipop-www の申し込み入口（/order/deploy-now/）へフルリロードで移る */}
      <LinkButton
        href="#"
        appearance="flat"
        color="neutral"
        width="full"
        onPress={() => navigate('lolipop-signup')}
      >
        ロリポップ！ID で新規登録
      </LinkButton>
      {/* 実物は 1 つの Typography s low_emphasis の段落の中に、クラスの無い素の a を置く（色は段落から継ぎ、下線は無い）。
          GAP-NEW: 文中のリンクが無いので、同じく素の a で、色を継いで下線を消す */}
      <Typography size="s" color="low_emphasis">
        すでにアカウントをお持ちの方は{' '}
        <a
          href="/login"
          style={inheritLinkStyle}
          onClick={(event) => {
            event.preventDefault()
            navigate('login')
          }}
        >
          ログイン
        </a>
      </Typography>
    </DeployNowCard>
  )
}

export const DeployNowLogin: Story = {
  render: () => (
    <DeployNowBareShell>
      <LoginScreen />
    </DeployNowBareShell>
  ),
}

export const DeployNowSignup: Story = {
  render: () => (
    <DeployNowBareShell>
      <SignupScreen />
    </DeployNowBareShell>
  ),
}
