import { useState } from 'react'

import { Button } from '../../Button'
import { Callout } from '../../Callout'
import { Checkbox } from '../../Checkbox'
import { Container } from '../../Container'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../Dialog'
import { Divider } from '../../Divider'
import { Icon } from '../../Icon'
import { Loader } from '../../Loader'
import { Menu, MenuItem, MenuTrigger } from '../../Menu'
import { Paper } from '../../Paper'
import { Select, SelectItem } from '../../Select'
import { Stack } from '../../Stack'
import { Sticker } from '../../Sticker'
import { Tab, TabList, Tabs } from '../../Tab'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../Table'
import { TextField } from '../../TextField'
import { Typography } from '../../Typography'
import { AppShell } from './AppShell'
import discordLogo from './assets/gamers/external-idp/discord.svg'
import googleLogo from './assets/gamers/external-idp/google.svg'
import twitchLogo from './assets/gamers/external-idp/twitch.svg'
import { Card, CopyableValue } from './parts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import type { ButtonColor } from '../../Button'

/**
 * アカウント。2 つの実画面を 1 ページに置いている。節見出しはそれぞれの実画面のページ見出しそのまま。
 * - ゲーマーズの「アカウント」：apollo/frontend/src/app/(application)/(private)/account
 *   （AccountHeader・AccountPaper・ExternalIdentitiesSection・AccountLeaveDialog、
 *   update-email・update-opt-email-notification）。
 * - AI ゲートウェイの組織の「メンバー」：octane/admin-ui/src/app/accounts/[accountId]/members/page.tsx と
 *   features/AccountMembers（index.tsx・MemberProjectsPanel.tsx・InviteEmailField.tsx・memberProjects.ts）。
 *
 * 主ボタンの色：AI ゲートウェイの実装は主ボタンを color="neutral"（黒）にしている。
 * Hosting はロリポップのトンマナを検証する場なので、ゲーマーズ（MUI の contained primary）とそろえて
 * color="interactive" に統一している。実装へ戻すときはこの差を判断材料にする。
 */

const meta = {
  title: 'Templates/Account',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** AI ゲートウェイの主ボタンの色。冒頭のコメントのとおり neutral ではなく interactive にそろえている */
const primaryColor: ButtonColor = 'interactive'

// ─── 共通 ───

/**
 * 実画面のページ見出し。ゲーマーズの AccountHeader は xxl の「アカウント」だけ、
 * AI ゲートウェイの shared/ui/PageHeader は xl の見出しと xs の説明
 */
const AppHeading = ({
  title,
  description,
  size = 'xl',
}: {
  title: string
  description?: string
  size?: 'xl' | 'xxl'
}) => (
  <Stack gap="xxs">
    <Typography size={size} fontWeight="bold" component="h2">
      {title}
    </Typography>
    {description && (
      <Typography size="xs" color="medium_emphasis" component="div">
        {description}
      </Typography>
    )}
  </Stack>
)

/** shared/ui/RetryCallout */
const RetryCallout = ({ message }: { message: string }) => (
  <Callout
    color="negative"
    action={
      <Button appearance="transparent" size="s">
        再読み込みする
      </Button>
    }
  >
    {message}
  </Callout>
)

// GAP-NEW: Dialog に幅の prop が無い（ゲーマーズは MUI の fullWidth・600px、AI ゲートウェイは 520px / 400px）。
// inline style を当てない方針のため未対応で、ダイアログは中身の幅で縮む。

/** shared/ui/ConfirmDialog。破壊的でない確定は neutral → interactive にそろえている */
const ConfirmDialog = ({
  title,
  description,
  confirmLabel,
  destructive = false,
  onClose,
}: {
  title: string
  description: string
  confirmLabel: string
  destructive?: boolean
  onClose?: () => void
}) => (
  <Dialog isOpen role="alertdialog" onOpenChange={(open) => !open && onClose?.()}>
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
    </DialogHeader>
    <DialogDescription>{description}</DialogDescription>
    <DialogFooter>
      <Button appearance="transparent" onPress={onClose}>
        キャンセル
      </Button>
      <Button color={destructive ? 'negative' : primaryColor}>{confirmLabel}</Button>
    </DialogFooter>
  </Dialog>
)

// ─── ゲーマーズ：データ ───

const account = { id: 'ac-1f7e3b9d2c', email: 'you@example.com', newsletter: true }

/** components/ExternalIdpButtons/model.ts の externalIdpProviders（Google・Discord・Twitch） */
const externalProviders: { label: string; logo: string; linked?: string }[] = [
  { label: 'Google', logo: googleLogo, linked: 'you@example.com' },
  { label: 'Discord', logo: discordLogo, linked: 'lolipop_taro' },
  { label: 'Twitch', logo: twitchLogo },
]

// ─── ゲーマーズ：アカウント ───

/** AccountPaper の 1 段。見出しと値、右に操作 */
const AccountRow = ({
  title,
  children,
  action,
}: {
  title: string
  children?: ReactNode
  action?: ReactNode
}) => (
  <Stack
    flexDirection={{ xxs: 'column', s: 'row' }}
    gap="s"
    justifyContent="space-between"
    alignItems="center"
  >
    <Stack gap="xs">
      <Typography fontWeight="bold" component="h3">
        {title}
      </Typography>
      {children}
    </Stack>
    {action}
  </Stack>
)

// 実物は Container maxWidth="md"（900px）
const GamersAccount = () => (
  <Container size="m">
    <Stack gap="l">
      {/* AccountHeader。サーバー一覧（/home）へ戻るボタンと見出し */}
      <Stack flexDirection="row">
        <Button appearance="outlined" leading={<Icon name="arrow_left" size="s" />}>
          サーバー
        </Button>
      </Stack>
      <AppHeading title="アカウント" size="xxl" />
      <Card>
        <Stack gap="l">
          <AccountRow title="アカウントID">
            <Typography size="s">{account.id}</Typography>
          </AccountRow>
          <Divider />
          <AccountRow title="メールアドレス" action={<Button appearance="outlined">変更</Button>}>
            <Typography size="s">{account.email}</Typography>
          </AccountRow>
          <Divider />
          {/* ExternalIdentitiesSection。解除は確認を挟まず、押すとすぐ解除する */}
          <Stack gap="xs">
            <Typography fontWeight="bold" component="h3">
              外部アカウント連携
            </Typography>
            {externalProviders.map((p, i) => (
              <Stack key={p.label} gap="xs">
                {i > 0 && <Divider />}
                <Stack
                  flexDirection={{ xxs: 'column', s: 'row' }}
                  gap="s"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {/* 実物はプロバイダ名の枠を 150px に固定して表示名の頭をそろえる（GAP-NEW: Stack に幅の指定が無い） */}
                  <Stack flexDirection="row" gap="l" alignItems="center">
                    <Stack flexDirection="row" gap="s" alignItems="center">
                      {/* GAP-NEW: 画像の枠（Image）が無い。実物は object-fit: contain */}
                      <img src={p.logo} alt={p.label} width={22} height={22} />
                      <Typography size="s" component="span">
                        {p.label}
                      </Typography>
                    </Stack>
                    <Typography size="s" component="span">
                      {p.linked ?? '未連携'}
                    </Typography>
                  </Stack>
                  {p.linked ? (
                    <Button appearance="outlined" color="negative">
                      解除
                    </Button>
                  ) : (
                    // 実物は外部の認可画面へ移る
                    <Button appearance="outlined">連携</Button>
                  )}
                </Stack>
              </Stack>
            ))}
          </Stack>
          <Divider />
          <AccountRow title="メール受信設定" action={<Button appearance="outlined">変更</Button>}>
            <Typography size="s" fontWeight="bold" component="h4">
              ニュースレター
            </Typography>
            <Typography size="s">{account.newsletter ? '受信する' : '受信しない'}</Typography>
          </AccountRow>
          <Divider />
          <AccountRow
            title="アカウント削除"
            action={
              <Button appearance="outlined" color="negative">
                削除
              </Button>
            }
          />
        </Stack>
      </Card>
    </Stack>
  </Container>
)

/** update-email/_components/UpdateEmailBackButton・UpdateOptEmailNotificationBackButton */
const BackButton = () => (
  <Stack flexDirection="row">
    <Button appearance="outlined" leading={<Icon name="arrow_left" size="s" />}>
      戻る
    </Button>
  </Stack>
)

/**
 * update-email/_components/UpdateEmailPaper。
 * 送信の結果は UpdateEmailMessage（Alert の AlertTitle ＋本文）で出る。GAP-NEW: Callout にタイトルの枠が無い
 */
const UpdateEmailPage = () => (
  <Container size="s">
    <Stack gap="l">
      <BackButton />
      <Card>
        <Stack gap="l">
          <Typography size="xl" fontWeight="bold" component="h3">
            メールアドレス変更
          </Typography>
          <Typography size="s" component="div">
            入力したメールアドレスにメールアドレス変更メールが送付されます
          </Typography>
          <TextField
            label="メールアドレス"
            placeholder="mail@pepabo.com"
            type="email"
            width="full"
          />
          <Button color="interactive" size="l" width="full">
            メールアドレス変更メールを送信
          </Button>
        </Stack>
      </Card>
    </Stack>
  </Container>
)

/** update-opt-email-notification/_components/UpdateOptEmailNotificationPaper（components/CheckboxItem。題も説明も m） */
const UpdateNewsletterPage = () => (
  <Container size="s">
    <Stack gap="l">
      <BackButton />
      <Card>
        <Stack gap="l">
          <Typography size="xl" fontWeight="bold" component="h3">
            メール受信設定
          </Typography>
          <Stack gap="xs">
            <Typography fontWeight="bold" component="h4">
              ニュースレター
            </Typography>
            <Typography component="div">
              クーポンや最新アップデート情報などをお届けします。
            </Typography>
            <Checkbox defaultSelected={account.newsletter}>受信する</Checkbox>
          </Stack>
          <Button color="interactive" size="l" width="full">
            保存
          </Button>
        </Stack>
      </Card>
    </Stack>
  </Container>
)

/** account/_components/AccountLeaveDialog。入力が一致するまで削除を押せない */
const AccountLeaveDialog = () => (
  <Dialog isOpen>
    <DialogHeader>
      <DialogTitle>アカウント削除</DialogTitle>
    </DialogHeader>
    <Stack gap="l">
      <DialogDescription>
        誤操作を防止するためご利用のメールアドレスをご入力ください
      </DialogDescription>
      <TextField
        label="ご利用のメールアドレス"
        placeholder="mail@pepabo.com"
        type="email"
        width="full"
      />
    </Stack>
    <DialogFooter>
      <Button appearance="transparent">閉じる</Button>
      <Button appearance="outlined" color="negative" isDisabled>
        削除
      </Button>
    </DialogFooter>
  </Dialog>
)

// ─── AI ゲートウェイ：データ ───

type Role = 'オーナー' | 'メンバー'
type MemberStatus = 'active' | 'invited' | 'suspended'

type Member = {
  id: string
  name: string
  email: string
  role: Role
  status: MemberStatus
  projects: Project[]
}

type Project = { id: string; name: string; role: '管理者' | 'メンバー' }

// 見ている人は山田 太郎（オーナー）。自分の行には操作を出さない（memberActionCapabilities の isSelf）
const viewerId = 'm-yamada'

const members: Member[] = [
  {
    id: viewerId,
    name: '山田 太郎',
    email: 'taro.yamada@example.test',
    role: 'オーナー',
    status: 'active',
    projects: [],
  },
  {
    id: 'm-takahashi',
    name: '高橋 恵',
    email: 'megumi.takahashi@example.test',
    role: 'オーナー',
    status: 'active',
    projects: [],
  },
  {
    id: 'm-sato',
    name: '佐藤 花子',
    email: 'hanako.sato@example.test',
    role: 'メンバー',
    status: 'active',
    projects: [
      { id: 'p-chat', name: 'サポートチャット', role: '管理者' },
      { id: 'p-search', name: '社内検索', role: 'メンバー' },
    ],
  },
  {
    id: 'm-suzuki',
    name: '鈴木 四郎',
    email: 'shiro.suzuki@example.test',
    role: 'メンバー',
    status: 'invited',
    projects: [],
  },
  {
    id: 'm-tanaka',
    name: '田中 三郎',
    email: 'saburo.tanaka@example.test',
    role: 'メンバー',
    status: 'suspended',
    projects: [],
  },
]

const sato = members[2]

const memberStatusLabels: Record<Exclude<MemberStatus, 'active'>, string> = {
  invited: '招待中',
  suspended: '停止中',
}

// formatInvitationDateTime（Intl の ja-JP、dateStyle: medium / timeStyle: short）
const invitations = [
  {
    id: 'inv1',
    role: 'メンバー',
    to: 'shiro.suzuki@example.test',
    created: '2026/10/28 14:02',
    expires: '2026/11/04 14:02',
  },
  {
    id: 'inv2',
    role: 'メンバー',
    to: '—',
    created: '2026/10/29 09:15',
    expires: '2026/11/05 09:15',
  },
]

type MembersView = 'loading' | 'error' | 'success'

// ─── AI ゲートウェイ：メンバー ───

/** roleChangeMessages。オーナーにする・オーナー権限を外すの確認の文言 */
const roleChangeDialog = (member: Member, onClose: () => void) =>
  member.role === 'オーナー' ? (
    <ConfirmDialog
      title="オーナー権限を外しますか？"
      description={`${member.name} はメンバーの招待・削除、ロールの変更、請求の管理ができなくなります。`}
      confirmLabel="オーナー権限を外す"
      onClose={onClose}
    />
  ) : (
    <ConfirmDialog
      title="オーナーに変更しますか？"
      description={`${member.name} はメンバーの招待・削除、ロールの変更、請求の管理ができるようになります。`}
      confirmLabel="オーナーに変更する"
      onClose={onClose}
    />
  )

const removeMemberDialog = (member: Member, onClose: () => void) => (
  <ConfirmDialog
    title="メンバーを削除しますか？"
    description={`${member.name} は組織とすべてのプロジェクトにアクセスできなくなります。`}
    confirmLabel="このメンバーを削除する"
    destructive
    onClose={onClose}
  />
)

/** MemberActions。項目を選ぶと、それぞれの確認ダイアログやパネルを開く */
const MemberActions = ({
  member,
  onOpenDialog,
}: {
  member: Member
  onOpenDialog: (dialog: ReactNode) => void
}) => {
  const isOwner = member.role === 'オーナー'
  const close = () => onOpenDialog(null)
  return (
    <MenuTrigger>
      <Button
        appearance="transparent"
        size="s"
        iconOnly
        aria-label={`${member.name} の操作メニュー`}
      >
        <Icon name="ellipsis_vertical" size="s" aria-hidden="true" />
      </Button>
      <Menu placement="bottom end">
        {/* プロジェクトの権限はオーナー以外に出す */}
        {!isOwner && (
          <MenuItem
            leading={<Icon name="folder" size="s" />}
            onAction={() => onOpenDialog(<MemberProjectsPanel member={member} onClose={close} />)}
          >
            プロジェクトの権限を変更する
          </MenuItem>
        )}
        <MenuItem
          leading={<Icon name={isOwner ? 'minus_on_circle' : 'person'} size="s" />}
          onAction={() => onOpenDialog(roleChangeDialog(member, close))}
        >
          {isOwner ? 'オーナー権限を外す' : 'オーナーにする'}
        </MenuItem>
        <MenuItem
          color="negative"
          leading={<Icon name="garbage_can" size="s" />}
          onAction={() => onOpenDialog(removeMemberDialog(member, close))}
        >
          削除する
        </MenuItem>
      </Menu>
    </MenuTrigger>
  )
}

// GAP-NEW: Table のセルに 2 段目の補足（DataTableText tone="secondary"。14px・灰色）を置く型が無い
const TwoLine = ({ primary, secondary }: { primary: ReactNode; secondary: string }) => (
  <Stack gap="xxs">
    {primary}
    <Typography size="s" color="medium_emphasis" component="span">
      {secondary}
    </Typography>
  </Stack>
)

const projectCount = (m: Member) => {
  if (m.role === 'オーナー') return 'すべて'
  if (m.projects.length === 0) return '参加なし'
  return `${m.projects.length} プロジェクト`
}

const AiMembers = ({
  view,
  onOpenDialog,
}: {
  view: MembersView
  onOpenDialog: (dialog: ReactNode) => void
}) => (
  <Stack gap="l">
    {/* app/accounts/[accountId]/members/page.tsx の PageHeader */}
    <AppHeading title="メンバー" description="組織のメンバーを管理します" />
    {/* GAP-NEW: Skeleton が無い。実物は表の形の骨格（SkeletonTable）を出すが、Loader で代用している */}
    {view === 'loading' && (
      <Paper outlined>
        <Stack alignItems="center">
          <Loader size="m" message="メンバーを読み込んでいます" />
        </Stack>
      </Paper>
    )}
    {view === 'error' && <RetryCallout message="メンバーを読み込めませんでした。" />}
    {view === 'success' && (
      // 実物の一覧と招待は面に入れない。表は shared/ui/DataTable が枠線の Paper（padding 0）に入れる。
      // GAP-NEW: Table が幅 100% にならない（実物は DataTable の CSS で width: 100%）
      <Stack gap="l">
        <Stack gap="s">
          {/* shared/ui/ListToolbar。検索は左（600px 以上で幅 280px）、招待は右。
              GAP-NEW: TextField に虫眼鏡のアイコンを差せない。Stack に幅の指定が無い */}
          <Stack flexDirection={{ xxs: 'column', s: 'row' }} gap="s" justifyContent="space-between">
            <TextField
              aria-label="メンバーを名前かメールアドレスで検索する"
              placeholder="名前で検索"
              size="s"
              type="search"
            />
            <Button color={primaryColor} leading={<Icon name="person_plus" size="s" />}>
              メンバーを招待する
            </Button>
          </Stack>
          <Paper outlined padding="none">
            <Table aria-label="メンバー一覧">
              <TableHeader>
                <Column isRowHeader>表示名</Column>
                <Column>ロール</Column>
                <Column>参加プロジェクト</Column>
                {/* 実物の列見出しは aria-label だけで、目に見える文字は無い */}
                <Column aria-label="操作"> </Column>
              </TableHeader>
              <TableBody renderEmptyState={() => 'メンバーはいません'}>
                {members.map((m) => (
                  <Row key={m.id}>
                    <Cell>
                      <TwoLine
                        primary={
                          <Stack flexDirection="row" gap="xs" alignItems="center">
                            <Typography component="span">{m.name}</Typography>
                            {m.status !== 'active' && (
                              <Sticker
                                size="s"
                                color={m.status === 'suspended' ? 'negative' : 'neutral'}
                              >
                                {memberStatusLabels[m.status]}
                              </Sticker>
                            )}
                          </Stack>
                        }
                        secondary={m.email}
                      />
                    </Cell>
                    {/* GAP-NEW: Column / Cell に右寄せ（DataTableColumn の align: 'end'）が無い */}
                    <Cell>{m.role}</Cell>
                    <Cell>{projectCount(m)}</Cell>
                    <Cell>
                      {/* 自分の行と、参加中でないメンバーの行には操作を出さない */}
                      {m.id !== viewerId && m.status === 'active' && (
                        <MemberActions member={m} onOpenDialog={onOpenDialog} />
                      )}
                    </Cell>
                  </Row>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Stack>
        <Stack gap="s">
          <Typography size="m" fontWeight="bold" component="h3">
            発行済みの招待
          </Typography>
          <Paper outlined padding="none">
            <Table aria-label="発行済みの招待一覧">
              <TableHeader>
                <Column isRowHeader>ロール</Column>
                <Column>宛先</Column>
                <Column>発行日時</Column>
                <Column>有効期限</Column>
                <Column aria-label="操作"> </Column>
              </TableHeader>
              <TableBody renderEmptyState={() => '有効な招待はありません'}>
                {invitations.map((inv) => (
                  <Row key={inv.id}>
                    <Cell>{inv.role}</Cell>
                    <Cell>{inv.to}</Cell>
                    <Cell>{inv.created}</Cell>
                    <Cell>{inv.expires}</Cell>
                    <Cell>
                      <Button
                        appearance="transparent"
                        size="s"
                        iconOnly
                        aria-label="この招待を取り消す"
                      >
                        <Icon name="garbage_can" size="s" />
                      </Button>
                    </Cell>
                  </Row>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Stack>
      </Stack>
    )}
  </Stack>
)

// ─── AI ゲートウェイ：ダイアログ ───

const InviteDialog = () => (
  <Dialog isOpen>
    <DialogHeader>
      <DialogTitle>メンバーを招待する</DialogTitle>
    </DialogHeader>
    <Stack gap="m">
      <DialogDescription>メールで招待するか、招待URLを発行して共有します。</DialogDescription>
      <Tabs defaultSelectedKey="email">
        <TabList aria-label="招待方法">
          <Tab id="email">メールで招待</Tab>
          <Tab id="url">URLで招待</Tab>
        </TabList>
      </Tabs>
      {/* 実物は TabPanel の中に Select を置く。Tabs の中に Select を置くと落ちる既知の不具合があるため、
          TabPanel を使わずタブの下に置いている（GAP-NEW） */}
      <Stack gap="m">
        {/* 招待できるロールが 2 つ以上あるときだけ出る */}
        <Select label="ロール" width="full" defaultSelectedKey="member">
          <SelectItem id="owner">オーナー</SelectItem>
          <SelectItem id="member">メンバー</SelectItem>
        </Select>
        {/* 実物は InviteEmailField（複数の宛先をチップで並べ、最大 50 件）。GAP-NEW: TagField が無い */}
        <TextField
          label="招待メールの宛先"
          placeholder="member@example.com"
          type="email"
          width="full"
        />
      </Stack>
    </Stack>
    <DialogFooter>
      <Button appearance="transparent">キャンセル</Button>
      <Button color={primaryColor}>招待メールを送信する</Button>
    </DialogFooter>
  </Dialog>
)

/**
 * shared/ui/IssuedSecretDialog（IssuedSecretPanel）。一度しか見せない招待 URL を渡す。
 * GAP-NEW: SuccessMark が無い。check_on_circle を positive の色で置く。
 * GAP-NEW: CopyButton が無い（押すと check に変わる挙動も無い）。parts の CopyableValue で代用する。
 */
const IssuedUrlDialog = () => (
  // 実物はコピーするまで外側を押しても閉じない
  <Dialog isOpen isDismissable={false}>
    <DialogHeader>
      <Stack flexDirection="row" gap="xs" alignItems="center" justifyContent="center">
        <DialogTitle>招待URLを発行しました</DialogTitle>
        <Typography component="span" color="positive">
          <Icon name="check_on_circle" size="m" />
        </Typography>
      </Stack>
      <DialogDescription>
        このURLは一度だけ表示されます。閉じる前にコピーしてください。
      </DialogDescription>
    </DialogHeader>
    <CopyableValue
      value="https://gateway.example.test/invite#token=octi_g1_8c0f…"
      label="招待URL"
    />
    <DialogFooter>
      <Button color={primaryColor}>閉じる</Button>
    </DialogFooter>
  </Dialog>
)

/** MemberProjectsPanel。メンバーが参加しているプロジェクトと、それぞれのロール */
const MemberProjectsPanel = ({ member, onClose }: { member: Member; onClose?: () => void }) => (
  <Dialog isOpen onOpenChange={(open) => !open && onClose?.()}>
    <DialogHeader>
      <DialogTitle>{member.name}</DialogTitle>
    </DialogHeader>
    <Stack gap="m">
      <DialogDescription>
        このメンバーが参加しているプロジェクトと、それぞれのロールを管理します。
      </DialogDescription>
      <Paper outlined padding="none">
        <Table aria-label={`${member.name} が参加しているプロジェクト`}>
          <TableHeader>
            <Column isRowHeader>プロジェクト</Column>
            <Column>ロール</Column>
            <Column aria-label="操作"> </Column>
          </TableHeader>
          <TableBody renderEmptyState={() => '参加しているプロジェクトはありません'}>
            {member.projects.map((p) => (
              <Row key={p.id}>
                {/* 実物はプロジェクトの画面へのリンク。GAP-NEW: 文中のテキストリンク（Link）が無い */}
                <Cell>{p.name}</Cell>
                <Cell>{p.role}</Cell>
                <Cell>
                  {/* ProjectActions */}
                  <MenuTrigger>
                    <Button
                      appearance="transparent"
                      size="s"
                      iconOnly
                      aria-label={`${p.name} の操作メニュー`}
                    >
                      <Icon name="ellipsis_vertical" size="s" aria-hidden="true" />
                    </Button>
                    <Menu placement="bottom end">
                      <MenuItem
                        leading={
                          <Icon
                            name={p.role === '管理者' ? 'minus_on_circle' : 'person'}
                            size="s"
                          />
                        }
                      >
                        {p.role === '管理者' ? '管理者権限を外す' : '管理者にする'}
                      </MenuItem>
                      <MenuItem color="negative" leading={<Icon name="garbage_can" size="s" />}>
                        プロジェクトから外す
                      </MenuItem>
                    </Menu>
                  </MenuTrigger>
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
    <DialogFooter>
      <Button color={primaryColor} onPress={onClose}>
        閉じる
      </Button>
    </DialogFooter>
  </Dialog>
)

// ─── 画面 ───

const AccountScreen = ({
  membersView = 'success',
  dialog,
}: {
  membersView?: MembersView
  dialog?: ReactNode
}) => {
  // 行の操作メニューから開くダイアログ。ストーリーで渡したものを最初に開いておく
  const [openDialog, setOpenDialog] = useState<ReactNode>(dialog ?? null)
  return (
    <AppShell active="account">
      <GamersAccount />
      <Divider />
      <AiMembers view={membersView} onOpenDialog={setOpenDialog} />
      {openDialog}
    </AppShell>
  )
}

// ─── ストーリー：ゲーマーズ ───

/**
 * ゲーマーズのアカウント（アカウントID・メールアドレス・外部アカウント連携・メール受信設定・アカウント削除）と、
 * AI ゲートウェイのメンバー（メンバー一覧・発行済みの招待）。
 *
 * @summary アカウントとメンバー
 */
export const Default: Story = {
  render: () => <AccountScreen />,
}

/**
 * メールアドレス変更。アカウントの「メールアドレス」の「変更」から入る。
 *
 * @summary メールアドレス変更
 */
export const UpdateEmail: Story = {
  render: () => (
    <AppShell active="account">
      <UpdateEmailPage />
    </AppShell>
  ),
}

/**
 * メール受信設定。アカウントの「メール受信設定」の「変更」から入る。
 *
 * @summary メール受信設定
 */
export const NewsletterSettings: Story = {
  render: () => (
    <AppShell active="account">
      <UpdateNewsletterPage />
    </AppShell>
  ),
}

/**
 * アカウント削除の確認。ご利用のメールアドレスを入れるまで「削除」は押せない。
 *
 * @summary アカウント削除の確認
 */
export const LeaveAccount: Story = {
  render: () => <AccountScreen dialog={<AccountLeaveDialog />} />,
}

// ─── ストーリー：AI ゲートウェイ ───

/**
 * メンバーの読み込み中（GAP-NEW: Skeleton が無いので Loader で代用）。
 *
 * @summary メンバーの読み込み中
 */
export const MembersLoading: Story = {
  render: () => <AccountScreen membersView="loading" />,
}

/**
 * メンバーを読み込めなかったとき。
 *
 * @summary メンバーの読み込みに失敗
 */
export const MembersError: Story = {
  render: () => <AccountScreen membersView="error" />,
}

/**
 * メンバーの招待。「メールで招待」はロールと宛先、「URLで招待」は招待 URL の発行。
 *
 * @summary メンバーの招待
 */
export const InviteMember: Story = {
  render: () => <AccountScreen dialog={<InviteDialog />} />,
}

/**
 * 招待 URL を発行した直後。URL は一度しか見せない。
 *
 * @summary 招待 URL の発行
 */
export const InviteUrlIssued: Story = {
  render: () => <AccountScreen dialog={<IssuedUrlDialog />} />,
}

/**
 * メンバーをオーナーにする確認（roleChangeMessages）。
 *
 * @summary オーナーにする
 */
export const MakeOwner: Story = {
  render: () => <AccountScreen dialog={roleChangeDialog(sato, () => {})} />,
}

/**
 * メンバーの削除の確認。
 *
 * @summary メンバーの削除
 */
export const RemoveMember: Story = {
  render: () => <AccountScreen dialog={removeMemberDialog(sato, () => {})} />,
}

/**
 * メンバーのプロジェクトの権限。参加しているプロジェクトごとに、管理者にする・プロジェクトから外すを選ぶ。
 *
 * @summary プロジェクトの権限
 */
export const MemberProjects: Story = {
  render: () => <AccountScreen dialog={<MemberProjectsPanel member={sato} />} />,
}
