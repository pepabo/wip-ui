import { TabPanel } from 'react-aria-components'

import { AppBar, AppBarLeading, AppBarTrailing } from '../../../AppBar'
import { Button } from '../../../Button'
import { Callout } from '../../../Callout'
import { Container } from '../../../Container'
import { Grid, GridItem } from '../../../Grid'
import { Icon } from '../../../Icon'
import { Loader } from '../../../Loader'
import { Page } from '../../../Page'
import { Paper } from '../../../Paper'
import { Stack } from '../../../Stack'
import { Sticker } from '../../../Sticker'
import { Tab, TabList, Tabs } from '../../../Tab'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../../Table'
import { Typography } from '../../../Typography'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import type { IconName } from '../../../Icon'
import type { TypographyColor } from '../../../Typography'

const meta = {
  title: 'Templates/Apollo/Home',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── データ ───

type ServerStatus = 'running' | 'stopped' | 'starting' | 'failure' | 'payment_failed'

const statusPresentation: Record<
  ServerStatus,
  { label: string; color: TypographyColor } & ({ icon: IconName } | { loading: true })
> = {
  running: { label: '起動中', icon: 'bullet_circle', color: 'positive' },
  stopped: { label: '停止中', icon: 'circle', color: 'medium_emphasis' },
  starting: { label: '起動処理中', color: 'medium_emphasis', loading: true },
  failure: { label: '起動失敗', icon: 'exclamation_on_triangle', color: 'negative' },
  payment_failed: { label: '決済失敗', icon: 'exclamation_on_triangle', color: 'negative' },
}

type Server = {
  id: string
  name: string
  gameTitle: string
  status: ServerStatus
  ipAddress?: string
  plan: string
}

const servers: Server[] = [
  {
    id: 'sv-8f21',
    name: 'ぺぱぼサバイバル',
    gameTitle: 'Minecraft Java Edition',
    status: 'running',
    ipAddress: 'pepabo-survival.gamers.jp:25565',
    plan: 'スタンダード 4GB',
  },
  {
    id: 'sv-3c07',
    name: '建築練習用ワールド',
    gameTitle: 'Minecraft Java Edition',
    status: 'stopped',
    ipAddress: 'kenchiku.gamers.jp:25565',
    plan: 'ライト 2GB',
  },
  {
    id: 'sv-1b94',
    name: 'モッド検証サーバー',
    gameTitle: 'Minecraft Forge',
    status: 'starting',
    plan: 'ハイスペック 8GB',
  },
  {
    id: 'sv-5d42',
    name: 'ARK 拠点',
    gameTitle: 'ARK: Survival Ascended',
    status: 'payment_failed',
    ipAddress: 'ark-base.gamers.jp:7777',
    plan: 'ハイスペック 8GB',
  },
]

const backups = [
  {
    id: 'bk-01',
    server: 'ぺぱぼサバイバル',
    createdAt: '2026-09-03 04:00',
    size: '1.2 GB',
    kind: '自動',
  },
  {
    id: 'bk-02',
    server: 'ぺぱぼサバイバル',
    createdAt: '2026-09-02 04:00',
    size: '1.2 GB',
    kind: '自動',
  },
  {
    id: 'bk-03',
    server: '建築練習用ワールド',
    createdAt: '2026-09-01 21:14',
    size: '640 MB',
    kind: '手動',
  },
  { id: 'bk-04', server: 'ARK 拠点', createdAt: '2026-08-31 04:00', size: '3.8 GB', kind: '自動' },
]

// ─── 部品 ───

const ServerStatusLabel = ({ status }: { status: ServerStatus }) => {
  const s = statusPresentation[status]
  // Icon には意味づけされた color prop がないため、Typography で包んで色を継承させる
  return (
    <Typography size="s" color={s.color} component="div">
      <Stack flexDirection="row" gap="xxs" alignItems="center">
        {'loading' in s ? <Loader size="s" /> : <Icon name={s.icon} size="s" />}
        {s.label}
      </Stack>
    </Typography>
  )
}

const DefinitionRow = ({ label, children }: { label: string; children: ReactNode }) => (
  <Grid spacing="xs">
    <GridItem size={4}>
      <Typography size="s" color="medium_emphasis">
        {label}
      </Typography>
    </GridItem>
    <GridItem size={8}>{children}</GridItem>
  </Grid>
)

const ServerCard = ({ server }: { server: Server }) => (
  <Paper elevation={1} padding="l">
    <Stack gap="s">
      <Stack flexDirection="row" justifyContent="space-between" alignItems="flex-start" gap="xs">
        <Sticker color="informative" size="s">
          {server.gameTitle}
        </Sticker>
        <Button appearance="transparent" size="s" iconOnly aria-label="サーバー名を変更">
          <Icon name="pencil" size="s" />
        </Button>
      </Stack>

      <Typography size="xl" fontWeight="bold" component="h3">
        {server.name}
      </Typography>

      <ServerStatusLabel status={server.status} />

      <Stack gap="xxs">
        <DefinitionRow label="IPアドレス">
          {server.ipAddress ? (
            <Stack flexDirection="row" gap="xxs" alignItems="center">
              <Typography size="s">{server.ipAddress}</Typography>
              <Button appearance="transparent" size="s" iconOnly aria-label="IPアドレスをコピー">
                <Icon name="copy" size="s" />
              </Button>
            </Stack>
          ) : (
            <Typography size="s" color="low_emphasis">
              割り当て中
            </Typography>
          )}
        </DefinitionRow>
        <DefinitionRow label="プラン">
          <Typography size="s">{server.plan}</Typography>
        </DefinitionRow>
      </Stack>

      <Stack flexDirection="row" gap="xs">
        <Button appearance="outlined" size="s" width="full">
          管理画面をひらく
        </Button>
      </Stack>
    </Stack>
  </Paper>
)

// 実アプリは 3px の紫破線ボーダー + 紫 8% 背景。wip-ui の Paper は破線ボーダーを
// 表現できないため outlined で代替している。
const AddServerCard = () => (
  <Paper elevation={0} outlined padding="l">
    <Stack gap="s" alignItems="center" justifyContent="center">
      <Icon name="plus_on_circle" size="l" />
      <Typography size="xl" fontWeight="bold" color="informative">
        サーバーを追加
      </Typography>
    </Stack>
  </Paper>
)

const AppShell = ({ children }: { children: ReactNode }) => (
  <Page>
    <AppBar appearance="white" position="relative">
      <AppBarLeading>
        <Typography size="l" fontWeight="bold">
          GAMERS
        </Typography>
      </AppBarLeading>
      <AppBarTrailing>
        <Stack flexDirection="row" gap="xs" alignItems="center">
          <Button appearance="transparent" size="s" iconOnly aria-label="お知らせ">
            <Icon name="bell" size="m" />
          </Button>
          <Button appearance="transparent" size="s" iconOnly aria-label="アカウントメニュー">
            <Icon name="person" size="m" />
          </Button>
        </Stack>
      </AppBarTrailing>
    </AppBar>
    <Container size="l" component="main">
      {children}
    </Container>
  </Page>
)

const HomeBody = ({ notice }: { notice?: ReactNode }) => (
  <Stack gap="l">
    <Typography size="xxxl" fontWeight="bold" component="h1">
      ホーム
    </Typography>

    {notice}

    <Tabs>
      <TabList>
        <Tab id="servers">
          <Stack flexDirection="row" gap="xxs" alignItems="center">
            <Icon name="node" size="s" />
            サーバー
          </Stack>
        </Tab>
        <Tab id="backups">
          <Stack flexDirection="row" gap="xxs" alignItems="center">
            <Icon name="person" size="s" />
            マイバックアップ
          </Stack>
        </Tab>
      </TabList>

      <TabPanel id="servers">
        <Grid spacing="m">
          {servers.map((s) => (
            <GridItem key={s.id} size={{ xxs: 12, s: 6, m: 4 }}>
              <ServerCard server={s} />
            </GridItem>
          ))}
          <GridItem size={{ xxs: 12, s: 6, m: 4 }}>
            <AddServerCard />
          </GridItem>
        </Grid>
      </TabPanel>

      <TabPanel id="backups">
        <Paper elevation={1} padding="l">
          <Stack gap="s">
            <Stack flexDirection="row" justifyContent="space-between" alignItems="center" gap="s">
              <Typography size="l" fontWeight="bold" component="h2">
                バックアップ
              </Typography>
              <Typography size="xs" color="medium_emphasis">
                6.8 GB / 20 GB 使用中
              </Typography>
            </Stack>
            <Table aria-label="バックアップ一覧">
              <TableHeader>
                <Column>サーバー</Column>
                <Column>作成日時</Column>
                <Column>種別</Column>
                <Column>サイズ</Column>
              </TableHeader>
              <TableBody>
                {backups.map((b) => (
                  <Row key={b.id}>
                    <Cell>
                      <Typography size="s">{b.server}</Typography>
                    </Cell>
                    <Cell>
                      <Typography size="s">{b.createdAt}</Typography>
                    </Cell>
                    <Cell>
                      <Sticker color={b.kind === '自動' ? 'neutral' : 'informative'} size="s">
                        {b.kind}
                      </Sticker>
                    </Cell>
                    <Cell>
                      <Typography size="s">{b.size}</Typography>
                    </Cell>
                  </Row>
                ))}
              </TableBody>
            </Table>
          </Stack>
        </Paper>
      </TabPanel>
    </Tabs>
  </Stack>
)

/**
 * Apollo のホーム。契約中のサーバーをカードで一覧し、バックアップをタブで切り替える。
 * ステータス・ゲームタイトル・プランという Apollo 固有の情報密度を、
 * フレーバー切り替えだけで再現できるかを見るための画面。
 *
 * @summary Apollo のサーバー一覧画面
 */
export const Default: Story = {
  render: () => (
    <AppShell>
      <HomeBody />
    </AppShell>
  ),
}

/**
 * 決済に失敗しているサーバーがある状態。
 * サービス全体に影響する警告をページ先頭で提示する導線の確認用。
 *
 * @summary 決済失敗の警告が出ている状態
 */
export const WithPaymentAlert: Story = {
  render: () => (
    <AppShell>
      <HomeBody
        notice={
          <Callout color="negative">
            お支払いが確認できないサーバーがあります。3 日以内にお支払い方法を更新してください。
          </Callout>
        }
      />
    </AppShell>
  ),
}

/**
 * サーバーを 1 台も契約していない初回ログイン直後の状態。
 * 空の状態でも次の行動が明確になっているかの確認用。
 *
 * @summary サーバー未契約の状態
 */
export const NoServers: Story = {
  render: () => (
    <AppShell>
      <Stack gap="l">
        <Typography size="xxxl" fontWeight="bold" component="h1">
          ホーム
        </Typography>
        <Paper elevation={1} padding="l">
          <Stack gap="m" alignItems="center">
            <Icon name="node" size="l" />
            <Stack gap="xxs" alignItems="center">
              <Typography size="m" component="p">
                契約中のサーバーがありません
              </Typography>
              <Typography size="m" component="p">
                契約してゲームを楽しみましょう！！
              </Typography>
            </Stack>
            <Button color="interactive" size="l" width="full">
              申し込む
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </AppShell>
  ),
}
