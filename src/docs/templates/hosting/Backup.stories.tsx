import { useEffect, useState } from 'react'
import { TabPanel } from 'react-aria-components'

import { Button } from '../../../Button'
import { Callout } from '../../../Callout'
import { Checkbox } from '../../../Checkbox'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../Dialog'
import { Divider } from '../../../Divider'
import { Grid, GridItem } from '../../../Grid'
import { Icon } from '../../../Icon'
import { Loader } from '../../../Loader'
import { Radio } from '../../../Radio'
import { Select, SelectItem } from '../../../Select'
import { SnackBar, SnackBarQueue } from '../../../SnackBar'
import { Stack } from '../../../Stack'
import { Sticker } from '../../../Sticker'
import { Switch } from '../../../Switch'
import { Tab, TabList, Tabs } from '../../../Tab'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../../Table'
import { TextField } from '../../../TextField'
import { Typography } from '../../../Typography'
import { AppShell } from './AppShell'
import { Card, PageHeader, RadioField, SectionTitle, Stat, StatusSticker } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Key, Selection } from 'react-aria-components'
import type { ServiceStatus } from './parts'

const meta = {
  title: 'Templates/Hosting/Backup',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const queue = new SnackBarQueue()

// ─── データ ───

type Backup = {
  id: string
  createdAt: string
  kind: '自動' | '手動'
  size: string
  note?: string
  status: ServiceStatus
}

const backups: Backup[] = [
  { id: 'bk-0918', createdAt: '2026-09-18 04:00', kind: '自動', size: '1.2 GB', status: 'active' },
  { id: 'bk-0917', createdAt: '2026-09-17 04:00', kind: '自動', size: '1.2 GB', status: 'active' },
  {
    id: 'bk-0916m',
    createdAt: '2026-09-16 21:14',
    kind: '手動',
    size: '1.1 GB',
    note: 'MOD 追加前',
    status: 'active',
  },
  { id: 'bk-0916', createdAt: '2026-09-16 04:00', kind: '自動', size: '1.1 GB', status: 'active' },
  { id: 'bk-0915', createdAt: '2026-09-15 04:00', kind: '自動', size: '1.1 GB', status: 'expired' },
]

// ─── 部品 ───

const Header = ({ onCreate }: { onCreate?: () => void }) => (
  <PageHeader
    breadcrumbs={[
      { label: 'ホーム', href: '#' },
      { label: 'みんなのサバイバル', href: '#' },
      { label: 'バックアップ' },
    ]}
    title="バックアップ"
    badge={<StatusSticker status="active" />}
    description="ワールドデータと設定ファイルを毎日 04:00 に自動保存します。手動バックアップはいつでも作成できます。"
    actions={
      <Button color="interactive" leading={<Icon name="download" size="s" />} onPress={onCreate}>
        今すぐバックアップ
      </Button>
    }
  />
)

const Summary = () => (
  <Grid spacing="m">
    <GridItem size={{ xxs: 12, s: 4 }}>
      <Card>
        <Stat label="保存中のバックアップ" value="4" unit="/ 7 世代" />
      </Card>
    </GridItem>
    <GridItem size={{ xxs: 12, s: 4 }}>
      <Card>
        <Stat
          label="使用容量"
          value="4.6"
          unit="GB / 10 GB"
          caption={
            <Typography size="xs" color="notice">
              残り 5.4 GB。7 世代に達すると古いものから削除されます
            </Typography>
          }
        />
      </Card>
    </GridItem>
    <GridItem size={{ xxs: 12, s: 4 }}>
      <Card>
        <Stat label="次回の自動バックアップ" value="04:00" unit="2026-09-19" />
      </Card>
    </GridItem>
  </Grid>
)

const BackupTable = ({
  items,
  selectedKeys,
  onSelectionChange,
  onRestore,
  creating = false,
}: {
  items: Backup[]
  selectedKeys: Selection
  onSelectionChange: (keys: Selection) => void
  onRestore: (backup: Backup) => void
  creating?: boolean
}) => (
  <Table
    aria-label="バックアップ一覧"
    selectionMode="single"
    selectedKeys={selectedKeys}
    onSelectionChange={onSelectionChange}
  >
    <TableHeader>
      <Column isRowHeader>作成日時</Column>
      <Column>種別</Column>
      <Column>サイズ</Column>
      <Column>メモ</Column>
      <Column>状態</Column>
      <Column>操作</Column>
    </TableHeader>
    <TableBody>
      {creating && (
        <Row id="creating">
          <Cell>
            <Stack flexDirection="row" gap="xs" alignItems="center">
              <Loader size="s" />
              <Typography component="span" size="s" color="medium_emphasis">
                作成中…
              </Typography>
            </Stack>
          </Cell>
          <Cell>手動</Cell>
          <Cell>—</Cell>
          <Cell>MOD 更新前</Cell>
          <Cell>
            <Sticker color="informative" size="s">
              作成中
            </Sticker>
          </Cell>
          <Cell>
            <Button appearance="transparent" size="s" isDisabled>
              復元
            </Button>
          </Cell>
        </Row>
      )}
      {items.map((backup) => (
        <Row key={backup.id} id={backup.id}>
          <Cell>{backup.createdAt}</Cell>
          <Cell>
            <Sticker color={backup.kind === '手動' ? 'informative' : 'neutral'} size="s">
              {backup.kind}
            </Sticker>
          </Cell>
          <Cell>{backup.size}</Cell>
          <Cell>{backup.note ?? '—'}</Cell>
          <Cell>
            <StatusSticker status={backup.status} />
          </Cell>
          <Cell>
            <Stack flexDirection="row" gap="xxs">
              <Button
                appearance="transparent"
                size="s"
                isDisabled={backup.status === 'expired'}
                onPress={() => onRestore(backup)}
              >
                復元
              </Button>
              <Button
                appearance="transparent"
                size="s"
                iconOnly
                aria-label={`${backup.createdAt} をダウンロード`}
              >
                <Icon name="download" size="s" />
              </Button>
              <Button
                appearance="transparent"
                size="s"
                iconOnly
                aria-label={`${backup.createdAt} を削除`}
              >
                <Icon name="garbage_can" size="s" />
              </Button>
            </Stack>
          </Cell>
        </Row>
      ))}
    </TableBody>
  </Table>
)

const SettingsCard = () => (
  <Card>
    <Stack gap="m">
      <SectionTitle>自動バックアップ</SectionTitle>
      <Switch label="毎日自動でバックアップする" color="interactive" size="l" defaultSelected />
      <Grid spacing="m">
        <GridItem size={{ xxs: 12, m: 4 }}>
          <Select label="実行時刻" size="s" width="full" defaultSelectedKey="04">
            <SelectItem id="02">02:00</SelectItem>
            <SelectItem id="04">04:00</SelectItem>
            <SelectItem id="06">06:00</SelectItem>
          </Select>
        </GridItem>
        <GridItem size={{ xxs: 12, m: 4 }}>
          <Select label="保存する世代数" size="s" width="full" defaultSelectedKey="7">
            <SelectItem id="3">3 世代</SelectItem>
            <SelectItem id="7">7 世代</SelectItem>
            <SelectItem id="14">14 世代（ビジネス）</SelectItem>
          </Select>
        </GridItem>
        <GridItem size={{ xxs: 12, m: 4 }}>
          <Select
            label="保存先リージョン"
            size="s"
            width="full"
            defaultSelectedKey="tokyo"
            isDisabled
          >
            <SelectItem id="tokyo">東京（サーバーと同じ）</SelectItem>
          </Select>
        </GridItem>
      </Grid>
      <Divider variant="middle" />
      <Switch label="バックアップ完了をメールで通知" size="s" />
      <Switch label="失敗時のみ通知" size="s" defaultSelected />
    </Stack>
  </Card>
)

const RestoreDialog = ({
  backup,
  onOpenChange,
}: {
  backup: Backup | null
  onOpenChange: (open: boolean) => void
}) => (
  <Dialog
    isOpen={backup !== null}
    onOpenChange={onOpenChange}
    isDismissable={false}
    role="alertdialog"
  >
    <DialogHeader>
      <DialogTitle>{backup?.createdAt} のバックアップから復元しますか？</DialogTitle>
    </DialogHeader>
    <DialogDescription>
      復元中はサーバーが停止し、接続中のプレイヤーは切断されます。所要時間は約 5 分です。
    </DialogDescription>
    <Stack gap="m">
      <RadioField label="復元方法" defaultValue="overwrite">
        <Radio value="overwrite">現在のデータを上書きして復元する</Radio>
        <Radio value="snapshot">復元前に現在の状態を手動バックアップとして残す（推奨）</Radio>
      </RadioField>
      <Callout color="notice">
        {backup?.createdAt} 以降に行った変更（ワールドの進行・設定・MOD）はすべて失われます。
      </Callout>
      <Checkbox>上記を理解したうえで復元を実行します</Checkbox>
    </Stack>
    <DialogFooter>
      <Button appearance="outlined" onPress={() => onOpenChange(false)}>
        キャンセル
      </Button>
      <Button color="negative" onPress={() => onOpenChange(false)}>
        復元する
      </Button>
    </DialogFooter>
  </Dialog>
)

const CreateDialog = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) => (
  <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
    <DialogHeader>
      <DialogTitle>手動バックアップを作成</DialogTitle>
    </DialogHeader>
    <DialogDescription>
      現在のワールドデータと設定ファイルを保存します。作成中もサーバーは稼働し続けます。
    </DialogDescription>
    <TextField
      label="メモ"
      caption="何のためのバックアップか、あとで分かるように"
      placeholder="例: MOD 追加前"
      width="full"
    />
    <DialogFooter>
      <Button appearance="outlined" onPress={() => onOpenChange(false)}>
        キャンセル
      </Button>
      <Button color="interactive" onPress={() => onOpenChange(false)}>
        作成する
      </Button>
    </DialogFooter>
  </Dialog>
)

const BackupScreen = ({
  restoreTarget = null,
  createOpen = false,
  creating = false,
  notify = false,
}: {
  restoreTarget?: Backup | null
  createOpen?: boolean
  creating?: boolean
  notify?: boolean
}) => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set<Key>())
  const [restoring, setRestoring] = useState<Backup | null>(restoreTarget)
  const [isCreateOpen, setIsCreateOpen] = useState(createOpen)

  useEffect(() => {
    if (!notify) return
    const keys = [
      queue.add(
        {
          message: 'バックアップの作成を開始しました。完了までサーバーは稼働し続けます。',
          state: 'neutral',
        },
        { timeout: undefined }
      ),
      queue.add(
        {
          message: '保存容量が上限に近づいています。古い世代は自動で削除されます。',
          state: 'notice',
        },
        { timeout: undefined }
      ),
    ]
    return () => {
      for (const key of keys) queue.close(key)
    }
  }, [notify])

  return (
    <AppShell active="backup">
      <Header onCreate={() => setIsCreateOpen(true)} />
      <Summary />
      <Tabs>
        <TabList aria-label="バックアップ">
          <Tab id="list">バックアップ一覧</Tab>
          <Tab id="settings">自動バックアップ設定</Tab>
          <Tab id="history" isDisabled>
            復元履歴（ビジネスプラン）
          </Tab>
        </TabList>
        <TabPanel id="list">
          <Card>
            <Stack gap="m">
              <SectionTitle
                action={
                  <Button
                    appearance="outlined"
                    size="s"
                    isDisabled={selectedKeys !== 'all' && selectedKeys.size === 0}
                    leading={<Icon name="clock" size="s" />}
                  >
                    選択したバックアップを復元
                  </Button>
                }
              >
                バックアップ一覧
              </SectionTitle>
              <BackupTable
                items={backups}
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
                onRestore={setRestoring}
                creating={creating}
              />
              <Typography size="xxs" color="low_emphasis" density="dense">
                期限切れのバックアップは復元できません。ダウンロードは期限切れ後 7 日間可能です。
              </Typography>
            </Stack>
          </Card>
        </TabPanel>
        <TabPanel id="settings">
          <SettingsCard />
        </TabPanel>
        <TabPanel id="history" />
      </Tabs>
      <RestoreDialog backup={restoring} onOpenChange={(open) => !open && setRestoring(null)} />
      <CreateDialog isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <SnackBar queue={queue} />
    </AppShell>
  )
}

// ─── ストーリー ───

/**
 * ゲームサーバーのバックアップ一覧。行を 1 つ選ぶ single selection の Table と、
 * 行ごとの復元・ダウンロード・削除、期限切れ行の disabled をまとめて確認する。
 *
 * @summary バックアップの一覧と操作
 */
export const Default: Story = {
  render: () => <BackupScreen />,
}

/**
 * 「復元」を押した直後。サーバー停止と巻き戻りを伴うため、alertdialog で復元方法の選択と確認 Checkbox を求める。
 *
 * @summary 復元の確認ダイアログ
 */
export const RestoreConfirm: Story = {
  render: () => <BackupScreen restoreTarget={backups[2]} />,
}

/**
 * 手動バックアップを作成中の状態。一覧の先頭に作成中の行が入り、SnackBar で開始を知らせる。
 * neutral と notice の通知が重なったときの見え方も確認する。
 *
 * @summary 手動バックアップを作成中
 */
export const Creating: Story = {
  render: () => <BackupScreen creating notify />,
}

/**
 * 「今すぐバックアップ」を押した直後のメモ入力ダイアログ。1 フィールドだけの小さなダイアログ。
 *
 * @summary 手動バックアップの作成ダイアログ
 */
export const CreateDialogOpen: Story = {
  render: () => <BackupScreen createOpen />,
}
