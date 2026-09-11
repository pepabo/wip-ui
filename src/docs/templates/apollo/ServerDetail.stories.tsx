import { TabPanel } from 'react-aria-components'

import { AppBar, AppBarLeading, AppBarTrailing } from '../../../AppBar'
import { Breadcrumb, Breadcrumbs } from '../../../Breadcrumbs'
import { Button } from '../../../Button'
import { Callout } from '../../../Callout'
import { Container } from '../../../Container'
import { Divider } from '../../../Divider'
import { Grid, GridItem } from '../../../Grid'
import { Icon } from '../../../Icon'
import { Page } from '../../../Page'
import { Paper } from '../../../Paper'
import { Select, SelectItem } from '../../../Select'
import { Stack } from '../../../Stack'
import { Sticker } from '../../../Sticker'
import { Switch } from '../../../Switch'
import { Tab, TabList, Tabs } from '../../../Tab'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../../Table'
import { Typography } from '../../../Typography'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

const meta = {
  title: 'Templates/Apollo/ServerDetail',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── データ ───

// 実アプリの ServerDetailPaper の項目
const overview = [
  { label: 'IPアドレス', value: '133.130.108.42', copyable: true },
  { label: 'SSH ユーザー名', value: 'admin' },
  { label: 'ゲーム', value: 'Minecraft Java Edition 1.21.4' },
  { label: 'リージョン', value: '東京 (ap-northeast-1)' },
]

const backupRows = [
  { id: 'bk-01', createdAt: '2026-09-03 04:00', size: '1.2 GB', kind: '自動' },
  { id: 'bk-02', createdAt: '2026-09-02 04:00', size: '1.2 GB', kind: '自動' },
  { id: 'bk-03', createdAt: '2026-09-01 21:14', size: '1.1 GB', kind: '手動' },
]

const settings: { label: string; caption: string; on: boolean }[] = [
  { label: '自動バックアップ', caption: '毎日 4:00 に世界データを保存します', on: true },
  { label: 'ホワイトリスト', caption: '許可したユーザーのみ参加できます', on: true },
  { label: 'PVP', caption: 'プレイヤー同士の攻撃を許可します', on: false },
  { label: 'コマンドブロック', caption: 'ワールド内でコマンドブロックを使用できます', on: false },
]

// ─── 部品 ───

const DefinitionRow = ({
  label,
  value,
  copyable,
}: {
  label: string
  value: string
  copyable?: boolean
}) => (
  <Grid spacing="xs" alignContent="center">
    <GridItem size={{ xxs: 12, m: 4 }}>
      <Typography size="s" color="medium_emphasis">
        {label}
      </Typography>
    </GridItem>
    <GridItem size={{ xxs: 12, m: 8 }}>
      <Stack flexDirection="row" gap="xxs" alignItems="center">
        <Typography size="s">{value}</Typography>
        {copyable && (
          <Button appearance="transparent" size="s" iconOnly aria-label={`${label}をコピー`}>
            <Icon name="copy" size="s" />
          </Button>
        )}
      </Stack>
    </GridItem>
  </Grid>
)

const SectionCard = ({
  title,
  action,
  children,
}: {
  title: string
  action?: ReactNode
  children: ReactNode
}) => (
  <Paper elevation={1} padding="l">
    <Stack gap="m">
      <Stack flexDirection="row" justifyContent="space-between" alignItems="center" gap="s">
        <Typography size="l" fontWeight="bold" component="h2">
          {title}
        </Typography>
        {action}
      </Stack>
      <Divider />
      {children}
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

const ServerHeader = ({ running, notice }: { running: boolean; notice?: ReactNode }) => (
  <Stack gap="m">
    <Breadcrumbs>
      <Breadcrumb href="/">マイサーバー</Breadcrumb>
      <Breadcrumb>ぺぱぼサバイバル</Breadcrumb>
    </Breadcrumbs>

    <Stack flexDirection="row" justifyContent="space-between" alignItems="flex-start" gap="m">
      <Stack gap="xs">
        <Sticker color="informative" size="s">
          Minecraft Java Edition
        </Sticker>
        <Typography size="xxl" fontWeight="bold" component="h1">
          ぺぱぼサバイバル
        </Typography>
        {/* Icon には意味づけされた color prop がないため Typography で包んで継承させる */}
        <Typography size="s" color={running ? 'positive' : 'medium_emphasis'} component="div">
          <Stack flexDirection="row" gap="xxs" alignItems="center">
            <Icon name={running ? 'bullet_circle' : 'circle'} size="s" />
            {running ? '起動中 ・ 稼働 12日 4時間' : '停止中'}
          </Stack>
        </Typography>
      </Stack>

      <Stack flexDirection="row" gap="xs">
        {running ? (
          <Button appearance="outlined" size="m">
            停止する
          </Button>
        ) : (
          <Button color="interactive" size="m">
            起動する
          </Button>
        )}
        <Button appearance="outlined" size="m" iconOnly aria-label="その他の操作">
          <Icon name="ellipsis_horizontal" size="s" />
        </Button>
      </Stack>
    </Stack>

    {notice}
  </Stack>
)

const ServerBody = ({ running, notice }: { running: boolean; notice?: ReactNode }) => (
  <Stack gap="l">
    <ServerHeader running={running} notice={notice} />

    <Tabs>
      <TabList>
        <Tab id="detail">詳細</Tab>
        <Tab id="game">ゲーム設定</Tab>
        <Tab id="files">ファイル管理</Tab>
      </TabList>

      <TabPanel id="detail">
        <Grid spacing="m">
          <GridItem size={{ xxs: 12, m: 7 }}>
            <SectionCard title="詳細情報">
              <Stack gap="xs">
                {overview.map((row) => (
                  <DefinitionRow key={row.label} {...row} />
                ))}
              </Stack>
            </SectionCard>
          </GridItem>
          <GridItem size={{ xxs: 12, m: 5 }}>
            <SectionCard title="サーバーステータス">
              <Stack gap="s">
                {[
                  { label: 'CPU', value: '18 %' },
                  { label: 'メモリ', value: '2.4 / 4.0 GB' },
                  { label: 'ディスク', value: '12 / 50 GB' },
                ].map((m) => (
                  <Stack
                    key={m.label}
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    gap="s"
                  >
                    <Typography size="s" color="medium_emphasis">
                      {m.label}
                    </Typography>
                    <Typography size="s">{m.value}</Typography>
                  </Stack>
                ))}
              </Stack>
            </SectionCard>
          </GridItem>
        </Grid>
      </TabPanel>

      <TabPanel id="game">
        <SectionCard
          title="バックアップ"
          action={
            <Button appearance="outlined" size="s" leading={<Icon name="plus" size="s" />}>
              今すぐ作成
            </Button>
          }
        >
          <Table aria-label="バックアップ一覧">
            <TableHeader>
              <Column>作成日時</Column>
              <Column>種別</Column>
              <Column>サイズ</Column>
              <Column>操作</Column>
            </TableHeader>
            <TableBody>
              {backupRows.map((b) => (
                <Row key={b.id}>
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
                  <Cell>
                    <Button appearance="transparent" size="s">
                      復元
                    </Button>
                  </Cell>
                </Row>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </TabPanel>

      <TabPanel id="files">
        <Stack gap="m">
          <SectionCard title="ワールド設定">
            <Stack gap="m">
              <Grid spacing="m">
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <Select label="難易度" defaultSelectedKey="normal" width="full" size="m">
                    <SelectItem id="peaceful">ピースフル</SelectItem>
                    <SelectItem id="easy">イージー</SelectItem>
                    <SelectItem id="normal">ノーマル</SelectItem>
                    <SelectItem id="hard">ハード</SelectItem>
                  </Select>
                </GridItem>
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <Select label="ゲームモード" defaultSelectedKey="survival" width="full" size="m">
                    <SelectItem id="survival">サバイバル</SelectItem>
                    <SelectItem id="creative">クリエイティブ</SelectItem>
                    <SelectItem id="adventure">アドベンチャー</SelectItem>
                  </Select>
                </GridItem>
              </Grid>
              <Divider />
              <Stack gap="m">
                {settings.map((s) => (
                  <Stack
                    key={s.label}
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    gap="m"
                  >
                    <Stack gap="xxs">
                      <Typography size="s" fontWeight="bold">
                        {s.label}
                      </Typography>
                      <Typography size="xs" color="medium_emphasis">
                        {s.caption}
                      </Typography>
                    </Stack>
                    <Switch
                      color="interactive"
                      size="m"
                      defaultSelected={s.on}
                      aria-label={s.label}
                    />
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </SectionCard>

          <SectionCard title="サーバーの再作成">
            <Stack gap="m" alignItems="flex-start">
              <Typography size="s" color="medium_emphasis">
                再作成するとワールドデータは初期化されます。バックアップからの復元をおすすめします。
              </Typography>
              <Button appearance="outlined" color="negative" size="m">
                サーバーを再作成する
              </Button>
            </Stack>
          </SectionCard>
        </Stack>
      </TabPanel>
    </Tabs>
  </Stack>
)

/**
 * Apollo のサーバー詳細。
 *
 * 実アプリはサイドバー（サーバー / バックアップ / 支払い）とページ内タブの二重構造だが、
 * wip-ui に SideNavigation コンポーネントが無く inline style なしでは組めないため、
 * ここではページ内タブのみを再現している。
 * トークンと adapter アクセサ（get-side-navigation-width / -border-color）は既に存在する。
 *
 * 起動中のサーバーの情報・バックアップ・設定を 3 タブで扱う。
 * 情報の密度が最も高い画面なので、ダークな面の上での可読性と階層表現の検証に使う。
 *
 * @summary Apollo のサーバー詳細画面（起動中）
 */
export const Default: Story = {
  render: () => (
    <AppShell>
      <ServerBody running />
    </AppShell>
  ),
}

/**
 * 停止中のサーバー。主要導線が「停止する」から「起動する」に入れ替わる。
 * 状態によって主ボタンの色が変わることの確認用。
 *
 * @summary サーバーが停止している状態
 */
export const Stopped: Story = {
  render: () => (
    <AppShell>
      <ServerBody running={false} />
    </AppShell>
  ),
}

/**
 * バージョンアップが利用可能な状態。
 * 情報量の多いヘッダーの直下に通知を挟んでも破綻しないかの確認用。
 *
 * @summary 更新のお知らせが出ている状態
 */
export const UpdateAvailable: Story = {
  render: () => (
    <AppShell>
      <ServerBody
        running
        notice={
          <Callout color="informative">
            Minecraft 1.21.5 が利用可能です。更新前に自動でバックアップを作成します。
          </Callout>
        }
      />
    </AppShell>
  ),
}
