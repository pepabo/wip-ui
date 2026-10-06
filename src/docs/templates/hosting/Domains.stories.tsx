import { useState } from 'react'

import { Button } from '../../../Button'
import { Callout } from '../../../Callout'
import { Checkbox } from '../../../Checkbox'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../Dialog'
import { Icon } from '../../../Icon'
import { Radio } from '../../../Radio'
import { Select, SelectItem } from '../../../Select'
import { Stack } from '../../../Stack'
import { Sticker } from '../../../Sticker'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../../Table'
import { TextField } from '../../../TextField'
import { Typography } from '../../../Typography'
import { AppShell } from './AppShell'
import { Card, PageHeader, RadioField, SectionTitle, StatusSticker } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ServiceStatus } from './parts'

const meta = {
  title: 'Templates/Hosting/Domains',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── データ ───

type Domain = {
  name: string
  kind: '独自ドメイン' | '初期ドメイン'
  ssl: ServiceStatus
  sslExpiresAt?: string
  documentRoot: string
}

const domains: Domain[] = [
  {
    name: 'example.com',
    kind: '独自ドメイン',
    ssl: 'active',
    sslExpiresAt: '2026-12-17',
    documentRoot: '/example.com',
  },
  {
    name: 'blog.example.com',
    kind: '独自ドメイン',
    ssl: 'active',
    sslExpiresAt: '2026-11-02',
    documentRoot: '/blog',
  },
  {
    name: 'shop.example.net',
    kind: '独自ドメイン',
    ssl: 'disabled',
    documentRoot: '/shop',
  },
  {
    name: 'user-0021934.hosting.example',
    kind: '初期ドメイン',
    ssl: 'active',
    sslExpiresAt: '自動更新',
    documentRoot: '/',
  },
]

// ─── 部品 ───

const Header = ({ onAdd }: { onAdd?: () => void }) => (
  <PageHeader
    breadcrumbs={[{ label: 'サーバー概要', href: '#' }, { label: 'ドメイン・SSL' }]}
    title="ドメイン・SSL"
    description="このサーバーで公開しているドメインと、SSL 証明書の状態を管理します。"
    actions={
      <Button color="interactive" leading={<Icon name="plus" size="s" />} onPress={onAdd}>
        ドメインを追加
      </Button>
    }
  />
)

const DomainTable = () => (
  <Card>
    <Stack gap="m">
      <SectionTitle>設定済みのドメイン</SectionTitle>
      <Table aria-label="設定済みのドメイン">
        <TableHeader>
          <Column isRowHeader>ドメイン</Column>
          <Column>種別</Column>
          <Column>SSL</Column>
          <Column>有効期限</Column>
          <Column>公開フォルダ</Column>
          <Column>操作</Column>
        </TableHeader>
        <TableBody>
          {domains.map((domain) => (
            <Row key={domain.name}>
              <Cell>
                <Stack flexDirection="row" gap="xs" alignItems="center">
                  <Typography component="span" fontWeight="bold">
                    {domain.name}
                  </Typography>
                  <Button
                    appearance="transparent"
                    size="s"
                    iconOnly
                    aria-label={`${domain.name} を開く`}
                  >
                    <Icon name="launch" size="s" />
                  </Button>
                </Stack>
              </Cell>
              <Cell>{domain.kind}</Cell>
              <Cell>
                <StatusSticker status={domain.ssl} />
              </Cell>
              <Cell>{domain.sslExpiresAt ?? '—'}</Cell>
              <Cell>{domain.documentRoot}</Cell>
              <Cell>
                <Stack flexDirection="row" gap="xxs">
                  <Button
                    appearance="transparent"
                    size="s"
                    iconOnly
                    aria-label={`${domain.name} の設定`}
                  >
                    <Icon name="gear" size="s" />
                  </Button>
                  <Button
                    appearance="transparent"
                    size="s"
                    iconOnly
                    aria-label={`${domain.name} を削除`}
                    isDisabled={domain.kind === '初期ドメイン'}
                  >
                    <Icon name="garbage_can" size="s" />
                  </Button>
                </Stack>
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </Stack>
  </Card>
)

const AddDomainDialog = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) => (
  <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
    <DialogHeader>
      <DialogTitle>ドメインを追加</DialogTitle>
    </DialogHeader>
    <DialogDescription>
      追加するドメインは、事前にネームサーバーまたは A
      レコードをこのサーバーに向けておいてください。
    </DialogDescription>
    <Stack gap="m">
      <TextField
        label="ドメイン名"
        caption="www. を除いたドメイン名を入力してください"
        placeholder="example.com"
        width="full"
      />
      <Select
        label="公開フォルダ"
        placeholder="フォルダを選択"
        width="full"
        defaultSelectedKey="new"
      >
        <SelectItem id="new">ドメイン名と同じフォルダを新規作成</SelectItem>
        <SelectItem id="root">/（ルート）</SelectItem>
        <SelectItem id="blog">/blog</SelectItem>
        <SelectItem id="shop">/shop</SelectItem>
      </Select>
      <RadioField label="SSL 証明書" defaultValue="free">
        <Radio value="free">無料 SSL を自動で設定する（推奨）</Radio>
        <Radio value="later">あとで設定する</Radio>
      </RadioField>
      <Checkbox defaultSelected>www 付きのサブドメインも同時に設定する</Checkbox>
    </Stack>
    <DialogFooter>
      <Button appearance="outlined" onPress={() => onOpenChange(false)}>
        キャンセル
      </Button>
      <Button color="interactive" onPress={() => onOpenChange(false)}>
        追加する
      </Button>
    </DialogFooter>
  </Dialog>
)

const DomainsScreen = ({
  addOpen = false,
  sslAlert = false,
}: {
  addOpen?: boolean
  sslAlert?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(addOpen)
  return (
    <AppShell active="domains">
      <Header onAdd={() => setIsOpen(true)} />
      {sslAlert && (
        <Callout color="negative" appearance="outline">
          shop.example.net に SSL
          証明書が設定されていません。ブラウザに警告が表示される可能性があります。
        </Callout>
      )}
      <DomainTable />
      <AddDomainDialog isOpen={isOpen} onOpenChange={setIsOpen} />
    </AppShell>
  )
}

// ─── ストーリー ───

/**
 * 独自ドメインを複数運用しているユーザーの一覧画面。
 * 一覧の中に状態（Sticker）・リンク・行操作（iconOnly Button）が同居するときの密度と揃え方を確認する。
 *
 * @summary ドメインが複数設定されている一覧
 */
export const Default: Story = {
  render: () => <DomainsScreen sslAlert />,
}

/**
 * 「ドメインを追加」を押した直後の状態。
 * Dialog の中にフォーム部品（TextField / Select / Radio / Checkbox）を並べたときの余白と幅を確認する。
 *
 * @summary ドメイン追加ダイアログを開いた状態
 */
export const AddDialog: Story = {
  render: () => <DomainsScreen addOpen />,
}

/**
 * 契約直後で独自ドメインを 1 つも設定していない状態。
 * 空の一覧を出す代わりに、最初にやることを 1 つだけ示す。
 *
 * @summary ドメインが未設定の空状態
 */
export const Empty: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <AppShell active="domains">
        <Header onAdd={() => setIsOpen(true)} />
        <Card outlined>
          <Stack gap="m" alignItems="center">
            <Icon name="launch" size="l" />
            <Stack gap="xxs" alignItems="center">
              <Typography size="l" fontWeight="bold">
                独自ドメインがまだ設定されていません
              </Typography>
              <Typography size="s" color="medium_emphasis">
                初期ドメイン user-0021934.hosting.example
                でサイトは公開できます。独自ドメインを追加すると、SSL も無料で自動設定されます。
              </Typography>
            </Stack>
            <Stack flexDirection="row" gap="s">
              <Button appearance="outlined">ドメインを取得する</Button>
              <Button color="interactive" onPress={() => setIsOpen(true)}>
                持っているドメインを追加
              </Button>
            </Stack>
            <Sticker color="neutral" size="s">
              初期ドメイン: user-0021934.hosting.example
            </Sticker>
          </Stack>
        </Card>
        <AddDomainDialog isOpen={isOpen} onOpenChange={setIsOpen} />
      </AppShell>
    )
  },
}
