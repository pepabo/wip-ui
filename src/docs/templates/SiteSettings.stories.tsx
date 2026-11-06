import { Fragment, useState } from 'react'

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
import { TextField } from '../../TextField'
import { Typography } from '../../Typography'
import {
  DeployNowShell,
  DeployNowTabs,
  ProjectDetailLayout,
  useDeployNowNavigate,
} from './deployNowShell'
import { TextLink } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

/**
 * デプロイナウ（hosting-deploy-now/frontend）のプロジェクト設定と環境変数を、ホスティング管理画面の中に写したもの。
 * - 設定: features/Project/index.tsx の settings タブ（ProjectBuildConfig + BuildConfigForm / ProjectGit +
 *   ConnectionAddDialog・ConnectionBranchDialog・ConnectionDisconnectDialog / ProjectTags + TagAddDialog /
 *   プロジェクト削除 + components/ProjectDeleteDialog）
 * - 環境変数: features/Project/features/ProjectEnvVars（EnvVarFormDialog / EnvVarDeleteDialog / KebabMenu / EyeIcons）
 * どちらもプロジェクト詳細のタブの中身で、枠は DeployNowShell と ProjectDetailLayout（パンくず・ProjectHero・
 * タブ。値は Deploys と同じ portfolio）。設定は「設定」タブ、環境変数は「環境変数」タブを選んだ状態。
 * 文言は shared/lib/schemas.ts と各コンポーネントの文字列のまま。
 */

const meta = {
  title: 'Templates/DeployNow/SiteSettings',
  // テンプレートはロリポップのトンマナを確かめる場所なので、フレーバーを lolipop に固定する
  globals: { flavor: 'lolipop' },
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── GAP の回避策（inline style はここに集める） ───

// 実物の Typography は component 無し（既定の p）が多いが、実物は Tailwind の preflight で p の margin が 0。
// Storybook には preflight が無く p の既定の margin が出るので、ここでは component="div" にしている。

// 面の余白は Paper の padding で付ける（GAP-1 は解消）。設定カードと一覧の面は既定の l、
// ダイアログの中のリポジトリ選択の面は m。
// GAP-NEW: 行ごとに余白をとる部品が無い。一覧の行（実物は px-6 py-4）と列見出し（px-6 py-2）は
//          面の余白の内側に並ぶので、区切り線が面の端まで届かない。
// GAP-NEW: 余白をとる部品が無い。面を持たない読み込み中（実物は py-16）の広い上下の余白。
//          Stack の gap は要素の間にしか付かず、Paper は白い面になるので付けられない。

// GAP-NEW: Button の isPending に見た目が無い（押せなくなるだけ）。実物の wip-ui も同じなので、
// 処理中が分かるよう leading に Loader を入れている。

// 素の button の見た目を消す（実物は Tailwind の preflight で枠・地・余白が無い）
const plainButtonStyle = {
  padding: 0,
  border: 0,
  background: 'none',
  font: 'inherit',
  color: 'inherit',
  cursor: 'pointer',
} as const
// 実物の code チップ（rounded border px-1）
// 枠の色は low_emphasis を 3 割に薄める（実物の #e0e0e0 に寄せた、出典の無い暫定値）
const codeChipStyle = {
  padding: '0 4px',
  border: '1px solid color-mix(in srgb, currentColor 30%, transparent)',
  borderRadius: 4,
} as const
// 実物のタグの中の inline-flex items-center gap-1
const tagInnerStyle = { display: 'inline-flex', alignItems: 'center', gap: 4 } as const

/** 実物の各セクションの読み込み中（flex justify-center py-16 + Loader）。 */
const SectionLoading = () => (
  <Stack alignItems="center">
    <Loader size="m" message="読み込み中" />
  </Stack>
)

// GAP-NEW: TextField のエラー文言スロットが react-aria のネイティブ検証前提で、
// 送信時の独自検証の文言を出せない。実物と同じく Typography で下に置いている。

/** 実物の「⚠️ ○○ を削除しますか？」型の確認ダイアログ（w-[360px]）。 */
const ConfirmDialog = ({
  title,
  description,
  confirmLabel = '削除',
  onClose,
  onConfirm = onClose,
}: {
  title: string
  description: string
  confirmLabel?: string
  onClose: () => void
  onConfirm?: () => void
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
      <Button appearance="flat" color="negative" size="m" onPress={onConfirm}>
        {confirmLabel}
      </Button>
    </DialogFooter>
  </Dialog>
)

/** GitHubRepositoryPicker の「リポジトリの選択を変更」。GitHub の App の設定画面へ移る */
const ChangeRepositoryAccessLink = () => {
  const navigate = useDeployNowNavigate()
  return (
    <LinkButton
      href="#"
      appearance="transparent"
      size="s"
      onPress={() => navigate('github-installation')}
    >
      リポジトリの選択を変更
    </LinkButton>
  )
}

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

// ─── 設定: ビルド設定（ProjectBuildConfig / BuildConfigForm） ───

type Load = 'loading' | 'error'
type BuildFieldKey = 'rootDir' | 'installCommand' | 'buildCommand' | 'outputDir'

type BuildState = {
  load?: Load
  editing?: boolean
}

/**
 * 実物の ConfigRow（ProjectBuildConfig）と SettingRow（ProjectGit）。
 * どちらも flex flex-col gap-1、sm 以上で flex-row gap-4。
 * GAP-NEW: 項目名の幅の固定（sm:w-48 shrink-0）が無いので、値の左端が行ごとにそろわない。
 * GAP-17: 実物は sm 以上でだけ items-baseline（ConfigRow）/ items-center（SettingRow）。alignItems がレスポンシブにできないので付けていない。
 * GAP-NEW: 値の列を伸ばす指定（flex-1）が無い。操作がある行は、項目名と値の組と操作を space-between で両端に分けている。
 */
const SettingRow = ({
  label,
  children,
  action,
}: {
  label: string
  children: ReactNode
  action?: ReactNode
}) => {
  const row = (
    <Stack flexDirection={{ xxs: 'column', s: 'row' }} gap={{ xxs: 'xxs', s: 'm' }}>
      <Typography component="div" size="s" color="medium_emphasis">
        {label}
      </Typography>
      {children}
    </Stack>
  )
  if (!action) return row
  return (
    <Stack
      flexDirection={{ xxs: 'column', s: 'row' }}
      gap={{ xxs: 'xxs', s: 'm' }}
      justifyContent="space-between"
    >
      {row}
      {action}
    </Stack>
  )
}

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
    <Paper outlined>
      <Stack gap="m">
        <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
          <Typography component="div" size="m" fontWeight="bold">
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
                  color={value === '—' ? 'low_emphasis' : undefined}
                >
                  {value}
                </Typography>
              </SettingRow>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
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
    <Paper outlined>
      <Stack gap="m">
        <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
          <Typography component="div" size="m" fontWeight="bold">
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
                  <TextLink
                    key="v"
                    href={`https://github.com/${connection.repositoryFullName}`}
                    external
                  >
                    {connection.repositoryFullName}
                  </TextLink>,
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
    </Paper>
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
            {/* 実物の GitHubRepositoryPicker（flex flex-col gap-3 sm:flex-row）。
                GAP-NEW: 幅の割合の指定が無い。実物はアカウント選択が sm:w-2/5、検索が sm:flex-1。
                ここは width="full" どうしが等分になる */}
            <Stack flexDirection={{ xxs: 'column', s: 'row' }} gap="s">
              <Select aria-label="アカウント" width="full" defaultSelectedKey="1001">
                <SelectItem id="1001" textValue="example-inc">
                  <Stack flexDirection="row" gap="xs" alignItems="center">
                    <Icon name="github" size="s" />
                    example-inc
                    <Typography component="span" size="xs" color="medium_emphasis">
                      Organization
                    </Typography>
                  </Stack>
                </SelectItem>
                <SelectItem id="install-new-account" textValue="アカウント追加">
                  <Stack flexDirection="row" gap="xs" alignItems="center">
                    <Icon name="plus" size="s" />
                    アカウント追加
                  </Stack>
                </SelectItem>
              </Select>
              <TextField
                aria-label="リポジトリを検索"
                type="search"
                width="full"
                value={query}
                onChange={setQuery}
                placeholder="リポジトリを検索"
                autoComplete="off"
              />
            </Stack>
            {matched.length === 0 ? (
              // 実物は Paper outlined + py-8 text-center。GAP-NEW: 上下だけの余白が無いので padding は xl（32px）を四方に付けている
              <Paper outlined padding="xl">
                <Stack alignItems="center">
                  <Typography component="div" size="s" color="low_emphasis">
                    {`「${query}」に一致するリポジトリがありません。`}
                  </Typography>
                </Stack>
              </Paper>
            ) : (
              // 実物は Paper outlined の中の ul.divide-y で、行は px-4 py-3。区切り線を面の端まで通すため、
              // 面は none にし、行を padding="s"（12px）の入れ子の Paper にする。
              // GAP-NEW: Paper の padding は上下左右で同じ値しか取れない。行の左右が実物より 4px 狭い
              <Paper outlined padding="none">
                {matched.map((r, i) => (
                  <Fragment key={r.id}>
                    {i > 0 && <Divider />}
                    <Paper padding="s" elevation={0}>
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
                    </Paper>
                  </Fragment>
                ))}
              </Paper>
            )}
            {/* 実物の GitHubRepositoryPicker の末尾（GitHub 側でアクセスを許可するリポジトリを変える導線） */}
            {/* GAP-NEW: Stack に折り返し（flex-wrap）が無い */}
            <Stack flexDirection="row" gap="xs" alignItems="center">
              <Typography component="div" size="s" color="medium_emphasis">
                目的のリポジトリがありませんか？
              </Typography>
              <ChangeRepositoryAccessLink />
            </Stack>
          </>
        ) : (
          <>
            {/* 実物は rounded-lg bg-neutral-100 p-4 の div。GAP-NEW: Paper に地色の違う面が無いので outlined で代える */}
            <Paper padding="m" outlined>
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
              autoComplete="off"
              spellCheck="false"
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
  <Paper outlined>
    <Stack gap="m">
      <Typography component="div" size="m" fontWeight="bold">
        タグ
      </Typography>
      {loadFailed ? (
        <Typography component="div" size="s" color="negative">
          タグの取得に失敗しました。
        </Typography>
      ) : (
        // 実物は flex flex-wrap items-center gap-2。GAP-NEW: Stack に折り返し（flex-wrap）が無い
        <Stack flexDirection="row" gap="xs" alignItems="center">
          {tags.map((t) => (
            // GAP-NEW: 外せるタグ（removable な Tag / Chip）が無い。実物と同じく、Sticker の中の
            // inline-flex gap-1 に名前と素の button の「×」を並べる
            <Sticker key={t} color="neutral" size="s">
              <span style={tagInnerStyle}>
                {t}
                <button
                  type="button"
                  aria-label={`タグ「${t}」を外す`}
                  style={plainButtonStyle}
                  onClick={() => onDetach(t)}
                >
                  ×
                </button>
              </span>
            </Sticker>
          ))}
          <Button appearance="outlined" color="neutral" size="s" onPress={onAdd}>
            + タグを追加
          </Button>
        </Stack>
      )}
    </Stack>
  </Paper>
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
            {/* GAP-NEW: 押せる Sticker が無い。実物と同じく Sticker を素の button で包む。
                実物は flex flex-wrap gap-2 で、hover で薄くなる（hover は出せない）。Stack に折り返しが無い */}
            <Stack flexDirection="row" gap="xs">
              {availableTags.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-label={`タグ「${t}」を追加`}
                  style={plainButtonStyle}
                  onClick={() => onAttach(t)}
                >
                  <Sticker color="neutral" size="s">
                    {t}
                  </Sticker>
                </button>
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
  const navigate = useDeployNowNavigate()
  return (
    <DeployNowShell>
      <ProjectDetailLayout activeTab="settings">
        <Stack gap="l">
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
          <Paper outlined>
            <Stack flexDirection="row" gap="m" alignItems="center" justifyContent="space-between">
              <Stack gap="xxs">
                <Typography component="div" size="m" fontWeight="bold">
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
          </Paper>
        </Stack>
      </ProjectDetailLayout>

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
          // 実物は削除に成功するとプロジェクト一覧へ移る
          onConfirm={() => {
            close()
            navigate('projects')
          }}
        />
      )}
    </DeployNowShell>
  )
}

// ─── 環境変数（features/Project/features/ProjectEnvVars） ───

const MASKED_VALUE = '••••••••••'
const AI_GATEWAY_ENV_KEY = 'AI_GATEWAY_API_KEY'

// GAP-NEW: アイコンに目（表示 / 非表示）が無い。実物と同じく、EyeIcons の SVG（Figma の visibility /
// visibility_off）をそのまま埋め込む
const EyeIcon = () => (
  <svg width="16" height="16" viewBox="8 8 16 16" fill="currentColor" aria-hidden="true">
    <path d="M18.125 18.125C18.7083 17.5417 19 16.8333 19 16C19 15.1667 18.7083 14.4583 18.125 13.875C17.5417 13.2917 16.8333 13 16 13C15.1667 13 14.4583 13.2917 13.875 13.875C13.2917 14.4583 13 15.1667 13 16C13 16.8333 13.2917 17.5417 13.875 18.125C14.4583 18.7083 15.1667 19 16 19C16.8333 19 17.5417 18.7083 18.125 18.125ZM14.725 17.275C14.375 16.925 14.2 16.5 14.2 16C14.2 15.5 14.375 15.075 14.725 14.725C15.075 14.375 15.5 14.2 16 14.2C16.5 14.2 16.925 14.375 17.275 14.725C17.625 15.075 17.8 15.5 17.8 16C17.8 16.5 17.625 16.925 17.275 17.275C16.925 17.625 16.5 17.8 16 17.8C15.5 17.8 15.075 17.625 14.725 17.275ZM11.5667 19.6417C10.2333 18.7361 9.26667 17.5222 8.66667 16C9.26667 14.4778 10.2333 13.2639 11.5667 12.3583C12.9 11.4528 14.3778 11 16 11C17.6222 11 19.1 11.4528 20.4333 12.3583C21.7667 13.2639 22.7333 14.4778 23.3333 16C22.7333 17.5222 21.7667 18.7361 20.4333 19.6417C19.1 20.5472 17.6222 21 16 21C14.3778 21 12.9 20.5472 11.5667 19.6417Z" />
  </svg>
)

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M13.2001 15.0664L10.4001 12.2997C10.0112 12.422 9.61958 12.5136 9.22513 12.5747C8.83069 12.6359 8.42235 12.6664 8.00013 12.6664C6.32235 12.6664 4.82791 12.2025 3.5168 11.2747C2.20569 10.347 1.25569 9.14418 0.666797 7.66641C0.90013 7.07752 1.19457 6.5303 1.55013 6.02474C1.90569 5.51918 2.31124 5.06641 2.7668 4.66641L0.933464 2.79974L1.8668 1.86641L14.1335 14.1331L13.2001 15.0664ZM8.00013 10.6664C8.12235 10.6664 8.23624 10.6609 8.3418 10.6497C8.44735 10.6386 8.56124 10.6164 8.68346 10.5831L5.08346 6.98307C5.05013 7.1053 5.02791 7.21918 5.0168 7.32474C5.00569 7.4303 5.00013 7.54418 5.00013 7.66641C5.00013 8.49974 5.2918 9.20807 5.87513 9.79141C6.45846 10.3747 7.1668 10.6664 8.00013 10.6664ZM12.8668 10.9664L10.7501 8.86641C10.8279 8.67752 10.889 8.48585 10.9335 8.29141C10.9779 8.09696 11.0001 7.88863 11.0001 7.66641C11.0001 6.83307 10.7085 6.12474 10.1251 5.54141C9.5418 4.95807 8.83346 4.66641 8.00013 4.66641C7.77791 4.66641 7.56957 4.68863 7.37513 4.73307C7.18069 4.77752 6.98902 4.84418 6.80013 4.93307L5.10013 3.23307C5.55569 3.04418 6.02235 2.90252 6.50013 2.80807C6.97791 2.71363 7.47791 2.66641 8.00013 2.66641C9.67791 2.66641 11.1724 3.1303 12.4835 4.05807C13.7946 4.98585 14.7446 6.18863 15.3335 7.66641C15.0779 8.32196 14.7418 8.9303 14.3251 9.49141C13.9085 10.0525 13.4224 10.5442 12.8668 10.9664ZM9.78346 7.89974L7.78346 5.89974C8.09457 5.84418 8.38069 5.86918 8.6418 5.97474C8.90291 6.0803 9.12791 6.23307 9.3168 6.43307C9.50569 6.63307 9.6418 6.86363 9.72513 7.12474C9.80846 7.38585 9.82791 7.64418 9.78346 7.89974Z" />
  </svg>
)

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
    {kind === 'reveal' ? <EyeIcon /> : <EyeOffIcon />}
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
  // 実物は Paper outlined overflow-hidden。空の案内は px-6 py-16 なので padding を xxl（48px）にして近づける。
  // 一覧は列見出しが px-6 py-2、行が px-6 py-4 で、間を区切り線で分ける。区切り線を面の端まで通すため、
  // 面は none にし、列見出しと行をそれぞれ padding="m" の入れ子の Paper にする（Deploys と同じ）。
  // GAP-NEW: Paper の padding は上下左右で同じ値しか取れない。列見出しは上下が実物より 8px 広く、左右は 8px 狭い
  <Paper outlined padding={vars.length === 0 ? 'xxl' : 'none'}>
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
      <Fragment>
        {/* GAP-NEW: 実物の列は md 以上で 320px 固定 / 1fr / auto。Grid の 12 分割で近づけている */}
        <Paper padding="m" elevation={0}>
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
        </Paper>
        {vars.map((env) => (
          <Fragment key={env.id}>
            <Divider />
            <Paper padding="m" elevation={0}>
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
                        <Icon name="ellipsis_horizontal" size="s" />
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
            </Paper>
          </Fragment>
        ))}
      </Fragment>
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
      <DeployNowShell>
        <ProjectDetailLayout activeTab="env">
          {load === 'loading' ? (
            <SectionLoading />
          ) : (
            <Callout color="negative">
              環境変数の取得に失敗しました。時間をおいて再度お試しください。
            </Callout>
          )}
        </ProjectDetailLayout>
      </DeployNowShell>
    )
  }

  return (
    <DeployNowShell>
      <ProjectDetailLayout activeTab="env">
        {/* タブと本文の間は実物の 16px */}
        <Stack gap="m">
          <DeployNowTabs
            aria-label="環境変数の環境"
            items={[
              { key: 'production', label: '本番' },
              { key: 'preview', label: 'プレビュー' },
            ]}
            selectedKey={target}
            onSelect={(k) => setTarget(k as EnvVar['target'])}
          />
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
                // 実物は素の a で Button を包み、中の span（inline-flex items-center gap-1）に文言とアイコンを並べている
                <a href="https://lolipop.jp/ai/gateway/" target="_blank" rel="noopener noreferrer">
                  <Button appearance="outlined" size="s">
                    <Stack flexDirection="row" gap="xxs" alignItems="center">
                      APIキーを発行
                      <Icon name="launch" size="s" />
                    </Stack>
                  </Button>
                </a>
              }
            >
              <Stack gap="xxs">
                <Typography component="div" size="s" fontWeight="bold">
                  アプリにAIを組み込むには
                </Typography>
                <Typography component="div" size="xs" color="medium_emphasis">
                  ロリポップ！AIゲートウェイは、Claude・GPT・Gemini
                  などのAIモデルをひとつのAPIキーで呼び出せるサービスです。
                  <br />
                  {/* GAP-20: 等幅のトークンが無い。実物と同じく素の code（ブラウザ既定の等幅）にし、
                              枠（rounded border px-1）は素の要素で付ける。枠の色は Typography の色を継ぐ。
                              実物の枠は #e0e0e0・地は白（地の色は出せない） */}
                  発行したキーを{' '}
                  <Typography component="span" size="xs" color="low_emphasis">
                    <code style={codeChipStyle}>
                      <Typography component="span" size="xs" color="medium_emphasis">
                        {AI_GATEWAY_ENV_KEY}
                      </Typography>
                    </code>
                  </Typography>{' '}
                  として追加すると、アプリから使えます。
                </Typography>
              </Stack>
            </Callout>
          )}
          <EnvVarList
            vars={vars.filter((e) => e.target === target)}
            target={target}
            onEdit={(env) => setDialog({ kind: 'form', editing: env })}
            onDelete={(env) => setDialog({ kind: 'delete', env })}
          />
        </Stack>
      </ProjectDetailLayout>

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
    </DeployNowShell>
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
