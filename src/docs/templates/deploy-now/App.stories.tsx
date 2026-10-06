import { useState } from 'react'
import { TabPanel } from 'react-aria-components'

import { AppBar, AppBarLeading, AppBarTrailing } from '../../../AppBar'
import { Breadcrumb, Breadcrumbs } from '../../../Breadcrumbs'
import { Button } from '../../../Button'
import { Callout } from '../../../Callout'
import { Container } from '../../../Container'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../Dialog'
import { Divider } from '../../../Divider'
import { Grid, GridItem } from '../../../Grid'
import { Icon } from '../../../Icon'
import { Loader } from '../../../Loader'
import { Paper } from '../../../Paper'
import { SnackBar, SnackBarQueue } from '../../../SnackBar'
import { Stack } from '../../../Stack'
import { Sticker } from '../../../Sticker'
import { Switch } from '../../../Switch'
import { Tab, TabList, Tabs } from '../../../Tab'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../../Table'
import { TextField } from '../../../TextField'
import { Typography } from '../../../Typography'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import type { StickerColor } from '../../../Sticker'

/**
 * デプロイナウ（hosting-deploy-now/frontend）の再現。
 * 既に wip-ui 0.1.4 を使っている実利用者で、足りない部分を Tailwind で補っている。
 */

const meta = {
  title: 'Templates/DeployNow/App',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const queue = new SnackBarQueue()

// GAP-1 の回避策（Paper に padding が無い）。実利用者は Paper に className="p-5" を渡している。
const insetStyle = { padding: 24 }
const Card = ({ children, outlined = true }: { children: ReactNode; outlined?: boolean }) => (
  <Paper elevation={outlined ? 0 : 1} outlined={outlined}>
    <div style={insetStyle}>{children}</div>
  </Paper>
)

// ─── データ ───

type DeployState = 'success' | 'building' | 'queued' | 'failed' | 'cancelled'

const deployState: Record<DeployState, { label: string; color: StickerColor }> = {
  success: { label: '成功', color: 'positive' },
  building: { label: 'ビルド中', color: 'informative' },
  queued: { label: 'キュー入り', color: 'neutral' },
  failed: { label: 'エラー', color: 'negative' },
  cancelled: { label: 'キャンセル済み', color: 'neutral' },
}

type Project = {
  id: string
  name: string
  domain: string
  branch: string
  tags: string[]
  state: DeployState
  updatedAt: string
  suspended?: boolean
}

const initialProjects: Project[] = [
  {
    id: 'p1',
    name: 'portfolio',
    domain: 'portfolio.deploy-now.app',
    branch: 'main',
    tags: ['production'],
    state: 'success',
    updatedAt: '3 分前',
  },
  {
    id: 'p2',
    name: 'shop-api',
    domain: 'shop-api.deploy-now.app',
    branch: 'main',
    tags: ['production', 'ai'],
    state: 'building',
    updatedAt: 'たった今',
  },
  {
    id: 'p3',
    name: 'blog-staging',
    domain: 'blog-staging.deploy-now.app',
    branch: 'develop',
    tags: ['staging'],
    state: 'failed',
    updatedAt: '2 時間前',
  },
]

const deploys = [
  {
    id: 'd1',
    sha: '8f21a3c',
    subject: 'Fix: 画像の遅延読み込みを有効にする',
    state: 'success' as DeployState,
    at: '2026/10/06 09:12',
    by: 'git',
  },
  {
    id: 'd2',
    sha: '4c90b11',
    subject: 'Add: お問い合わせフォーム',
    state: 'success' as DeployState,
    at: '2026/10/05 18:40',
    by: 'git',
  },
  {
    id: 'd3',
    sha: '—',
    subject: 'アップロード',
    state: 'failed' as DeployState,
    at: '2026/10/05 11:03',
    by: 'upload',
  },
]

const initialEnvVars = [
  { key: 'DATABASE_URL', value: '••••••••••••' },
  { key: 'NEXT_PUBLIC_API_BASE', value: 'https://api.example.com' },
  { key: 'SENTRY_DSN', value: '••••••••••••' },
]

const domains = [
  { domain: 'portfolio.deploy-now.app', kind: '初期ドメイン', ssl: true },
  { domain: 'example.com', kind: '独自ドメイン', ssl: true },
]

// ─── ルーティング ───

type Route =
  | { name: 'projects' }
  | { name: 'new' }
  | { name: 'project'; id: string; tab: 'deploys' | 'domains' | 'env' | 'settings' }
  | { name: 'deploy'; id: string; deployId: string }
  | { name: 'usage' }

// ─── 共通の枠 ───

const Layout = ({
  route,
  onNavigate,
  children,
}: {
  route: Route
  onNavigate: (r: Route) => void
  children: ReactNode
}) => (
  <Stack gap="l">
    <AppBar appearance="white" position="relative">
      <AppBarLeading>
        <Button appearance="transparent" onPress={() => onNavigate({ name: 'projects' })}>
          <Stack flexDirection="row" gap="s" alignItems="center">
            <Icon name="code" size="m" />
            <Typography size="l" fontWeight="bold" component="span">
              デプロイナウ
            </Typography>
          </Stack>
        </Button>
      </AppBarLeading>
      <AppBarTrailing>
        <Stack flexDirection="row" gap="xs" alignItems="center">
          <Button
            appearance={
              route.name === 'projects' || route.name === 'project' ? 'flat' : 'transparent'
            }
            size="s"
            onPress={() => onNavigate({ name: 'projects' })}
          >
            プロジェクト
          </Button>
          <Button
            appearance={route.name === 'usage' ? 'flat' : 'transparent'}
            size="s"
            onPress={() => onNavigate({ name: 'usage' })}
          >
            使用量
          </Button>
          <Button appearance="transparent" size="s" iconOnly aria-label="設定">
            <Icon name="gear" size="m" />
          </Button>
        </Stack>
      </AppBarTrailing>
    </AppBar>
    <Container size="l" component="main">
      <Stack gap="l">{children}</Stack>
    </Container>
  </Stack>
)

// ─── プロジェクト一覧 ───

const ProjectsScreen = ({
  projects,
  onOpen,
  onNew,
}: {
  projects: Project[]
  onOpen: (id: string) => void
  onNew: () => void
}) => (
  <Stack gap="l">
    <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="m" justifyContent="space-between">
      <Typography size="xxl" fontWeight="bold" component="h1">
        プロジェクト
      </Typography>
      <Button color="interactive" leading={<Icon name="plus" size="s" />} onPress={onNew}>
        新しいプロジェクト
      </Button>
    </Stack>
    <Paper elevation={0} outlined>
      <Stack gap="xxs">
        {projects.map((p, i) => (
          <Stack key={p.id} gap="xxs">
            {i > 0 && <Divider />}
            <div style={{ padding: 16 }}>
              <Grid spacing="s" alignContent="center">
                <GridItem size={{ xxs: 12, m: 6 }}>
                  <Stack gap="xxs">
                    <Stack flexDirection="row" gap="xs" alignItems="center">
                      <Typography fontWeight="bold" component="span">
                        {p.name}
                      </Typography>
                      {p.tags.map((t) => (
                        <Sticker key={t} color="neutral" size="s">
                          {t}
                        </Sticker>
                      ))}
                    </Stack>
                    {/* GAP: Typography に interactive（リンク）色が無い。実利用者は生の hex を書いている */}
                    <Stack flexDirection="row" gap="xxs" alignItems="center">
                      <Typography size="s" color="informative" component="span">
                        {p.domain}
                      </Typography>
                      <Icon name="launch" size="s" />
                    </Stack>
                  </Stack>
                </GridItem>
                <GridItem size={{ xxs: 6, m: 3 }}>
                  <Stack gap="xxs">
                    <Stack flexDirection="row" gap="xs" alignItems="center">
                      {p.state === 'building' && <Loader size="s" />}
                      <Sticker color={deployState[p.state].color} size="s">
                        {deployState[p.state].label}
                      </Sticker>
                    </Stack>
                    <Typography size="xs" color="low_emphasis">
                      {p.branch} ・ {p.updatedAt}
                    </Typography>
                  </Stack>
                </GridItem>
                <GridItem size={{ xxs: 6, m: 3 }}>
                  <Stack flexDirection="row" justifyContent="flex-end">
                    <Button
                      appearance="outlined"
                      size="s"
                      onPress={() => onOpen(p.id)}
                      trailing={<Icon name="chevron_right" size="s" />}
                    >
                      開く
                    </Button>
                  </Stack>
                </GridItem>
              </Grid>
            </div>
          </Stack>
        ))}
      </Stack>
    </Paper>
  </Stack>
)

const repos = [
  { id: 'r1', full: 'example-inc/portfolio', lang: 'TypeScript', updated: '3 分前' },
  { id: 'r2', full: 'example-inc/shop-api', lang: 'Go', updated: '2 時間前' },
  { id: 'r3', full: 'example-inc/blog', lang: 'TypeScript', updated: '昨日' },
  { id: 'r4', full: 'taro/sandbox', lang: 'Python', updated: '先週' },
]

const NewProjectScreen = ({
  onBack,
  onCreate,
}: {
  onBack: () => void
  onCreate: (name: string, branch: string) => void
}) => {
  const [repo, setRepo] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [name, setName] = useState('')
  const [branch, setBranch] = useState('main')
  const filtered = repos.filter((r) => r.full.includes(query))
  return (
    <Stack gap="l">
      <Breadcrumbs>
        <Breadcrumb href="#" onPress={onBack}>
          プロジェクト
        </Breadcrumb>
        <Breadcrumb>新しいプロジェクト</Breadcrumb>
      </Breadcrumbs>
      <Typography size="xxl" fontWeight="bold" component="h1">
        新しいプロジェクト
      </Typography>

      <Card>
        <Stack gap="m">
          <Typography size="l" fontWeight="bold" component="h2">
            リポジトリを選ぶ
          </Typography>
          <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="s" justifyContent="space-between">
            <TextField
              aria-label="リポジトリを検索"
              placeholder="リポジトリ名で検索"
              size="s"
              width="half"
              value={query}
              onChange={setQuery}
            />
            <Button appearance="outlined" size="s" leading={<Icon name="github" size="s" />}>
              GitHub の連携を設定
            </Button>
          </Stack>
          <Stack gap="xxs">
            {filtered.map((r) => (
              <Paper key={r.id} elevation={0} outlined={r.id !== repo}>
                <div style={{ padding: 12 }}>
                  <Stack
                    flexDirection="row"
                    gap="m"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Stack flexDirection="row" gap="s" alignItems="center">
                      <Icon name="github" size="s" />
                      <Stack gap="xxs">
                        <Typography component="span">{r.full}</Typography>
                        <Typography size="xs" color="low_emphasis">
                          {r.lang} ・ 更新 {r.updated}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Button
                      appearance={r.id === repo ? 'flat' : 'outlined'}
                      color={r.id === repo ? 'interactive' : 'neutral'}
                      size="s"
                      onPress={() => {
                        setRepo(r.id)
                        setName(r.full.split('/')[1])
                      }}
                      leading={r.id === repo ? <Icon name="check" size="s" /> : undefined}
                    >
                      {r.id === repo ? '選択中' : '選ぶ'}
                    </Button>
                  </Stack>
                </div>
              </Paper>
            ))}
            {filtered.length === 0 && (
              <Typography size="s" color="medium_emphasis">
                一致するリポジトリがありません。
              </Typography>
            )}
          </Stack>
          <Typography size="xs" color="low_emphasis">
            アップロードから始めることもできます。
          </Typography>
        </Stack>
      </Card>

      <Card>
        <Stack gap="m">
          <Typography size="l" fontWeight="bold" component="h2">
            ビルド設定
          </Typography>
          <Grid spacing="m">
            <GridItem size={{ xxs: 12, m: 6 }}>
              <TextField
                label="プロジェクト名"
                placeholder="portfolio"
                width="full"
                isRequired
                value={name}
                onChange={setName}
              />
            </GridItem>
            <GridItem size={{ xxs: 12, m: 6 }}>
              <TextField label="ブランチ" width="full" value={branch} onChange={setBranch} />
            </GridItem>
            <GridItem size={{ xxs: 12, m: 6 }}>
              <TextField label="ビルドコマンド" defaultValue="pnpm build" width="full" />
            </GridItem>
            <GridItem size={{ xxs: 12, m: 6 }}>
              <TextField label="出力ディレクトリ" defaultValue=".next" width="full" />
            </GridItem>
          </Grid>
          <Switch label="push で自動デプロイする" color="interactive" defaultSelected />
          <Callout color="informative">
            このブランチへの push がデプロイされます。接続すると最初のデプロイがすぐに始まります。
          </Callout>
          <Stack flexDirection="row" gap="s" justifyContent="flex-end">
            <Button appearance="outlined" onPress={onBack}>
              キャンセル
            </Button>
            <Button
              color="interactive"
              isDisabled={!repo || !name}
              onPress={() => onCreate(name, branch)}
            >
              作成してデプロイ
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  )
}

// ─── プロジェクト詳細 ───

const EnvVarPanel = ({
  vars,
  onAdd,
  onRemove,
}: {
  vars: { key: string; value: string }[]
  onAdd: (key: string, value: string) => void
  onRemove: (key: string) => void
}) => {
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')
  return (
    <Card>
      <Stack gap="m">
        <Typography size="l" fontWeight="bold" component="h2">
          環境変数
        </Typography>
        <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="s">
          <TextField
            aria-label="キー"
            placeholder="KEY"
            size="s"
            width="third"
            value={key}
            onChange={setKey}
          />
          <TextField
            aria-label="値"
            placeholder="VALUE"
            size="s"
            width="half"
            value={value}
            onChange={setValue}
          />
          <Button
            appearance="outlined"
            isDisabled={!key}
            onPress={() => {
              onAdd(key, value)
              setKey('')
              setValue('')
            }}
          >
            追加
          </Button>
        </Stack>
        {vars.length === 0 ? (
          <Typography size="s" color="medium_emphasis">
            環境変数はまだ設定されていません。
          </Typography>
        ) : (
          <Table aria-label="環境変数">
            <TableHeader>
              <Column isRowHeader>キー</Column>
              <Column>値</Column>
              <Column>操作</Column>
            </TableHeader>
            <TableBody>
              {vars.map((e) => (
                <Row key={e.key}>
                  <Cell>{e.key}</Cell>
                  <Cell>{e.value}</Cell>
                  <Cell>
                    <Stack flexDirection="row" gap="xxs">
                      <Button
                        appearance="transparent"
                        size="s"
                        iconOnly
                        aria-label={`${e.key} を編集`}
                      >
                        <Icon name="pencil" size="s" />
                      </Button>
                      <Button
                        appearance="transparent"
                        size="s"
                        iconOnly
                        aria-label={`${e.key} を削除`}
                        onPress={() => onRemove(e.key)}
                      >
                        <Icon name="garbage_can" size="s" />
                      </Button>
                    </Stack>
                  </Cell>
                </Row>
              ))}
            </TableBody>
          </Table>
        )}
        <Typography size="xs" color="low_emphasis">
          変更は次のデプロイから反映されます。
        </Typography>
      </Stack>
    </Card>
  )
}

const ProjectScreen = ({
  project,
  tab,
  onTab,
  onBack,
  onOpenDeploy,
  onDelete,
  envPanel,
}: {
  project: Project
  tab: 'deploys' | 'domains' | 'env' | 'settings'
  onTab: (t: 'deploys' | 'domains' | 'env' | 'settings') => void
  onBack: () => void
  onOpenDeploy: (id: string) => void
  onDelete: () => void
  envPanel: ReactNode
}) => (
  <Stack gap="l">
    <Breadcrumbs>
      <Breadcrumb href="#" onPress={onBack}>
        プロジェクト
      </Breadcrumb>
      <Breadcrumb>{project.name}</Breadcrumb>
    </Breadcrumbs>

    <Card outlined={false}>
      <Stack gap="m">
        <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="m" justifyContent="space-between">
          <Stack gap="xxs">
            <Typography size="xxl" fontWeight="bold" component="h1">
              {project.name}
            </Typography>
            <Stack flexDirection="row" gap="xs" alignItems="center">
              <Typography size="s" color="informative" component="span">
                {project.domain}
              </Typography>
              <Icon name="launch" size="s" />
            </Stack>
          </Stack>
          <Stack flexDirection="row" gap="s" alignItems="center">
            <Button appearance="outlined" leading={<Icon name="upload" size="s" />}>
              アップロード
            </Button>
            <Button color="interactive" leading={<Icon name="arrow_right" size="s" />}>
              デプロイ
            </Button>
          </Stack>
        </Stack>
        <Divider />
        <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="l">
          <Stack gap="xxs">
            <Typography size="xs" color="medium_emphasis">
              最新のデプロイ
            </Typography>
            <Sticker color={deployState[project.state].color} size="s">
              {deployState[project.state].label}
            </Sticker>
          </Stack>
          <Divider orientation="vertical" flexItem />
          <Stack gap="xxs">
            <Typography size="xs" color="medium_emphasis">
              ブランチ
            </Typography>
            <Typography fontWeight="bold" component="span">
              {project.branch}
            </Typography>
          </Stack>
          <Divider orientation="vertical" flexItem />
          <Stack gap="xxs">
            <Typography size="xs" color="medium_emphasis">
              更新
            </Typography>
            <Typography fontWeight="bold" component="span">
              {project.updatedAt}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>

    {project.state === 'failed' && (
      <Callout
        color="negative"
        action={
          <Button appearance="outlined" color="negative" size="s">
            ログを見る
          </Button>
        }
      >
        直近のデプロイが失敗しました。ビルドログを確認してください。
      </Callout>
    )}

    <Tabs selectedKey={tab} onSelectionChange={(k) => onTab(k as typeof tab)}>
      <TabList aria-label="プロジェクト">
        <Tab id="deploys">デプロイ</Tab>
        <Tab id="domains">ドメイン</Tab>
        <Tab id="env">環境変数</Tab>
        <Tab id="settings">設定</Tab>
      </TabList>

      <TabPanel id="deploys">
        <Card>
          <Stack gap="m">
            <Typography size="l" fontWeight="bold" component="h2">
              デプロイ履歴
            </Typography>
            {/* 行を押すと詳細に入る */}
            <Table aria-label="デプロイ履歴" onRowAction={(k) => onOpenDeploy(String(k))}>
              <TableHeader>
                <Column isRowHeader>コミット</Column>
                <Column>ソース</Column>
                <Column>ステータス</Column>
                <Column>日時</Column>
              </TableHeader>
              <TableBody>
                {deploys.map((d) => (
                  <Row key={d.id} id={d.id}>
                    <Cell>
                      <Stack gap="xxs">
                        <Typography size="s" component="span">
                          {d.subject}
                        </Typography>
                        <Typography size="xs" color="low_emphasis">
                          {d.sha}
                        </Typography>
                      </Stack>
                    </Cell>
                    <Cell>{d.by === 'git' ? project.branch : 'アップロード'}</Cell>
                    <Cell>
                      <Sticker color={deployState[d.state].color} size="s">
                        {deployState[d.state].label}
                      </Sticker>
                    </Cell>
                    <Cell>{d.at}</Cell>
                  </Row>
                ))}
              </TableBody>
            </Table>
            <Typography size="xs" color="low_emphasis">
              行を押すとデプロイの詳細に入ります。
            </Typography>
          </Stack>
        </Card>
      </TabPanel>

      <TabPanel id="domains">
        <Card>
          <Stack gap="m">
            <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
              <Typography size="l" fontWeight="bold" component="h2">
                ドメイン
              </Typography>
              <Button appearance="outlined" size="s" leading={<Icon name="plus" size="s" />}>
                ドメインを追加
              </Button>
            </Stack>
            <Table aria-label="ドメイン">
              <TableHeader>
                <Column isRowHeader>ドメイン</Column>
                <Column>種別</Column>
                <Column>SSL</Column>
                <Column>操作</Column>
              </TableHeader>
              <TableBody>
                {domains.map((d) => (
                  <Row key={d.domain}>
                    <Cell>{d.domain}</Cell>
                    <Cell>{d.kind}</Cell>
                    <Cell>
                      <Sticker color={d.ssl ? 'positive' : 'negative'} size="s">
                        {d.ssl ? '有効' : '未設定'}
                      </Sticker>
                    </Cell>
                    <Cell>
                      <Button
                        appearance="transparent"
                        size="s"
                        isDisabled={d.kind === '初期ドメイン'}
                      >
                        削除
                      </Button>
                    </Cell>
                  </Row>
                ))}
              </TableBody>
            </Table>
          </Stack>
        </Card>
      </TabPanel>

      <TabPanel id="env">{envPanel}</TabPanel>

      <TabPanel id="settings">
        <Stack gap="l">
          <Card>
            <Stack gap="m">
              <Typography size="l" fontWeight="bold" component="h2">
                ビルド設定
              </Typography>
              <TextField label="ビルドコマンド" defaultValue="pnpm build" width="full" />
              <TextField label="出力ディレクトリ" defaultValue=".next" width="full" />
              <Divider />
              <Switch label="push で自動デプロイする" color="interactive" defaultSelected />
              <Typography size="xs" color="medium_emphasis">
                このブランチへの push がデプロイされます。
              </Typography>
            </Stack>
          </Card>
          <Card>
            <Stack gap="m">
              <Typography size="l" fontWeight="bold" component="h2">
                プロジェクトの削除
              </Typography>
              <Callout
                color="negative"
                appearance="outline"
                action={
                  <Button appearance="outlined" color="negative" size="s" onPress={onDelete}>
                    削除する
                  </Button>
                }
              >
                プロジェクトを削除すると、デプロイ履歴とドメインの設定がすべて失われます。この操作は取り消せません。
              </Callout>
            </Stack>
          </Card>
        </Stack>
      </TabPanel>
    </Tabs>
  </Stack>
)

// ─── デプロイ詳細 ───

const DeployScreen = ({
  project,
  deployId,
  onBack,
  onProject,
}: {
  project: Project
  deployId: string
  onBack: () => void
  onProject: () => void
}) => {
  const d = deploys.find((x) => x.id === deployId) ?? deploys[0]
  const failed = d.state === 'failed'
  return (
    <Stack gap="l">
      <Breadcrumbs>
        <Breadcrumb href="#" onPress={onBack}>
          プロジェクト
        </Breadcrumb>
        <Breadcrumb href="#" onPress={onProject}>
          {project.name}
        </Breadcrumb>
        <Breadcrumb>{d.sha === '—' ? 'アップロード' : d.sha}</Breadcrumb>
      </Breadcrumbs>
      <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="m" justifyContent="space-between">
        <Stack gap="xxs">
          <Typography size="xxl" fontWeight="bold" component="h1">
            {d.subject}
          </Typography>
          <Stack flexDirection="row" gap="xs" alignItems="center">
            <Sticker color={deployState[d.state].color} size="s">
              {deployState[d.state].label}
            </Sticker>
            <Typography size="s" color="medium_emphasis" component="span">
              {d.at}
            </Typography>
          </Stack>
        </Stack>
        <Stack flexDirection="row" gap="s">
          {!failed && (
            <Button appearance="outlined" trailing={<Icon name="launch" size="s" />}>
              公開URLを開く
            </Button>
          )}
          <Button appearance="outlined">再デプロイ</Button>
        </Stack>
      </Stack>
      {failed && (
        <Callout color="negative">
          ビルドに失敗しました。依存関係のインストールで停止しています。
        </Callout>
      )}
      <Card>
        <Stack gap="m">
          <Typography size="l" fontWeight="bold" component="h2">
            ビルドログ
          </Typography>
          {/* GAP: 等幅フォントのトークンが無い。実利用者は Tailwind の font-mono を直書きしている */}
          <Stack gap="xxs">
            {[
              '$ pnpm install --frozen-lockfile',
              'Lockfile is up to date, resolution step is skipped',
              'Packages: +412',
              '$ pnpm build',
              failed ? 'ERROR  Cannot find module "sharp"' : '✓ Compiled successfully in 24.1s',
            ].map((line) => (
              <Typography
                key={line}
                size="xs"
                density="dense"
                color={line.startsWith('ERROR') ? 'negative' : 'medium_emphasis'}
                component="span"
              >
                {line}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </Card>
    </Stack>
  )
}

// ─── 使用量 ───

const UsageScreen = () => (
  <Stack gap="l">
    <Typography size="xl" fontWeight="bold" component="h1">
      使用量
    </Typography>
    <Stack gap="xxs">
      <Typography size="xs" color="medium_emphasis">
        使用量 · Lite プラン · 10月（1日〜31日）
      </Typography>
      <Typography size="xs" color="low_emphasis">
        月間リクエスト数または月総実行時間が上限に達すると、すべてのプロジェクトが一時停止されます。
      </Typography>
    </Stack>
    <Grid spacing="m">
      {[
        { label: 'プロジェクト数', value: '3', limit: '5 件', ratio: 0.6 },
        { label: '月間リクエスト数', value: '500', limit: '1,000 回', ratio: 0.5 },
        { label: '月総実行時間', value: '120', limit: '300 分', ratio: 0.4 },
      ].map((m) => (
        <GridItem key={m.label} size={{ xxs: 12, m: 4 }}>
          <Card>
            <Stack gap="xs">
              <Typography size="xs" color="medium_emphasis">
                {m.label}
              </Typography>
              <Stack flexDirection="row" gap="xxs" alignItems="flex-end">
                <Typography size="xxxl" fontWeight="bold" component="span">
                  {m.value}
                </Typography>
                <Typography size="m" color="medium_emphasis" component="span">
                  / {m.limit}
                </Typography>
              </Stack>
              {/* GAP: 進捗バーが無い。色は Typography から currentColor で継承させている */}
              <Typography component="div" color="informative">
                <div
                  style={{ height: 4, borderRadius: 2, background: 'currentColor', opacity: 0.15 }}
                />
                <div
                  style={{
                    height: 4,
                    borderRadius: 2,
                    marginTop: -4,
                    width: `${m.ratio * 100}%`,
                    background: 'currentColor',
                  }}
                />
              </Typography>
            </Stack>
          </Card>
        </GridItem>
      ))}
    </Grid>
  </Stack>
)

// ─── アプリ本体 ───

const App = () => {
  const [route, setRoute] = useState<Route>({ name: 'projects' })
  const [projects, setProjects] = useState(initialProjects)
  const [envVars, setEnvVars] = useState(initialEnvVars)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const projectId = 'id' in route ? route.id : projects[0].id
  const project = projects.find((p) => p.id === projectId) ?? projects[0]

  return (
    <>
      <Layout route={route} onNavigate={setRoute}>
        {route.name === 'projects' && (
          <ProjectsScreen
            projects={projects}
            onOpen={(id) => setRoute({ name: 'project', id, tab: 'deploys' })}
            onNew={() => setRoute({ name: 'new' })}
          />
        )}
        {route.name === 'project' && (
          <ProjectScreen
            project={project}
            tab={route.tab}
            onTab={(tab) => setRoute({ name: 'project', id: project.id, tab })}
            onBack={() => setRoute({ name: 'projects' })}
            onOpenDeploy={(deployId) => setRoute({ name: 'deploy', id: project.id, deployId })}
            onDelete={() => setDeleteOpen(true)}
            envPanel={
              <EnvVarPanel
                vars={envVars}
                onAdd={(key, value) => {
                  setEnvVars((prev) => [...prev, { key, value: value || '••••••••••••' }])
                  queue.add({ message: `${key} を追加しました` })
                }}
                onRemove={(key) => {
                  setEnvVars((prev) => prev.filter((e) => e.key !== key))
                  queue.add({ message: `${key} を削除しました`, state: 'neutral' })
                }}
              />
            }
          />
        )}
        {route.name === 'deploy' && (
          <DeployScreen
            project={project}
            deployId={route.deployId}
            onBack={() => setRoute({ name: 'projects' })}
            onProject={() => setRoute({ name: 'project', id: project.id, tab: 'deploys' })}
          />
        )}
        {route.name === 'new' && (
          <NewProjectScreen
            onBack={() => setRoute({ name: 'projects' })}
            onCreate={(name, branch) => {
              const id = `p-${Date.now()}`
              setProjects((prev) => [
                {
                  id,
                  name,
                  domain: `${name}.deploy-now.app`,
                  branch,
                  tags: [],
                  state: 'building',
                  updatedAt: 'たった今',
                },
                ...prev,
              ])
              setRoute({ name: 'project', id, tab: 'deploys' })
              queue.add({ message: 'プロジェクトを作成しました。最初のデプロイを開始します。' })
              // ビルド中の表示が一定時間後に成功へ変わる
              setTimeout(() => {
                setProjects((prev) =>
                  prev.map((p) =>
                    p.id === id ? { ...p, state: 'success', updatedAt: '1 分前' } : p
                  )
                )
                queue.add({ message: `${name} のデプロイが完了しました` })
              }, 2500)
            }}
          />
        )}
        {route.name === 'usage' && <UsageScreen />}
      </Layout>

      <Dialog
        isOpen={deleteOpen}
        onOpenChange={setDeleteOpen}
        isDismissable={false}
        role="alertdialog"
      >
        <DialogHeader>
          <DialogTitle>{project.name} を削除しますか？</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          デプロイ履歴とドメインの設定がすべて失われます。この操作は取り消せません。
        </DialogDescription>
        <TextField label="確認のためプロジェクト名を入力" placeholder={project.name} width="full" />
        <DialogFooter>
          <Button appearance="outlined" onPress={() => setDeleteOpen(false)}>
            キャンセル
          </Button>
          <Button
            color="negative"
            onPress={() => {
              setProjects((prev) => prev.filter((p) => p.id !== project.id))
              setDeleteOpen(false)
              setRoute({ name: 'projects' })
              queue.add({ message: `${project.name} を削除しました`, state: 'neutral' })
            }}
          >
            削除する
          </Button>
        </DialogFooter>
      </Dialog>
      <SnackBar queue={queue} />
    </>
  )
}

// ─── ストーリー ───

/**
 * デプロイナウの管理画面。実際に押して遷移する。
 *
 * - 一覧の「開く」でプロジェクト詳細に入る
 * - デプロイ履歴は行を押すとデプロイ詳細に入る（失敗したデプロイはビルドログにエラーが出る）
 * - デプロイ・ドメイン・環境変数・設定のタブが動く
 * - 設定タブの「削除する」で確認ダイアログが開く
 * - 「新しいプロジェクト」で GitHub のリポジトリ選択とビルド設定に入る
 * - ヘッダーの「使用量」で使用量画面に切り替わる
 *
 * @summary デプロイナウ（操作できる）
 */
export const Default: Story = {
  render: () => <App />,
}
