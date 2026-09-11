import { Button } from '../../Button'
import { Callout } from '../../Callout'
import { Checkbox } from '../../Checkbox'
import { Divider } from '../../Divider'
import { Icon } from '../../Icon'
import { Paper } from '../../Paper'
import { Stack } from '../../Stack'
import { TextField } from '../../TextField'
import { Typography } from '../../Typography'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Templates/Login',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/**
 * メールアドレスとパスワードによるシンプルなログインフォーム。
 * Paper で囲んだ中央配置のカードレイアウト。
 *
 * @summary シンプルなログインフォーム
 */
export const Default: Story = {
  render: () => (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--wip-color-surface-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <Stack gap="l" alignItems="center">
          <Stack gap="xs" alignItems="center">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--wip-color-surface-interactive)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="home" size="l" />
            </div>
            <Typography size="xl" fontWeight="bold">
              ログイン
            </Typography>
            <Typography size="s" color="medium_emphasis">
              アカウントにログインしてください
            </Typography>
          </Stack>

          <Paper elevation={2}>
            <div style={{ padding: '32px', width: '100%', boxSizing: 'border-box' }}>
              <Stack gap="m">
                <TextField label="メールアドレス" placeholder="you@example.com" width="full" />
                <TextField label="パスワード" placeholder="••••••••" width="full" />

                <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                  <Checkbox>ログイン状態を保持</Checkbox>
                  <Button appearance="transparent" size="s">
                    <Typography size="xs" color="informative">
                      パスワードを忘れた方
                    </Typography>
                  </Button>
                </Stack>

                <Button color="interactive" width="full">
                  ログイン
                </Button>

                <Stack flexDirection="row" gap="m" alignItems="center">
                  <Divider />
                  <Typography size="xs" color="medium_emphasis" component="span">
                    または
                  </Typography>
                  <Divider />
                </Stack>

                <Button appearance="outlined" width="full">
                  新規アカウント登録
                </Button>
              </Stack>
            </div>
          </Paper>

          <Typography size="xs" color="low_emphasis">
            ログインすることで利用規約とプライバシーポリシーに同意したことになります
          </Typography>
        </Stack>
      </div>
    </div>
  ),
}

/**
 * ブランドイメージを左側に配置した2カラムのログインレイアウト。
 * サービスのコンセプトやキャッチコピーを表示しつつ、
 * 右側にフォームを配置する。LP経由のユーザーに向けた構成。
 *
 * @summary ブランディング付き2カラムログイン
 */
export const WithBranding: Story = {
  render: () => (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
      }}
    >
      {/* ブランディング側 */}
      <div
        style={{
          flex: 1,
          background: 'var(--wip-color-surface-interactive)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px',
          minHeight: '100vh',
        }}
      >
        <Stack gap="xl">
          <Stack gap="m">
            <Stack flexDirection="row" gap="s" alignItems="center">
              <Icon name="home" size="l" />
              <Typography size="xxl" fontWeight="bold">
                My Shop
              </Typography>
            </Stack>
            <Typography size="l">あなたのクリエイティビティを、</Typography>
            <Typography size="l">世界中の人々に届けよう。</Typography>
          </Stack>
          <Divider />
          <Stack gap="m">
            <Stack flexDirection="row" gap="s" alignItems="center">
              <Icon name="check_on_circle" size="s" />
              <Typography size="s">かんたん出品 — 写真を撮って、すぐに販売開始</Typography>
            </Stack>
            <Stack flexDirection="row" gap="s" alignItems="center">
              <Icon name="check_on_circle" size="s" />
              <Typography size="s">安心決済 — 購入者・出品者の双方を保護</Typography>
            </Stack>
            <Stack flexDirection="row" gap="s" alignItems="center">
              <Icon name="check_on_circle" size="s" />
              <Typography size="s">充実の分析 — 売上トレンドを一目で把握</Typography>
            </Stack>
          </Stack>
        </Stack>
      </div>

      {/* フォーム側 */}
      <div
        style={{
          width: '480px',
          flexShrink: 0,
          background: 'var(--wip-color-surface-base)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px',
        }}
      >
        <Stack gap="l">
          <Stack gap="xs">
            <Typography size="xl" fontWeight="bold">
              おかえりなさい
            </Typography>
            <Typography size="s" color="medium_emphasis">
              アカウントにログインして続行してください
            </Typography>
          </Stack>

          <Stack gap="m">
            <TextField label="メールアドレス" placeholder="you@example.com" width="full" />
            <TextField label="パスワード" placeholder="••••••••" width="full" />

            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
              <Checkbox>ログイン状態を保持</Checkbox>
              <Button appearance="transparent" size="s">
                <Typography size="xs" color="informative">
                  パスワードを忘れた方
                </Typography>
              </Button>
            </Stack>

            <Button color="interactive" width="full">
              ログイン
            </Button>
          </Stack>

          <Divider />

          <Stack gap="s" alignItems="center">
            <Typography size="s" color="medium_emphasis">
              アカウントをお持ちでない方
            </Typography>
            <Button appearance="outlined" width="full">
              新規アカウント登録
            </Button>
          </Stack>

          <Typography size="xs" color="low_emphasis">
            ログインすることで利用規約とプライバシーポリシーに同意したことになります
          </Typography>
        </Stack>
      </div>
    </div>
  ),
}

/**
 * エラー状態のログインフォーム。認証失敗時やバリデーションエラー時の表示例。
 * Callout とフィールドの color="negative" を組み合わせたエラーハンドリング。
 *
 * @summary エラー状態のログインフォーム
 */
export const WithError: Story = {
  render: () => (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--wip-color-surface-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <Stack gap="l" alignItems="center">
          <Stack gap="xs" alignItems="center">
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--wip-color-surface-interactive)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="home" size="l" />
            </div>
            <Typography size="xl" fontWeight="bold">
              ログイン
            </Typography>
          </Stack>

          <Paper elevation={2}>
            <div style={{ padding: '32px', width: '100%', boxSizing: 'border-box' }}>
              <Stack gap="m">
                <Callout color="negative">
                  <Typography size="s">
                    メールアドレスまたはパスワードが正しくありません。もう一度お試しください。
                  </Typography>
                </Callout>

                <TextField
                  label="メールアドレス"
                  placeholder="you@example.com"
                  width="full"
                  color="negative"
                />
                <TextField
                  label="パスワード"
                  placeholder="••••••••"
                  width="full"
                  color="negative"
                  caption="パスワードは8文字以上で入力してください"
                />

                <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                  <Checkbox>ログイン状態を保持</Checkbox>
                  <Button appearance="transparent" size="s">
                    <Typography size="xs" color="informative">
                      パスワードを忘れた方
                    </Typography>
                  </Button>
                </Stack>

                <Button color="interactive" width="full">
                  ログイン
                </Button>

                <Stack flexDirection="row" gap="m" alignItems="center">
                  <Divider />
                  <Typography size="xs" color="medium_emphasis" component="span">
                    または
                  </Typography>
                  <Divider />
                </Stack>

                <Button appearance="outlined" width="full">
                  新規アカウント登録
                </Button>
              </Stack>
            </div>
          </Paper>
        </Stack>
      </div>
    </div>
  ),
}
