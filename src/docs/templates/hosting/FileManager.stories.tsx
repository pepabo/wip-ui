import { useState } from 'react'

import { Breadcrumb, Breadcrumbs } from '../../../Breadcrumbs'
import { Button } from '../../../Button'
import { Callout } from '../../../Callout'
import { Divider } from '../../../Divider'
import { Icon } from '../../../Icon'
import { Select, SelectItem } from '../../../Select'
import { Stack } from '../../../Stack'
import { Sticker } from '../../../Sticker'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../../Table'
import { TextField } from '../../../TextField'
import { Typography } from '../../../Typography'
import { AppShell } from './AppShell'
import { Card, PageHeader } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Key, Selection, SortDescriptor } from 'react-aria-components'
import type { IconName } from '../../../Icon'

const meta = {
  title: 'Templates/Hosting/FileManager',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── データ ───

type Entry = {
  id: string
  name: string
  kind: 'folder' | 'php' | 'image' | 'text' | 'archive' | 'other'
  size: string
  bytes: number
  updatedAt: string
  permission: string
  owner: string
}

// アイコンセットにファイル種別のアイコンが無いため、汎用アイコンで代用している（GAP-15）
const kindIcon: Record<Entry['kind'], IconName> = {
  folder: 'folder',
  php: 'code',
  image: 'image',
  text: 'note',
  archive: 'clip',
  other: 'note',
}

const entries: Entry[] = [
  {
    id: 'd1',
    name: 'wp-admin',
    kind: 'folder',
    size: '—',
    bytes: 0,
    updatedAt: '2026-09-18 04:12',
    permission: '755',
    owner: 'lolipop',
  },
  {
    id: 'd2',
    name: 'wp-content',
    kind: 'folder',
    size: '—',
    bytes: 0,
    updatedAt: '2026-09-22 11:40',
    permission: '755',
    owner: 'lolipop',
  },
  {
    id: 'd3',
    name: 'wp-includes',
    kind: 'folder',
    size: '—',
    bytes: 0,
    updatedAt: '2026-09-18 04:12',
    permission: '755',
    owner: 'lolipop',
  },
  {
    id: 'd4',
    name: '.well-known',
    kind: 'folder',
    size: '—',
    bytes: 0,
    updatedAt: '2026-08-02 09:15',
    permission: '755',
    owner: 'lolipop',
  },
  {
    id: 'd5',
    name: 'uploads',
    kind: 'folder',
    size: '—',
    bytes: 0,
    updatedAt: '2026-09-24 08:03',
    permission: '777',
    owner: 'lolipop',
  },
  {
    id: 'f1',
    name: 'index.php',
    kind: 'php',
    size: '405 B',
    bytes: 405,
    updatedAt: '2026-09-18 04:12',
    permission: '644',
    owner: 'lolipop',
  },
  {
    id: 'f2',
    name: 'wp-config.php',
    kind: 'php',
    size: '3.2 KB',
    bytes: 3277,
    updatedAt: '2026-09-17 15:41',
    permission: '600',
    owner: 'lolipop',
  },
  {
    id: 'f3',
    name: 'wp-login.php',
    kind: 'php',
    size: '48.1 KB',
    bytes: 49254,
    updatedAt: '2026-09-18 04:12',
    permission: '644',
    owner: 'lolipop',
  },
  {
    id: 'f4',
    name: 'wp-settings.php',
    kind: 'php',
    size: '28.7 KB',
    bytes: 29388,
    updatedAt: '2026-09-18 04:12',
    permission: '644',
    owner: 'lolipop',
  },
  {
    id: 'f5',
    name: 'wp-cron.php',
    kind: 'php',
    size: '5.5 KB',
    bytes: 5632,
    updatedAt: '2026-09-18 04:12',
    permission: '644',
    owner: 'lolipop',
  },
  {
    id: 'f6',
    name: '.htaccess',
    kind: 'text',
    size: '1.1 KB',
    bytes: 1126,
    updatedAt: '2026-09-20 22:08',
    permission: '644',
    owner: 'lolipop',
  },
  {
    id: 'f7',
    name: 'robots.txt',
    kind: 'text',
    size: '112 B',
    bytes: 112,
    updatedAt: '2026-06-11 13:22',
    permission: '644',
    owner: 'lolipop',
  },
  {
    id: 'f8',
    name: 'favicon.ico',
    kind: 'image',
    size: '15.0 KB',
    bytes: 15360,
    updatedAt: '2026-04-01 10:00',
    permission: '644',
    owner: 'lolipop',
  },
  {
    id: 'f9',
    name: 'ogp.png',
    kind: 'image',
    size: '284.3 KB',
    bytes: 291123,
    updatedAt: '2026-07-30 17:55',
    permission: '644',
    owner: 'lolipop',
  },
  {
    id: 'f10',
    name: 'hero@2x.jpg',
    kind: 'image',
    size: '1.4 MB',
    bytes: 1468006,
    updatedAt: '2026-07-30 17:56',
    permission: '644',
    owner: 'lolipop',
  },
  {
    id: 'f11',
    name: 'backup-2026-09-17.zip',
    kind: 'archive',
    size: '182.6 MB',
    bytes: 191468339,
    updatedAt: '2026-09-17 23:00',
    permission: '600',
    owner: 'lolipop',
  },
  {
    id: 'f12',
    name: 'error_log',
    kind: 'text',
    size: '2.3 MB',
    bytes: 2411724,
    updatedAt: '2026-09-24 09:31',
    permission: '644',
    owner: 'lolipop',
  },
  {
    id: 'f13',
    name: 'php.ini',
    kind: 'text',
    size: '892 B',
    bytes: 892,
    updatedAt: '2026-09-17 15:41',
    permission: '644',
    owner: 'lolipop',
  },
  {
    id: 'f14',
    name: 'sitemap.xml',
    kind: 'other',
    size: '18.4 KB',
    bytes: 18841,
    updatedAt: '2026-09-24 03:00',
    permission: '644',
    owner: 'lolipop',
  },
  {
    id: 'f15',
    name: 'readme.html',
    kind: 'text',
    size: '7.2 KB',
    bytes: 7372,
    updatedAt: '2026-09-18 04:12',
    permission: '644',
    owner: 'lolipop',
  },
]

const columns = [
  { id: 'name', label: '名前', sortable: true },
  { id: 'size', label: 'サイズ', sortable: true },
  { id: 'updatedAt', label: '更新日時', sortable: true },
  { id: 'permission', label: 'パーミッション', sortable: false },
  { id: 'owner', label: '所有者', sortable: false },
  { id: 'actions', label: '操作', sortable: false },
]

// ─── 部品 ───

const Header = () => (
  <PageHeader
    breadcrumbs={[{ label: 'サーバー概要', href: '#' }, { label: 'ファイル管理' }]}
    title="ファイル管理"
    description="web12.hosting.example ／ 使用量 12.4 GB / 400 GB"
    actions={
      <>
        <Button appearance="outlined" leading={<Icon name="folder" size="s" />}>
          新規フォルダ
        </Button>
        <Button color="interactive" leading={<Icon name="upload" size="s" />}>
          アップロード
        </Button>
      </>
    }
  />
)

const Toolbar = ({ selectedCount }: { selectedCount: number }) => (
  // GAP-17: Stack の alignItems はレスポンシブ非対応（flexDirection と gap は対応済み）。
  // 縦積みのときは stretch、横並びのときは center にしたいが指定できない。
  <Stack flexDirection={{ xxs: 'column', m: 'row' }} gap="s" justifyContent="space-between">
    <Breadcrumbs>
      <Breadcrumb href="#">/</Breadcrumb>
      <Breadcrumb href="#">example.com</Breadcrumb>
      <Breadcrumb>public_html</Breadcrumb>
    </Breadcrumbs>
    <Stack flexDirection="row" gap="s" alignItems="center">
      {selectedCount > 0 && (
        <>
          <Typography size="s" color="medium_emphasis" component="span">
            {selectedCount} 件を選択中
          </Typography>
          <Button appearance="outlined" size="s" leading={<Icon name="download" size="s" />}>
            ダウンロード
          </Button>
          <Button
            appearance="outlined"
            color="negative"
            size="s"
            leading={<Icon name="garbage_can" size="s" />}
          >
            削除
          </Button>
          <Divider orientation="vertical" flexItem />
        </>
      )}
      <TextField
        aria-label="ファイルを検索"
        placeholder="このフォルダ内を検索"
        size="s"
        width="third"
      />
      <Select aria-label="表示する種別" size="s" defaultSelectedKey="all">
        <SelectItem id="all">すべて</SelectItem>
        <SelectItem id="folder">フォルダのみ</SelectItem>
        <SelectItem id="php">PHP</SelectItem>
        <SelectItem id="image">画像</SelectItem>
      </Select>
    </Stack>
  </Stack>
)

const FileTable = ({
  selectedKeys,
  onSelectionChange,
}: {
  selectedKeys: Selection
  onSelectionChange: (keys: Selection) => void
}) => {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  })

  const sorted = [...entries].sort((a, b) => {
    // フォルダを常に先頭にまとめる
    if ((a.kind === 'folder') !== (b.kind === 'folder')) return a.kind === 'folder' ? -1 : 1
    const column = sortDescriptor.column
    const cmp =
      column === 'size'
        ? a.bytes - b.bytes
        : String(a[column as keyof Entry]).localeCompare(String(b[column as keyof Entry]), 'ja')
    return sortDescriptor.direction === 'descending' ? -cmp : cmp
  })

  return (
    <Table
      aria-label="ファイル一覧"
      selectionMode="multiple"
      selectedKeys={selectedKeys}
      onSelectionChange={onSelectionChange}
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
    >
      <TableHeader>
        {columns.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            isRowHeader={column.id === 'name'}
            allowsSorting={column.sortable}
          >
            {column.label}
          </Column>
        ))}
      </TableHeader>
      <TableBody>
        {sorted.map((entry) => (
          <Row key={entry.id} id={entry.id}>
            <Cell>
              <Stack flexDirection="row" gap="xs" alignItems="center">
                <Icon name={kindIcon[entry.kind]} size="s" />
                <Typography
                  component="span"
                  fontWeight={entry.kind === 'folder' ? 'bold' : 'normal'}
                >
                  {entry.name}
                </Typography>
                {entry.permission === '777' && (
                  <Sticker color="notice" size="s">
                    権限が緩い
                  </Sticker>
                )}
              </Stack>
            </Cell>
            <Cell>{entry.size}</Cell>
            <Cell>{entry.updatedAt}</Cell>
            <Cell>{entry.permission}</Cell>
            <Cell>{entry.owner}</Cell>
            <Cell>
              <Stack flexDirection="row" gap="xxs">
                <Button
                  appearance="transparent"
                  size="s"
                  iconOnly
                  aria-label={`${entry.name} を編集`}
                  isDisabled={entry.kind === 'folder'}
                >
                  <Icon name="pencil" size="s" />
                </Button>
                <Button
                  appearance="transparent"
                  size="s"
                  iconOnly
                  aria-label={`${entry.name} をダウンロード`}
                >
                  <Icon name="download" size="s" />
                </Button>
                {/* GAP-9: Menu が無いため、その他の操作をまとめる先が無い */}
                <Button
                  appearance="transparent"
                  size="s"
                  iconOnly
                  aria-label={`${entry.name} のその他の操作`}
                >
                  <Icon name="ellipsis_horizontal" size="s" />
                </Button>
              </Stack>
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  )
}

const FileManagerScreen = ({ warn = false }: { warn?: boolean }) => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set<Key>())
  const selectedCount = selectedKeys === 'all' ? entries.length : selectedKeys.size
  return (
    <AppShell active="files" width="wide">
      <Header />
      {warn && (
        <Callout
          color="notice"
          action={
            <Button appearance="outlined" size="s">
              権限を修正
            </Button>
          }
        >
          uploads フォルダのパーミッションが 777 です。第三者による書き込みが可能な状態のため、755
          への変更を推奨します。
        </Callout>
      )}
      <Card>
        <Stack gap="m">
          <Toolbar selectedCount={selectedCount} />
          <FileTable selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} />
          <Stack flexDirection="row" gap="m" alignItems="center" justifyContent="space-between">
            <Typography size="xs" color="low_emphasis">
              20 件中 20 件を表示
            </Typography>
            {/* GAP-16: Pagination が無いため、件数の送りをボタンで代用している */}
            <Stack flexDirection="row" gap="xxs" alignItems="center">
              <Button appearance="transparent" size="s" iconOnly aria-label="前のページ" isDisabled>
                <Icon name="chevron_left" size="s" />
              </Button>
              <Typography size="xs" component="span">
                1 / 1
              </Typography>
              <Button appearance="transparent" size="s" iconOnly aria-label="次のページ" isDisabled>
                <Icon name="chevron_right" size="s" />
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </AppShell>
  )
}

// ─── ストーリー ───

/**
 * 画面いっぱいに 20 行 6 列のテーブルを置いた、このテンプレート層で最も密度の高い画面。
 * 角丸・罫線・行の高さ・余白の判断は、この密度で初めて破綻するため、
 * トンマナを変えたときはまずこの画面で確認する。
 *
 * @summary 全幅・高密度のファイル一覧
 */
export const Default: Story = {
  render: () => <FileManagerScreen />,
}

/**
 * パーミッションの警告が出ている状態。
 * 全幅の画面で Callout がどこまで目立つか、行内の Sticker と二重にならないかを確認する。
 *
 * @summary 権限の警告が出ている状態
 */
export const WithWarning: Story = {
  render: () => <FileManagerScreen warn />,
}

/**
 * 同じ画面をスマートフォン幅で見た状態。
 * 全幅テーブルが横スクロールに収まるか、ツールバーが縦に折り返るかを確認する。
 * あわせて、サイドナビが全幅ボタン 7 個として縦に積まれる問題（GAP-14）もここで見える。
 *
 * @summary スマートフォン幅でのファイル一覧
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'iphone14' } },
  render: () => <FileManagerScreen />,
}
