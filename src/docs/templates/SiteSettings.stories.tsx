import { useState } from 'react'
import { TabPanel } from 'react-aria-components'

import { Breadcrumb, Breadcrumbs } from '../../Breadcrumbs'
import { Button, LinkButton } from '../../Button'
import { Callout } from '../../Callout'
import { Checkbox } from '../../Checkbox'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../Dialog'
import { Divider } from '../../Divider'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Loader } from '../../Loader'
import { Menu, MenuItem, MenuTrigger } from '../../Menu'
import { Paper } from '../../Paper'
import { Select, SelectItem } from '../../Select'
import { Stack } from '../../Stack'
import { Sticker } from '../../Sticker'
import { Switch } from '../../Switch'
import { Tab, TabList, Tabs } from '../../Tab'
import { TextField } from '../../TextField'
import { Typography } from '../../Typography'
import { AppShell } from './AppShell'
import { Card } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

/**
 * デプロイナウ（hosting-deploy-now/frontend）のプロジェクト設定と環境変数を、ホスティング管理画面の中に写したもの。
 * - 設定: features/Project/index.tsx の settings タブ（ProjectBuildConfig + BuildConfigForm / ProjectGit +
 *   ConnectionAddDialog・ConnectionBranchDialog・ConnectionDisconnectDialog / ProjectTags + TagAddDialog /
 *   プロジェクト削除 + components/ProjectDeleteDialog）
 * - 環境変数: features/Project/features/ProjectEnvVars（EnvVarFormDialog / EnvVarDeleteDialog / KebabMenu / EyeIcons）
 * 実物はプロジェクト詳細のタブで切り替えるが、ここではサイドナビの「設定」1 つにまとめ、
 * 設定と環境変数を別の画面（ストーリー）にしている。タブより上はパンくずだけを写している
 * （ProjectHero は Deploys で写している）。文言は shared/lib/schemas.ts と各コンポーネントの文字列のまま。
 */

const meta = {
  title: 'Templates/SiteSettings',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── GAP の回避策（inline style はここに集める） ───

// 面の余白は Paper の padding で付ける（GAP-1 は解消）。設定カードと一覧の面は既定の l、
// ダイアログの中のリポジトリ選択の面は m。
// GAP-NEW: 行ごとに余白をとる部品が無い。一覧の行（実物は px-6 py-4）と列見出し（px-6 py-2）は
//          面の余白の内側に並ぶので、区切り線が面の端まで届かない。
// GAP-NEW: 余白をとる部品が無い。空の案内と読み込み中（実物は px-6 py-16 / py-16）の広い上下の余白。
//          inline style を当てない方針のため未対応。
// GAP-NEW: TabPanel と本文のあいだの間隔（実物は 16px）を付ける prop が無く、
//          タブの下線に本文が接する。inline style を当てない方針のため未対応。

// GAP-NEW: Button の isPending に見た目が無い（押せなくなるだけ）。実物の wip-ui も同じなので、
// 処理中が分かるよう leading に Loader を入れている。

/** 実物の各セクションの読み込み中（flex justify-center py-16 + Loader）。 */
const SectionLoading = () => (
  <Stack alignItems="center">
    <Loader size="m" message="読み込み中" />
  </Stack>
)

// GAP-NEW: 文中のテキストリンクが無い。実物は native a + text-[#0b3893]。
// LinkButton の transparent で代えるので、文字の前後に余白が付いて左端がそろわない。
const ExternalLink = ({ children }: { children: ReactNode }) => (
  <LinkButton
    appearance="transparent"
    color="interactive"
    size="s"
    href="#"
    target="_blank"
    rel="noopener noreferrer"
    trailing={<Icon name="launch" size="s" />}
  >
    {children}
  </LinkButton>
)

// GAP-NEW: TextField のエラー文言スロットが react-aria のネイティブ検証前提で、
// 送信時の独自検証の文言を出せない。実物と同じく Typography で下に置いている。

/** 実物の「⚠️ ○○ を削除しますか？」型の確認ダイアログ（w-[360px]）。 */
const ConfirmDialog = ({
  title,
  description,
  confirmLabel = '削除',
  onClose,
}: {
  title: string
  description: string
  confirmLabel?: string
  onClose: () => void
}) => (
  <Dialog isOpen onOpenChange={(open) => !open && onClose()}>
    {/* GAP-NEW: Dialog に幅の指定が無い。実物は w-[360px] に固定している */}
    <DialogHeader>
      <DialogTitle>
        <span aria-hidden>⚠️ </span>
        {title}
      </DialogTitle>
    </DialogHeader>
    <DialogDescription>{description}</DialogDescription>
    <DialogFooter>
      <Button appearance="outlined" color="neutral" size="m" onPress={onClose}>
        キャンセル
      </Button>
      <Button appearance="flat" color="negative" size="m" onPress={onClose}>
        {confirmLabel}
      </Button>
    </DialogFooter>
  </Dialog>
)

// ─── データ（実物の view model と同じ形。値はダミー） ───

type Connection = {
  repositoryFullName: string
  productionBranch: string
  enabled: boolean
  previewEnabled: boolean
}

type BuildConfig = {
  frameworkId: string
  rootDir: string
  installCommand: string
  buildCommand: string
  outputDir: string
}

type EnvVar = {
  id: string
  key: string
  value: string
  sensitive: boolean
  target: 'production' | 'preview'
}

const frameworks = [
  {
    id: 'nextjs',
    displayName: 'Next.js',
    install: 'npm install',
    build: 'npm run build',
    out: '.next',
  },
  {
    id: 'nuxt',
    displayName: 'Nuxt',
    install: 'npm install',
    build: 'npm run build',
    out: '.output',
  },
  {
    id: 'astro',
    displayName: 'Astro',
    install: 'npm install',
    build: 'npm run build',
    out: 'dist',
  },
  { id: 'static', displayName: '静的サイト', install: '', build: '', out: '' },
]

const buildConfig: BuildConfig = {
  frameworkId: 'nextjs',
  rootDir: '',
  installCommand: 'npm install',
  buildCommand: 'npm run build',
  outputDir: '.next',
}

const connection: Connection = {
  repositoryFullName: 'example-inc/portfolio',
  productionBranch: 'main',
  enabled: true,
  previewEnabled: true,
}

const envVars: EnvVar[] = [
  { id: 'e1', key: 'DATABASE_URL', value: '', sensitive: true, target: 'production' },
  { id: 'e2', key: 'OPENAI_API_KEY', value: '', sensitive: true, target: 'production' },
  {
    id: 'e3',
    key: 'NEXT_PUBLIC_API_BASE',
    value: 'https://api.example.com',
    sensitive: false,
    target: 'production',
  },
  {
    id: 'e5',
    key: 'NEXT_PUBLIC_SITE_NAME',
    value: 'portfolio',
    sensitive: false,
    target: 'production',
  },
  {
    id: 'e4',
    key: 'NEXT_PUBLIC_API_BASE',
    value: 'https://staging-api.example.com',
    sensitive: false,
    target: 'preview',
  },
]

const existingTags = ['production', 'staging', 'Next.js', 'OpenAI', 'Claude']

// 実物は features/Project/index.tsx のパンくず（プロジェクト / プロジェクト名）
const ProjectBreadcrumbs = () => (
  <Breadcrumbs>
    <Breadcrumb href="#">プロジェクト</Breadcrumb>
    <Breadcrumb>portfolio</Breadcrumb>
  </Breadcrumbs>
)

// ─── 設定: ビルド設定（ProjectBuildConfig / BuildConfigForm） ───

type Load = 'loading' | 'error'
type BuildFieldKey = 'rootDir' | 'installCommand' | 'buildCommand' | 'outputDir'

type BuildState = {
  load?: Load
  editing?: boolean
}

/** 実物の ConfigRow（sm 以上で 項目名 w-48 / 値 の横並び）。 */
const SettingRow = ({
  label,
  children,
  action,
}: {
  label: string
  children: ReactNode
  action?: ReactNode
}) => (
  // GAP-NEW: Grid に alignItems が無く、値と操作を項目名の縦中央にそろえられない
  <Grid spacing="s" alignContent="center">
    <GridItem size={{ xxs: 12, s: 3 }}>
      <Typography component="div" size="s" color="medium_emphasis">
        {label}
      </Typography>
    </GridItem>
    <GridItem size={{ xxs: 12, s: action ? 6 : 9 }}>{children}</GridItem>
    {action && (
      <GridItem size={{ xxs: 12, s: 3 }}>
        <Stack alignItems="flex-end">{action}</Stack>
      </GridItem>
    )}
  </Grid>
)

const BuildConfigForm = ({
  saved,
  onCancel,
  onSubmit,
}: {
  saved: BuildConfig
  onCancel: () => void
  onSubmit: (c: BuildConfig) => void
}) => {
  const [draft, setDraft] = useState<BuildConfig>(saved)
  const fields: [string, BuildFieldKey][] = [
    ['ルートディレクトリ', 'rootDir'],
    ['インストールコマンド', 'installCommand'],
    ['ビルドコマンド', 'buildCommand'],
    ['出力ディレクトリ', 'outputDir'],
  ]
  return (
    <Stack gap="l">
      <Select
        label="フレームワーク"
        size="s"
        width="full"
        selectedKey={draft.frameworkId}
        onSelectionChange={(key) => {
          const nextId = String(key)
          // 保存済みのフレームワークへ戻したときは、デフォルトではなく保存済みの値へ戻す
          if (nextId === saved.frameworkId) {
            setDraft({
              ...draft,
              frameworkId: nextId,
              installCommand: saved.installCommand,
              buildCommand: saved.buildCommand,
              outputDir: saved.outputDir,
            })
            return
          }
          const next = frameworks.find((f) => f.id === nextId)
          if (!next) return
          setDraft({
            ...draft,
            frameworkId: next.id,
            installCommand: next.install,
            buildCommand: next.build,
            outputDir: next.out,
          })
        }}
      >
        {frameworks.map((f) => (
          <SelectItem key={f.id} id={f.id}>
            {f.displayName}
          </SelectItem>
        ))}
      </Select>
      {fields.map(([label, field]) => (
        <TextField
          key={field}
          label={label}
          size="s"
          width="full"
          autoComplete="off"
          spellCheck="false"
          value={draft[field]}
          onChange={(v) => setDraft({ ...draft, [field]: v })}
        />
      ))}
      <Stack flexDirection="row" gap="xs" justifyContent="flex-end">
        <Button appearance="outlined" color="neutral" size="s" onPress={onCancel}>
          キャンセル
        </Button>
        <Button appearance="flat" color="neutral" size="s" onPress={() => onSubmit(draft)}>
          保存
        </Button>
      </Stack>
    </Stack>
  )
}

const BuildConfigSection = ({ state }: { state: BuildState }) => {
  const [config, setConfig] = useState(buildConfig)
  const [editing, setEditing] = useState(state.editing ?? false)
  if (state.load === 'loading') return <SectionLoading />
  if (state.load === 'error') {
    return (
      <Callout color="negative">
        ビルド設定の取得に失敗しました。時間をおいて再度お試しください。
      </Callout>
    )
  }
  const fw = frameworks.find((f) => f.id === config.frameworkId)
  const rows: [string, string][] = [
    ['フレームワーク', fw?.displayName ?? config.frameworkId],
    ['ルートディレクトリ', config.rootDir || '—'],
    ['インストールコマンド', config.installCommand || '—'],
    ['ビルドコマンド', config.buildCommand || '—'],
    ['出力ディレクトリ', config.outputDir || '—'],
  ]
  return (
    <Card outlined elevation={0}>
      <Stack gap="m">
        <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
          <Typography component="h2" size="m" fontWeight="bold">
            ビルド設定
          </Typography>
          {!editing && (
            <Button appearance="outlined" color="neutral" size="s" onPress={() => setEditing(true)}>
              編集
            </Button>
          )}
        </Stack>
        {editing ? (
          <BuildConfigForm
            saved={config}
            onCancel={() => setEditing(false)}
            onSubmit={(c) => {
              // GAP-NEW: SnackBar にアクションを置けない（実物は保存後に「再デプロイ」付きのトーストを出す）
              setConfig(c)
              setEditing(false)
            }}
          />
        ) : (
          <Stack gap="xs">
            {rows.map(([label, value]) => (
              <SettingRow key={label} label={label}>
                <Typography
                  component="div"
                  size="s"
                  color={value === '—' ? 'low_emphasis' : 'high_emphasis'}
                >
                  {value}
                </Typography>
              </SettingRow>
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  )
}

// ─── 設定: GitHub リポジトリ（ProjectGit） ───

const GitCard = ({
  connection,
  onChange,
  onConnect,
  onChangeBranch,
  onDisconnect,
}: {
  connection?: Connection
  onChange: (c: Connection) => void
  onConnect: () => void
  onChangeBranch: () => void
  onDisconnect: () => void
}) => {
  return (
    <Card outlined elevation={0}>
      <Stack gap="m">
        <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
          <Typography component="h2" size="m" fontWeight="bold">
            GitHub リポジトリ
          </Typography>
          {!connection && (
            <Button appearance="outlined" color="neutral" size="s" onPress={onConnect}>
              リポジトリを接続
            </Button>
          )}
        </Stack>
        {connection ? (
          <Stack gap="s">
            {(
              [
                [
                  'リポジトリ',
                  <Stack key="v" flexDirection="row">
                    <ExternalLink>{connection.repositoryFullName}</ExternalLink>
                  </Stack>,
                  <Button
                    key="a"
                    appearance="outlined"
                    color="negative"
                    size="s"
                    aria-label="リポジトリの接続を解除"
                    onPress={onDisconnect}
                  >
                    接続を解除
                  </Button>,
                ],
                [
                  'デプロイするブランチ',
                  <Typography component="div" key="v" size="s">
                    {connection.productionBranch}
                  </Typography>,
                  <Button
                    key="a"
                    appearance="outlined"
                    color="neutral"
                    size="s"
                    aria-label="デプロイするブランチを変更"
                    onPress={onChangeBranch}
                  >
                    変更
                  </Button>,
                ],
                [
                  '自動デプロイ',
                  <Typography component="div" key="v" size="s" color="medium_emphasis">
                    {connection.enabled
                      ? '有効です。push のたびに自動でデプロイされます。'
                      : '停止中です。push してもデプロイされません。'}
                  </Typography>,
                  <Switch
                    key="a"
                    aria-label="自動デプロイ"
                    isSelected={connection.enabled}
                    onChange={(enabled) => onChange({ ...connection, enabled })}
                  />,
                ],
                [
                  'プレビュー',
                  <Typography component="div" key="v" size="s" color="medium_emphasis">
                    {!connection.enabled
                      ? '停止中です。自動デプロイを再開すると設定できます。'
                      : connection.previewEnabled
                        ? '有効です。プルリクエストごとにプレビュー用の URL が作られます。'
                        : '停止中です。新しいプルリクエストではプレビューが作られません (公開中のプレビューは残ります)。'}
                  </Typography>,
                  <Switch
                    key="a"
                    aria-label="プレビュー"
                    isSelected={connection.enabled && connection.previewEnabled}
                    isDisabled={!connection.enabled}
                    onChange={(previewEnabled) => onChange({ ...connection, previewEnabled })}
                  />,
                ],
              ] as const
            ).map(([label, value, action], i) => (
              <Stack key={label} gap="s">
                {i > 0 && <Divider />}
                <SettingRow label={label} action={action}>
                  {value}
                </SettingRow>
              </Stack>
            ))}
          </Stack>
        ) : (
          <Stack gap="xxs">
            <Typography component="div" size="s" fontWeight="bold">
              接続されたリポジトリはまだありません。
            </Typography>
            <Typography component="div" size="xs" color="medium_emphasis">
              リポジトリを接続すると、push のたびに自動でデプロイされます。
            </Typography>
          </Stack>
        )}
      </Stack>
    </Card>
  )
}

const repositories = [
  { id: 'r1', name: 'portfolio', private: false },
  { id: 'r2', name: 'shop-api', private: true },
  { id: 'r3', name: 'docs-site', private: false },
]

/** 実物の ConnectionAddDialog（リポジトリの選択 → ブランチの確認 → 接続、の 2 段構成）。 */
const ConnectionAddDialog = ({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: (c: Connection) => void
}) => {
  const [selected, setSelected] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [branch, setBranch] = useState('main')
  const matched = repositories.filter((r) => r.name.includes(query.trim()))
  return (
    <Dialog isOpen onOpenChange={(open) => !open && onClose()}>
      {/* GAP-NEW: Dialog に幅の指定が無い。実物は w-[560px] に固定し、一覧を max-h-[55vh] でスクロールさせる */}
      <DialogHeader>
        <DialogTitle>リポジトリを接続</DialogTitle>
      </DialogHeader>
      <Stack gap="m">
        {selected === null ? (
          <>
            <DialogDescription>
              接続するリポジトリを選ぶと、push のたびに自動でデプロイされます。
            </DialogDescription>
            <Grid spacing="s">
              <GridItem size={{ xxs: 12, s: 5 }}>
                <Select aria-label="アカウント" width="full" defaultSelectedKey="1001">
                  <SelectItem id="1001" textValue="example-inc">
                    example-inc
                  </SelectItem>
                  <SelectItem id="install-new-account" textValue="アカウント追加">
                    + アカウント追加
                  </SelectItem>
                </Select>
              </GridItem>
              <GridItem size={{ xxs: 12, s: 7 }}>
                <TextField
                  aria-label="リポジトリを検索"
                  type="search"
                  placeholder="リポジトリを検索"
                  width="full"
                  value={query}
                  onChange={setQuery}
                />
              </GridItem>
            </Grid>
            <Paper padding="m" elevation={0} outlined>
              {matched.length === 0 ? (
                <Stack alignItems="center">
                  <Typography component="div" size="s" color="low_emphasis">
                    {`「${query}」に一致するリポジトリがありません。`}
                  </Typography>
                </Stack>
              ) : (
                matched.map((r, i) => (
                  <Stack key={r.id}>
                    {i > 0 && <Divider />}
                    <Stack
                      flexDirection="row"
                      gap="m"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack flexDirection="row" gap="xs" alignItems="center">
                        <Typography component="span" size="m" fontWeight="bold">
                          {r.name}
                        </Typography>
                        {r.private && <Icon name="lock" size="s" aria-label="非公開リポジトリ" />}
                      </Stack>
                      <Button
                        size="s"
                        aria-label={`${r.name} を選択`}
                        onPress={() => setSelected(`example-inc/${r.name}`)}
                      >
                        選択
                      </Button>
                    </Stack>
                  </Stack>
                ))
              )}
            </Paper>
          </>
        ) : (
          <>
            {/* GAP-NEW: Paper に地色の違う面（bg-neutral-100）が無い */}
            <Paper padding="m" elevation={0} outlined>
              <Stack flexDirection="row" gap="xs" alignItems="center">
                <Icon name="github" size="s" />
                <Typography component="div" size="m" fontWeight="bold">
                  {selected}
                </Typography>
              </Stack>
            </Paper>
            <TextField
              label="デプロイするブランチ"
              caption="このブランチへの push がデプロイされます。接続すると最初のデプロイが始まります。"
              size="s"
              width="full"
              value={branch}
              onChange={setBranch}
            />
            <Stack flexDirection="row">
              <Button
                appearance="transparent"
                color="neutral"
                size="s"
                onPress={() => setSelected(null)}
              >
                別のリポジトリを選ぶ
              </Button>
            </Stack>
          </>
        )}
      </Stack>
      <DialogFooter>
        <Button appearance="outlined" color="neutral" size="m" onPress={onClose}>
          キャンセル
        </Button>
        {selected !== null && (
          <Button
            size="m"
            isDisabled={branch.trim() === ''}
            onPress={() =>
              onSubmit({
                repositoryFullName: selected,
                productionBranch: branch.trim(),
                enabled: true,
                previewEnabled: true,
              })
            }
          >
            接続
          </Button>
        )}
      </DialogFooter>
    </Dialog>
  )
}

/** 実物の ConnectionBranchDialog（w-[360px]）。空のあいだは「保存」を押せない。 */
const ConnectionBranchDialog = ({
  repositoryFullName,
  initialBranch,
  onClose,
  onSubmit,
}: {
  repositoryFullName: string
  initialBranch: string
  onClose: () => void
  onSubmit: (branch: string) => void
}) => {
  const [branch, setBranch] = useState(initialBranch)
  return (
    <Dialog isOpen onOpenChange={(open) => !open && onClose()}>
      {/* GAP-NEW: Dialog に幅の指定が無い。実物は w-[360px] に固定している */}
      <DialogHeader>
        <DialogTitle>デプロイするブランチを変更</DialogTitle>
      </DialogHeader>
      <Stack gap="m">
        <DialogDescription>
          {`${repositoryFullName} のデプロイ対象のブランチを変更します。次の push から新しいブランチでデプロイされます。`}
        </DialogDescription>
        <TextField
          label="デプロイするブランチ"
          size="s"
          width="full"
          autoComplete="off"
          spellCheck="false"
          value={branch}
          onChange={setBranch}
        />
      </Stack>
      <DialogFooter>
        <Button appearance="outlined" color="neutral" size="m" onPress={onClose}>
          キャンセル
        </Button>
        <Button size="m" isDisabled={branch.trim() === ''} onPress={() => onSubmit(branch)}>
          保存
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

// ─── 設定: タグ（ProjectTags / TagAddDialog） ───

const TagsCard = ({
  tags,
  loadFailed,
  onAdd,
  onDetach,
}: {
  tags: string[]
  loadFailed?: boolean
  onAdd: () => void
  onDetach: (t: string) => void
}) => (
  <Card outlined elevation={0}>
    <Stack gap="m">
      <Typography component="h2" size="m" fontWeight="bold">
        タグ
      </Typography>
      {loadFailed ? (
        <Typography component="div" size="s" color="negative">
          タグの取得に失敗しました。
        </Typography>
      ) : (
        <Stack flexDirection="row" gap="xs" alignItems="center">
          {tags.map((t) => (
            // GAP-NEW: Sticker に外す（×）ボタンが無い（removable な Tag / Chip が無い）。
            // 実物は Sticker の中に native button の × を入れている
            <Stack key={t} flexDirection="row" gap="xxs" alignItems="center">
              <Sticker color="neutral" size="s">
                {t}
              </Sticker>
              <Button
                appearance="transparent"
                color="neutral"
                size="s"
                iconOnly
                aria-label={`タグ「${t}」を外す`}
                onPress={() => onDetach(t)}
              >
                <Icon name="cross" size="s" />
              </Button>
            </Stack>
          ))}
          <Button appearance="outlined" color="neutral" size="s" onPress={onAdd}>
            + タグを追加
          </Button>
        </Stack>
      )}
    </Stack>
  </Card>
)

/** 実物の TagAddDialog（w-[472px]）。既存のタグを押すか、新しいタグを入れて「追加」。 */
const TagAddDialog = ({
  availableTags,
  onClose,
  onAttach,
}: {
  availableTags: string[]
  onClose: () => void
  onAttach: (name: string) => void
}) => {
  const [name, setName] = useState('')
  return (
    <Dialog isOpen onOpenChange={(open) => !open && onClose()}>
      {/* GAP-NEW: Dialog に幅の指定が無い。実物は中身を w-[472px]（= 外寸 520px）に固定している */}
      <DialogHeader>
        <DialogTitle>タグを追加</DialogTitle>
      </DialogHeader>
      <Stack gap="l">
        {availableTags.length > 0 && (
          <Stack gap="xs">
            <Typography component="div" size="s" color="medium_emphasis">
              既存のタグ
            </Typography>
            {/* GAP-NEW: 押せる Sticker が無い。実物は Sticker を native button で包んでいる */}
            <Stack flexDirection="row" gap="xs">
              {availableTags.map((t) => (
                <Button
                  key={t}
                  appearance="outlined"
                  color="neutral"
                  size="s"
                  aria-label={`タグ「${t}」を追加`}
                  onPress={() => onAttach(t)}
                >
                  {t}
                </Button>
              ))}
            </Stack>
          </Stack>
        )}
        <Stack flexDirection="row" gap="xs" alignItems="flex-end">
          <TextField
            label="新しいタグ"
            placeholder="production"
            size="s"
            width="full"
            autoComplete="off"
            spellCheck="false"
            value={name}
            onChange={setName}
          />
          <Button
            appearance="flat"
            color="neutral"
            size="s"
            isDisabled={name.trim() === ''}
            onPress={() => onAttach(name.trim())}
          >
            追加
          </Button>
        </Stack>
      </Stack>
      <DialogFooter>
        <Button appearance="outlined" color="neutral" size="s" onPress={onClose}>
          キャンセル
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

// ─── 設定の画面 ───

type SettingsDialog =
  | { kind: 'none' }
  | { kind: 'connect' }
  | { kind: 'branch' }
  | { kind: 'disconnect' }
  | { kind: 'tag' }
  | { kind: 'delete' }

const SettingsScreen = ({
  initialConnection = connection,
  build = {},
  gitLoad,
  tagsLoadFailed,
  initialDialog = { kind: 'none' },
}: {
  initialConnection?: Connection | null
  build?: BuildState
  gitLoad?: Load
  tagsLoadFailed?: boolean
  initialDialog?: SettingsDialog
}) => {
  const [conn, setConn] = useState<Connection | undefined>(initialConnection ?? undefined)
  const [tags, setTags] = useState(['Next.js'])
  const [dialog, setDialog] = useState<SettingsDialog>(initialDialog)
  const close = () => setDialog({ kind: 'none' })
  return (
    <AppShell active="site">
      <Stack gap="l">
        <ProjectBreadcrumbs />
        <BuildConfigSection state={build} />
        {gitLoad === 'loading' ? (
          <SectionLoading />
        ) : gitLoad === 'error' ? (
          <Callout color="negative">
            リポジトリ接続の取得に失敗しました。時間をおいて再度お試しください。
          </Callout>
        ) : (
          <GitCard
            connection={conn}
            onChange={setConn}
            onConnect={() => setDialog({ kind: 'connect' })}
            onChangeBranch={() => setDialog({ kind: 'branch' })}
            onDisconnect={() => setDialog({ kind: 'disconnect' })}
          />
        )}
        <TagsCard
          tags={tags}
          loadFailed={tagsLoadFailed}
          onAdd={() => setDialog({ kind: 'tag' })}
          onDetach={(t) => setTags(tags.filter((x) => x !== t))}
        />
        <Card outlined elevation={0}>
          <Stack flexDirection="row" gap="m" alignItems="center" justifyContent="space-between">
            <Stack gap="xxs">
              <Typography component="h2" size="m" fontWeight="bold">
                プロジェクト削除
              </Typography>
              <Typography component="div" size="s" color="medium_emphasis">
                削除した場合、元に戻すことができません。
              </Typography>
            </Stack>
            <Button
              appearance="outlined"
              color="negative"
              size="s"
              onPress={() => setDialog({ kind: 'delete' })}
            >
              削除
            </Button>
          </Stack>
        </Card>
      </Stack>

      {dialog.kind === 'connect' && (
        <ConnectionAddDialog
          onClose={close}
          onSubmit={(c) => {
            setConn(c)
            close()
          }}
        />
      )}
      {dialog.kind === 'branch' && conn && (
        <ConnectionBranchDialog
          repositoryFullName={conn.repositoryFullName}
          initialBranch={conn.productionBranch}
          onClose={close}
          onSubmit={(branch) => {
            setConn({ ...conn, productionBranch: branch.trim() })
            close()
          }}
        />
      )}
      {dialog.kind === 'disconnect' && conn && (
        <ConfirmDialog
          title={`${conn.repositoryFullName} の接続を解除しますか？`}
          description="push による自動デプロイが行われなくなります。過去のデプロイに影響はありません。GitHub App が不要な場合は、GitHub からアンインストールできます。"
          confirmLabel="接続を解除"
          onClose={close}
        />
      )}
      {dialog.kind === 'tag' && (
        <TagAddDialog
          availableTags={existingTags.filter((t) => !tags.includes(t))}
          onClose={close}
          onAttach={(name) => {
            setTags((ts) => (ts.includes(name) ? ts : [...ts, name]))
            close()
          }}
        />
      )}
      {dialog.kind === 'delete' && (
        <ConfirmDialog
          title="portfolio を削除しますか？"
          description="デプロイ・環境変数・ドメインを含むすべてのデータが削除され、元に戻せません。"
          onClose={close}
        />
      )}
    </AppShell>
  )
}

// ─── 環境変数（features/Project/features/ProjectEnvVars） ───

const MASKED_VALUE = '••••••••••'
const AI_GATEWAY_ENV_KEY = 'AI_GATEWAY_API_KEY'

// GAP-NEW: アイコンに目（表示 / 非表示）が無い。実物は EyeIcons の SVG を手書きしている。
// 近いものとして、表示は magnifying_glass、非表示に戻すのは lock で代えている。
const EyeToggle = ({
  kind,
  label,
  pressed,
  onPress,
}: {
  kind: 'reveal' | 'hide'
  label: string
  pressed?: boolean
  onPress: () => void
}) => (
  <Button
    appearance="transparent"
    color="neutral"
    size="s"
    iconOnly
    aria-label={label}
    aria-pressed={pressed}
    onPress={onPress}
  >
    <Icon name={kind === 'reveal' ? 'magnifying_glass' : 'lock'} size="s" />
  </Button>
)

/** 値のセル。機密は常に伏せ字。そうでない値は目のアイコンで取りに行って見せる。 */
const EnvValueCell = ({ env }: { env: EnvVar }) => {
  const [shown, setShown] = useState(false)
  if (env.sensitive) {
    return (
      <Typography component="span" size="s" color="low_emphasis">
        {MASKED_VALUE}
      </Typography>
    )
  }
  if (!shown) {
    return (
      <Stack flexDirection="row" gap="xs" alignItems="center">
        <Typography component="span" size="s" color="medium_emphasis">
          {MASKED_VALUE}
        </Typography>
        <EyeToggle kind="reveal" label={`${env.key} の値を表示`} onPress={() => setShown(true)} />
      </Stack>
    )
  }
  return (
    <Stack flexDirection="row" gap="xs" alignItems="center">
      <Typography component="span" size="s" color="medium_emphasis">
        {env.value}
      </Typography>
      <EyeToggle kind="hide" label={`${env.key} の値を非表示に`} onPress={() => setShown(false)} />
    </Stack>
  )
}

const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <Stack gap="xxs" alignItems="center">
    <Typography component="div" size="m" fontWeight="bold">
      {title}
    </Typography>
    <Typography component="div" size="s" color="medium_emphasis">
      {description}
    </Typography>
  </Stack>
)

const EnvVarList = ({
  vars,
  target,
  onEdit,
  onDelete,
}: {
  vars: EnvVar[]
  target: EnvVar['target']
  onEdit: (env: EnvVar) => void
  onDelete: (env: EnvVar) => void
}) => (
  <Paper elevation={0} outlined>
    {vars.length === 0 ? (
      target === 'preview' ? (
        <EmptyState
          title="プレビュー環境の環境変数はまだありません"
          description="プレビュー環境には、ここで設定した変数だけが注入されます（本番の変数は引き継がれません）"
        />
      ) : (
        <EmptyState
          title="環境変数はまだありません"
          description="環境変数を追加すると、ここに一覧で表示されます"
        />
      )
    ) : (
      <>
        <Grid spacing="s">
          <GridItem size={{ xxs: 10, m: 4 }}>
            <Typography component="span" size="xs" color="medium_emphasis">
              キー
            </Typography>
          </GridItem>
          <GridItem size={{ xxs: 12, m: 7 }}>
            <Typography component="span" size="xs" color="medium_emphasis">
              値
            </Typography>
          </GridItem>
        </Grid>
        {vars.map((env) => (
          <Stack key={env.id}>
            <Divider />
            <Grid spacing="s" alignContent="center">
              <GridItem size={{ xxs: 10, m: 4 }}>
                <Typography component="span" size="s">
                  {env.key}
                </Typography>
              </GridItem>
              <GridItem size={{ xxs: 12, m: 7 }}>
                <EnvValueCell env={env} />
              </GridItem>
              <GridItem size={{ xxs: 2, m: 1 }}>
                <Stack alignItems="flex-end">
                  <MenuTrigger>
                    <Button
                      appearance="transparent"
                      color="neutral"
                      size="s"
                      iconOnly
                      aria-label={`${env.key} の操作`}
                    >
                      <Icon name="ellipsis_horizontal" size="s" aria-hidden="true" />
                    </Button>
                    <Menu placement="bottom end">
                      <MenuItem onAction={() => onEdit(env)}>編集</MenuItem>
                      <MenuItem color="negative" onAction={() => onDelete(env)}>
                        削除
                      </MenuItem>
                    </Menu>
                  </MenuTrigger>
                </Stack>
              </GridItem>
            </Grid>
          </Stack>
        ))}
      </>
    )}
  </Paper>
)

// 実物の shared/lib/envKeyTagRecommendation.ts の対応表（並び順が優先順位。先頭から最初の 1 件を採る）
const ENV_KEY_PATTERN_TO_TAG_NAME: [pattern: string, tagName: string][] = [
  ['AI_GATEWAY', 'ロリポップ！AIゲートウェイ'],
  ['AZURE_OPENAI', 'Azure OpenAI'],
  ['OPENROUTER', 'OpenRouter'],
  ['OPENAI', 'OpenAI'],
  ['ANTHROPIC', 'Claude'],
  ['CLAUDE', 'Claude'],
  ['GOOGLE_GENERATIVE_AI', 'Gemini'],
  ['GOOGLE_AI', 'Gemini'],
  ['GEMINI', 'Gemini'],
  ['BEDROCK', 'Amazon Bedrock'],
  ['MISTRAL', 'Mistral'],
  ['COHERE', 'Cohere'],
  ['GROQ', 'Groq'],
  ['GROK', 'xAI'],
  ['XAI', 'xAI'],
  ['DEEPSEEK', 'DeepSeek'],
  ['PERPLEXITY', 'Perplexity'],
  ['HUGGINGFACE', 'Hugging Face'],
  ['HUGGING_FACE', 'Hugging Face'],
  ['HF_TOKEN', 'Hugging Face'],
  ['REPLICATE', 'Replicate'],
  ['TOGETHER', 'Together AI'],
  ['FIREWORKS', 'Fireworks AI'],
  ['STABILITY', 'Stability AI'],
  ['ELEVENLABS', 'ElevenLabs'],
  ['VOYAGE', 'Voyage AI'],
  ['LANGCHAIN', 'LangSmith'],
  ['LANGSMITH', 'LangSmith'],
]

const recommendTagForEnvKey = (key: string): string | null => {
  const upper = key.toUpperCase()
  if (upper === '') return null
  return ENV_KEY_PATTERN_TO_TAG_NAME.find(([p]) => upper.includes(p))?.[1] ?? null
}

const EnvVarFormDialog = ({
  editing,
  attachedTags,
  initialKey,
  initialValue = '',
  onClose,
  onSubmit,
}: {
  editing: EnvVar | null
  attachedTags: string[]
  initialKey?: string
  initialValue?: string
  onClose: () => void
  onSubmit: (input: { key: string; value: string; sensitive: boolean }) => void
}) => {
  const isEdit = editing !== null
  const locked = isEdit && editing.sensitive
  const [key, setKey] = useState(initialKey ?? editing?.key ?? '')
  const [value, setValue] = useState(initialValue)
  const [sensitive, setSensitive] = useState(editing?.sensitive ?? false)
  const [revealed, setRevealed] = useState(false)
  const [uncheckedSuggestion, setUncheckedSuggestion] = useState<string | null>(null)
  // edit はキーを変えられないので提案しない
  const suggested = isEdit ? null : recommendTagForEnvKey(key)
  const showSuggestion =
    suggested !== null &&
    !attachedTags.some((name) => name.toLowerCase() === suggested.toLowerCase())
  const attachChecked = suggested !== null && uncheckedSuggestion !== suggested
  // add は値が必須。edit は空のまま保存すると値を据え置く
  const canSubmit = key.trim() !== '' && (isEdit || value !== '')
  return (
    <Dialog isOpen onOpenChange={(open) => !open && onClose()}>
      {/* GAP-NEW: Dialog に幅の指定が無い。実物は中身を w-[472px]（= 外寸 520px）に固定している */}
      <DialogHeader>
        <DialogTitle>{isEdit ? '環境変数を編集' : '環境変数を追加'}</DialogTitle>
      </DialogHeader>
      <Stack gap="l">
        <TextField
          label="キー"
          placeholder="API_KEY"
          size="s"
          width="full"
          autoComplete="off"
          spellCheck="false"
          value={key}
          isDisabled={isEdit}
          onChange={setKey}
        />
        {/* GAP-NEW: TextField に末尾アクションのスロットが無い。実物は入力欄の右端に目のトグルを重ねている。
            ここは入力欄の右に並べる */}
        <Stack flexDirection="row" gap="xxs" alignItems="flex-end">
          <TextField
            label="値"
            placeholder="●●●●●●●●●●●●"
            size="s"
            width="full"
            type={revealed ? 'text' : 'password'}
            autoComplete="off"
            spellCheck="false"
            caption={isEdit ? '変更する場合のみ入力してください。' : undefined}
            value={value}
            onChange={setValue}
          />
          <EyeToggle
            kind={revealed ? 'hide' : 'reveal'}
            label={revealed ? '値を非表示' : '値を表示'}
            pressed={revealed}
            onPress={() => setRevealed((r) => !r)}
          />
        </Stack>
        <Stack gap="xxs">
          <Checkbox isSelected={sensitive} isDisabled={locked} onChange={setSensitive}>
            機密情報として扱う
          </Checkbox>
          <Typography component="div" size="s" color="medium_emphasis">
            ※値は非表示になり、あとから中身を確認することはできなくなります。変更したいときは新しい値で上書きしてください。
          </Typography>
          {locked && (
            <Typography component="div" size="s" color="medium_emphasis">
              一度「機密」に設定した環境変数は解除できません。
            </Typography>
          )}
        </Stack>
        {showSuggestion && (
          <Stack gap="xxs">
            <Checkbox
              isSelected={attachChecked}
              onChange={(checked) => setUncheckedSuggestion(checked ? null : suggested)}
            >
              {`タグ「${suggested}」をプロジェクトに付ける`}
            </Checkbox>
            <Typography component="div" size="s" color="medium_emphasis">
              キー名から AI プロバイダを推定しています。付けたタグはあとから外せます。
            </Typography>
          </Stack>
        )}
      </Stack>
      <DialogFooter>
        <Button appearance="outlined" color="neutral" size="s" onPress={onClose}>
          キャンセル
        </Button>
        <Button
          appearance="flat"
          color="neutral"
          size="s"
          isDisabled={!canSubmit}
          onPress={() => onSubmit({ key, value, sensitive })}
        >
          保存
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

type EnvDialog =
  | { kind: 'none' }
  | { kind: 'form'; editing: EnvVar | null; initialKey?: string; initialValue?: string }
  | { kind: 'delete'; env: EnvVar }

const EnvVarsScreen = ({
  initialVars = envVars,
  initialDialog = { kind: 'none' },
  load,
}: {
  initialVars?: EnvVar[]
  initialDialog?: EnvDialog
  load?: Load
}) => {
  const [vars, setVars] = useState(initialVars)
  const [target, setTarget] = useState<EnvVar['target']>('production')
  const [dialog, setDialog] = useState<EnvDialog>(initialDialog)
  const close = () => setDialog({ kind: 'none' })
  // 本番・プレビューのどちらかに設定済みなら案内済みとみなす
  const hasAiGatewayKey = vars.some((e) => e.key === AI_GATEWAY_ENV_KEY)

  // 読み込み中と取得失敗は、タブごと置き換わる
  if (load) {
    return (
      <AppShell active="site">
        <Stack gap="l">
          <ProjectBreadcrumbs />
          {load === 'loading' ? (
            <SectionLoading />
          ) : (
            <Callout color="negative">
              環境変数の取得に失敗しました。時間をおいて再度お試しください。
            </Callout>
          )}
        </Stack>
      </AppShell>
    )
  }

  return (
    <AppShell active="site">
      <Stack gap="l">
        <ProjectBreadcrumbs />
        <Tabs selectedKey={target} onSelectionChange={(k) => setTarget(k as EnvVar['target'])}>
          <TabList aria-label="環境変数の環境">
            <Tab id="production">本番</Tab>
            <Tab id="preview">プレビュー</Tab>
          </TabList>
          {/* GAP-10: TabPanel は react-aria-components から直接 import している */}
          {(['production', 'preview'] as const).map((t) => (
            <TabPanel key={t} id={t}>
              <Stack gap="m">
                <Stack alignItems="flex-end">
                  <Button
                    appearance="flat"
                    color="neutral"
                    size="s"
                    onPress={() => setDialog({ kind: 'form', editing: null })}
                  >
                    + 環境変数を追加
                  </Button>
                </Stack>
                {!hasAiGatewayKey && (
                  <Callout
                    color="neutral"
                    appearance="flat"
                    action={
                      <LinkButton
                        href="https://lolipop.jp/ai/gateway/"
                        target="_blank"
                        rel="noopener noreferrer"
                        appearance="outlined"
                        size="s"
                        trailing={<Icon name="launch" size="s" />}
                      >
                        APIキーを発行
                      </LinkButton>
                    }
                  >
                    <Stack gap="xxs">
                      <Typography component="div" size="s" fontWeight="bold">
                        アプリにAIを組み込むには
                      </Typography>
                      <Typography component="div" size="xs" color="medium_emphasis">
                        ロリポップ！AIゲートウェイは、Claude・GPT・Gemini
                        などのAIモデルをひとつのAPIキーで呼び出せるサービスです。
                      </Typography>
                      {/* GAP-20: 実物はキー名を font-mono の code チップで出している */}
                      <Typography component="div" size="xs" color="medium_emphasis">
                        発行したキーを{' '}
                        <Typography component="span" size="xs" fontWeight="bold">
                          {AI_GATEWAY_ENV_KEY}
                        </Typography>{' '}
                        として追加すると、アプリから使えます。
                      </Typography>
                    </Stack>
                  </Callout>
                )}
                <EnvVarList
                  vars={vars.filter((e) => e.target === t)}
                  target={t}
                  onEdit={(env) => setDialog({ kind: 'form', editing: env })}
                  onDelete={(env) => setDialog({ kind: 'delete', env })}
                />
              </Stack>
            </TabPanel>
          ))}
        </Tabs>
      </Stack>

      {dialog.kind === 'form' && (
        <EnvVarFormDialog
          editing={dialog.editing}
          attachedTags={['Next.js']}
          initialKey={dialog.initialKey}
          initialValue={dialog.initialValue}
          onClose={close}
          onSubmit={({ key, value, sensitive }) => {
            // GAP-NEW: SnackBar にアクションを置けない（実物は保存後に「再デプロイ」付きのトーストを出す）
            const editing = dialog.editing
            setVars((vs) =>
              editing
                ? vs.map((e) =>
                    e.id === editing.id ? { ...e, value: value || e.value, sensitive } : e
                  )
                : [...vs, { id: `e-${Date.now()}`, key, value, sensitive, target }]
            )
            close()
          }}
        />
      )}
      {dialog.kind === 'delete' && (
        <ConfirmDialog
          title={`${dialog.env.key} を削除しますか？`}
          description="この環境変数を削除すると、次回のデプロイから読み込まれなくなります。"
          onClose={close}
        />
      )}
    </AppShell>
  )
}

// ─── ストーリー: 設定 ───

/**
 * プロジェクトの設定。ビルド設定・GitHub リポジトリ・タグ・プロジェクト削除の 4 枚のカードが並ぶ。
 * ビルド設定は「編集」でその場のフォームに切り替わり、GitHub リポジトリの自動デプロイと
 * プレビューは Switch で切り替える。
 *
 * @summary プロジェクトの設定
 */
export const Default: Story = {
  render: () => <SettingsScreen />,
}

/**
 * 各カードの読み込み中と取得失敗。カードごとに別々に取得するので、ビルド設定と GitHub リポジトリは
 * それぞれの場所で「読み込み中」や失敗の Callout に置き換わる。タグは取得に失敗したときだけ、
 * タグの並びの代わりに文言を出す。
 *
 * @summary 読み込み中・取得失敗
 */
export const LoadingAndError: Story = {
  render: () => (
    <Stack gap="xxl">
      <SettingsScreen build={{ load: 'loading' }} gitLoad="loading" />
      <SettingsScreen build={{ load: 'error' }} gitLoad="error" tagsLoadFailed />
    </Stack>
  ),
}

/**
 * ビルド設定の「編集」を開いたところ。フレームワークを変えると、コマンドと出力ディレクトリが
 * そのフレームワークの既定の値に入れ替わる。
 *
 * @summary ビルド設定の編集
 */
export const BuildConfigEditing: Story = {
  render: () => <SettingsScreen build={{ editing: true }} />,
}

/**
 * GitHub リポジトリをまだ接続していないとき。「リポジトリを接続」でリポジトリを選び、
 * デプロイするブランチを確かめてから接続するダイアログを開いている。
 *
 * @summary リポジトリを接続
 */
export const ConnectRepository: Story = {
  render: () => <SettingsScreen initialConnection={null} initialDialog={{ kind: 'connect' }} />,
}

/**
 * デプロイするブランチの「変更」。空のあいだは「保存」を押せない。
 *
 * @summary ブランチの変更
 */
export const BranchDialog: Story = {
  render: () => <SettingsScreen initialDialog={{ kind: 'branch' }} />,
}

/**
 * リポジトリの「接続を解除」の確認。
 *
 * @summary 接続の解除
 */
export const DisconnectDialog: Story = {
  render: () => <SettingsScreen initialDialog={{ kind: 'disconnect' }} />,
}

/**
 * 「+ タグを追加」のダイアログ。まだ付けていない既存のタグを押すか、新しいタグを入れて「追加」する。
 *
 * @summary タグを追加
 */
export const TagDialog: Story = {
  render: () => <SettingsScreen initialDialog={{ kind: 'tag' }} />,
}

/**
 * プロジェクト削除の確認。
 *
 * @summary プロジェクトの削除
 */
export const DeleteDialog: Story = {
  render: () => <SettingsScreen initialDialog={{ kind: 'delete' }} />,
}

// ─── ストーリー: 環境変数 ───

/**
 * 環境変数。本番とプレビューをタブで分け、機密の値は伏せ字のまま、そうでない値は目のアイコンで
 * 確かめられる。AI ゲートウェイのキーが無いときは、発行の案内を出す。行の ⋯ から編集と削除ができる。
 *
 * @summary 環境変数
 */
export const EnvVars: Story = {
  render: () => <EnvVarsScreen />,
}

/**
 * 本番に環境変数がまだ無いとき。
 *
 * @summary 本番の環境変数が無いとき
 */
export const EnvVarsProductionEmpty: Story = {
  render: () => <EnvVarsScreen initialVars={[]} />,
}

/**
 * 環境変数の読み込み中と取得失敗。タブごと置き換わる。
 *
 * @summary 環境変数の読み込み中・取得失敗
 */
export const EnvVarsLoadingAndError: Story = {
  render: () => (
    <Stack gap="xxl">
      <EnvVarsScreen load="loading" />
      <EnvVarsScreen load="error" />
    </Stack>
  ),
}

/**
 * 「+ 環境変数を追加」のダイアログ。キー名から AI プロバイダを推定し、タグを付けるかを聞く。
 *
 * @summary 環境変数を追加
 */
export const EnvVarDialog: Story = {
  render: () => (
    <EnvVarsScreen
      initialDialog={{
        kind: 'form',
        editing: null,
        initialKey: 'ANTHROPIC_API_KEY',
        initialValue: 'sk-ant-xxxxxxxx',
      }}
    />
  ),
}

/**
 * ⋯ の「削除」の確認。
 *
 * @summary 環境変数の削除
 */
export const EnvVarDeleteDialog: Story = {
  render: () => <EnvVarsScreen initialDialog={{ kind: 'delete', env: envVars[2] }} />,
}
