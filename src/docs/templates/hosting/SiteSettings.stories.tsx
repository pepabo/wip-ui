import { useState } from 'react'
import { TabPanel } from 'react-aria-components'

import { Button } from '../../../Button'
import { Callout } from '../../../Callout'
import { Checkbox } from '../../../Checkbox'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../Dialog'
import { Divider } from '../../../Divider'
import { Radio } from '../../../Radio'
import { Select, SelectItem } from '../../../Select'
import { SnackBar, SnackBarQueue } from '../../../SnackBar'
import { Stack } from '../../../Stack'
import { Switch } from '../../../Switch'
import { Tab, TabList, Tabs } from '../../../Tab'
import { TextField } from '../../../TextField'
import { Typography } from '../../../Typography'
import { AppShell } from './AppShell'
import { Card, DefinitionRow, PageHeader, RadioField, SectionTitle } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Templates/Hosting/SiteSettings',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const queue = new SnackBarQueue()

// ─── 部品 ───

const Header = () => (
  <PageHeader
    breadcrumbs={[
      { label: 'サーバー概要', href: '#' },
      { label: 'サイト設定', href: '#' },
      { label: 'example.com' },
    ]}
    title="example.com"
    description="公開フォルダ: /example.com ／ WordPress 6.6 ／ 最終更新: 2026-09-17 15:41"
  />
)

const SaveBar = ({ onSave }: { onSave: () => void }) => (
  <Stack flexDirection="row" gap="s" justifyContent="flex-end">
    <Button appearance="outlined">変更を破棄</Button>
    <Button color="interactive" onPress={onSave}>
      保存する
    </Button>
  </Stack>
)

const BasicPanel = ({ onSave }: { onSave: () => void }) => (
  <Stack gap="l">
    <Card>
      <Stack gap="m">
        <SectionTitle>基本設定</SectionTitle>
        <TextField label="サイト名" defaultValue="Example Inc. 公式サイト" width="full" />
        <TextField
          label="サイトの説明"
          caption="検索結果やSNSでの共有時に表示されます"
          component="textarea"
          defaultValue="Example Inc. の製品情報とお知らせを掲載しています。"
          width="full"
        />
        <Select label="タイムゾーン" width="half" defaultSelectedKey="tokyo">
          <SelectItem id="tokyo">Asia/Tokyo（UTC+9）</SelectItem>
          <SelectItem id="utc">UTC</SelectItem>
          <SelectItem id="la">America/Los_Angeles（UTC-7）</SelectItem>
        </Select>
        <Divider />
        <Switch label="メンテナンスモード" color="interactive" />
        <Typography size="xs" color="medium_emphasis">
          有効にすると、ログイン中の管理者以外にはメンテナンス画面が表示されます。
        </Typography>
      </Stack>
    </Card>
    <SaveBar onSave={onSave} />
  </Stack>
)

const PhpPanel = ({ onSave }: { onSave: () => void }) => (
  <Stack gap="l">
    <Card>
      <Stack gap="m">
        <SectionTitle>PHP</SectionTitle>
        <Callout color="informative">
          PHP 8.1 は 2026-12-31 でセキュリティサポートが終了します。8.3 への切り替えを推奨します。
        </Callout>
        <RadioField label="PHP バージョン" defaultValue="8.3">
          <Radio value="8.3">8.3（推奨）</Radio>
          <Radio value="8.2">8.2</Radio>
          <Radio value="8.1">8.1（サポート終了予定）</Radio>
        </RadioField>
        <Divider />
        <Select
          label="memory_limit"
          caption="WordPress のプラグインが多い場合は 512M 以上を推奨"
          width="third"
          defaultSelectedKey="256"
        >
          <SelectItem id="128">128M</SelectItem>
          <SelectItem id="256">256M</SelectItem>
          <SelectItem id="512">512M</SelectItem>
          <SelectItem id="1024">1024M</SelectItem>
        </Select>
        <TextField label="max_execution_time" caption="秒" defaultValue="30" width="third" />
        <Checkbox>display_errors を有効にする（本番環境では推奨しません）</Checkbox>
      </Stack>
    </Card>
    <SaveBar onSave={onSave} />
  </Stack>
)

const SecurityPanel = ({ onSave, onDelete }: { onSave: () => void; onDelete: () => void }) => (
  <Stack gap="l">
    <Card>
      <Stack gap="m">
        <SectionTitle>セキュリティ</SectionTitle>
        <Switch
          label="WAF（Web アプリケーションファイアウォール）"
          color="interactive"
          defaultSelected
        />
        <Switch label="海外からの管理画面アクセスを制限" color="interactive" defaultSelected />
        <Switch label="ディレクトリ一覧の表示を禁止" color="interactive" />
        <Divider />
        <DefinitionRow term="最終ログイン">
          <Typography component="span">2026-09-18 09:10 ／ 203.0.113.8（東京）</Typography>
        </DefinitionRow>
        <DefinitionRow term="2 段階認証">
          <Stack flexDirection="row" gap="s" alignItems="center">
            <Typography component="span">未設定</Typography>
            <Button appearance="outlined" size="s">
              設定する
            </Button>
          </Stack>
        </DefinitionRow>
      </Stack>
    </Card>
    <SaveBar onSave={onSave} />
    <Card outlined>
      <Stack gap="m">
        <SectionTitle>危険な操作</SectionTitle>
        <Callout
          color="negative"
          action={
            <Button appearance="outlined" color="negative" size="s" onPress={onDelete}>
              サイトを削除
            </Button>
          }
        >
          サイトを削除すると、公開フォルダ内のファイルとデータベースがすべて消去されます。この操作は取り消せません。
        </Callout>
      </Stack>
    </Card>
  </Stack>
)

const DeleteDialog = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) => (
  <Dialog isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} role="alertdialog">
    <DialogHeader>
      <DialogTitle>example.com を削除しますか？</DialogTitle>
    </DialogHeader>
    <DialogDescription>
      公開フォルダ /example.com のファイルと、データベース wp_example
      が削除されます。直近のバックアップは 2026-09-17 23:00 です。
    </DialogDescription>
    <Stack gap="m">
      <TextField label="確認のためドメイン名を入力" placeholder="example.com" width="full" />
      <Checkbox>バックアップからの復元が必要になる可能性を理解しました</Checkbox>
    </Stack>
    <DialogFooter>
      <Button appearance="outlined" onPress={() => onOpenChange(false)}>
        キャンセル
      </Button>
      <Button color="negative" onPress={() => onOpenChange(false)}>
        削除する
      </Button>
    </DialogFooter>
  </Dialog>
)

const SettingsScreen = ({
  defaultTab,
  deleteDialogOpen = false,
}: {
  defaultTab: 'basic' | 'php' | 'security'
  deleteDialogOpen?: boolean
}) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(deleteDialogOpen)
  const save = () => queue.add({ message: '設定を保存しました', state: 'positive' })
  return (
    <AppShell active="site">
      <Header />
      <Tabs defaultSelectedKey={defaultTab}>
        <TabList aria-label="サイト設定">
          <Tab id="basic">基本設定</Tab>
          <Tab id="php">PHP</Tab>
          <Tab id="security">セキュリティ</Tab>
        </TabList>
        <TabPanel id="basic">
          <BasicPanel onSave={save} />
        </TabPanel>
        <TabPanel id="php">
          <PhpPanel onSave={save} />
        </TabPanel>
        <TabPanel id="security">
          <SecurityPanel onSave={save} onDelete={() => setIsDeleteOpen(true)} />
        </TabPanel>
      </Tabs>
      <DeleteDialog isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen} />
      <SnackBar queue={queue} />
    </AppShell>
  )
}

// ─── ストーリー ───

/**
 * 1 サイト分の設定を、タブで分けて編集する画面。
 * フォーム部品（TextField / Select / Switch）を縦に並べたときのラベル・補足・余白のリズムを確認する。
 * 「保存する」を押すと SnackBar でフィードバックが出る。
 *
 * @summary サイトの基本設定を編集する画面
 */
export const Default: Story = {
  render: () => <SettingsScreen defaultTab="basic" />,
}

/**
 * PHP バージョンのような、選択肢が少なく排他的な設定を Radio で選ばせる画面。
 * サポート終了の注意（Callout）と選択肢の並び、値の単位を補足に出す TextField の見え方を確認する。
 *
 * @summary 排他的な選択肢を含む PHP 設定
 */
export const Php: Story = {
  render: () => <SettingsScreen defaultTab="php" />,
}

/**
 * ON/OFF の設定が並ぶセキュリティタブと、その下の「危険な操作」領域。
 * 通常の設定と取り消せない操作が同じ画面にあるとき、負の色（negative）がどこまで目立つべきかを確認する。
 *
 * @summary Switch が並ぶセキュリティ設定と危険な操作
 */
export const Security: Story = {
  render: () => <SettingsScreen defaultTab="security" />,
}

/**
 * 「サイトを削除」を押した直後の確認ダイアログ。
 * 背景クリックで閉じられない alertdialog として、入力による確認と negative ボタンの組み合わせを確認する。
 *
 * @summary 取り消せない操作の確認ダイアログ
 */
export const DeleteConfirm: Story = {
  render: () => <SettingsScreen defaultTab="security" deleteDialogOpen />,
}
