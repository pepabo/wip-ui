import { useEffect, useState } from 'react'

import { Button } from '../../Button'
import { Callout } from '../../Callout'
import { Checkbox } from '../../Checkbox'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../Dialog'
import { Divider } from '../../Divider'
import { Grid, GridItem } from '../../Grid'
import { Icon } from '../../Icon'
import { Loader } from '../../Loader'
import { Paper } from '../../Paper'
import { Select, SelectItem } from '../../Select'
import { Stack } from '../../Stack'
import { Sticker } from '../../Sticker'
import { Tab, TabList, Tabs } from '../../Tab'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../Table'
import { TextField } from '../../TextField'
import { Typography } from '../../Typography'
import { AppShell } from './AppShell'
import { ServerDetailHeader, server } from './gameServer'
import { Card } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Key, Selection } from 'react-aria-components'

/**
 * MOD 管理（apollo/frontend の (server)/_components/ModManager の「MOD」タブ）。
 * Minecraft (Java版) でサーバーの種類が Vanilla 以外のときだけタブが出る。
 * 一覧（InstalledModsTable）と、「追加」で開く全画面の MOD追加（AddModsDialog: Modrinth の検索）の 2 画面。
 * ここでは MOD とプラグインの両方を入れられる HYBRID のサーバー（mohist）にしている。
 */
const meta = {
  title: 'Templates/Mods',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── データ（形は ListInstalledModsResponse / ModrinthSearchResults に合わせ、値はダミー）───

type ModType = 'MOD' | 'プラグイン'

type InstalledMod = {
  filename: string
  /** Modrinth から入れたものは Modrinth の名前、手で置いた jar はファイル名を出す（getModName） */
  name: string
  type: ModType
  size: string
  installedAt: string
}

// サイズは formatSize（1MB 以上は MB、未満は KB で小数 1 桁）、日付は formatDate（YYYY-MM-DD）
const installedModsInitial: InstalledMod[] = [
  {
    filename: 'lithium-forge-0.11.2.jar',
    name: 'Lithium',
    type: 'MOD',
    size: '0.7MB',
    installedAt: '2026-10-21',
  },
  {
    filename: 'ferritecore-6.0.1-forge.jar',
    name: 'FerriteCore',
    type: 'MOD',
    size: '120.4KB',
    installedAt: '2026-10-21',
  },
  {
    filename: 'LuckPerms-Bukkit-5.4.141.jar',
    name: 'LuckPerms',
    type: 'プラグイン',
    size: '1.9MB',
    installedAt: '2026-10-12',
  },
  {
    filename: 'EssentialsX-2.20.1.jar',
    name: 'EssentialsX-2.20.1.jar',
    type: 'プラグイン',
    size: '1.2MB',
    installedAt: '2026-10-12',
  },
]

type ProjectType = 'mod' | 'plugin' | 'modpack'

type SearchResult = {
  id: string
  name: string
  author: string
  downloads: string
  follows: string
  updated: string
  isInstalled: boolean
}

// 数は formatDownloads（100 万以上は 2 桁の M、1000 以上は 1 桁の K）、更新は formatRelativeTime
const searchResults: Record<ProjectType, SearchResult[]> = {
  mod: [
    {
      id: 'gvQqBUqZ',
      name: 'Lithium',
      author: 'CaffeineMC',
      downloads: '41.27M',
      follows: '9.8K',
      updated: '2週間前',
      isInstalled: true,
    },
    {
      id: 'uXXizFIs',
      name: 'FerriteCore',
      author: 'malte0811',
      downloads: '38.04M',
      follows: '6.1K',
      updated: '1ヶ月前',
      isInstalled: true,
    },
    {
      id: 'fALzjamp',
      name: 'Chunky',
      author: 'pop4959',
      downloads: '9.62M',
      follows: '3.4K',
      updated: '3日前',
      isInstalled: false,
    },
    {
      id: 'l6YH9Als',
      name: 'spark',
      author: 'lucko',
      downloads: '12.80M',
      follows: '4.0K',
      updated: '5日前',
      isInstalled: false,
    },
    {
      id: '9eGKb6K1',
      name: 'Simple Voice Chat',
      author: 'henkelmax',
      downloads: '27.55M',
      follows: '7.7K',
      updated: '6時間前',
      isInstalled: false,
    },
  ],
  plugin: [
    {
      id: 'Vebnzrzj',
      name: 'LuckPerms',
      author: 'lucko',
      downloads: '2.41M',
      follows: '2.2K',
      updated: '1週間前',
      isInstalled: true,
    },
    {
      id: 'P1OZGk5p',
      name: 'ViaVersion',
      author: 'ViaVersion',
      downloads: '5.08M',
      follows: '1.9K',
      updated: '2日前',
      isInstalled: false,
    },
    {
      id: 'swbUV1cr',
      name: 'BlueMap',
      author: 'TBlueF',
      downloads: '612.3K',
      follows: '1.1K',
      updated: '3週間前',
      isInstalled: false,
    },
  ],
  modpack: [
    {
      id: 'ZYgyPyfq',
      name: 'Create: Astral',
      author: 'Laskyyy',
      downloads: '1.32M',
      follows: '1.6K',
      updated: '2ヶ月前',
      isInstalled: false,
    },
    {
      id: 'BYfVnHa7',
      name: 'All of Create',
      author: 'Mapple',
      downloads: '488.0K',
      follows: '702',
      updated: '1ヶ月前',
      isInstalled: false,
    },
  ],
}

// Modrinth のカテゴリ名（実アプリは API から取り、アイコンの SVG も付く）
const categories = [
  'adventure',
  'decoration',
  'economy',
  'equipment',
  'food',
  'game-mechanics',
  'library',
  'magic',
  'management',
  'optimization',
  'storage',
  'technology',
  'utility',
  'worldgen',
]

// AddModsDialog/model.ts の SORT_OPTIONS
const sortOptions = [
  { id: 'relevance', label: '関連性' },
  { id: 'downloads', label: 'ダウンロード' },
  { id: 'follows', label: 'フォロワー' },
  { id: 'newest', label: '公開日' },
  { id: 'updated', label: '更新日' },
]

const configLabel = `${server.mod} ${server.version}`

// AddModsDialog/model.ts の PAGE_SIZE。1 ページ 20 件
const PAGE_SIZE = 20
// 検索の総件数（ModrinthSearchResults の totalCount）。ページ数はここから出す。
// 見本の結果はどのページでも同じものを出している
const totalCounts: Record<ProjectType, number> = { mod: 95, plugin: 3, modpack: 2 }

// ─── 部品 ───

/**
 * MUI の md（900px）未満かどうか。実アプリは sx の display で出し分けている。
 * GAP-NEW: ブレークポイントで要素を出し分ける口（display のレスポンシブ指定）が無いので、
 * matchMedia で判定して描き分けている
 */
const narrowQuery = '(max-width: 899.95px)'
const useNarrow = () => {
  const [narrow, setNarrow] = useState(() => window.matchMedia(narrowQuery).matches)
  useEffect(() => {
    const mql = window.matchMedia(narrowQuery)
    const onChange = () => setNarrow(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])
  return narrow
}

/** Sticker spec='current'（現在のサーバーの種類とバージョン） */
const ConfigSticker = () => (
  <Sticker color="informative" size="m">
    {configLabel}
  </Sticker>
)

/**
 * 名前の左の 40px 角のアイコン。Modrinth のアイコンが無いものは ExtensionOutlined（パズルのピース）。
 * GAP-NEW: 画像の枠も、パズルのピースのアイコンも無い。plus_on_circle で代用
 */
const ModIcon = () => (
  <Typography color="low_emphasis" component="span">
    <Icon name="plus_on_circle" size="l" />
  </Typography>
)

/** 検索欄。GAP-NEW: TextField に先頭の虫めがねと末尾のクリア（×）の枠が無い */
const SearchField = ({
  value,
  onChange,
  onSubmit,
}: {
  value: string
  onChange: (v: string) => void
  onSubmit?: () => void
}) => (
  <Stack flexDirection="row" gap="xxs" alignItems="center">
    <TextField
      aria-label="検索"
      placeholder="検索"
      size="s"
      type="search"
      value={value}
      onChange={onChange}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSubmit?.()
      }}
    />
    {value && (
      <Button
        appearance="transparent"
        size="s"
        iconOnly
        aria-label="検索語を消す"
        onPress={() => onChange('')}
      >
        <Icon name="cross" size="s" />
      </Button>
    )}
  </Stack>
)

/** MUI の Chip（押すと絞り込みが切り替わる）。GAP-NEW: Chip / ToggleButton が無いので Button で代用 */
const FilterChip = ({
  label,
  active,
  onPress,
}: {
  label: string
  active: boolean
  onPress: () => void
}) => (
  <Button
    appearance={active ? 'flat' : 'outlined'}
    color={active ? 'interactive' : 'neutral'}
    size="s"
    aria-pressed={active}
    leading={active ? <Icon name="check" size="s" /> : undefined}
    onPress={onPress}
  >
    {label}
  </Button>
)

// ─── インストール済MOD ───

const typeLabel = (mods: InstalledMod[]) => {
  const hasMod = mods.some((m) => m.type === 'MOD')
  const hasPlugin = mods.some((m) => m.type === 'プラグイン')
  // getFileTypeLabel
  if (hasMod && hasPlugin) return 'MODファイルおよびプラグインファイル'
  if (hasPlugin) return 'プラグインファイル'
  return 'MODファイル'
}

/** 「N個選択中」の行のアンインストール。実アプリは md 未満で small、以上で medium */
const UninstallSelectedButton = ({
  size,
  isDisabled,
  onPress,
}: {
  size: 's' | 'm'
  isDisabled: boolean
  onPress: () => void
}) => (
  // GAP-NEW: DeleteOutlined の「線のゴミ箱」が無いので garbage_can
  <Button
    appearance="outlined"
    size={size}
    leading={<Icon name="garbage_can" size="s" />}
    isDisabled={isDisabled}
    onPress={onPress}
  >
    アンインストール
  </Button>
)

const InstalledMods = ({
  loading,
  mods,
  initialUninstall,
  onAdd,
}: {
  loading: boolean
  mods: InstalledMod[]
  initialUninstall: string[] | null
  onAdd: () => void
}) => {
  const narrow = useNarrow()
  const [query, setQuery] = useState('')
  // InstalledModsTable/hooks.ts の activeFilters。最初は MOD もプラグインも有効
  const [filters, setFilters] = useState<ModType[]>(['MOD', 'プラグイン'])
  const [selected, setSelected] = useState<Set<Key>>(new Set(initialUninstall ?? []))
  const [targets, setTargets] = useState<string[] | null>(initialUninstall)

  const q = query.trim().toLowerCase()
  const visible = mods.filter(
    (m) =>
      filters.includes(m.type) &&
      (m.name.toLowerCase().includes(q) || m.filename.toLowerCase().includes(q))
  )
  // HYBRID のサーバーなので両方のチップが出る（MOD サーバーは MOD だけ、PLUGIN サーバーはプラグインだけ）
  const toggleFilter = (t: ModType) =>
    setFilters((prev) => (prev.includes(t) ? prev.filter((f) => f !== t) : [...prev, t]))
  const targetMods = mods.filter((m) => targets?.includes(m.filename))

  const chips = (
    <Stack flexDirection="row" gap="xs">
      <FilterChip
        label="MOD"
        active={filters.includes('MOD')}
        onPress={() => toggleFilter('MOD')}
      />
      <FilterChip
        label="プラグイン"
        active={filters.includes('プラグイン')}
        onPress={() => toggleFilter('プラグイン')}
      />
    </Stack>
  )
  const selectionLabel = (
    <Typography size="s" component="span">
      {selected.size > 0 ? `${selected.size}個選択中` : '未選択'}
    </Typography>
  )

  return (
    <Stack gap="m">
      <Stack flexDirection="row" gap="m" alignItems="center">
        <Typography size="xxl" fontWeight="bold" component="h2">
          インストール済MOD
        </Typography>
        <ConfigSticker />
      </Stack>
      <Stack flexDirection="row" gap="m" justifyContent="space-between" alignItems="center">
        <SearchField value={query} onChange={setQuery} />
        <Button appearance="outlined" leading={<Icon name="plus" size="s" />} onPress={onAdd}>
          追加
        </Button>
      </Stack>
      {loading ? (
        // GAP-NEW: Skeleton が無い。実アプリは高さ 400 の角丸の Skeleton
        <Card>
          <Stack alignItems="center">
            <Loader size="l" />
          </Stack>
        </Card>
      ) : (
        <Paper padding="none" elevation={0} outlined>
          <Paper padding="m" elevation={0}>
            {narrow ? (
              // md 未満: 1 行目に「未選択」と small のアンインストール、2 行目にチップ
              <Stack gap="s">
                <Stack
                  flexDirection="row"
                  gap="m"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {selectionLabel}
                  <UninstallSelectedButton
                    size="s"
                    isDisabled={selected.size === 0}
                    onPress={() => setTargets([...selected].map(String))}
                  />
                </Stack>
                {chips}
              </Stack>
            ) : (
              <Stack flexDirection="row" gap="s" justifyContent="space-between" alignItems="center">
                <Stack flexDirection="row" gap="m" alignItems="center">
                  {selectionLabel}
                  {chips}
                </Stack>
                <UninstallSelectedButton
                  size="m"
                  isDisabled={selected.size === 0}
                  onPress={() => setTargets([...selected].map(String))}
                />
              </Stack>
            )}
          </Paper>
          <Divider />
          {/* 実アプリは MUI x の DataGrid（行の高さ 72px、列の並べ替え、チェックボックスでの選択） */}
          <Table
            aria-label="インストール済MOD"
            selectionMode="multiple"
            selectionBehavior="toggle"
            selectedKeys={selected}
            onSelectionChange={(keys: Selection) =>
              setSelected(keys === 'all' ? new Set(visible.map((m) => m.filename)) : new Set(keys))
            }
          >
            <TableHeader>
              {/* GAP-NEW: Table が選択のチェックボックス列を描かない。Checkbox を slot="selection" で手で置く。
                  あわせて、Table が面の幅いっぱいに広がらない */}
              <Column>
                <Checkbox slot="selection">{null}</Checkbox>
              </Column>
              <Column isRowHeader allowsSorting>
                名前
              </Column>
              <Column>タイプ</Column>
              <Column allowsSorting>サイズ</Column>
              <Column allowsSorting>インストール日</Column>
              <Column aria-label="操作"> </Column>
            </TableHeader>
            <TableBody
              renderEmptyState={() => (
                <Typography size="s" color="medium_emphasis">
                  インストールされていません
                </Typography>
              )}
            >
              {visible.map((m) => (
                <Row key={m.filename} id={m.filename}>
                  <Cell>
                    <Checkbox slot="selection">{null}</Checkbox>
                  </Cell>
                  <Cell>
                    <Stack flexDirection="row" gap="m" alignItems="center">
                      <ModIcon />
                      <Typography size="s" component="span">
                        {m.name}
                      </Typography>
                    </Stack>
                  </Cell>
                  <Cell>{m.type}</Cell>
                  <Cell>{m.size}</Cell>
                  <Cell>{m.installedAt}</Cell>
                  <Cell>
                    {/* GAP-NEW: Tooltip が無い。実アプリはホバーで「アンインストール」 */}
                    <Button
                      appearance="transparent"
                      size="s"
                      iconOnly
                      aria-label={`${m.name}をアンインストール`}
                      onPress={() => {
                        setSelected(new Set([m.filename]))
                        setTargets([m.filename])
                      }}
                    >
                      <Icon name="garbage_can" size="m" />
                    </Button>
                  </Cell>
                </Row>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* ModManager/UninstallDialog */}
      <Dialog isOpen={targets !== null} onOpenChange={(open) => !open && setTargets(null)}>
        <DialogHeader>
          <DialogTitle>
            {targetMods.length > 1
              ? `選択した${targetMods.length}個をアンインストールしますか？`
              : `「${targetMods[0]?.name ?? ''}」をアンインストールしますか？`}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>{typeLabel(targetMods)}のみを削除します。</DialogDescription>
        <DialogFooter>
          <Button appearance="transparent" onPress={() => setTargets(null)}>
            キャンセル
          </Button>
          <Button appearance="outlined" color="negative" onPress={() => setTargets(null)}>
            アンインストール
          </Button>
        </DialogFooter>
      </Dialog>
    </Stack>
  )
}

// ─── MOD追加（AddModsDialog）───

/** ModManager/CategorySidebar。GAP-NEW: List / ListSubheader が無いので Typography と Checkbox で組む */
const CategorySidebar = ({
  selected,
  onToggle,
  onClear,
  onClose,
}: {
  selected: string[]
  onToggle: (c: string) => void
  onClear: () => void
  /** md 未満の「フィルタ」から開いたときだけ、プラットフォームの右に閉じるボタンが出る */
  onClose?: () => void
}) => (
  <Paper elevation={0} outlined>
    <Stack gap="m">
      <Stack gap="xs">
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <Typography size="xs" color="medium_emphasis" component="h3">
            プラットフォーム
          </Typography>
          {onClose && (
            <Button
              appearance="transparent"
              size="s"
              iconOnly
              aria-label="閉じる"
              onPress={onClose}
            >
              <Icon name="cross" size="s" />
            </Button>
          )}
        </Stack>
        <Typography size="s">Modrinth</Typography>
      </Stack>
      <Divider />
      <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
        <Typography size="xs" color="medium_emphasis" component="h3">
          フィルタ
        </Typography>
        <Button appearance="transparent" size="s" onPress={onClear}>
          すべてクリア
        </Button>
      </Stack>
      {/* GAP-NEW: Collapse / Accordion が無い。実アプリは「カテゴリ」の右の ∨ で開閉する。ここでは開いた状態で固定 */}
      <Typography size="s">カテゴリ</Typography>
      <Stack gap="xs">
        {categories.map((c) => (
          <Checkbox key={c} isSelected={selected.includes(c)} onChange={() => onToggle(c)}>
            {c}
          </Checkbox>
        ))}
      </Stack>
    </Stack>
  </Paper>
)

/** ModManager/ModResultItem */
const ModResultItem = ({ mod }: { mod: SearchResult }) => (
  <>
    <Stack flexDirection="row" gap="m" justifyContent="space-between" alignItems="center">
      <Stack flexDirection="row" gap="m" alignItems="center">
        <ModIcon />
        <Stack gap="xxs">
          <Stack flexDirection={{ xxs: 'column', s: 'row' }} gap="s" alignItems="flex-start">
            {/* GAP-NEW: 文中のリンク（Link）が無い。名前は Modrinth のページを新しいタブで開くリンク */}
            <Stack flexDirection="row" gap="xxs" alignItems="center">
              <Typography size="s" fontWeight="bold" component="span">
                {mod.name}
              </Typography>
              <Typography size="xs" color="medium_emphasis" component="span">
                <Icon name="launch" size="s" />
              </Typography>
            </Stack>
            <Typography size="xs" color="medium_emphasis" component="span">
              by {mod.author}
            </Typography>
          </Stack>
          <Stack flexDirection="row" gap="s" alignItems="center">
            <Stack flexDirection="row" gap="xxs" alignItems="center">
              <Typography size="xs" color="medium_emphasis" component="span">
                <Icon name="download" size="s" />
              </Typography>
              <Typography size="xs" color="medium_emphasis" component="span">
                {mod.downloads}
              </Typography>
            </Stack>
            <Stack flexDirection="row" gap="xxs" alignItems="center">
              <Typography size="xs" color="medium_emphasis" component="span">
                <Icon name="heart_border" size="s" />
              </Typography>
              <Typography size="xs" color="medium_emphasis" component="span">
                {mod.follows}
              </Typography>
            </Stack>
            <Typography size="xs" color="medium_emphasis" component="span">
              更新: {mod.updated}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Button color="interactive" size="s" isDisabled={mod.isInstalled}>
        {mod.isInstalled ? 'インストール済' : 'インストール'}
      </Button>
    </Stack>
  </>
)

/**
 * ModSearchResults の Pagination（showFirstButton / showLastButton）。totalPages が 2 以上のときだけ出る。
 * GAP-16: Pagination が無い。最初・前・番号・次・最後を Button で組む。
 * 実物は総ページ数が多いと途中を「…」で省くが、ここでは 5 ページなので全部並べる
 */
const Pager = ({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (page: number) => void
}) => (
  <Stack flexDirection="row" gap="xs" alignItems="center" justifyContent="center">
    <Button
      appearance="transparent"
      size="s"
      iconOnly
      aria-label="最初のページ"
      isDisabled={page === 1}
      onPress={() => onChange(1)}
    >
      <Icon name="first_page" size="s" />
    </Button>
    <Button
      appearance="transparent"
      size="s"
      iconOnly
      aria-label="前のページ"
      isDisabled={page === 1}
      onPress={() => onChange(page - 1)}
    >
      <Icon name="chevron_left" size="s" />
    </Button>
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
      <Button
        key={n}
        appearance={n === page ? 'flat' : 'transparent'}
        size="s"
        aria-current={n === page ? 'page' : undefined}
        onPress={() => onChange(n)}
      >
        {n}
      </Button>
    ))}
    <Button
      appearance="transparent"
      size="s"
      iconOnly
      aria-label="次のページ"
      isDisabled={page === totalPages}
      onPress={() => onChange(page + 1)}
    >
      <Icon name="chevron_right" size="s" />
    </Button>
    <Button
      appearance="transparent"
      size="s"
      iconOnly
      aria-label="最後のページ"
      isDisabled={page === totalPages}
      onPress={() => onChange(totalPages)}
    >
      <Icon name="last_page" size="s" />
    </Button>
  </Stack>
)

const AddMods = ({ initialQuery, onBack }: { initialQuery: string; onBack: () => void }) => {
  const narrow = useNarrow()
  const [type, setType] = useState<ProjectType>('mod')
  const [query, setQuery] = useState(initialQuery)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [modpackAlert, setModpackAlert] = useState(true)
  const [page, setPage] = useState(1)
  const [filterOpen, setFilterOpen] = useState(false)
  const totalPages = Math.ceil(totalCounts[type] / PAGE_SIZE)

  const toggleCategory = (c: string) => {
    setSelectedCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))
    setPage(1)
  }
  const clearCategories = () => {
    setSelectedCategories([])
    setPage(1)
  }

  const results = searchResults[type].filter((m) =>
    m.name.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <Stack gap="m">
      <Stack alignItems="flex-start">
        {/* GAP-NEW: ArrowBack に当たるアイコンが無いので chevron_left で代用 */}
        <Button
          appearance="outlined"
          size="l"
          leading={<Icon name="chevron_left" size="m" />}
          onPress={onBack}
        >
          戻る
        </Button>
      </Stack>
      <Stack flexDirection="row" gap="m" alignItems="center">
        <Typography size={{ xxs: 'xxl', m: 'xxxl' }} fontWeight="bold" component="h1">
          MOD追加
        </Typography>
        <ConfigSticker />
      </Stack>
      <Grid spacing="m">
        {/* 実アプリは幅 230px の固定。md 未満ではサイドバーを隠し、「フィルタ」ボタンの Popover に入れる */}
        {!narrow && (
          <GridItem size={{ m: 4, l: 3 }}>
            <CategorySidebar
              selected={selectedCategories}
              onToggle={toggleCategory}
              onClear={clearCategories}
            />
          </GridItem>
        )}
        <GridItem size={narrow ? 12 : { m: 8, l: 9 }}>
          <Stack gap="m">
            {/* ModSearchResults。HYBRID のサーバーは MOD / プラグイン / MODパック の 3 つ。
                Select を Tabs の中に置くと落ちるため、Tabs にはタブの列だけを入れて中身は外に出している */}
            <Tabs
              selectedKey={type}
              onSelectionChange={(k) => {
                setType(k as ProjectType)
                setPage(1)
              }}
            >
              <TabList aria-label="種類">
                <Tab id="mod">MOD</Tab>
                <Tab id="plugin">プラグイン</Tab>
                <Tab id="modpack">MODパック</Tab>
              </TabList>
            </Tabs>
            {type === 'modpack' && modpackAlert && (
              // GAP-NEW: Callout に閉じるボタンの枠が無いので action に置く。文中の「バックアップ」も本来はリンク
              <Callout
                color="informative"
                appearance="outline"
                action={
                  <Button
                    appearance="transparent"
                    size="s"
                    iconOnly
                    aria-label="閉じる"
                    onPress={() => setModpackAlert(false)}
                  >
                    <Icon name="cross" size="s" />
                  </Button>
                }
              >
                MODパックをインストールすると既存の設定ファイルが上書きされることがあります。また、パック内のMODを個別に削除・変更すると、正常に動作しなくなる場合があります。操作前に必ずバックアップを作成してください。
              </Callout>
            )}
            <Stack
              flexDirection={{ xxs: 'column', s: 'row' }}
              gap="s"
              justifyContent="space-between"
            >
              <SearchField value={query} onChange={setQuery} />
              <Stack flexDirection="row" gap="s" alignItems="center">
                {/* GAP-NEW: Select の表示値に「並べ替え：」の接頭辞を付けられない（MUI の renderValue） */}
                <Select
                  aria-label="並べ替え"
                  size="s"
                  defaultSelectedKey="relevance"
                  onSelectionChange={() => setPage(1)}
                >
                  {sortOptions.map((o) => (
                    <SelectItem key={o.id} id={o.id}>
                      {o.label}
                    </SelectItem>
                  ))}
                </Select>
                {narrow && (
                  <Button
                    appearance="outlined"
                    leading={<Icon name="funnel" size="s" />}
                    aria-expanded={filterOpen}
                    onPress={() => setFilterOpen((v) => !v)}
                  >
                    フィルタ
                  </Button>
                )}
              </Stack>
            </Stack>
            {narrow && filterOpen && (
              // GAP-NEW: Popover が無い。実アプリは「フィルタ」の右下に浮く Popover（幅 230px）に
              // サイドバーと同じ中身を入れる。ここでは検索欄の下に差し込んでいる
              <CategorySidebar
                selected={selectedCategories}
                onToggle={toggleCategory}
                onClear={clearCategories}
                onClose={() => setFilterOpen(false)}
              />
            )}
            <Paper padding="none" elevation={0} outlined>
              {results.length === 0 ? (
                // 実アプリは上下 48px の余白
                <Paper padding="xxl" elevation={0}>
                  <Stack alignItems="center">
                    <Typography color="medium_emphasis">検索結果がありません</Typography>
                  </Stack>
                </Paper>
              ) : (
                results.map((mod, i) => (
                  <Stack key={mod.id}>
                    {i > 0 && <Divider />}
                    {/* 1 件ごとに左右 24px・上下 16px の余白（スマートフォンでは 16px・12px） */}
                    <Paper padding="m" elevation={0}>
                      <ModResultItem mod={mod} />
                    </Paper>
                  </Stack>
                ))
              )}
            </Paper>
            {/* 見本は総件数を固定しているので、検索語で 0 件になったときだけ隠す（実物は totalCount が 0 になる） */}
            {results.length > 0 && totalPages > 1 && (
              <Pager page={page} totalPages={totalPages} onChange={setPage} />
            )}
          </Stack>
        </GridItem>
      </Grid>
    </Stack>
  )
}

// ─── 画面 ───

const ModsScreen = ({
  loading = false,
  mods = installedModsInitial,
  uninstall = null,
  adding = false,
  addQuery = '',
}: {
  loading?: boolean
  mods?: InstalledMod[]
  /** 指定するとアンインストールの確認が開いた状態から始める */
  uninstall?: string[] | null
  adding?: boolean
  addQuery?: string
}) => {
  const [isAdding, setIsAdding] = useState(adding)
  return (
    <AppShell active="mods">
      {isAdding ? (
        // GAP-NEW: 全画面の Dialog が無い。実アプリは fullScreen の Dialog（幅 900px）なので AppShell の中身を置き換えている
        <AddMods initialQuery={addQuery} onBack={() => setIsAdding(false)} />
      ) : (
        <>
          <ServerDetailHeader status="RUNNING" tab="MOD" />
          <InstalledMods
            loading={loading}
            mods={mods}
            initialUninstall={uninstall}
            onAdd={() => setIsAdding(true)}
          />
        </>
      )}
    </AppShell>
  )
}

// ─── ストーリー ───

/**
 * インストール済の MOD とプラグインの一覧。検索、MOD / プラグインのチップでの絞り込み
 * （最初は両方とも有効）、チェックボックスでの複数選択が動く。
 *
 * @summary インストール済MODの一覧
 */
export const Default: Story = {
  render: () => <ModsScreen />,
}

/**
 * まだ何も入れていない状態。表の中に「インストールされていません」と出る。
 *
 * @summary インストール済MODが空
 */
export const Empty: Story = {
  render: () => <ModsScreen mods={[]} />,
}

/**
 * 一覧の最初の取得中。実アプリは表の位置に高さ 400 の Skeleton を出す。
 *
 * @summary 一覧の読み込み中
 */
export const Loading: Story = {
  render: () => <ModsScreen loading />,
}

/**
 * 選んだ 2 つ（MOD とプラグイン）をまとめてアンインストールする確認。消えるファイルの種類を本文で伝える。
 *
 * @summary アンインストールの確認
 */
export const UninstallConfirm: Story = {
  render: () => (
    <ModsScreen uninstall={[installedModsInitial[0].filename, installedModsInitial[2].filename]} />
  ),
}

/**
 * スマートフォン幅。選択の行は「未選択」と小さいアンインストールが 1 行目、MOD / プラグインのチップが 2 行目に下がる。
 *
 * @summary インストール済MOD（スマートフォン幅）
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'iphone14' } },
  render: () => <ModsScreen />,
}

/**
 * 「追加」で開く MOD追加。Modrinth の検索結果を並べる。MOD / プラグイン / MODパック のタブで切り替え、
 * MODパックでは既存の設定が上書きされうることを閉じられる Alert で先に伝える。
 * MOD は総件数が 1 ページ（20 件）を超えるので、下にページ送りが出る。
 *
 * @summary MOD追加（Modrinth の検索）
 */
export const AddMod: Story = {
  render: () => <ModsScreen adding />,
}

/**
 * スマートフォン幅の MOD追加。左のカテゴリは隠れ、並べ替えの右の「フィルタ」から開く。
 *
 * @summary MOD追加（スマートフォン幅）
 */
export const AddMobile: Story = {
  globals: { viewport: { value: 'iphone14' } },
  render: () => <ModsScreen adding />,
}

/**
 * 検索語に当たるものが無い状態。
 *
 * @summary 検索結果が空
 */
export const AddNoResults: Story = {
  render: () => <ModsScreen adding addQuery="zzzz" />,
}
