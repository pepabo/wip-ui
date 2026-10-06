import { useState } from 'react'
import { TabPanel } from 'react-aria-components'

import { AppBar, AppBarLeading, AppBarTrailing } from '../../../AppBar'
import { Breadcrumb, Breadcrumbs } from '../../../Breadcrumbs'
import { Button } from '../../../Button'
import { Callout } from '../../../Callout'
import { Checkbox } from '../../../Checkbox'
import { Container } from '../../../Container'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../Dialog'
import { Divider } from '../../../Divider'
import { Grid, GridItem } from '../../../Grid'
import { Icon } from '../../../Icon'
import { Paper } from '../../../Paper'
import { Select, SelectItem } from '../../../Select'
import { SnackBar, SnackBarQueue } from '../../../SnackBar'
import { Stack } from '../../../Stack'
import { Sticker } from '../../../Sticker'
import { Tab, TabList, Tabs } from '../../../Tab'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../../Table'
import { TextField } from '../../../TextField'
import { Typography } from '../../../Typography'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import type { IconName } from '../../../Icon'

/**
 * ロリポップ！ユーザー専用ページ（lolipop-user の ?mode=* 側）の再現。
 * 共通ダッシュボードとは別レイアウトで、6 カテゴリのサイドメニューを持つ。
 */

const meta = {
  title: 'Templates/Lolipop/UserPanel',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const queue = new SnackBarQueue()

// GAP-1 の回避策（Paper に padding が無い）
const insetStyle = { padding: 24 }
const Card = ({ children, outlined = false }: { children: ReactNode; outlined?: boolean }) => (
  <Paper elevation={outlined ? 0 : 1} outlined={outlined}>
    <div style={insetStyle}>{children}</div>
  </Paper>
)

// ─── データ ───

type Domain = { name: string; folder: string; ssl: 'enabled' | 'disabled' | 'working' }

const initialDomains: Domain[] = [
  { name: 'example.com', folder: '/example.com', ssl: 'enabled' },
  { name: 'blog.example.com', folder: '/blog', ssl: 'enabled' },
  { name: 'shop.example.net', folder: '/shop', ssl: 'disabled' },
  { name: 'user-0021934.lolipop.jp', folder: '/', ssl: 'working' },
]

const sslLabel: Record<
  Domain['ssl'],
  { label: string; color: 'positive' | 'negative' | 'notice' }
> = {
  enabled: { label: 'SSL保護有効', color: 'positive' },
  disabled: { label: 'SSL保護無効', color: 'negative' },
  working: { label: 'SSL設定作業中', color: 'notice' },
}

const contracts = [
  {
    term: '12ヶ月',
    start: '2026/04/01',
    end: '2027/03/31',
    amount: '¥ 11,880',
    due: '2026/03/25',
    state: '入金確認済み',
  },
  {
    term: '12ヶ月',
    start: '2025/04/01',
    end: '2026/03/31',
    amount: '¥ 11,880',
    due: '2025/03/25',
    state: '入金確認済み',
  },
]

const mailAccounts = [
  { address: 'info@example.com', usage: '1.8 GB', count: '12,402 件' },
  { address: 'support@example.com', usage: '0.6 GB', count: '3,118 件' },
  { address: 'sales@example.com', usage: '0.3 GB', count: '940 件' },
]

const databases = [
  {
    server: 'mysql301.phy.lolipop.lan',
    name: 'LAA0021934-wp',
    version: 'MySQL 8.0',
    user: 'LAA0021934',
  },
  {
    server: 'mysql301.phy.lolipop.lan',
    name: 'LAA0021934-shop',
    version: 'MySQL 8.0',
    user: 'LAA0021934',
  },
]

// ─── サイドメニュー ───

type Mode =
  | 'domain'
  | 'domain-register'
  | 'domain-complete'
  | 'ssl'
  | 'disk'
  | 'mysql'
  | 'mail-address'
  | 'contract'

type NavGroup = { label: string; icon: IconName; items: { id: Mode; label: string }[] }

const navGroups: NavGroup[] = [
  {
    label: 'サーバーの管理・設定',
    icon: 'node',
    items: [
      { id: 'domain', label: '独自ドメイン設定' },
      { id: 'disk', label: 'ディスク使用量' },
      { id: 'mysql', label: 'データベース' },
    ],
  },
  { label: 'セキュリティ', icon: 'lock', items: [{ id: 'ssl', label: '独自SSL証明書導入' }] },
  { label: 'メール', icon: 'mail', items: [{ id: 'mail-address', label: 'メール設定' }] },
  {
    label: '契約・お支払い',
    icon: 'bill',
    items: [{ id: 'contract', label: 'サーバー契約・お支払い' }],
  },
]

const SideMenu = ({ mode, onNavigate }: { mode: Mode; onNavigate: (m: Mode) => void }) => (
  // GAP-14: SideNavigation が無いのでボタンを縦に積んでいる。実アプリは 6 カテゴリの開閉メニュー
  <nav aria-label="メインメニュー">
    <Stack gap="m">
      {navGroups.map((g) => (
        <Stack key={g.label} gap="xxs">
          <Stack flexDirection="row" gap="xs" alignItems="center">
            <Icon name={g.icon} size="s" />
            <Typography size="xs" color="low_emphasis" component="span">
              {g.label}
            </Typography>
          </Stack>
          {g.items.map((item) => (
            <Button
              key={item.id}
              appearance={
                mode === item.id || (item.id === 'domain' && mode.startsWith('domain'))
                  ? 'flat'
                  : 'transparent'
              }
              width="full"
              size="s"
              onPress={() => onNavigate(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
      ))}
    </Stack>
  </nav>
)

// ─── ヘッダー ───

const Header = () => (
  <Stack gap="xs">
    <Paper elevation={0} square>
      <div style={{ padding: 12 }}>
        <Container size="xl">
          <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="m" justifyContent="space-between">
            <Stack flexDirection="row" gap="m" alignItems="center">
              <Sticker color="neutral" size="s">
                アカウントラベルをつける
              </Sticker>
              <Typography size="s" component="span">
                山田 太郎（LAA0021934 / 301）
              </Typography>
              <Typography size="xs" color="medium_emphasis" component="span">
                ロリポップ！のドメイン: user-0021934.lolipop.jp
              </Typography>
            </Stack>
            <Button appearance="outlined" size="s">
              アカウント切替
            </Button>
          </Stack>
        </Container>
      </div>
    </Paper>
    <AppBar appearance="white" position="relative">
      <AppBarLeading>
        <Stack flexDirection="row" gap="s" alignItems="center">
          <Icon name="pepapon" size="m" />
          <Typography size="l" fontWeight="bold" component="span">
            ロリポップ！レンタルサーバー
          </Typography>
        </Stack>
      </AppBarLeading>
      <AppBarTrailing>
        <Stack flexDirection="row" gap="xs" alignItems="center">
          <Button appearance="transparent" size="s">
            ホーム
          </Button>
          <Button appearance="transparent" size="s">
            ログイン履歴
          </Button>
          <Button appearance="transparent" size="s">
            ログアウト
          </Button>
        </Stack>
      </AppBarTrailing>
    </AppBar>
  </Stack>
)

// ─── 独自ドメイン ───

const DomainList = ({
  domains,
  onRegister,
  onEdit,
  onRemove,
}: {
  domains: Domain[]
  onRegister: () => void
  onEdit: (name: string) => void
  onRemove: (names: string[]) => void
}) => {
  const [selected, setSelected] = useState<string[]>([])
  return (
    <Stack gap="l">
      <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="m" justifyContent="space-between">
        <Typography size="xxl" fontWeight="bold" component="h1">
          独自ドメイン設定
        </Typography>
        <Stack flexDirection="row" gap="s">
          <Button
            appearance="outlined"
            color="negative"
            isDisabled={selected.length === 0}
            onPress={() => {
              onRemove(selected)
              setSelected([])
              queue.add({ message: '処理は正常に完了しました。', state: 'neutral' })
            }}
          >
            ドメイン解除
          </Button>
          <Button color="interactive" onPress={onRegister}>
            独自ドメイン設定
          </Button>
        </Stack>
      </Stack>

      <Callout color="informative">
        ドメインは 100 まで設定可能です。設定したドメインでサイトを閲覧できるようになるまで、設定後
        １時間 ほどかかる場合がございます。
      </Callout>

      <Stack flexDirection="row" gap="m" alignItems="center" justifyContent="space-between">
        <Typography size="s" color="medium_emphasis">
          全{domains.length}件中 {domains.length}件を表示
        </Typography>
        <Select aria-label="表示件数" size="s" defaultSelectedKey="20">
          <SelectItem id="20">20件表示</SelectItem>
          <SelectItem id="50">50件表示</SelectItem>
          <SelectItem id="100">100件表示</SelectItem>
        </Select>
      </Stack>

      <Stack gap="s">
        {domains.map((d) => (
          <Card key={d.name} outlined>
            <Grid spacing="s" alignContent="center">
              <GridItem size={{ xxs: 12, m: 7 }}>
                <Stack flexDirection="row" gap="s" alignItems="center">
                  {/* GAP: Checkbox が children 必須でラベル無しにできない。空文字を渡して回避している */}
                  <Checkbox
                    aria-label={`${d.name} を選択`}
                    isSelected={selected.includes(d.name)}
                    onChange={(v) =>
                      setSelected((prev) =>
                        v ? [...prev, d.name] : prev.filter((x) => x !== d.name)
                      )
                    }
                  >
                    {''}
                  </Checkbox>
                  <Stack gap="xxs">
                    <Stack flexDirection="row" gap="xs" alignItems="center">
                      {/* GAP: Typography に interactive（リンク）色が無い */}
                      <Typography color="informative" component="span">
                        http://{d.name}/
                      </Typography>
                      <Icon name="launch" size="s" />
                    </Stack>
                    <Typography size="xs" color="medium_emphasis">
                      公開（アップロード）フォルダ: {d.folder}
                    </Typography>
                  </Stack>
                </Stack>
              </GridItem>
              <GridItem size={{ xxs: 6, m: 3 }}>
                <Sticker color={sslLabel[d.ssl].color} size="s">
                  {sslLabel[d.ssl].label}
                </Sticker>
              </GridItem>
              <GridItem size={{ xxs: 6, m: 2 }}>
                <Stack flexDirection="row" justifyContent="flex-end">
                  <Button appearance="outlined" size="s" onPress={() => onEdit(d.name)}>
                    設定変更
                  </Button>
                </Stack>
              </GridItem>
            </Grid>
          </Card>
        ))}
      </Stack>

      {/* GAP-16: Pagination が無いのでボタンで代用 */}
      <Stack flexDirection="row" gap="s" justifyContent="center">
        <Button appearance="transparent" size="s" isDisabled>
          « 前の一覧
        </Button>
        <Button appearance="transparent" size="s" isDisabled>
          次の一覧 »
        </Button>
      </Stack>
    </Stack>
  )
}

const DomainRegister = ({
  onBack,
  onDone,
}: {
  onBack: () => void
  onDone: (name: string) => void
}) => {
  const [name, setName] = useState('')
  const [checked, setChecked] = useState(false)
  return (
    <Stack gap="l">
      <Breadcrumbs>
        <Breadcrumb href="#" onPress={onBack}>
          独自ドメイン設定
        </Breadcrumb>
        <Breadcrumb>新規登録</Breadcrumb>
      </Breadcrumbs>
      <Typography size="xxl" fontWeight="bold" component="h1">
        独自ドメイン設定
      </Typography>
      <Typography size="s" color="medium_emphasis">
        独自ドメインを新規に設定できます。独自ドメインをお持ちでない方は「ムームードメイン」から取得できます。
      </Typography>

      <Card>
        <Stack gap="m">
          <Stack gap="xs">
            <Typography size="s" fontWeight="bold">
              設定する独自ドメイン
            </Typography>
            <Stack flexDirection="row" gap="xs" alignItems="center">
              <Typography size="s" color="medium_emphasis" component="span">
                http://
              </Typography>
              <TextField
                aria-label="設定する独自ドメイン"
                placeholder="example.com"
                width="half"
                value={name}
                onChange={(v) => {
                  setName(v)
                  setChecked(false)
                }}
              />
              <Typography size="s" color="medium_emphasis" component="span">
                /
              </Typography>
            </Stack>
          </Stack>
          <Divider />
          <TextField
            label="公開 (アップロード) フォルダ"
            caption="指定したフォルダ内のデータが http://独自ドメイン/ にアクセスした際に表示されます。"
            width="half"
          />
          <Checkbox defaultSelected>ロリポップ！アクセラレータを利用する</Checkbox>

          {!checked ? (
            <Stack flexDirection="row" gap="s" justifyContent="flex-end">
              <Button appearance="outlined" onPress={onBack}>
                戻る
              </Button>
              <Button color="interactive" isDisabled={!name} onPress={() => setChecked(true)}>
                独自ドメインをチェックする
              </Button>
            </Stack>
          ) : (
            <Stack gap="m">
              <Callout color="positive">
                下記のドメインで設定を行います。間違いなければ、設定ボタンをクリックしてください。
              </Callout>
              <Typography fontWeight="bold" component="span">
                http://{name}/
              </Typography>
              <Stack flexDirection="row" gap="s" justifyContent="flex-end">
                <Button appearance="outlined" onPress={() => setChecked(false)}>
                  戻る
                </Button>
                <Button color="interactive" onPress={() => onDone(name)}>
                  設定
                </Button>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Card>
    </Stack>
  )
}

const DomainComplete = ({
  name,
  onSsl,
  onMail,
  onList,
}: {
  name: string
  onSsl: () => void
  onMail: () => void
  onList: () => void
}) => (
  <Stack gap="l">
    <Card>
      <Stack gap="m" alignItems="center">
        <Icon name="check_on_circle" size="l" />
        <Typography size="xxl" fontWeight="bold" component="h1">
          独自ドメイン設定ができました
        </Typography>
        <Typography size="s" color="medium_emphasis">
          http://{name}/ の登録が完了しました。
        </Typography>
        <Typography size="xs" color="low_emphasis">
          独自ドメインの設定が反映するまで最大１時間程度かかる場合がございます。
        </Typography>
      </Stack>
    </Card>
    <Grid spacing="m">
      <GridItem size={{ xxs: 12, m: 6 }}>
        <Card outlined>
          <Stack gap="s">
            <Icon name="lock" size="m" />
            <Typography fontWeight="bold">設定した独自ドメインをSSLで暗号化できます</Typography>
            <Button appearance="outlined" width="full" onPress={onSsl}>
              独自SSL設定ページを見てみる
            </Button>
          </Stack>
        </Card>
      </GridItem>
      <GridItem size={{ xxs: 12, m: 6 }}>
        <Card outlined>
          <Stack gap="s">
            <Icon name="mail" size="m" />
            <Typography fontWeight="bold">
              設定した独自ドメインのメールアドレスが作成できます
            </Typography>
            <Button appearance="outlined" width="full" onPress={onMail}>
              メール設定ページを見てみる
            </Button>
          </Stack>
        </Card>
      </GridItem>
    </Grid>
    <Stack flexDirection="row" justifyContent="center">
      <Button appearance="transparent" onPress={onList}>
        独自ドメイン設定の一覧へ
      </Button>
    </Stack>
  </Stack>
)

// ─── 独自SSL ───

const SslScreen = ({
  domains,
  onIssue,
}: {
  domains: Domain[]
  onIssue: (name: string) => void
}) => {
  const table = (list: Domain[]) => (
    <Stack gap="s">
      {list.length === 0 ? (
        <Typography size="s" color="medium_emphasis">
          該当するドメインはありません。
        </Typography>
      ) : (
        list.map((d) => (
          <Card key={d.name} outlined>
            <Stack flexDirection="row" gap="m" alignItems="center" justifyContent="space-between">
              <Stack gap="xxs">
                <Typography component="span">{d.name}</Typography>
                <Sticker color={sslLabel[d.ssl].color} size="s">
                  {sslLabel[d.ssl].label}
                </Sticker>
              </Stack>
              {d.ssl === 'disabled' ? (
                <Button color="interactive" size="s" onPress={() => onIssue(d.name)}>
                  独自SSL（無料）を設定する
                </Button>
              ) : d.ssl === 'working' ? (
                <Button appearance="outlined" size="s" isDisabled>
                  設定作業中
                </Button>
              ) : (
                <Button appearance="outlined" size="s">
                  有料SSLにアップグレード
                </Button>
              )}
            </Stack>
          </Card>
        ))
      )}
    </Stack>
  )
  return (
    <Stack gap="l">
      <Typography size="xxl" fontWeight="bold" component="h1">
        独自SSLを設定して、安全なサイト運営を行いましょう！
      </Typography>
      <Callout color="informative">
        ひとつの独自ドメインに対して、サブドメインも含め100件のSSLを設定できます。
      </Callout>
      <Card>
        <Tabs>
          <TabList aria-label="独自SSL">
            <Tab id="all">すべてのドメイン</Tab>
            <Tab id="unprotected">SSL保護されていないドメイン</Tab>
            <Tab id="protected">SSLで保護されているドメイン</Tab>
          </TabList>
          <TabPanel id="all">{table(domains)}</TabPanel>
          <TabPanel id="unprotected">{table(domains.filter((d) => d.ssl === 'disabled'))}</TabPanel>
          <TabPanel id="protected">{table(domains.filter((d) => d.ssl === 'enabled'))}</TabPanel>
        </Tabs>
      </Card>
    </Stack>
  )
}

// ─── ディスク使用量 ───

const Bar = ({ ratio, tone }: { ratio: number; tone: 'informative' | 'notice' | 'negative' }) => (
  // GAP: 進捗バーが無いので Typography の色を継承した div で代用
  <Typography component="div" color={tone}>
    <div style={{ height: 8, borderRadius: 4, background: 'currentColor', opacity: 0.15 }} />
    <div
      style={{
        height: 8,
        borderRadius: 4,
        marginTop: -8,
        width: `${Math.min(ratio, 1) * 100}%`,
        background: 'currentColor',
      }}
    />
  </Typography>
)

const DiskScreen = () => (
  <Stack gap="l">
    <Typography size="xxl" fontWeight="bold" component="h1">
      ディスク使用量
    </Typography>
    <Card>
      <Stack gap="m">
        <Typography size="l" fontWeight="bold" component="h2">
          ディスク使用量
        </Typography>
        <Typography size="s" color="medium_emphasis">
          現在使用している容量は、400 GB ( 409,600MB ) のうち 12,698 MBです。
        </Typography>
        <Bar ratio={0.031} tone="informative" />
        <Divider />
        <Stack gap="s">
          {[
            { label: 'ファイル・フォルダ数', value: '184,029' },
            { label: 'ファイル使用量', value: '8,402 MB' },
            { label: 'メール使用量', value: '3,884 MB' },
            { label: 'データベース使用量', value: '412 MB' },
            { label: '全体の使用量', value: '12,698 MB' },
            { label: '残りの使用可能量', value: '396,902 MB' },
          ].map((r) => (
            <Stack key={r.label} flexDirection="row" justifyContent="space-between">
              <Typography size="s" color="medium_emphasis" component="span">
                {r.label}
              </Typography>
              <Typography size="s" component="span">
                {r.value}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Card>
  </Stack>
)

// ─── データベース ───

const MysqlScreen = ({
  rows,
  onCreate,
  onDelete,
}: {
  rows: typeof databases
  onCreate: () => void
  onDelete: (name: string) => void
}) => (
  <Stack gap="l">
    <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="m" justifyContent="space-between">
      <Typography size="xxl" fontWeight="bold" component="h1">
        データベース
      </Typography>
      <Button color="interactive" onPress={onCreate}>
        データベース作成
      </Button>
    </Stack>
    <Callout color="notice">
      データベースについては基本的にサポート外とさせていただきます。詳しい知識がある方のみご利用ください。
    </Callout>
    <Card>
      <Table aria-label="データベース">
        <TableHeader>
          <Column isRowHeader>データベース名</Column>
          <Column>サーバー</Column>
          <Column>バージョン</Column>
          <Column>ユーザー名</Column>
          <Column>操作</Column>
        </TableHeader>
        <TableBody>
          {rows.map((d) => (
            <Row key={d.name}>
              <Cell>{d.name}</Cell>
              <Cell>{d.server}</Cell>
              <Cell>{d.version}</Cell>
              <Cell>{d.user}</Cell>
              <Cell>
                <Stack flexDirection="row" gap="xxs">
                  <Button
                    appearance="transparent"
                    size="s"
                    trailing={<Icon name="launch" size="s" />}
                  >
                    phpMyAdmin
                  </Button>
                  <Button
                    appearance="transparent"
                    size="s"
                    iconOnly
                    aria-label={`${d.name} を削除`}
                    onPress={() => onDelete(d.name)}
                  >
                    <Icon name="garbage_can" size="s" />
                  </Button>
                </Stack>
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </Card>
  </Stack>
)

// ─── メール設定 ───

const MailScreen = ({
  accounts,
  onCreate,
  onDelete,
}: {
  accounts: typeof mailAccounts
  onCreate: () => void
  onDelete: (address: string) => void
}) => (
  <Stack gap="l">
    <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="m" justifyContent="space-between">
      <Typography size="xxl" fontWeight="bold" component="h1">
        メール設定
      </Typography>
      <Stack flexDirection="row" gap="s">
        <Button appearance="outlined" trailing={<Icon name="launch" size="s" />}>
          ロリポップ！新WEBメーラー ログイン
        </Button>
        <Button color="interactive" onPress={onCreate}>
          新規作成
        </Button>
      </Stack>
    </Stack>
    <Typography size="s" color="medium_emphasis">
      メールアドレスの作成・削除ができます。メールアドレスが使えるようになるには、新規作成後１時間ほどかかります。
    </Typography>
    <Stack gap="s">
      {accounts.length === 0 && (
        <Card outlined>
          <Stack alignItems="center" gap="s">
            <Icon name="mail" size="l" />
            <Typography color="medium_emphasis">メールアドレスが作成されていません。</Typography>
          </Stack>
        </Card>
      )}
      {accounts.map((m) => (
        <Card key={m.address} outlined>
          <Grid spacing="s" alignContent="center">
            <GridItem size={{ xxs: 12, m: 5 }}>
              <Typography fontWeight="bold" component="span">
                {m.address}
              </Typography>
            </GridItem>
            <GridItem size={{ xxs: 6, m: 3 }}>
              <Stack gap="xxs">
                <Typography size="xs" color="medium_emphasis">
                  使用量
                </Typography>
                <Typography size="s" component="span">
                  {m.usage}
                </Typography>
              </Stack>
            </GridItem>
            <GridItem size={{ xxs: 6, m: 2 }}>
              <Stack gap="xxs">
                <Typography size="xs" color="medium_emphasis">
                  メール件数
                </Typography>
                <Typography size="s" component="span">
                  {m.count}
                </Typography>
              </Stack>
            </GridItem>
            <GridItem size={{ xxs: 12, m: 2 }}>
              <Stack flexDirection="row" gap="xxs" justifyContent="flex-end">
                <Button appearance="outlined" size="s">
                  設定変更
                </Button>
                <Button
                  appearance="transparent"
                  size="s"
                  iconOnly
                  aria-label={`${m.address} を削除`}
                  onPress={() => onDelete(m.address)}
                >
                  <Icon name="garbage_can" size="s" />
                </Button>
              </Stack>
            </GridItem>
          </Grid>
        </Card>
      ))}
    </Stack>
  </Stack>
)

// ─── 契約・お支払い ───

const ContractScreen = () => (
  <Stack gap="l">
    <Typography size="xxl" fontWeight="bold" component="h1">
      サーバー契約・お支払い
    </Typography>
    <Card>
      <Stack gap="m">
        <Typography size="l" fontWeight="bold" component="h2">
          ご契約内容一覧
        </Typography>
        <Table aria-label="ご契約内容一覧">
          <TableHeader>
            <Column isRowHeader>契約期間</Column>
            <Column>契約開始日</Column>
            <Column>契約終了日</Column>
            <Column>請求額</Column>
            <Column>入金締切日</Column>
            <Column>入金状況</Column>
            <Column>お支払い</Column>
          </TableHeader>
          <TableBody>
            {contracts.map((c) => (
              <Row key={c.start}>
                <Cell>{c.term}</Cell>
                <Cell>{c.start}</Cell>
                <Cell>{c.end}</Cell>
                <Cell>{c.amount}</Cell>
                <Cell>{c.due}</Cell>
                <Cell>
                  <Sticker color="positive" size="s">
                    {c.state}
                  </Sticker>
                </Cell>
                <Cell>
                  <Button appearance="transparent" size="s" isDisabled>
                    お支払い
                  </Button>
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </Stack>
    </Card>
    <Card>
      <Stack gap="m">
        <Typography size="l" fontWeight="bold" component="h2">
          自動更新設定
        </Typography>
        <Typography size="s" color="medium_emphasis">
          ロリポップ！の契約更新を自動で行うことができます。お支払い忘れでホームページが閲覧できなくなったり、メールがご利用できなくなる事象を未然に防ぎます。
        </Typography>
        <Stack gap="s">
          <Stack flexDirection="row" justifyContent="space-between">
            <Typography size="s" color="medium_emphasis" component="span">
              状態
            </Typography>
            <Typography size="s" component="span">
              クレジットカードで自動更新設定中
            </Typography>
          </Stack>
          <Divider />
          <Stack flexDirection="row" justifyContent="space-between">
            <Typography size="s" color="medium_emphasis" component="span">
              次回決済日
            </Typography>
            <Typography size="s" component="span">
              2027/03/25
            </Typography>
          </Stack>
          <Divider />
          <Stack flexDirection="row" justifyContent="space-between">
            <Typography size="s" color="medium_emphasis" component="span">
              次回契約プラン
            </Typography>
            <Typography size="s" component="span">
              ハイスピードプラン / 12ヶ月
            </Typography>
          </Stack>
        </Stack>
        <Stack flexDirection="row" gap="s" justifyContent="flex-end">
          <Button appearance="outlined">契約変更</Button>
        </Stack>
      </Stack>
    </Card>
  </Stack>
)

// ─── アプリ本体 ───

const App = () => {
  const [mode, setMode] = useState<Mode>('domain')
  const [domains, setDomains] = useState(initialDomains)
  const [mails, setMails] = useState(mailAccounts)
  const [dbs, setDbs] = useState(databases)
  const [registered, setRegistered] = useState('')
  const [dbDialog, setDbDialog] = useState(false)
  const [dbName, setDbName] = useState('')
  const [mailDialog, setMailDialog] = useState(false)
  const [mailName, setMailName] = useState('')

  return (
    <>
      <Stack gap="l">
        <Header />
        <Container size="xl" component="main">
          <Grid spacing="l">
            <GridItem size={{ xxs: 12, m: 3 }}>
              <SideMenu mode={mode} onNavigate={setMode} />
            </GridItem>
            <GridItem size={{ xxs: 12, m: 9 }}>
              {mode === 'domain' && (
                <DomainList
                  domains={domains}
                  onRegister={() => setMode('domain-register')}
                  onEdit={() =>
                    queue.add({ message: '処理は正常に完了しました。', state: 'neutral' })
                  }
                  onRemove={(names) =>
                    setDomains((prev) => prev.filter((d) => !names.includes(d.name)))
                  }
                />
              )}
              {mode === 'domain-register' && (
                <DomainRegister
                  onBack={() => setMode('domain')}
                  onDone={(name) => {
                    setDomains((prev) => [...prev, { name, folder: `/${name}`, ssl: 'disabled' }])
                    setRegistered(name)
                    setMode('domain-complete')
                  }}
                />
              )}
              {mode === 'domain-complete' && (
                <DomainComplete
                  name={registered}
                  onSsl={() => setMode('ssl')}
                  onMail={() => setMode('mail-address')}
                  onList={() => setMode('domain')}
                />
              )}
              {mode === 'ssl' && (
                <SslScreen
                  domains={domains}
                  onIssue={(name) => {
                    setDomains((prev) =>
                      prev.map((d) => (d.name === name ? { ...d, ssl: 'working' } : d))
                    )
                    queue.add({ message: `${name} の独自SSL（無料）の設定を開始しました。` })
                    setTimeout(() => {
                      setDomains((prev) =>
                        prev.map((d) => (d.name === name ? { ...d, ssl: 'enabled' } : d))
                      )
                      queue.add({ message: `${name} がSSLで保護されました。` })
                    }, 2200)
                  }}
                />
              )}
              {mode === 'disk' && <DiskScreen />}
              {mode === 'mysql' && (
                <MysqlScreen
                  rows={dbs}
                  onCreate={() => setDbDialog(true)}
                  onDelete={(name) => {
                    setDbs((prev) => prev.filter((d) => d.name !== name))
                    queue.add({ message: `${name} を削除しました。`, state: 'neutral' })
                  }}
                />
              )}
              {mode === 'mail-address' && (
                <MailScreen
                  accounts={mails}
                  onCreate={() => setMailDialog(true)}
                  onDelete={(address) => {
                    setMails((prev) => prev.filter((m) => m.address !== address))
                    queue.add({ message: `${address} を削除しました。`, state: 'neutral' })
                  }}
                />
              )}
              {mode === 'contract' && <ContractScreen />}
            </GridItem>
          </Grid>
        </Container>
      </Stack>

      <Dialog isOpen={dbDialog} onOpenChange={setDbDialog}>
        <DialogHeader>
          <DialogTitle>データベース作成</DialogTitle>
        </DialogHeader>
        <DialogDescription>作成後、データベース名とユーザー名は変更できません。</DialogDescription>
        <Stack gap="m">
          <Select label="作成するサーバー" width="full" defaultSelectedKey="301">
            <SelectItem id="301">mysql301.phy.lolipop.lan</SelectItem>
          </Select>
          <TextField
            label="データベース名"
            caption="2〜12文字の半角英数小文字でご入力ください。"
            width="full"
            isRequired
            value={dbName}
            onChange={setDbName}
          />
          <TextField
            label="接続パスワード"
            caption="4〜16文字でご入力ください。"
            type="password"
            width="full"
            isRequired
          />
        </Stack>
        <DialogFooter>
          <Button appearance="outlined" onPress={() => setDbDialog(false)}>
            もどる
          </Button>
          <Button
            color="interactive"
            isDisabled={!dbName}
            onPress={() => {
              setDbs((prev) => [
                ...prev,
                {
                  server: 'mysql301.phy.lolipop.lan',
                  name: `LAA0021934-${dbName}`,
                  version: 'MySQL 8.0',
                  user: 'LAA0021934',
                },
              ])
              setDbName('')
              setDbDialog(false)
              queue.add({ message: 'データベースを作成しました。' })
            }}
          >
            作成
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog isOpen={mailDialog} onOpenChange={setMailDialog}>
        <DialogHeader>
          <DialogTitle>メール作成</DialogTitle>
        </DialogHeader>
        <Stack gap="m">
          <Stack flexDirection="row" gap="xs" alignItems="flex-end">
            <TextField
              label="メールアドレス"
              caption="半角英数字と 『 - 』 『 . 』 『 _ 』 で、64字以下でご入力ください。"
              width="half"
              isRequired
              value={mailName}
              onChange={setMailName}
            />
            <Typography size="s" color="medium_emphasis" component="span">
              @
            </Typography>
            <Select aria-label="ドメイン" width="half" defaultSelectedKey="example.com">
              {domains.map((d) => (
                <SelectItem key={d.name} id={d.name}>
                  {d.name}
                </SelectItem>
              ))}
            </Select>
          </Stack>
          <TextField
            label="パスワード"
            caption="半角英字の大文字、小文字、半角数字、記号をすべて組み合わせ、12文字以上32文字以下でご入力ください。"
            type="password"
            width="full"
            isRequired
          />
        </Stack>
        <DialogFooter>
          <Button appearance="outlined" onPress={() => setMailDialog(false)}>
            キャンセル
          </Button>
          <Button
            color="interactive"
            isDisabled={!mailName}
            onPress={() => {
              setMails((prev) => [
                ...prev,
                { address: `${mailName}@example.com`, usage: '0.0 GB', count: '0 件' },
              ])
              setMailName('')
              setMailDialog(false)
              queue.add({ message: 'メールアドレスを作成しました。' })
            }}
          >
            作成
          </Button>
        </DialogFooter>
      </Dialog>
      <SnackBar queue={queue} />
    </>
  )
}

// ─── ストーリー ───

/**
 * ロリポップ！ユーザー専用ページ。実際に押して遷移する。
 *
 * - 「独自ドメイン設定」→ ドメイン名を入れて「独自ドメインをチェックする」→「設定」で一覧に増える
 * - 完了画面の「独自SSL設定ページを見てみる」で SSL 画面へ。実アプリの導線どおり
 * - SSL の「独自SSL（無料）を設定する」を押すと「設定作業中」を 2.2 秒挟んで「SSL保護有効」になる
 * - 左のメニューでディスク使用量・データベース・メール設定・契約に切り替わる
 * - 「データベース作成」でダイアログが開く
 *
 * @summary ユーザー専用ページ（操作できる）
 */
export const Default: Story = {
  render: () => <App />,
}
