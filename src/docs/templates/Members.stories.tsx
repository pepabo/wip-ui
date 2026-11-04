import { useState } from 'react'

import { Button } from '../../Button'
import { Callout } from '../../Callout'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../Dialog'
import { Icon } from '../../Icon'
import { Loader } from '../../Loader'
import { Menu, MenuItem, MenuTrigger } from '../../Menu'
import { Paper } from '../../Paper'
import { Stack } from '../../Stack'
import { Sticker } from '../../Sticker'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../Table'
import { TextField } from '../../TextField'
import { Typography } from '../../Typography'
import { InviteDialog } from './aiGatewayInvite'
import { AiGatewayShell, PageContainer, PageHeader } from './aiGatewayShell'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

/**
 * AI ゲートウェイ（octane/admin-ui）の組織の「メンバー」。
 * - 画面: app/accounts/[accountId]/members/page.tsx（PageContainer ＋ PageHeader ＋ AccountMembers）
 * - 一覧・招待・確認: features/AccountMembers/index.tsx（ListToolbar・ListSearch・DataTable・ConfirmDialog・IssuedSecretDialog）
 * - プロジェクトの権限: features/AccountMembers/MemberProjectsPanel.tsx・memberProjects.ts
 *
 * 見ている人は山田 太郎（オーナー。ロールの変更・メンバーの削除・招待・招待の取り消しができ、管理できるプロジェクトがある）。
 *
 * 実物と違うところ（表せなかったもの）:
 * - GAP: Dialog に幅の口が無い。実物はプロジェクトの権限 600px・確認 400px
 * - GAP: Table の列に右寄せ（DataTableColumn の align: 'end'）と最小幅が無い。実物はロール・参加プロジェクト・操作の列が右寄せ
 * - GAP: Table が幅 100% にならない（実物は DataTable の CSS で width: 100%）
 * - GAP: 表のセルの文字の大きさ。実物の DataTableText は既定 16px、aux 14px、secondary 14px の灰色。ここでは Typography の m / s で写している
 * - GAP: 0 件の表示（DataTableEmpty）は実物では h3（s・太字）を中央に置く。TableBody の renderEmptyState に文字だけを渡している
 * - GAP: 検索欄（ListSearch）の虫眼鏡のアイコンと、600px 以上での幅 280px
 * - GAP: Skeleton が無い。読み込み中は実物では表の形の骨格（SkeletonTable、4 行）を出す。ここでは見出しだけの表の中に Loader を置く
 * - 招待と発行した URL のダイアログは aiGatewayInvite.tsx（そちらの GAP を参照）
 * - GAP: プロジェクトの権限の表のプロジェクト名は、wip-ui に文中のリンクが無いので素の a（hover の下線は無い）
 */

const meta = {
  title: 'Templates/AiGateway/Members',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
  // 画面の部品は Templates/AiGateway/App から使うために export している。ストーリーとしては数えない
  excludeStories: /Screen$|^productionUsage$/,
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ─── データ（形は features/AccountMembers の AccountMember・InvitationMetadata。値はダミー）───

type Role = 'オーナー' | 'メンバー'
type MemberStatus = 'active' | 'invited' | 'suspended'

type Project = { id: string; name: string; role: '管理者' | 'メンバー' }

type Member = {
  id: string
  name: string
  email: string
  role: Role
  status: MemberStatus
  projects: Project[]
}

// 自分の行には操作を出さない（memberActionCapabilities の isSelf）
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
      { id: 'p-chat', name: '社内チャットbot', role: '管理者' },
      { id: 'p-staging', name: 'staging', role: 'メンバー' },
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

// formatInvitationDateTime（Intl の ja-JP、dateStyle: medium / timeStyle: short）。宛先の無い招待は URL での招待
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

// ─── 共通の部品 ───

/** shared/ui/RetryCallout */
const RetryCallout = ({ message }: { message: string }) => (
  <Callout
    color="negative"
    action={
      <Button appearance="transparent" color="neutral" size="s">
        再読み込みする
      </Button>
    }
  >
    {message}
  </Callout>
)

/** shared/ui/ConfirmDialog。確定は destructive なら negative、それ以外は neutral */
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
      <Button appearance="transparent" color="neutral" onPress={onClose}>
        キャンセル
      </Button>
      <Button color={destructive ? 'negative' : 'neutral'} onPress={onClose}>
        {confirmLabel}
      </Button>
    </DialogFooter>
  </Dialog>
)

/** shared/ui/Menu の ActionsMenu。行の右端の「…」 */
const ActionsMenu = ({ label, children }: { label: string; children: ReactNode }) => (
  <MenuTrigger>
    <Button iconOnly appearance="transparent" color="neutral" size="s" aria-label={label}>
      <Icon name="ellipsis_vertical" size="s" />
    </Button>
    <Menu placement="bottom end">{children}</Menu>
  </MenuTrigger>
)

/** DataTableText の tone="aux"（14px） */
const Aux = ({ children }: { children: ReactNode }) => (
  <Typography size="s" component="span">
    {children}
  </Typography>
)

/** DataTableText の tone="secondary"（14px の灰色） */
const Secondary = ({ children }: { children: ReactNode }) => (
  <Typography size="s" color="medium_emphasis" component="span">
    {children}
  </Typography>
)

// ─── 確認ダイアログ（index.tsx の roleChangeMessages と削除の ConfirmDialog）───

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

const cancelInvitationDialog = (onClose: () => void) => (
  <ConfirmDialog
    title="招待を取り消しますか？"
    description="この招待URLは使用できなくなります。"
    confirmLabel="この招待を取り消す"
    destructive
    onClose={onClose}
  />
)

// ─── 一覧（index.tsx の AccountMembers）───

/** MemberActions。プロジェクトの権限はオーナー以外、ロールの変更と削除は自分以外 */
const MemberActions = ({
  member,
  onOpenDialog,
  onNavigate,
}: {
  member: Member
  onOpenDialog: (dialog: ReactNode) => void
  onNavigate?: (to: string) => void
}) => {
  const isOwner = member.role === 'オーナー'
  const close = () => onOpenDialog(null)
  return (
    <ActionsMenu label={`${member.name} の操作メニュー`}>
      {!isOwner && (
        <MenuItem
          leading={<Icon name="folder" size="s" />}
          onAction={() =>
            onOpenDialog(
              <MemberProjectsPanel member={member} onClose={close} onNavigate={onNavigate} />
            )
          }
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
    </ActionsMenu>
  )
}

/** canOpenProjects。参加中で、オーナーではないメンバー（管理できるプロジェクトがある前提） */
const canOpenProjects = (m: Member) => m.status === 'active' && m.role !== 'オーナー'

/** MemberProjectCount */
const ProjectCount = ({ member }: { member: Member }) => {
  if (member.role === 'オーナー') return <Aux>すべて</Aux>
  if (member.projects.length === 0) return <Secondary>参加なし</Secondary>
  return <Aux>{member.projects.length} プロジェクト</Aux>
}

/** memberColumns。操作の列は、操作できる行が 1 つでもあるときだけ */
const MemberColumns = () => (
  <TableHeader>
    <Column isRowHeader>表示名</Column>
    <Column>ロール</Column>
    <Column>参加プロジェクト</Column>
    <Column aria-label="操作"> </Column>
  </TableHeader>
)

const AccountMembers = ({
  view,
  onOpenDialog,
  onInvite,
  onNavigate,
}: {
  view: MembersView
  onOpenDialog: (dialog: ReactNode) => void
  onInvite: () => void
  onNavigate?: (to: string) => void
}) => {
  const [query, setQuery] = useState('')
  const needle = query.trim().toLowerCase()
  const visible = members.filter(
    (m) => needle === '' || m.name.toLowerCase().includes(needle) || m.email.includes(needle)
  )
  if (view === 'loading') {
    // SkeletonTable。見出しは操作の列を含まない memberColumns(false)
    return (
      <section aria-label="組織メンバー">
        <Paper outlined padding="none">
          <Table aria-label="メンバー一覧">
            <TableHeader>
              <Column isRowHeader>表示名</Column>
              <Column>ロール</Column>
              <Column>参加プロジェクト</Column>
            </TableHeader>
            <TableBody
              renderEmptyState={() => <Loader size="m" message="メンバーを読み込んでいます" />}
            >
              {[]}
            </TableBody>
          </Table>
        </Paper>
      </section>
    )
  }
  if (view === 'error') {
    return (
      <section aria-label="組織メンバー">
        <RetryCallout message="メンバーを読み込めませんでした。" />
      </section>
    )
  }
  return (
    <section aria-label="組織メンバー">
      {/* 一覧の下 24px（.invitationSection の margin-top）に発行済みの招待 */}
      <Stack gap="l">
        {/* ツールバーの下 12px（.tableToolbar の margin-bottom） */}
        <Stack gap="s">
          {/* shared/ui/ListToolbar。左に検索（ListSearch）、右端に招待 */}
          <Stack flexDirection={{ xxs: 'column', s: 'row' }} gap="s" justifyContent="space-between">
            <TextField
              aria-label="メンバーを名前かメールアドレスで検索する"
              placeholder="名前で検索"
              size="s"
              type="search"
              value={query}
              onChange={setQuery}
            />
            <Button
              color="neutral"
              leading={<Icon name="person_plus" size="s" />}
              onPress={onInvite}
            >
              メンバーを招待する
            </Button>
          </Stack>
          {/* shared/ui/DataTable は表を枠線の Paper（padding 0）に入れる */}
          <Paper outlined padding="none">
            {/* 行を押すとプロジェクトの権限を開く。開けるのはオーナー以外の参加中のメンバーだけ（canOpenProjects） */}
            <Table
              aria-label="メンバー一覧"
              onRowAction={(key) => {
                const member = visible.find((m) => m.id === key)
                if (member && canOpenProjects(member)) {
                  onOpenDialog(
                    <MemberProjectsPanel
                      member={member}
                      onClose={() => onOpenDialog(null)}
                      onNavigate={onNavigate}
                    />
                  )
                }
              }}
            >
              <MemberColumns />
              <TableBody
                renderEmptyState={() =>
                  needle === '' ? 'メンバーはいません' : '絞り込みに一致するメンバーはいません'
                }
              >
                {visible.map((m) => (
                  <Row key={m.id} id={m.id}>
                    <Cell>
                      <Stack gap="xxs">
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
                        <Secondary>{m.email}</Secondary>
                      </Stack>
                    </Cell>
                    <Cell>
                      <Aux>{m.role}</Aux>
                    </Cell>
                    <Cell>
                      <ProjectCount member={m} />
                    </Cell>
                    <Cell>
                      {/* memberActionsAvailable: 参加中で、自分ではない行 */}
                      {m.id !== viewerId && m.status === 'active' && (
                        <MemberActions
                          member={m}
                          onOpenDialog={onOpenDialog}
                          onNavigate={onNavigate}
                        />
                      )}
                    </Cell>
                  </Row>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Stack>
        <section aria-label="発行済みの招待">
          {/* 見出しの下 12px（.sectionHeading の margin-bottom） */}
          <Stack gap="s">
            <Typography component="h2" size="m" fontWeight="bold">
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
                      <Cell>
                        <Typography component="span">{inv.role}</Typography>
                      </Cell>
                      <Cell>
                        <Aux>{inv.to}</Aux>
                      </Cell>
                      <Cell>
                        <Aux>{inv.created}</Aux>
                      </Cell>
                      <Cell>
                        <Aux>{inv.expires}</Aux>
                      </Cell>
                      <Cell>
                        <Button
                          iconOnly
                          appearance="transparent"
                          color="neutral"
                          size="s"
                          aria-label="この招待を取り消す"
                          onPress={() =>
                            onOpenDialog(cancelInvitationDialog(() => onOpenDialog(null)))
                          }
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
        </section>
      </Stack>
    </section>
  )
}

// ─── ダイアログ ───

const projectLinkStyle = { color: 'inherit', textDecoration: 'none' }

/** MemberProjectsPanel。メンバーが参加しているプロジェクトと、それぞれのロール */
const MemberProjectsPanel = ({
  member,
  onClose,
  onNavigate,
}: {
  member: Member
  onClose?: () => void
  onNavigate?: (to: string) => void
}) => {
  // ProjectActions から開く確認（projectRoleChangeMessages・「プロジェクトから外しますか？」）
  const [confirm, setConfirm] = useState<ReactNode>(null)
  const closeConfirm = () => setConfirm(null)
  return (
    <>
      <Dialog isOpen onOpenChange={(open) => !open && onClose?.()}>
        <DialogHeader>
          <DialogTitle>{member.name}</DialogTitle>
        </DialogHeader>
        {/* 表の上 16px（.panelTable の margin-top） */}
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
                    <Cell>
                      {/* next/link でプロジェクトの概要（/accounts/[accountId]/projects/[projectId]）へ。
                      wip-ui に文中のリンクが無いので素の a。文字の色は継承し、hover で下線（.projectLink） */}
                      <Typography component="span">
                        <a
                          href={`/accounts/ac-dev/projects/${p.id}`}
                          style={projectLinkStyle}
                          onClick={(event) => {
                            event.preventDefault()
                            onNavigate?.('project')
                          }}
                        >
                          {p.name}
                        </a>
                      </Typography>
                    </Cell>
                    <Cell>
                      <Aux>{p.role}</Aux>
                    </Cell>
                    <Cell>
                      {/* ProjectActions */}
                      <ActionsMenu label={`${p.name} の操作メニュー`}>
                        <MenuItem
                          leading={
                            <Icon
                              name={p.role === '管理者' ? 'minus_on_circle' : 'person'}
                              size="s"
                            />
                          }
                          onAction={() =>
                            setConfirm(
                              p.role === '管理者' ? (
                                <ConfirmDialog
                                  title="管理者権限を外しますか？"
                                  description={`${member.name} は ${p.name} のAPIキーの発行・取り消し、設定の変更、メンバーの管理ができなくなります。`}
                                  confirmLabel="管理者権限を外す"
                                  onClose={closeConfirm}
                                />
                              ) : (
                                <ConfirmDialog
                                  title="管理者に変更しますか？"
                                  description={`${member.name} は ${p.name} のAPIキーの発行・取り消し、設定の変更、メンバーの管理ができるようになります。`}
                                  confirmLabel="管理者に変更する"
                                  onClose={closeConfirm}
                                />
                              )
                            )
                          }
                        >
                          {p.role === '管理者' ? '管理者権限を外す' : '管理者にする'}
                        </MenuItem>
                        <MenuItem
                          color="negative"
                          leading={<Icon name="garbage_can" size="s" />}
                          onAction={() =>
                            setConfirm(
                              <ConfirmDialog
                                title="プロジェクトから外しますか？"
                                description={`${member.name} は ${p.name} を利用できなくなります。`}
                                confirmLabel="このプロジェクトから外す"
                                destructive
                                onClose={closeConfirm}
                              />
                            )
                          }
                        >
                          プロジェクトから外す
                        </MenuItem>
                      </ActionsMenu>
                    </Cell>
                  </Row>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Stack>
        <DialogFooter>
          <Button color="neutral" onPress={onClose}>
            閉じる
          </Button>
        </DialogFooter>
      </Dialog>
      {confirm}
    </>
  )
}

// ─── 画面 ───

export const MembersScreen = ({
  view = 'success',
  dialog,
  invite,
  onNavigate,
}: {
  view?: MembersView
  dialog?: ReactNode
  /** 招待の流れを開いた状態で始める。issued は招待 URL を発行した後 */
  invite?: 'email' | 'issued'
  onNavigate?: (to: string) => void
}) => {
  // 操作から開くダイアログ。ストーリーで渡したものを最初に開いておく
  const [openDialog, setOpenDialog] = useState<ReactNode>(dialog ?? null)
  const [inviteOpen, setInviteOpen] = useState(invite !== undefined)
  return (
    <AiGatewayShell current="members" title="メンバー" onNavigate={onNavigate}>
      <PageContainer>
        <PageHeader title="メンバー" description="組織のメンバーを管理します" />
        <AccountMembers
          view={view}
          onOpenDialog={setOpenDialog}
          onInvite={() => setInviteOpen(true)}
          onNavigate={onNavigate}
        />
      </PageContainer>
      {openDialog}
      <InviteDialog
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        initialIssued={invite === 'issued'}
      />
    </AiGatewayShell>
  )
}

// ─── ストーリー ───

/**
 * 組織のメンバー一覧と、発行済みの招待。自分の行と、参加中でないメンバーの行には操作を出さない。
 *
 * @summary メンバー一覧
 */
export const Default: Story = {
  render: () => <MembersScreen />,
}

/**
 * メンバーの読み込み中。
 *
 * @summary メンバーの読み込み中
 */
export const MembersLoading: Story = {
  render: () => <MembersScreen view="loading" />,
}

/**
 * メンバーを読み込めなかったとき。ツールバーも表も出さず、RetryCallout だけを置く。
 *
 * @summary メンバーの読み込みに失敗
 */
export const MembersError: Story = {
  render: () => <MembersScreen view="error" />,
}

/**
 * メンバーの招待。「メールで招待」はロールと宛先、「URLで招待」は招待 URL の発行。
 *
 * @summary メンバーの招待
 */
export const InviteMember: Story = {
  render: () => <MembersScreen invite="email" />,
}

/**
 * 招待 URL を発行した直後。URL は一度しか見せない。
 *
 * @summary 招待 URL の発行
 */
export const InviteUrlIssued: Story = {
  render: () => <MembersScreen invite="issued" />,
}

/**
 * メンバーをオーナーにする確認（roleChangeMessages）。
 *
 * @summary オーナーにする
 */
export const MakeOwner: Story = {
  render: () => <MembersScreen dialog={roleChangeDialog(sato, () => {})} />,
}

/**
 * メンバーの削除の確認。
 *
 * @summary メンバーの削除
 */
export const RemoveMember: Story = {
  render: () => <MembersScreen dialog={removeMemberDialog(sato, () => {})} />,
}

/**
 * メンバーのプロジェクトの権限。参加しているプロジェクトごとに、管理者にする・プロジェクトから外すを選ぶ。
 *
 * @summary プロジェクトの権限
 */
export const MemberProjects: Story = {
  render: () => <MembersScreen dialog={<MemberProjectsPanel member={sato} />} />,
}
