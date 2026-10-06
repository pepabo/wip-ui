import { useEffect, useMemo, useState } from 'react'

import { Avatar } from '../../../Avatar'
import { Button } from '../../../Button'
import { Callout } from '../../../Callout'
import { Divider } from '../../../Divider'
import { Grid, GridItem } from '../../../Grid'
import { Icon } from '../../../Icon'
import { Loader } from '../../../Loader'
import { Paper } from '../../../Paper'
import { SnackBar, SnackBarQueue } from '../../../SnackBar'
import { Stack } from '../../../Stack'
import { Sticker } from '../../../Sticker'
import { Switch } from '../../../Switch'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../../Table'
import { Typography } from '../../../Typography'
import { AppShell, avatarSrc, initialAvatar } from './AppShell'
import { Card, DefinitionRow, PageHeader, SectionTitle, StatusSticker } from './parts'
import { PlanSelector, yen } from './plans'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Key, Selection, SortDescriptor } from 'react-aria-components'
import type { ServiceStatus } from './parts'
import type { PlanId } from './plans'

const meta = {
  title: 'Templates/Hosting/Billing',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const queue = new SnackBarQueue()

// ─── データ ───

type Invoice = {
  id: string
  issuedAt: string
  description: string
  amount: number
  status: ServiceStatus
}

const invoices: Invoice[] = [
  {
    id: 'INV-2026-09',
    issuedAt: '2026-09-01',
    description: 'スタンダードプラン 月額',
    amount: 990,
    status: 'paid',
  },
  {
    id: 'INV-2026-08',
    issuedAt: '2026-08-01',
    description: 'スタンダードプラン 月額',
    amount: 990,
    status: 'paid',
  },
  {
    id: 'INV-2026-07',
    issuedAt: '2026-07-01',
    description: 'スタンダードプラン 月額',
    amount: 990,
    status: 'paid',
  },
  {
    id: 'INV-2026-06',
    issuedAt: '2026-06-01',
    description: 'スタンダードプラン 月額 ＋ 独自ドメイン更新',
    amount: 2_490,
    status: 'paid',
  },
  {
    id: 'INV-2026-05',
    issuedAt: '2026-05-01',
    description: 'スタンダードプラン 月額',
    amount: 990,
    status: 'paid',
  },
  {
    id: 'INV-2026-04',
    issuedAt: '2026-04-01',
    description: 'ライトプラン → スタンダードプラン 差額',
    amount: 440,
    status: 'paid',
  },
]

const admins = [
  { name: '山田 太郎', role: '契約者', avatar: avatarSrc },
  { name: '佐藤 花子', role: '管理者', avatar: initialAvatar('佐') },
  { name: '鈴木 一郎', role: '閲覧のみ', avatar: initialAvatar('鈴') },
]

// ─── 部品 ───

const Header = () => (
  <PageHeader
    breadcrumbs={[{ label: 'サーバー概要', href: '#' }, { label: '契約・お支払い' }]}
    title="契約・お支払い"
    description="プランの変更、支払い方法、請求履歴を管理します。"
    actions={
      <Button
        appearance="outlined"
        leading={<Icon name="receipt" size="s" />}
        trailing={<Icon name="launch" size="s" />}
      >
        適格請求書発行事業者情報
      </Button>
    }
  />
)

const PlanCard = ({ expiring = false }: { expiring?: boolean }) => (
  <Card elevation={2}>
    <Stack gap="m">
      <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="m" justifyContent="space-between">
        <Stack gap="xxs">
          <Typography size="s" color="medium_emphasis">
            現在のプラン
          </Typography>
          <Stack flexDirection="row" gap="s" alignItems="center">
            <Typography size="xl" fontWeight="bold" component="h2">
              スタンダードプラン
            </Typography>
            {expiring ? (
              <Sticker color="attention">更新期限が近づいています</Sticker>
            ) : (
              <Sticker color="positive">契約中</Sticker>
            )}
          </Stack>
          <Typography size="xs" color="low_emphasis">
            2024-04-01 に開始 ／ 12 か月契約（自動更新）
          </Typography>
        </Stack>
        <Stack flexDirection="row" gap="s" alignItems="center">
          <Button appearance="outlined" size="l">
            契約内容を確認
          </Button>
          <Button color="interactive" size="l">
            プランを変更
          </Button>
        </Stack>
      </Stack>
      <Divider />
      <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="l">
        <Stack gap="xxs">
          <Typography size="xs" color="medium_emphasis">
            次回請求日
          </Typography>
          <Typography
            fontWeight="bold"
            component="span"
            color={expiring ? 'notice' : 'high_emphasis'}
          >
            2026-10-01
          </Typography>
        </Stack>
        <Divider orientation="vertical" flexItem />
        <Stack gap="xxs">
          <Typography size="xs" color="medium_emphasis">
            次回請求額
          </Typography>
          <Typography fontWeight="bold" component="span">
            {yen(990)}（税込）
          </Typography>
        </Stack>
        <Divider orientation="vertical" flexItem />
        <Stack gap="xxs">
          <Typography size="xs" color="medium_emphasis">
            支払い方法
          </Typography>
          <Typography fontWeight="bold" component="span">
            クレジットカード（**** 4242）
          </Typography>
        </Stack>
        <Divider orientation="vertical" flexItem />
        <Stack gap="xxs">
          <Typography size="xs" color="medium_emphasis">
            契約更新日
          </Typography>
          <Typography fontWeight="bold" component="span">
            2027-03-31
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="m" justifyContent="space-between">
        <Switch label="契約を自動更新する" color="interactive" defaultSelected={!expiring} />
        <Typography size="xs" color="medium_emphasis">
          {expiring
            ? '自動更新が無効です。2027-03-31 を過ぎるとサーバーが停止します。'
            : '更新日の 7 日前に登録済みのカードへ請求します。'}
        </Typography>
      </Stack>
    </Stack>
  </Card>
)

const PlanChange = () => {
  const current: PlanId = 'standard'
  const [selected, setSelected] = useState<PlanId>('business')
  const upgraded = selected === 'business'
  return (
    <Stack gap="l">
      <PageHeader
        breadcrumbs={[
          { label: 'サーバー概要', href: '#' },
          { label: '契約・お支払い', href: '#' },
          { label: 'プラン変更' },
        ]}
        title="プラン変更"
        description="上位プランへの変更は即時反映されます。下位プランへの変更は次回更新日から適用されます。"
      />
      <PlanSelector selected={selected} current={current} onSelect={setSelected} />
      <Card elevation={2}>
        <Stack gap="m">
          <SectionTitle>変更内容</SectionTitle>
          <DefinitionRow term="変更">
            <Stack flexDirection="row" gap="xs" alignItems="center">
              <Typography component="span">スタンダード</Typography>
              <Icon name="arrow_right" size="s" />
              <Typography component="span" fontWeight="bold">
                {selected === 'business' ? 'ビジネス' : 'ライト'}
              </Typography>
              <Sticker color={upgraded ? 'informative' : 'neutral'} size="s">
                {upgraded ? 'アップグレード' : 'ダウングレード'}
              </Sticker>
            </Stack>
          </DefinitionRow>
          <DefinitionRow term="適用日">
            <Typography component="span">
              {upgraded ? '今すぐ' : '2027-03-31（次回更新日）'}
            </Typography>
          </DefinitionRow>
          <DefinitionRow term="差額">
            <Typography component="span">
              {upgraded
                ? `${yen(1_980)} × 残り 6 か月 = ${yen(11_880)}（日割り）`
                : '次回更新時から月額 ¥550'}
            </Typography>
          </DefinitionRow>
          {!upgraded && (
            <Callout color="notice">
              ライトプランのディスク容量は 200 GB です。現在の使用量 12.4 GB
              は収まりますが、サイト数の上限が 1 になるため、blog.example.com と shop.example.net
              は公開停止になります。
            </Callout>
          )}
          <Divider />
          <Stack flexDirection="row" gap="s" justifyContent="flex-end">
            <Button appearance="outlined">キャンセル</Button>
            <Button color="interactive">
              {upgraded ? '今すぐ変更する' : '次回更新日に変更する'}
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  )
}

const PaymentMethodCard = ({ failed = false }: { failed?: boolean }) => (
  <Card>
    <Stack gap="m">
      <SectionTitle
        action={
          <Button appearance="outlined" size="s">
            支払い方法を追加
          </Button>
        }
      >
        支払い方法
      </SectionTitle>
      {failed && (
        <Callout
          color="negative"
          action={
            <Button appearance="outlined" color="negative" size="s">
              カードを更新
            </Button>
          }
        >
          2026-09-01 の請求（{yen(990)}）の決済に失敗しました。9 月 15
          日までに支払い方法を更新しないと、サイトが停止します。
        </Callout>
      )}
      <Stack flexDirection="row" gap="m" alignItems="center" justifyContent="space-between">
        <Stack flexDirection="row" gap="m" alignItems="center">
          <Icon name="bill" size="l" />
          <Stack gap="xxs">
            <Stack flexDirection="row" gap="xs" alignItems="center">
              <Typography fontWeight="bold" component="span">
                Visa **** 4242
              </Typography>
              <Sticker color="neutral" size="s">
                メイン
              </Sticker>
              {failed && <StatusSticker status="error" />}
            </Stack>
            <Typography size="xs" color="medium_emphasis">
              有効期限 {failed ? '08/26（期限切れ）' : '12/28'}
            </Typography>
          </Stack>
        </Stack>
        <Stack flexDirection="row" gap="xxs">
          <Button appearance="transparent" size="s" iconOnly aria-label="カード情報を編集">
            <Icon name="pencil" size="s" />
          </Button>
          <Button appearance="transparent" size="s" iconOnly aria-label="カードを削除" isDisabled>
            <Icon name="garbage_can" size="s" />
          </Button>
        </Stack>
      </Stack>
      <Divider variant="middle" />
      <Typography size="xxs" color="low_emphasis">
        メインの支払い方法は削除できません。別の方法を追加してから切り替えてください。
      </Typography>
    </Stack>
  </Card>
)

const InvoiceTable = ({ loading = false }: { loading?: boolean }) => {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'issuedAt',
    direction: 'descending',
  })
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set<Key>())

  const sorted = useMemo(
    () =>
      [...invoices].sort((a, b) => {
        const column = sortDescriptor.column as keyof Invoice
        const av = a[column]
        const bv = b[column]
        const cmp = av < bv ? -1 : av > bv ? 1 : 0
        return sortDescriptor.direction === 'descending' ? -cmp : cmp
      }),
    [sortDescriptor]
  )
  const selectedCount = selectedKeys === 'all' ? invoices.length : selectedKeys.size

  return (
    <Card>
      <Stack gap="m">
        <SectionTitle
          action={
            <Button
              appearance="outlined"
              size="s"
              leading={<Icon name="download" size="s" />}
              isDisabled={selectedCount === 0}
            >
              {selectedCount > 0
                ? `${selectedCount} 件の領収書をダウンロード`
                : '領収書をまとめてダウンロード'}
            </Button>
          }
        >
          請求履歴
        </SectionTitle>
        {loading ? (
          <Stack alignItems="center">
            <Loader size="l" message="請求履歴を読み込んでいます…" />
          </Stack>
        ) : (
          <Table
            aria-label="請求履歴"
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <TableHeader>
              <Column id="issuedAt" isRowHeader allowsSorting>
                請求日
              </Column>
              <Column id="id">請求番号</Column>
              <Column id="description">内容</Column>
              <Column id="amount" allowsSorting>
                金額（税込）
              </Column>
              <Column id="status">状態</Column>
              <Column id="actions">領収書</Column>
            </TableHeader>
            <TableBody>
              {sorted.map((invoice) => (
                <Row key={invoice.id} id={invoice.id}>
                  <Cell>{invoice.issuedAt}</Cell>
                  <Cell>{invoice.id}</Cell>
                  <Cell>{invoice.description}</Cell>
                  <Cell>{yen(invoice.amount)}</Cell>
                  <Cell>
                    <StatusSticker status={invoice.status} />
                  </Cell>
                  <Cell>
                    <Button
                      appearance="transparent"
                      size="s"
                      trailing={<Icon name="download" size="s" />}
                    >
                      PDF
                    </Button>
                  </Cell>
                </Row>
              ))}
            </TableBody>
          </Table>
        )}
        <Typography size="xxs" color="low_emphasis" density="dense">
          過去 24 か月分の請求を表示しています。それ以前の領収書はサポートまでお問い合わせください。
        </Typography>
      </Stack>
    </Card>
  )
}

const AccountCard = () => (
  <Card>
    <Stack gap="m">
      <SectionTitle>契約者情報</SectionTitle>
      <Stack flexDirection="row" gap="m" alignItems="center">
        <Avatar src={avatarSrc} alt="山田 太郎" size="l" />
        <Stack gap="xxs">
          <Typography size="l" fontWeight="bold" component="span">
            山田 太郎
          </Typography>
          <Typography size="s" color="medium_emphasis">
            taro.yamada@example.com
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      <DefinitionRow term="契約 ID">
        <Typography component="span">hp-0021934</Typography>
      </DefinitionRow>
      <DefinitionRow term="請求先住所">
        <Typography component="span" density="dense">
          〒150-0001 東京都渋谷区神宮前 1-2-3 Example ビル 4F
        </Typography>
      </DefinitionRow>
      <DefinitionRow term="管理者">
        <Stack gap="xs">
          {admins.map((admin) => (
            <Stack key={admin.name} flexDirection="row" gap="xs" alignItems="center">
              <Avatar src={admin.avatar} alt={admin.name} size="xs" />
              <Typography component="span" size="s">
                {admin.name}
              </Typography>
              <Typography component="span" size="xs" color="low_emphasis">
                {admin.role}
              </Typography>
            </Stack>
          ))}
          <Button appearance="transparent" size="s" leading={<Icon name="person_plus" size="s" />}>
            管理者を招待
          </Button>
        </Stack>
      </DefinitionRow>
    </Stack>
  </Card>
)

const InvoiceDetail = () => (
  <Stack gap="l">
    <PageHeader
      breadcrumbs={[
        { label: 'サーバー概要', href: '#' },
        { label: '契約・お支払い', href: '#' },
        { label: '請求履歴', href: '#' },
        { label: 'INV-2026-06' },
      ]}
      title="請求書 INV-2026-06"
      badge={<StatusSticker status="paid" />}
      actions={
        <>
          <Button appearance="outlined" leading={<Icon name="download" size="s" />}>
            領収書 PDF
          </Button>
          <Button appearance="outlined" leading={<Icon name="mail" size="s" />}>
            メールで送る
          </Button>
        </>
      }
    />
    <Grid spacing="l">
      <GridItem size={{ xxs: 12, l: 8 }}>
        <Paper elevation={0} outlined>
          <Card elevation={0} square>
            <Stack flexDirection="row" gap="m" alignItems="center" justifyContent="space-between">
              <Typography size="s" color="medium_emphasis">
                合計（税込）
              </Typography>
              <Typography size="xxxl" fontWeight="bold" component="span">
                {yen(2_490)}
              </Typography>
            </Stack>
          </Card>
          <Card elevation={0}>
            <Stack gap="s">
              <Table aria-label="請求内訳">
                <TableHeader>
                  <Column isRowHeader>項目</Column>
                  <Column>期間</Column>
                  <Column>金額</Column>
                </TableHeader>
                <TableBody>
                  <Row>
                    <Cell>スタンダードプラン 月額</Cell>
                    <Cell>2026-06-01 〜 2026-06-30</Cell>
                    <Cell>{yen(900)}</Cell>
                  </Row>
                  <Row>
                    <Cell>独自ドメイン更新 example.com</Cell>
                    <Cell>2026-06-17 〜 2027-06-16</Cell>
                    <Cell>{yen(1_364)}</Cell>
                  </Row>
                  <Row>
                    <Cell>消費税（10%）</Cell>
                    <Cell>—</Cell>
                    <Cell>{yen(226)}</Cell>
                  </Row>
                </TableBody>
              </Table>
            </Stack>
          </Card>
        </Paper>
      </GridItem>
      <GridItem size={{ xxs: 12, l: 4 }}>
        <Card>
          <Stack gap="s">
            <SectionTitle>支払い情報</SectionTitle>
            <DefinitionRow term="支払日">
              <Typography component="span" color="positive">
                2026-06-01
              </Typography>
            </DefinitionRow>
            <DefinitionRow term="方法">
              <Typography component="span">Visa **** 4242</Typography>
            </DefinitionRow>
            <DefinitionRow term="請求番号">
              <Typography component="span">INV-2026-06</Typography>
            </DefinitionRow>
          </Stack>
        </Card>
      </GridItem>
    </Grid>
  </Stack>
)

const BillingScreen = ({
  failed = false,
  loading = false,
}: {
  failed?: boolean
  loading?: boolean
}) => {
  useEffect(() => {
    if (!failed) return
    const key = queue.add(
      { message: '支払いに失敗しました。カード情報を確認してください。', state: 'negative' },
      { timeout: undefined }
    )
    return () => queue.close(key)
  }, [failed])

  return (
    <AppShell active="billing" appBar="filled">
      <Header />
      <PlanCard expiring={failed} />
      {!loading && (
        <Grid spacing="l">
          <GridItem size={{ xxs: 12, l: 7 }}>
            <PaymentMethodCard failed={failed} />
          </GridItem>
          <GridItem size={{ xxs: 12, l: 5 }}>
            <AccountCard />
          </GridItem>
        </Grid>
      )}
      <InvoiceTable loading={loading} />
      {failed && <SnackBar queue={queue} />}
    </AppShell>
  )
}

// ─── ストーリー ───

/**
 * 契約とお金に関する情報を 1 画面にまとめたページ。
 * AppBar を filled にして、ヘッダーが色面になったときに white ボタンや見出しがどう見えるかを確認する。
 * 請求履歴の Table は行選択とソートが有効で、選択数に応じてボタンの disabled が切り替わる。
 *
 * @summary 契約・支払い方法・請求履歴の一覧
 */
export const Default: Story = {
  render: () => <BillingScreen />,
}

/**
 * カードの期限切れで決済に失敗した状態。
 * ページ内の Callout negative、Sticker attention、SnackBar negative が同時に出たとき、
 * 何を最初に見せるべきかの優先順位を確認する。
 *
 * @summary 決済に失敗している状態
 */
export const PaymentFailed: Story = {
  render: () => <BillingScreen failed />,
}

/**
 * 請求履歴の取得に時間がかかっている状態。
 * message 付きの大きい Loader を面の中央に置いたときの見え方を確認する。
 *
 * @summary 請求履歴を読み込み中
 */
export const Loading: Story = {
  render: () => <BillingScreen loading />,
}

/**
 * 請求 1 件の詳細。4 階層のパンくず、outlined な Paper の中に square な面を重ねた合計欄、
 * 内訳の Table と補足情報の 2 カラムを確認する。
 *
 * @summary 請求書 1 件の詳細
 */
export const InvoiceDetailPage: Story = {
  render: () => (
    <AppShell active="billing" appBar="filled">
      <InvoiceDetail />
    </AppShell>
  ),
}

/**
 * プラン変更。契約中のプランは選べないようにし、選んだプランに応じて適用日・差額・注意が変わる。
 * アップグレードとダウングレードで文言と Sticker の色が切り替わることを確認する。
 *
 * @summary プランの変更
 */
export const PlanChangePage: Story = {
  render: () => (
    <AppShell active="billing" appBar="filled">
      <PlanChange />
    </AppShell>
  ),
}

/**
 * 請求履歴をスマートフォン幅で見た状態。選択とソートのある Table が横スクロールに収まるか、
 * filled な AppBar と 2 カラムのカードが縦に落ちたときの見え方を確認する。
 *
 * @summary スマートフォン幅での契約・お支払い
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'iphone14' } },
  render: () => <BillingScreen />,
}
