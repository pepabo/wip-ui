import { Button } from '../../Button'
import { Callout } from '../../Callout'
import { Container } from '../../Container'
import { Divider } from '../../Divider'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Loader } from '../../Loader'
import { Paper } from '../../Paper'
import { Stack } from '../../Stack'
import { Sticker } from '../../Sticker'
import { Typography } from '../../Typography'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { IconName } from '../../Icon'

const meta = {
  title: 'Templates/EmptyStates',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const EmptyStateCard = ({
  icon,
  iconBg,
  title,
  description,
  action,
  secondaryAction,
}: {
  icon: IconName
  iconBg: string
  title: string
  description: string
  action?: { label: string; color?: 'interactive' | 'neutral' }
  secondaryAction?: { label: string }
}) => (
  <Paper elevation={1}>
    <div style={{ padding: '48px 32px', textAlign: 'center' }}>
      <Stack gap="m" alignItems="center">
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name={icon} size="l" />
        </div>
        <Stack gap="xs" alignItems="center">
          <Typography size="l" fontWeight="bold">
            {title}
          </Typography>
          <Typography size="s" color="medium_emphasis">
            {description}
          </Typography>
        </Stack>
        {(action || secondaryAction) && (
          <Stack flexDirection="row" gap="s" justifyContent="center">
            {action && (
              <Button color={action.color || 'interactive'} size="s">
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button appearance="outlined" size="s">
                {secondaryAction.label}
              </Button>
            )}
          </Stack>
        )}
      </Stack>
    </div>
  </Paper>
)

/**
 * さまざまなエンプティステート（空の状態）のパターン集。
 * 初回利用時、検索結果なし、エラー発生時、メンテナンス中など
 * ユーザーへのフィードバック表示パターンを網羅。
 * Icon, Typography, Button, Paper, Callout, Sticker, Loader の
 * カラーバリエーションを確認できる。
 *
 * @summary エンプティステートのパターン集
 */
export const Default: Story = {
  render: () => (
    <div style={{ minHeight: '100vh', background: 'var(--wip-color-surface-base)' }}>
      <Container size="l">
        <div style={{ paddingTop: '32px', paddingBottom: '48px' }}>
          <Stack gap="xl">
            <Stack gap="xs">
              <Typography size="xl" fontWeight="bold">
                エンプティステート パターン集
              </Typography>
              <Typography size="s" color="medium_emphasis">
                データがない状態や特殊な状態でのUI表示パターン
              </Typography>
            </Stack>

            {/* セクション: 初回利用 */}
            <Stack gap="m">
              <Stack flexDirection="row" gap="s" alignItems="center">
                <Sticker color="informative">初回利用</Sticker>
                <Typography size="m" fontWeight="bold">
                  オンボーディング・初回利用時
                </Typography>
              </Stack>

              <Grid spacing="m">
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <EmptyStateCard
                    icon="note"
                    iconBg="var(--wip-color-surface-informative)"
                    title="商品がまだありません"
                    description="最初の商品を登録して、ショップを開設しましょう。写真を撮って、価格を設定するだけで出品できます。"
                    action={{ label: '最初の商品を追加' }}
                    secondaryAction={{ label: 'ガイドを見る' }}
                  />
                </GridItem>
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <EmptyStateCard
                    icon="people"
                    iconBg="var(--wip-color-surface-informative)"
                    title="まだフォロワーがいません"
                    description="商品を公開すると、ユーザーがあなたのショップをフォローできるようになります。"
                    action={{ label: 'ショップを公開' }}
                  />
                </GridItem>
              </Grid>
            </Stack>

            <Divider />

            {/* セクション: 検索結果なし */}
            <Stack gap="m">
              <Stack flexDirection="row" gap="s" alignItems="center">
                <Sticker color="notice">検索結果</Sticker>
                <Typography size="m" fontWeight="bold">
                  検索・フィルター結果なし
                </Typography>
              </Stack>

              <Grid spacing="m">
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <EmptyStateCard
                    icon="magnifying_glass"
                    iconBg="var(--wip-color-surface-notice)"
                    title="検索結果が見つかりません"
                    description="「手編みマフラー」に一致する商品は見つかりませんでした。別のキーワードで検索してみてください。"
                    action={{ label: '検索条件をクリア', color: 'neutral' }}
                  />
                </GridItem>
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <EmptyStateCard
                    icon="funnel"
                    iconBg="var(--wip-color-surface-notice)"
                    title="条件に一致する注文がありません"
                    description="選択したフィルター条件に一致する注文がありません。フィルターを変更してお試しください。"
                    action={{ label: 'フィルターをリセット', color: 'neutral' }}
                  />
                </GridItem>
              </Grid>
            </Stack>

            <Divider />

            {/* セクション: 完了・成功 */}
            <Stack gap="m">
              <Stack flexDirection="row" gap="s" alignItems="center">
                <Sticker color="positive">完了</Sticker>
                <Typography size="m" fontWeight="bold">
                  タスク完了・処理済み
                </Typography>
              </Stack>

              <Grid spacing="m">
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <EmptyStateCard
                    icon="check_on_circle"
                    iconBg="var(--wip-color-surface-positive)"
                    title="未処理の注文はありません"
                    description="すべての注文が処理済みです。新しい注文が入ると、ここに表示されます。"
                  />
                </GridItem>
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <EmptyStateCard
                    icon="check_on_circle"
                    iconBg="var(--wip-color-surface-positive)"
                    title="すべての通知を確認済みです"
                    description="未読の通知はありません。新しい通知が届くとここに表示されます。"
                  />
                </GridItem>
              </Grid>
            </Stack>

            <Divider />

            {/* セクション: エラー */}
            <Stack gap="m">
              <Stack flexDirection="row" gap="s" alignItems="center">
                <Sticker color="negative">エラー</Sticker>
                <Typography size="m" fontWeight="bold">
                  エラー・障害発生時
                </Typography>
              </Stack>

              <Grid spacing="m">
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <Paper elevation={1}>
                    <div style={{ padding: '48px 32px', textAlign: 'center' }}>
                      <Stack gap="m" alignItems="center">
                        <div
                          style={{
                            width: '72px',
                            height: '72px',
                            borderRadius: '50%',
                            background: 'var(--wip-color-surface-negative)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon name="cross_on_circle" size="l" />
                        </div>
                        <Stack gap="xs" alignItems="center">
                          <Typography size="l" fontWeight="bold">
                            データの読み込みに失敗しました
                          </Typography>
                          <Typography size="s" color="medium_emphasis">
                            ネットワーク接続を確認して、再試行してください。
                          </Typography>
                        </Stack>
                        <Stack flexDirection="row" gap="s" justifyContent="center">
                          <Button
                            color="interactive"
                            size="s"
                            leading={<Icon name="arrow_cross" size="s" />}
                          >
                            再試行
                          </Button>
                          <Button appearance="outlined" size="s">
                            サポートに連絡
                          </Button>
                        </Stack>
                        <Callout color="negative" appearance="outline">
                          <Typography size="xs">
                            Error: NETWORK_ERROR — サーバーとの接続がタイムアウトしました (30s)
                          </Typography>
                        </Callout>
                      </Stack>
                    </div>
                  </Paper>
                </GridItem>
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <Paper elevation={1}>
                    <div style={{ padding: '48px 32px', textAlign: 'center' }}>
                      <Stack gap="m" alignItems="center">
                        <Typography size="xxxl" fontWeight="bold" color="low_emphasis">
                          404
                        </Typography>
                        <Stack gap="xs" alignItems="center">
                          <Typography size="l" fontWeight="bold">
                            ページが見つかりません
                          </Typography>
                          <Typography size="s" color="medium_emphasis">
                            お探しのページは存在しないか、移動された可能性があります。
                          </Typography>
                        </Stack>
                        <Stack flexDirection="row" gap="s" justifyContent="center">
                          <Button color="interactive" size="s">
                            ダッシュボードに戻る
                          </Button>
                          <Button appearance="outlined" size="s">
                            ヘルプを見る
                          </Button>
                        </Stack>
                      </Stack>
                    </div>
                  </Paper>
                </GridItem>
              </Grid>
            </Stack>

            <Divider />

            {/* セクション: ローディング */}
            <Stack gap="m">
              <Stack flexDirection="row" gap="s" alignItems="center">
                <Sticker color="neutral">ローディング</Sticker>
                <Typography size="m" fontWeight="bold">
                  読み込み中・処理中
                </Typography>
              </Stack>

              <Grid spacing="m">
                <GridItem size={{ xxs: 12, m: 4 }}>
                  <Paper elevation={1}>
                    <div style={{ padding: '48px 32px', textAlign: 'center' }}>
                      <Stack gap="m" alignItems="center">
                        <Loader size="l" />
                        <Typography size="s" color="medium_emphasis">
                          データを読み込んでいます...
                        </Typography>
                      </Stack>
                    </div>
                  </Paper>
                </GridItem>
                <GridItem size={{ xxs: 12, m: 4 }}>
                  <Paper elevation={1}>
                    <div style={{ padding: '48px 32px', textAlign: 'center' }}>
                      <Stack gap="m" alignItems="center">
                        <Loader size="xl" message="エクスポートを準備中..." />
                      </Stack>
                    </div>
                  </Paper>
                </GridItem>
                <GridItem size={{ xxs: 12, m: 4 }}>
                  <Paper elevation={1}>
                    <div style={{ padding: '48px 32px', textAlign: 'center' }}>
                      <Stack gap="m" alignItems="center">
                        <Loader size="xxl" />
                        <Typography size="m" fontWeight="bold">
                          ファイルをアップロード中
                        </Typography>
                        <Typography size="s" color="medium_emphasis">
                          3/5 完了 — 残り約30秒
                        </Typography>
                      </Stack>
                    </div>
                  </Paper>
                </GridItem>
              </Grid>
            </Stack>

            <Divider />

            {/* セクション: メンテナンス */}
            <Stack gap="m">
              <Stack flexDirection="row" gap="s" alignItems="center">
                <Sticker color="attention">メンテナンス</Sticker>
                <Typography size="m" fontWeight="bold">
                  メンテナンス・制限時
                </Typography>
              </Stack>

              <Paper elevation={1}>
                <div style={{ padding: '48px 32px', textAlign: 'center' }}>
                  <Stack gap="m" alignItems="center">
                    <div
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '50%',
                        background: 'var(--wip-color-surface-notice)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon name="gear" size="l" />
                    </div>
                    <Stack gap="xs" alignItems="center">
                      <Typography size="l" fontWeight="bold">
                        ただいまメンテナンス中です
                      </Typography>
                      <Typography size="s" color="medium_emphasis">
                        サービスの品質向上のため、一時的にご利用いただけません。
                      </Typography>
                      <Typography size="s" color="medium_emphasis">
                        復旧予定: 2026年9月5日 06:00
                      </Typography>
                    </Stack>
                    <Callout color="notice">
                      <Typography size="s">
                        メンテナンス中のデータは保護されています。復旧後は通常通りご利用いただけます。
                      </Typography>
                    </Callout>
                  </Stack>
                </div>
              </Paper>
            </Stack>

            <Divider />

            {/* Sticker カラー一覧 */}
            <Stack gap="m">
              <Typography size="m" fontWeight="bold">
                ステータスラベルのカラーバリエーション
              </Typography>
              <Typography size="s" color="medium_emphasis">
                Sticker コンポーネントの全カラー
              </Typography>
              <Stack flexDirection="row" gap="s">
                <Sticker color="positive" size="m">
                  positive
                </Sticker>
                <Sticker color="informative" size="m">
                  informative
                </Sticker>
                <Sticker color="notice" size="m">
                  notice
                </Sticker>
                <Sticker color="negative" size="m">
                  negative
                </Sticker>
                <Sticker color="neutral" size="m">
                  neutral
                </Sticker>
                <Sticker color="attention" size="m">
                  attention
                </Sticker>
              </Stack>
              <Stack flexDirection="row" gap="s">
                <Sticker color="positive" size="s">
                  positive (s)
                </Sticker>
                <Sticker color="informative" size="s">
                  informative (s)
                </Sticker>
                <Sticker color="notice" size="s">
                  notice (s)
                </Sticker>
                <Sticker color="negative" size="s">
                  negative (s)
                </Sticker>
                <Sticker color="neutral" size="s">
                  neutral (s)
                </Sticker>
                <Sticker color="attention" size="s">
                  attention (s)
                </Sticker>
              </Stack>
            </Stack>

            {/* Typography カラー一覧 */}
            <Stack gap="m">
              <Typography size="m" fontWeight="bold">
                テキストカラーバリエーション
              </Typography>
              <Typography size="s" color="medium_emphasis">
                Typography コンポーネントの全 color
              </Typography>
              <Paper elevation={1}>
                <div style={{ padding: '24px' }}>
                  <Stack gap="s">
                    <Typography size="m" color="high_emphasis">
                      high_emphasis — 最も強調度の高いテキスト
                    </Typography>
                    <Typography size="m" color="medium_emphasis">
                      medium_emphasis — 補足的なテキスト
                    </Typography>
                    <Typography size="m" color="low_emphasis">
                      low_emphasis — 控えめな注釈テキスト
                    </Typography>
                    <Divider />
                    <Typography size="m" color="informative">
                      informative — 情報や参考リンク
                    </Typography>
                    <Typography size="m" color="positive">
                      positive — 成功・完了メッセージ
                    </Typography>
                    <Typography size="m" color="notice">
                      notice — 注意・警告メッセージ
                    </Typography>
                    <Typography size="m" color="negative">
                      negative — エラー・問題メッセージ
                    </Typography>
                  </Stack>
                </div>
              </Paper>
            </Stack>

            {/* Button カラー一覧 */}
            <Stack gap="m">
              <Typography size="m" fontWeight="bold">
                ボタンのバリエーション
              </Typography>
              <Typography size="s" color="medium_emphasis">
                Button コンポーネントの color × appearance
              </Typography>
              <Paper elevation={1}>
                <div style={{ padding: '24px' }}>
                  <Stack gap="m">
                    <Stack gap="xs">
                      <Typography size="s" fontWeight="bold">
                        Flat (デフォルト)
                      </Typography>
                      <Stack flexDirection="row" gap="s">
                        <Button color="neutral">Neutral</Button>
                        <Button color="interactive">Interactive</Button>
                        <Button color="negative">Negative</Button>
                      </Stack>
                    </Stack>
                    <Divider />
                    <Stack gap="xs">
                      <Typography size="s" fontWeight="bold">
                        Outlined
                      </Typography>
                      <Stack flexDirection="row" gap="s">
                        <Button appearance="outlined" color="neutral">
                          Neutral
                        </Button>
                        <Button appearance="outlined" color="interactive">
                          Interactive
                        </Button>
                        <Button appearance="outlined" color="negative">
                          Negative
                        </Button>
                      </Stack>
                    </Stack>
                    <Divider />
                    <Stack gap="xs">
                      <Typography size="s" fontWeight="bold">
                        Transparent
                      </Typography>
                      <Stack flexDirection="row" gap="s">
                        <Button appearance="transparent" color="neutral">
                          Neutral
                        </Button>
                        <Button appearance="transparent" color="interactive">
                          Interactive
                        </Button>
                        <Button appearance="transparent" color="negative">
                          Negative
                        </Button>
                      </Stack>
                    </Stack>
                    <Divider />
                    <Stack gap="xs">
                      <Typography size="s" fontWeight="bold">
                        サイズ
                      </Typography>
                      <Stack flexDirection="row" gap="s" alignItems="center">
                        <Button color="interactive" size="s">
                          Small
                        </Button>
                        <Button color="interactive" size="m">
                          Medium
                        </Button>
                        <Button color="interactive" size="l">
                          Large
                        </Button>
                      </Stack>
                    </Stack>
                  </Stack>
                </div>
              </Paper>
            </Stack>
          </Stack>
        </div>
      </Container>
    </div>
  ),
}
