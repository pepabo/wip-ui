import { Button, LinkButton } from '../../Button'
import { Icon } from '../../Icon'
import { Stack } from '../../Stack'
import { Typography } from '../../Typography'
import { AuthShell } from './AppShell'
import chatbotImage from './assets/gamers/chatbot.svg'
import { Card } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'

/**
 * エラー・メンテナンス・404 の画面の再現。どれもログイン前の画面と同じく、サイドナビを持たない AuthShell に載せる。
 *
 * ロリポップ！for Gamers（apollo/frontend/src）
 * - app/(application)/(public)/error/page.tsx（問題が発生しました。?trace_id があればコードを出す）
 * - components/Maintenance（フラグ gamers_maintenance-mode が ON のとき、(public) の layout ごと差し替わる）
 *
 * ロリポップ！デプロイナウ（hosting-deploy-now/frontend）
 * - features/Maintenance（backend が全 RPC で Unavailable を返す間に遷移してくる）
 * - features/NotFound（root の not-found。404）
 *
 * デプロイナウの 3 画面は実物に AppBar が無い。統合コンソールとしてそろえるため AuthShell のロゴだけの AppBar を付けている。
 */

const meta = {
  title: 'Templates/SystemPages',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── ストーリー ───

/**
 * ゲーマーズのエラー画面（(public)/error）。お問い合わせ（サポートの問い合わせフォームを別タブで開く）と、
 * ホーム・サービストップへの戻り道を出す。?trace_id があるとき（エラートラッキングコードとコピーボタンが出る）の表示。
 * 実物の Paper は高さ 400px で中身を縦に中央寄せしている。GAP-1 の Card は高さを持てないので詰めて組む。
 *
 * @summary ゲーマーズのエラー画面
 */
export const GamersError: Story = {
  render: () => {
    const code = '6c9f1a2b3d4e5f60718293a4b5c6d7e8'
    return (
      <AuthShell>
        <Card elevation={0}>
          <Stack gap="l">
            <Typography size="xl" fontWeight="bold" component="h1">
              問題が発生しました
            </Typography>
            <Stack gap="l">
              <Stack gap="xxs">
                <Typography size="m" component="span">
                  一時的にアクセスできない状態です
                </Typography>
                <Typography size="m" component="span">
                  お困りの場合はエラートラッキングコードを添えてお問い合せください
                </Typography>
              </Stack>
              <Stack
                flexDirection={{ xxs: 'column', s: 'row' }}
                gap="s"
                justifyContent="space-between"
              >
                <Stack gap="xxs">
                  <Typography size="m" fontWeight="bold" component="span">
                    エラートラッキングコード
                  </Typography>
                  {/* GAP-20: 等幅フォントが無い（実物も等幅ではない） */}
                  <Typography size="m" component="span">
                    {code}
                  </Typography>
                </Stack>
                {/* components/CopyButton。押すと「コピーしました」のスナックバーが出る */}
                <Button appearance="outlined" leading={<Icon name="copy" size="s" />}>
                  コピー
                </Button>
              </Stack>
            </Stack>
            <Stack gap="s">
              <LinkButton
                color="interactive"
                size="l"
                width="full"
                href="#support-request"
                target="_blank"
              >
                お問い合わせ
              </LinkButton>
              <Stack flexDirection={{ xxs: 'column', s: 'row' }} gap="s">
                <LinkButton appearance="outlined" size="l" width="full" href="#home">
                  ホームへ
                </LinkButton>
                <LinkButton appearance="outlined" size="l" width="full" href="#gamers-top">
                  サービストップへ
                </LinkButton>
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </AuthShell>
    )
  },
}

/**
 * ゲーマーズのメンテナンス画面（components/Maintenance）。
 * 実物は見出しの上に 12em のイラスト（chatbot.svg）がある。
 *
 * @summary ゲーマーズのメンテナンス画面
 */
export const GamersMaintenance: Story = {
  render: () => (
    <AuthShell>
      <Card elevation={0}>
        <Stack gap="l">
          <Stack alignItems="center">
            {/* GAP-NEW: 画像の枠（Image）が無い。実物は 12em 角（192px） */}
            <img src={chatbotImage} alt="chatbotのイラスト" width={192} height={192} />
            <Typography size="m" fontWeight="bold" component="h1">
              メンテナンス中です
            </Typography>
          </Stack>
          <Stack gap="xs">
            <Typography size="m" component="span">
              メンテナンスにより、一時的にアクセスできない状態です
            </Typography>
            <Typography size="m" component="span">
              お困りの場合はお問い合わせください
            </Typography>
          </Stack>
          <LinkButton color="interactive" size="l" width="full" href="#gamers-top">
            トップへ
          </LinkButton>
        </Stack>
      </Card>
    </AuthShell>
  ),
}

/**
 * デプロイナウのメンテナンス画面（features/Maintenance）。この画面は API を呼ばない。
 * 「トップページへ戻る」はフルリロードでプロジェクト一覧へ入り直し、メンテナンスが続いていればまたここへ戻る。
 * 実物のカード幅は 384px（max-w-sm）で、AuthShell の Container より狭い。
 *
 * @summary デプロイナウのメンテナンス画面
 */
export const DeployNowMaintenance: Story = {
  render: () => (
    <AuthShell>
      {/* 実物は Tailwind の rounded-lg border shadow-sm の白いカード */}
      <Card outlined elevation={1}>
        <Stack gap="m" alignItems="center">
          <Typography size="xl" fontWeight="bold" component="h1">
            メンテナンス中です
          </Typography>
          <Typography size="s" color="low_emphasis" component="span">
            現在メンテナンスを実施しています。ご不便をおかけしますが、しばらく時間をおいてから再度アクセスしてください。
          </Typography>
          {/* 実物は Tailwind で黒地のボタン（bg-neutral-900）を手組みしている */}
          <LinkButton width="full" href="#projects">
            トップページへ戻る
          </LinkButton>
        </Stack>
      </Card>
    </AuthShell>
  ),
}

/**
 * デプロイナウの 404（features/NotFound）。カードを持たず、画面の中央に「404」と見出し・説明・戻るボタンを積む。
 *
 * @summary デプロイナウの 404
 */
export const DeployNowNotFound: Story = {
  render: () => (
    <AuthShell>
      <Stack gap="l" alignItems="center">
        <Typography size="xxl" fontWeight="bold" color="low_emphasis" component="p">
          404
        </Typography>
        <Stack gap="xs" alignItems="center">
          <Typography size="xl" fontWeight="bold" component="h1">
            ページが見つかりません
          </Typography>
          <Typography size="s" color="medium_emphasis" component="span">
            お探しのページは存在しないか、移動した可能性があります。
          </Typography>
        </Stack>
        <LinkButton href="#projects">トップへ戻る</LinkButton>
      </Stack>
    </AuthShell>
  ),
}
