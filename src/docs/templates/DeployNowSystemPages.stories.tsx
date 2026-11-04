import { LinkButton } from '../../Button'
import { Stack } from '../../Stack'
import { Typography } from '../../Typography'
import { DeployNowBareShell, DeployNowCard, useDeployNowNavigate } from './deployNowShell'

import type { Meta, StoryObj } from '@storybook/react-vite'

/**
 * デプロイナウ（hosting-deploy-now/frontend）のメンテナンスと 404。どちらも AppBar を持たない（DeployNowBareShell）。
 * - features/Maintenance（app/(dashboard)/maintenance。backend が全 RPC で Unavailable を返す間に遷移してくる）
 * - features/NotFound（app/not-found.tsx。カードを持たず、画面の中央に積む）
 */

const meta = {
  title: 'Templates/DeployNow/SystemPages',
  // テンプレートはロリポップのトンマナを確かめる場所なので、フレーバーを lolipop に固定する
  globals: { flavor: 'lolipop' },
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const MaintenanceScreen = () => {
  const navigate = useDeployNowNavigate()
  return (
    <DeployNowCard>
      <Typography size="xl" fontWeight="bold" component="h1">
        メンテナンス中です
      </Typography>
      <Typography size="s" color="low_emphasis">
        現在メンテナンスを実施しています。ご不便をおかけしますが、しばらく時間をおいてから再度アクセスしてください。
      </Typography>
      {/* 実物は Tailwind の黒地の a。フルリロードでプロジェクト一覧へ入り直す */}
      <LinkButton
        href="#"
        appearance="flat"
        color="neutral"
        width="full"
        onPress={() => navigate('projects')}
      >
        トップページへ戻る
      </LinkButton>
    </DeployNowCard>
  )
}

// 実物は main に min-height: 100dvh・中央寄せ・padding 2.5rem 1rem を inline style で当てている。
// GAP: 画面の高さに合わせて縦の中央に置く部品が無く、上から積む
const NotFoundScreen = () => {
  const navigate = useDeployNowNavigate()
  return (
    <Stack gap="l" alignItems="center">
      <Typography size="xxl" fontWeight="bold" color="low_emphasis" component="p">
        404
      </Typography>
      <Stack gap="xs" alignItems="center">
        <Typography size="xl" fontWeight="bold" component="h1">
          ページが見つかりません
        </Typography>
        <Typography size="s" color="medium_emphasis">
          お探しのページは存在しないか、移動した可能性があります。
        </Typography>
      </Stack>
      <LinkButton href="#" onPress={() => navigate('projects')}>
        トップへ戻る
      </LinkButton>
    </Stack>
  )
}

export const DeployNowMaintenance: Story = {
  render: () => (
    <DeployNowBareShell>
      <MaintenanceScreen />
    </DeployNowBareShell>
  ),
}

export const DeployNowNotFound: Story = {
  render: () => (
    <DeployNowBareShell>
      <NotFoundScreen />
    </DeployNowBareShell>
  ),
}
