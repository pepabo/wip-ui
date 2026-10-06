import { TabPanel } from 'react-aria-components'

import { Button } from '../../../Button'
import { Callout } from '../../../Callout'
import { Grid, GridItem } from '../../../Grid'
import { Icon } from '../../../Icon'
import { Loader } from '../../../Loader'
import { Stack } from '../../../Stack'
import { Sticker } from '../../../Sticker'
import { Tab, TabList, Tabs } from '../../../Tab'
import { Typography } from '../../../Typography'
import { AppShell } from './AppShell'
import { Card, PageHeader, SectionTitle } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import type { IconName } from '../../../Icon'
import type { TypographyColor } from '../../../Typography'

const meta = {
  title: 'Templates/Hosting/Home',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── データ ───

type ContractStatus = 'running' | 'stopped' | 'starting' | 'payment_failed' | 'trial'

const statusPresentation: Record<
  ContractStatus,
  { label: string; text: TypographyColor; icon?: IconName; loading?: boolean }
> = {
  running: { label: '稼働中', text: 'positive', icon: 'bullet_circle' },
  stopped: { label: '停止中', text: 'medium_emphasis', icon: 'circle' },
  starting: { label: '起動処理中', text: 'medium_emphasis', loading: true },
  payment_failed: { label: '決済失敗', text: 'negative', icon: 'exclamation_on_triangle' },
  trial: { label: 'お試し期間', text: 'notice', icon: 'clock' },
}

type Contract = {
  id: string
  name: string
  service: 'レンタルサーバー' | 'for Gamers'
  plan: string
  status: ContractStatus
  detail: string
  renewAt: string
}

const contracts: Contract[] = [
  {
    id: 'hp-0021934',
    name: 'example.com',
    service: 'レンタルサーバー',
    plan: 'スタンダード',
    status: 'running',
    detail: 'web12.hosting.example ／ 3 ドメイン',
    renewAt: '2027-03-31',
  },
  {
    id: 'gs-8f21',
    name: 'みんなのサバイバル',
    service: 'for Gamers',
    plan: '8 GB',
    status: 'running',
    detail: 'Minecraft Java Edition 1.21 ／ 133.130.108.42',
    renewAt: '2026-10-01',
  },
  {
    id: 'gs-9a02',
    name: '週末パルワールド',
    service: 'for Gamers',
    plan: '16 GB',
    status: 'stopped',
    detail: 'Palworld ／ 最終起動 2026-09-13',
    renewAt: '2026-10-01',
  },
  {
    id: 'gs-b7c3',
    name: 'ARK 検証用',
    service: 'for Gamers',
    plan: '4 GB',
    status: 'payment_failed',
    detail: 'ARK: Survival Ascended ／ 9 月分の決済に失敗',
    renewAt: '2026-09-01',
  },
  {
    id: 'hp-0031102',
    name: 'portfolio.example.net',
    service: 'レンタルサーバー',
    plan: 'ライト',
    status: 'trial',
    detail: 'お試し期間 残り 6 日',
    renewAt: '2026-09-30',
  },
]

const byService = {
  all: contracts,
  hosting: contracts.filter((c) => c.service === 'レンタルサーバー'),
  gamers: contracts.filter((c) => c.service === 'for Gamers'),
}

// ─── 部品 ───

const ContractCard = ({ contract }: { contract: Contract }) => {
  const s = statusPresentation[contract.status]
  return (
    <Card>
      <Stack gap="m">
        <Stack flexDirection="row" gap="s" alignItems="flex-start" justifyContent="space-between">
          <Stack gap="xxs">
            <Sticker color="neutral" size="s">
              {contract.service}
            </Sticker>
            <Typography size="l" fontWeight="bold" component="h3">
              {contract.name}
            </Typography>
          </Stack>
          <Button
            appearance="transparent"
            size="s"
            iconOnly
            aria-label={`${contract.name} のメニュー`}
          >
            <Icon name="ellipsis_vertical" size="s" />
          </Button>
        </Stack>
        <Stack flexDirection="row" gap="xs" alignItems="center">
          {s.loading ? <Loader size="s" /> : s.icon && <Icon name={s.icon} size="s" />}
          <Typography component="span" size="s" color={s.text} fontWeight="bold">
            {s.label}
          </Typography>
          <Typography component="span" size="xs" color="low_emphasis">
            ・ {contract.plan} プラン
          </Typography>
        </Stack>
        <Typography size="xs" color="medium_emphasis" density="dense">
          {contract.detail}
        </Typography>
        <Stack flexDirection="row" gap="s" alignItems="center" justifyContent="space-between">
          <Typography size="xxs" color="low_emphasis" component="span">
            次回更新 {contract.renewAt}
          </Typography>
          {contract.status === 'payment_failed' ? (
            <Button color="negative" size="s">
              支払い方法を更新
            </Button>
          ) : contract.status === 'stopped' ? (
            <Button color="interactive" size="s" leading={<Icon name="arrow_right" size="s" />}>
              起動する
            </Button>
          ) : (
            <Button
              appearance="outlined"
              size="s"
              trailing={<Icon name="chevron_right" size="s" />}
            >
              管理画面へ
            </Button>
          )}
        </Stack>
      </Stack>
    </Card>
  )
}

const AddCard = () => (
  <Card outlined elevation={0}>
    <Stack gap="m" alignItems="center" justifyContent="center">
      <Icon name="plus_on_circle" size="l" />
      <Stack gap="xxs" alignItems="center">
        <Typography fontWeight="bold">サービスを追加</Typography>
        <Typography size="xs" color="medium_emphasis">
          レンタルサーバーやゲームサーバーを新しく契約します
        </Typography>
      </Stack>
      <Button color="interactive" appearance="outlined" size="s">
        申し込む
      </Button>
    </Stack>
  </Card>
)

const ContractGrid = ({ items }: { items: Contract[] }) => (
  <Grid spacing="m">
    {items.map((contract) => (
      <GridItem key={contract.id} size={{ xxs: 12, s: 6, l: 4 }}>
        <ContractCard contract={contract} />
      </GridItem>
    ))}
    <GridItem size={{ xxs: 12, s: 6, l: 4 }}>
      <AddCard />
    </GridItem>
  </Grid>
)

const Header = () => (
  <PageHeader
    breadcrumbs={[{ label: 'ホーム' }]}
    title="ホーム"
    description="契約中のサービスをまとめて確認できます。"
    actions={
      <Button color="interactive" leading={<Icon name="plus" size="s" />}>
        サービスを追加
      </Button>
    }
  />
)

const tabs: { id: keyof typeof byService; label: string; icon: IconName }[] = [
  { id: 'all', label: `すべて（${byService.all.length}）`, icon: 'multi_pane' },
  { id: 'hosting', label: 'レンタルサーバー', icon: 'node' },
  { id: 'gamers', label: 'for Gamers', icon: 'people' },
]

const HomeScreen = ({ alert }: { alert?: ReactNode }) => (
  <AppShell active="home">
    <Header />
    {alert}
    <Tabs>
      <TabList aria-label="サービスの絞り込み">
        {tabs.map((tab) => (
          <Tab key={tab.id} id={tab.id}>
            <Stack flexDirection="row" gap="xxs" alignItems="center">
              <Icon name={tab.icon} size="s" />
              {tab.label}
            </Stack>
          </Tab>
        ))}
      </TabList>
      {tabs.map((tab) => (
        <TabPanel key={tab.id} id={tab.id}>
          <ContractGrid items={byService[tab.id]} />
        </TabPanel>
      ))}
    </Tabs>
  </AppShell>
)

// ─── ストーリー ───

/**
 * ログイン直後のホーム。1 アカウントで複数サービス・複数契約を持つ前提で、カードのグリッドに並べる。
 * 稼働・停止・起動中・決済失敗・お試しの 5 状態が同じカード形で並んだときの見分けやすさを確認する。
 *
 * @summary 契約中のサービス一覧
 */
export const Default: Story = {
  render: () => <HomeScreen />,
}

/**
 * 決済に失敗した契約があるときは、一覧の上に Callout を出して一番に気づかせる。
 * カード側の negative ボタンと Callout の negative が二重になるので、強さの配分を確認する。
 *
 * @summary 決済失敗の契約がある状態
 */
export const WithPaymentAlert: Story = {
  render: () => (
    <HomeScreen
      alert={
        <Callout
          color="negative"
          action={
            <Button appearance="outlined" color="negative" size="s">
              支払い方法を更新
            </Button>
          }
        >
          「ARK 検証用」の 9 月分の決済に失敗しました。9 月 30
          日までに支払い方法を更新しないと、サーバーが削除されます。
        </Callout>
      }
    />
  ),
}

/**
 * 契約が 1 つも無い、登録直後の状態。空のグリッドではなく、最初の申し込みだけを大きく見せる。
 *
 * @summary 契約が無い空状態
 */
export const Empty: Story = {
  render: () => (
    <AppShell active="home">
      <Header />
      <Card outlined elevation={0}>
        <Stack gap="l" alignItems="center">
          <Icon name="pepapon" size="l" />
          <Stack gap="xxs" alignItems="center">
            <SectionTitle>まだ契約しているサービスがありません</SectionTitle>
            <Typography size="s" color="medium_emphasis">
              レンタルサーバーは 10 日間、ゲームサーバーは 3 日間、無料でお試しできます。
            </Typography>
          </Stack>
          <Grid spacing="m" justifyContent="center">
            <GridItem size={{ xxs: 12, m: 5 }} offset={{ m: 1 }}>
              <Card>
                <Stack gap="s">
                  <Icon name="node" size="m" />
                  <Typography fontWeight="bold">レンタルサーバー</Typography>
                  <Typography size="xs" color="medium_emphasis">
                    WordPress やホームページの公開に。月額 550 円から。
                  </Typography>
                  <Button appearance="outlined" width="full">
                    プランを見る
                  </Button>
                </Stack>
              </Card>
            </GridItem>
            <GridItem size={{ xxs: 12, m: 5 }}>
              <Card>
                <Stack gap="s">
                  <Icon name="people" size="m" />
                  <Typography fontWeight="bold">for Gamers</Typography>
                  <Typography size="xs" color="medium_emphasis">
                    Minecraft などのマルチプレイ用サーバーを 1 分で。
                  </Typography>
                  <Button appearance="outlined" width="full">
                    ゲームを選ぶ
                  </Button>
                </Stack>
              </Card>
            </GridItem>
          </Grid>
        </Stack>
      </Card>
    </AppShell>
  ),
}

/**
 * 契約一覧をスマートフォン幅で見た状態。カードが 1 カラムに落ちたときの余白と、
 * AppBar 右側のボタンが並びきるかを確認する。
 * サイドナビが全幅ボタン 7 個として縦に積まれる問題（GAP-14）もここで見える。
 *
 * @summary スマートフォン幅での契約一覧
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'iphone14' } },
  render: () => <HomeScreen />,
}
