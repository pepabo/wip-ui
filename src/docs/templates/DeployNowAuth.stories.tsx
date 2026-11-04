import { LinkButton } from '../../Button'
import { Callout } from '../../Callout'
import { Stack } from '../../Stack'
import { Typography } from '../../Typography'
import { DeployNowBareShell, DeployNowCard, useDeployNowNavigate } from './deployNowShell'

import type { Meta, StoryObj } from '@storybook/react-vite'

/**
 * デプロイナウ（hosting-deploy-now/frontend）のログイン前の画面。
 * - features/Auth（dex モード専用のログイン。本番の /login は lolipop のログイン入口へ転送するだけで画面を持たない）
 * - features/Signup（lolipop モード）
 * どちらも app/(dashboard)/layout.tsx の直下で、AppBar を持たない。枠は DeployNowBareShell と DeployNowCard。
 * 実物のボタンは Tailwind の黒地（bg-neutral-900・h-10・w-full）の a を手組みしている。
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
      {/* 実物は 1 つの段落の中の a。GAP: 文中のリンクが無いので、文と transparent の LinkButton を並べる */}
      <Stack flexDirection="row" gap="xxs" alignItems="center">
        <Typography size="s" color="low_emphasis" component="span">
          すでにアカウントをお持ちの方は
        </Typography>
        <LinkButton appearance="transparent" size="s" href="#" onPress={() => navigate('login')}>
          ログイン
        </LinkButton>
      </Stack>
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
