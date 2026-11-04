import { useState } from 'react'

import { AppBar, AppBarLeading } from '../../AppBar'
import { Breadcrumb, Breadcrumbs } from '../../Breadcrumbs'
import { Button, LinkButton } from '../../Button'
import { Container } from '../../Container'
import { Dialog, DialogFooter, DialogHeader, DialogTitle } from '../../Dialog'
import { Divider } from '../../Divider'
import { Icon } from '../../Icon'
import { Menu, MenuDivider, MenuItem, MenuSection, MenuTrigger } from '../../Menu'
import { Paper } from '../../Paper'
import { SideNavigation, SideNavigationItem, SideNavigationSection } from '../../SideNavigation'
import { Stack } from '../../Stack'
import { TextField } from '../../TextField'
import { Typography } from '../../Typography'
import { InviteDialog } from './aiGatewayInvite'
import logo from './assets/ai-gateway/logo.svg'

import type { CSSProperties, ReactNode } from 'react'
import type { IconName } from '../../Icon'

/**
 * AI ゲートウェイ（octane/admin-ui）の顧客コンソールの枠。
 * 写したもの:
 * - app/AppShell.tsx（ログイン後の枠）・app/globals.css（.app-root / .app-body / .app-main / .page-section-y）
 *   左に Sidebar、右の列の上に TopBar、その下に白い本文の面（左上だけ角丸 12px、左と上に罫線）
 * - shared/ui/Sidebar（幅 264px・地は gray[50]）: 上から ロゴ（高さ 56px の行の中央）→ ナビ → クレジット残高（前払いのみ）
 *   → 罫線の下にユーザーメニュー。ナビはプロジェクトの画面ならプロジェクトの項目だけ、組織の画面なら組織の項目と「管理」の見出しの項目。
 *   どちらも末尾（下寄せ）に ドキュメント・ヘルプ（別タブ）
 * - shared/ui/TopBar: AppBar transparent。組織の画面では（600px 以上）ロゴとユーザーメニューを Sidebar に任せて出さず、
 *   パンくず「組織の切り替え / プロジェクトの切り替え / 手前のページ / 現在のページ」だけを置く
 * - shared/ui/ProjectSwitcher・TopBar の AccountSwitcher: 名前のリンク＋切り替えの iconOnly ボタン（Menu）
 * - shared/ui/UserMenu（variant="sidebar"）・shared/ui/Sidebar/SidebarCredit
 * - shared/ui/PageContainer（Container size="l"、上下 24px）・shared/ui/PageHeader（xl の h1・xs の説明・右に操作・左に戻る）
 *
 * onNavigate に渡す行き先の名前（実物の URL）:
 * - 'projects'（/accounts/:id プロジェクト一覧）/ 'usage'（…/usage）/ 'members'（…/members）/ 'billing'（…/billing クレジット）
 *   / 'models'（…/models）/ 'tokens'（…/tokens）/ 'account-settings'（…/settings）
 * - 'project'（…/projects/:pid 概要）/ 'project-usage' / 'keys' / 'playground' / 'rules' / 'byok' / 'project-members'
 *   / 'project-settings'（いずれも …/projects/:pid/<名前>）
 * - 'logout'（ログアウト。実物は認証のログアウト URL か / へ移り、アプリの外に出る）
 * - 各画面の中の行き先（'key-detail' など）は、それぞれのストーリーファイルの冒頭に書く
 *
 * どの要素を押すとどこへ移るか（枠の中の分）:
 * | 押す要素 | 行き先 | 実物 |
 * | Sidebar のロゴ | 'projects' | Logo は / へ。/ は最初の組織の /accounts/:id へ replace する（app/page.tsx） |
 * | Sidebar の各項目 | 項目の行き先（上の一覧） | Sidebar の navItem の href |
 * | Sidebar のドキュメント・ヘルプ | 呼ばない（別タブで /docs・ヘルプセンター） | newTab |
 * | SidebarCredit の「追加」 | 'billing' | SidebarCredit の onNavigate |
 * | ユーザーメニュー「表示名を変更する」 | ダイアログ（表示名を変更） | DisplayNameDialog |
 * | ユーザーメニュー「ユーザー設定」 | 呼ばない（user.lolipop.jp へ） | href={userPageUrl} |
 * | ユーザーメニュー「組織へ招待する」 | ダイアログ（招待） | AccountMembers dialogOnly openInviteOnLoad |
 * | ユーザーメニュー「お知らせを受け取る」 | 移らない（オン・オフを切り替える） | changeAnnouncementOptIn |
 * | ユーザーメニュー「ログアウト」 | 'logout' | logout |
 * | パンくずの組織名 | 'projects' | AccountSwitcher の Link |
 * | 組織の切り替えメニューの組織 | 'projects'（選んだ組織の） | onNavigate(`/accounts/${id}`) |
 * | 組織の切り替えメニュー「組織を作成する」 | ダイアログ（組織を作成する） | AddAccountDialog |
 * | パンくずのプロジェクト名 | 'project' | ProjectSwitcher の Link |
 * | プロジェクトの切り替えメニューのプロジェクト | 'project'。APIキー・プレイグラウンドの画面では 'keys' / 'playground' | projectPathSuffix |
 * | プロジェクトの切り替えメニュー「プロジェクトを作成する」 | ダイアログ（プロジェクトを作成する） | ProjectCreationDialog |
 * | パンくずの手前のページ | 呼び出し側が渡した to | usePageTitle の breadcrumbs |
 *
 * 表せず残した違い:
 * - GAP: 600px 未満の切り替え（Sidebar を隠し、TopBar の下の「メニュー」ボタンから同じナビを Dialog で開く。
 *   TopBar にロゴとユーザーメニュー（iconOnly）が戻る）。この枠は常に 600px 以上の並びで描く
 * - GAP: 枠（.app-root・Sidebar の列・本文の面）と PageContainer の上下余白は wip-ui に部品が無く、素の div に style を当てている
 * - GAP: アイコンセットに 棒グラフ（使用状況）・鍵（APIキー・マネジメントトークン）・重なり（ルール・利用可能モデル）・
 *   ページ（ドキュメント）・建物（組織）・上下の山（切り替え）・右上の矢印（別タブ）が無い。
 *   parameters / lock / multi_pane / note / people / arrow_order / launch で代用している
 * - GAP: 実物のナビの項目は高さ 36px・文字 14px・アイコン 18px・現在地は gray[100] の地と太字。SideNavigation の見た目のまま
 * - GAP: 実物の別タブの矢印は hover したときだけ出る。ここでは常に出している
 * - GAP: 切り替えメニューの「組織を作成する」「プロジェクトを作成する」は実物では accent（強調色）の項目。MenuItem に色の口が無い
 * - GAP: ユーザーメニューの「お知らせを受け取る」は実物では右にスイッチの絵を出す。ここではオンのとき check を出す
 * - GAP: ユーザーメニューのアバターは実物では丸い地の上の人のアイコン。Icon だけを置いている
 * - GAP: 本文の面の表示時のフェードイン（content-fade-in 300ms）は無い
 * - GAP: Sidebar の下のユーザーメニューのボタンは、実物は幅いっぱいで中身が左寄せ。Button width="full" は中身が中央に寄る
 * - GAP: パンくずは実物では 14px・項目の間 6px。Breadcrumb の文字の大きさと余白のまま（間は Stack の xxs = 4px）
 * - GAP: 実物の PageHeader の h1 は margin 0。Typography の h1 には UA の margin が残り、見出しの上下が実物より開く
 * - ダイアログの送信中（Loader・保存中…）と失敗の Callout、作成後の Snackbar は入れていない。作成・保存を押すと閉じる
 */

// ─── データ（値はダミー）───

export const accountName = '開発チーム'
const otherAccounts = ['個人の組織']
export const viewerName = '山田 太郎'

export const projects = ['production', 'staging', 'デプロイ用', '社内チャットbot']

/** SidebarCredit の残高（formatMicroJpy） */
const creditBalance = '￥12,345.6789'

// ─── ナビの項目（Sidebar の createProjectNavItems・createAccountNavItems・createSupportNavItems）───

export type AiGatewayDestination =
  | 'projects'
  | 'usage'
  | 'members'
  | 'billing'
  | 'models'
  | 'tokens'
  | 'account-settings'
  | 'project'
  | 'project-usage'
  | 'keys'
  | 'playground'
  | 'rules'
  | 'byok'
  | 'project-members'
  | 'project-settings'
  | 'logout'

type NavItem = { to: AiGatewayDestination; label: string; icon: IconName }

const projectNavItems: NavItem[] = [
  { to: 'project', label: '概要', icon: 'folder' },
  { to: 'project-usage', label: '使用状況', icon: 'parameters' },
  { to: 'keys', label: 'APIキー', icon: 'lock' },
  { to: 'playground', label: 'プレイグラウンド', icon: 'balloon' },
  { to: 'rules', label: 'ルール', icon: 'multi_pane' },
  { to: 'byok', label: 'BYOK', icon: 'lock' },
  { to: 'project-members', label: 'メンバー', icon: 'person' },
  // プロジェクトを管理できるロール（canManageProjectNavigation）のときだけ出る
  { to: 'project-settings', label: 'プロジェクト設定', icon: 'gear' },
]

const accountNavItems: NavItem[] = [
  { to: 'projects', label: 'プロジェクト一覧', icon: 'folder' },
  { to: 'usage', label: '使用状況', icon: 'parameters' },
  { to: 'members', label: 'メンバー', icon: 'person' },
]

// クレジットは支払いを管理できる人（canViewBilling）、マネジメントトークンはロールとメンバーを管理できる人だけに出る。
// 見ている人はオーナーなので、すべて出す
const accountBottomNavItems: NavItem[] = [
  { to: 'billing', label: 'クレジット', icon: 'bill' },
  { to: 'models', label: '利用可能モデル', icon: 'multi_pane' },
  { to: 'tokens', label: 'マネジメントトークン', icon: 'lock' },
  { to: 'account-settings', label: '組織設定', icon: 'gear' },
]

const supportNavItems: { label: string; href: string; icon: IconName }[] = [
  { label: 'ドキュメント', href: '/docs', icon: 'note' },
  { label: 'ヘルプ', href: 'https://support.ai-gateway.lolipop.jp/', icon: 'question_on_circle' },
]

// ─── 枠の寸法（globals.css・Sidebar/styles.module.css）。wip-ui に枠の部品が無いので素の div に当てる ───

const rootStyle: CSSProperties = {
  display: 'flex',
  height: '100dvh',
  overflow: 'hidden',
  // 地の色は wip-ui のページの地（lolipop では brown 50）に任せる。実物は lolipopColors.gray[50]（#f2f3f7）
}
const sidebarStyle: CSSProperties = {
  width: 264,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}
const logoRowStyle: CSSProperties = {
  display: 'flex',
  minHeight: 56,
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
}
const navigationStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  padding: '8px 8px 0',
}
const supportStyle: CSSProperties = { marginTop: 'auto', paddingTop: 8, paddingBottom: 4 }
const footerStyle: CSSProperties = { flexShrink: 0, padding: 8 }
const bodyStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  minWidth: 0,
}
const mainStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  overflow: 'auto',
  scrollbarGutter: 'stable',
  borderTop: '1px solid #c4c9d8', // lolipopColors.gray[200]
  borderLeft: '1px solid #c4c9d8',
  borderTopLeftRadius: 12,
  // 地の色は wip-ui のページの地（lolipop では brown 50）に任せる。実物は白（#fff）
}
const pageSectionStyle: CSSProperties = { paddingTop: 24, paddingBottom: 24 }

// ─── 枠から開くダイアログ ───

/**
 * shared/ui/FormDialog。見出し・（失敗の Callout）・本文・キャンセル（transparent）と送信（neutral）。
 * DisplayNameDialog も同じ並びで、送信が「保存する」
 */
const FormDialog = ({
  isOpen,
  title,
  submitLabel,
  submitDisabled,
  onClose,
  children,
}: {
  isOpen: boolean
  title: string
  submitLabel: string
  submitDisabled: boolean
  onClose: () => void
  children: ReactNode
}) => (
  <Dialog isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
    </DialogHeader>
    {children}
    <DialogFooter>
      <Button appearance="transparent" color="neutral" onPress={onClose}>
        キャンセル
      </Button>
      <Button color="neutral" isDisabled={submitDisabled} onPress={onClose}>
        {submitLabel}
      </Button>
    </DialogFooter>
  </Dialog>
)

/** features/UserSettings の DisplayNameDialog。開くと今の表示名が入っている */
const DisplayNameDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [name, setName] = useState(viewerName)
  const tooLong = name.trim().length > 100
  return (
    <FormDialog
      isOpen={isOpen}
      title="表示名を変更"
      submitLabel="保存する"
      submitDisabled={name.trim().length === 0 || tooLong}
      onClose={onClose}
    >
      <TextField
        label="表示名"
        value={name}
        onChange={setName}
        width="full"
        isRequired
        isInvalid={tooLong}
        caption={tooLong ? '表示名は100文字以内で入力してください。' : undefined}
      />
    </FormDialog>
  )
}

/** features/AddAccountDialog */
const AddAccountDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [name, setName] = useState('')
  const tooLong = name.length > 100
  return (
    <FormDialog
      isOpen={isOpen}
      title="組織を作成する"
      submitLabel="組織を作成する"
      submitDisabled={name.trim().length === 0 || tooLong}
      onClose={onClose}
    >
      <TextField
        label="組織名"
        value={name}
        onChange={setName}
        width="full"
        isRequired
        autoFocus
        isInvalid={tooLong}
        caption={tooLong ? '100文字以内で入力してください。' : undefined}
      />
    </FormDialog>
  )
}

/** shared/ui/ProjectSwitcher/ProjectCreationDialog */
const ProjectCreationDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [name, setName] = useState('')
  return (
    <FormDialog
      isOpen={isOpen}
      title="プロジェクトを作成する"
      submitLabel="作成する"
      submitDisabled={name.trim().length === 0}
      onClose={onClose}
    >
      <TextField
        label="プロジェクト名"
        value={name}
        onChange={setName}
        width="full"
        isRequired
        autoFocus
      />
    </FormDialog>
  )
}

// ─── Sidebar ───

type Navigate = ((to: string) => void) | undefined

const NavList = ({
  label,
  items,
  current,
  onNavigate,
  title,
}: {
  label: string
  items: NavItem[]
  current?: AiGatewayDestination
  onNavigate: Navigate
  title?: string
}) => {
  const list = items.map((item) => (
    <SideNavigationItem
      key={item.to}
      href="#"
      onPress={() => onNavigate?.(item.to)}
      isCurrent={item.to === current}
      leading={<Icon name={item.icon} />}
    >
      {item.label}
    </SideNavigationItem>
  ))
  return (
    <SideNavigation aria-label={label}>
      {title ? <SideNavigationSection title={title}>{list}</SideNavigationSection> : list}
    </SideNavigation>
  )
}

/** shared/ui/Sidebar/SidebarCredit。枠線の面の左に「クレジット」と残高、右下に「追加」 */
const SidebarCredit = ({ onNavigate }: { onNavigate: Navigate }) => (
  <section aria-label="クレジット残高">
    <Paper outlined padding="s">
      <Stack flexDirection="row" gap="xs" alignItems="flex-end" justifyContent="space-between">
        <Stack>
          <Typography component="div" size="xs" color="medium_emphasis" fontWeight="bold">
            クレジット
          </Typography>
          <Typography component="div" size="m" fontWeight="bold">
            {creditBalance}
          </Typography>
        </Stack>
        <Button
          appearance="outlined"
          color="neutral"
          size="s"
          aria-label="クレジットを追加する"
          onPress={() => onNavigate?.('billing')}
        >
          追加
        </Button>
      </Stack>
    </Paper>
  </section>
)

const userPageUrl = 'https://user.lolipop.jp/?mode=dashboard&exec=account&return_to=ai_gateway'

/** shared/ui/UserMenu（variant="sidebar"）。上に開き、幅はトリガーに合わせる */
const UserMenu = ({ onNavigate }: { onNavigate: Navigate }) => {
  const [nameOpen, setNameOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [announcement, setAnnouncement] = useState(true)
  return (
    <>
      <MenuTrigger>
        <Button
          color="neutral"
          appearance="transparent"
          size="s"
          width="full"
          leading={<Icon name="person" />}
          trailing={<Icon name="arrow_order" />}
          aria-label={`ユーザーメニュー。${viewerName}でログイン中です`}
        >
          {viewerName}
        </Button>
        <Menu aria-label="ユーザー" placement="top start">
          <MenuSection title={viewerName}>
            <MenuItem leading={<Icon name="pencil" />} onAction={() => setNameOpen(true)}>
              表示名を変更する
            </MenuItem>
            <MenuItem leading={<Icon name="gear" />} href={userPageUrl}>
              ユーザー設定
            </MenuItem>
            <MenuItem leading={<Icon name="person_plus" />} onAction={() => setInviteOpen(true)}>
              組織へ招待する
            </MenuItem>
          </MenuSection>
          <MenuSection title="メール">
            <MenuItem
              leading={<Icon name="mail" />}
              trailing={announcement ? <Icon name="check" /> : undefined}
              onAction={() => setAnnouncement((on) => !on)}
            >
              お知らせを受け取る
            </MenuItem>
          </MenuSection>
          <MenuDivider />
          <MenuItem leading={<Icon name="out" />} onAction={() => onNavigate?.('logout')}>
            ログアウト
          </MenuItem>
        </Menu>
      </MenuTrigger>
      <DisplayNameDialog isOpen={nameOpen} onClose={() => setNameOpen(false)} />
      <InviteDialog isOpen={inviteOpen} onClose={() => setInviteOpen(false)} />
    </>
  )
}

const Sidebar = ({
  scope,
  current,
  onNavigate,
}: {
  scope: 'account' | 'project'
  current?: AiGatewayDestination
  onNavigate: Navigate
}) => (
  <aside style={sidebarStyle} aria-label="メインナビゲーション">
    <div style={logoRowStyle}>
      {/* shared/ui/Logo。ホームへのリンク */}
      <a
        href="/"
        aria-label="ホームへ移動する"
        onClick={(event) => {
          event.preventDefault()
          onNavigate?.('projects')
        }}
      >
        <img src={logo} alt="ロリポップ！AIゲートウェイ" width={226} height={24} />
      </a>
    </div>
    <div style={navigationStyle}>
      {scope === 'project' ? (
        <NavList
          label="プロジェクト内ナビゲーション"
          items={projectNavItems}
          current={current}
          onNavigate={onNavigate}
        />
      ) : (
        <Stack gap="m">
          <NavList
            label="組織ナビゲーション"
            items={accountNavItems}
            current={current}
            onNavigate={onNavigate}
          />
          <NavList
            label="組織管理ナビゲーション"
            title="管理"
            items={accountBottomNavItems}
            current={current}
            onNavigate={onNavigate}
          />
        </Stack>
      )}
      <div style={supportStyle}>
        <SideNavigation aria-label="サポートナビゲーション">
          {supportNavItems.map((item) => (
            <SideNavigationItem
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.label}（新しいタブで開く）`}
              leading={<Icon name={item.icon} />}
              trailing={<Icon name="launch" size="s" />}
            >
              {item.label}
            </SideNavigationItem>
          ))}
        </SideNavigation>
      </div>
    </div>
    {/* 前払いで、支払いを管理できる人だけに出る */}
    <div style={footerStyle}>
      <SidebarCredit onNavigate={onNavigate} />
    </div>
    <Divider />
    <div style={footerStyle}>
      <UserMenu onNavigate={onNavigate} />
    </div>
  </aside>
)

// ─── TopBar ───

export type Crumb = { label: string; to?: string }

const Separator = () => (
  <Typography component="span" size="s" color="low_emphasis" aria-hidden="true">
    /
  </Typography>
)

/** リンク 1 つの Breadcrumbs。区切りは後ろに自分で置く（切り替えボタンを挟むため） */
const CrumbLink = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <Breadcrumbs>
    <Breadcrumb href="#" onPress={onPress}>
      {label}
    </Breadcrumb>
  </Breadcrumbs>
)

/** TopBar の AccountSwitcher。組織名のリンクと、組織を切り替えるメニュー */
const AccountSwitcher = ({ onNavigate }: { onNavigate: Navigate }) => {
  const [createOpen, setCreateOpen] = useState(false)
  return (
    <>
      <Stack flexDirection="row" gap="xxs" alignItems="center">
        <Icon name="people" size="s" aria-hidden="true" />
        <CrumbLink label={accountName} onPress={() => onNavigate?.('projects')} />
        <MenuTrigger>
          <Button
            iconOnly
            color="neutral"
            appearance="transparent"
            size="s"
            aria-label={`組織を切り替える。現在は${accountName}です`}
          >
            <Icon name="arrow_order" size="s" />
          </Button>
          <Menu aria-label="組織の切り替え" placement="bottom start">
            <MenuSection title="組織">
              {[accountName, ...otherAccounts].map((name) => (
                <MenuItem
                  key={name}
                  leading={<Icon name="people" size="s" />}
                  trailing={name === accountName ? <Icon name="check" /> : undefined}
                  onAction={() => onNavigate?.('projects')}
                >
                  {name}
                </MenuItem>
              ))}
              <MenuItem leading={<Icon name="plus" />} onAction={() => setCreateOpen(true)}>
                組織を作成する
              </MenuItem>
            </MenuSection>
          </Menu>
        </MenuTrigger>
      </Stack>
      <AddAccountDialog isOpen={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  )
}

/** shared/ui/ProjectSwitcher */
const ProjectSwitcher = ({
  project,
  current,
  onNavigate,
}: {
  project: string
  current?: AiGatewayDestination
  onNavigate: Navigate
}) => {
  // projectPathSuffix: APIキー・プレイグラウンドの画面では、切り替え先でも同じ画面を開く
  const to: AiGatewayDestination =
    current === 'keys' || current === 'playground' ? current : 'project'
  const [createOpen, setCreateOpen] = useState(false)
  return (
    <>
      <Stack flexDirection="row" gap="xxs" alignItems="center">
        <CrumbLink label={project} onPress={() => onNavigate?.('project')} />
        <MenuTrigger>
          <Button
            iconOnly
            color="neutral"
            appearance="transparent"
            size="s"
            aria-label={`プロジェクトを切り替える。現在は${project}です`}
          >
            <Icon name="arrow_order" size="s" />
          </Button>
          <Menu aria-label="プロジェクトの切り替え" placement="bottom start">
            <MenuSection title="プロジェクト">
              {projects.map((name) => (
                <MenuItem key={name} onAction={() => onNavigate?.(to)}>
                  {name}
                </MenuItem>
              ))}
            </MenuSection>
            <MenuItem leading={<Icon name="plus" size="s" />} onAction={() => setCreateOpen(true)}>
              プロジェクトを作成する
            </MenuItem>
          </Menu>
        </MenuTrigger>
      </Stack>
      <ProjectCreationDialog isOpen={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  )
}

const TopBar = ({
  project,
  breadcrumbs,
  title,
  current,
  onNavigate,
}: {
  project?: string
  breadcrumbs: Crumb[]
  title?: string
  current?: AiGatewayDestination
  onNavigate: Navigate
}) => (
  <AppBar appearance="transparent" position="relative">
    <AppBarLeading>
      <nav aria-label="パンくず">
        <Stack flexDirection="row" gap="xxs" alignItems="center">
          <AccountSwitcher onNavigate={onNavigate} />
          <Separator />
          {project && (
            <>
              <ProjectSwitcher project={project} current={current} onNavigate={onNavigate} />
              <Separator />
            </>
          )}
          {breadcrumbs.map((item) => (
            <Stack key={item.label} flexDirection="row" gap="xxs" alignItems="center">
              <CrumbLink label={item.label} onPress={() => item.to && onNavigate?.(item.to)} />
              <Separator />
            </Stack>
          ))}
          {title !== undefined && (
            <Typography component="span" size="s" fontWeight="bold" aria-current="page">
              {title}
            </Typography>
          )}
        </Stack>
      </nav>
    </AppBarLeading>
  </AppBar>
)

// ─── 枠 ───

/**
 * 顧客コンソールの枠。project を渡すとプロジェクトの画面（Sidebar はプロジェクトの項目、パンくずにプロジェクトの切り替え）
 * になり、渡さなければ組織の画面になる。
 */
export const AiGatewayShell = ({
  current,
  project,
  breadcrumbs = [],
  title,
  onNavigate,
  children,
}: {
  /** Sidebar で現在地にする項目 */
  current?: AiGatewayDestination
  /** プロジェクトの画面のときの、開いているプロジェクト */
  project?: string
  /** パンくずの、切り替えメニューより後ろで現在のページより手前（usePageTitle の breadcrumbs） */
  breadcrumbs?: Crumb[]
  /** パンくずの末尾に出す現在のページ名（usePageTitle の title） */
  title?: string
  /** サイドナビ・パンくず・メニューの項目を押したとき */
  onNavigate?: (to: string) => void
  children: ReactNode
}) => (
  <div style={rootStyle}>
    <Sidebar scope={project ? 'project' : 'account'} current={current} onNavigate={onNavigate} />
    <div style={bodyStyle}>
      <TopBar
        project={project}
        breadcrumbs={breadcrumbs}
        title={title}
        current={current}
        onNavigate={onNavigate}
      />
      <main style={mainStyle} aria-labelledby="page-title">
        {children}
      </main>
    </div>
  </div>
)

// ─── 本文の部品 ───

/** shared/ui/PageContainer。Container size="l"（1200px）、上下 24px。見出しと本文の間は PageHeader の margin-bottom 24px */
export const PageContainer = ({ children }: { children: ReactNode }) => (
  <div style={pageSectionStyle}>
    <Container size="l">
      <Stack gap="l">{children}</Stack>
    </Container>
  </div>
)

/**
 * shared/ui/PageHeader。見出し行の左に（あれば）戻るボタンと h1（xl・太字）、右端に操作。その下に xs の説明。
 * 見出しは .app-main の aria-labelledby から指される（id="page-title"）
 */
export const PageHeader = ({
  title,
  description,
  actions,
  back,
  leading,
}: {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  back?: { label: string; onPress?: () => void }
  leading?: ReactNode
}) => {
  return (
    <Stack gap="xxs">
      <Stack flexDirection="row" gap="m" alignItems="center" justifyContent="space-between">
        <Stack flexDirection="row" gap="xs" alignItems="center">
          {back && (
            <LinkButton
              iconOnly
              appearance="transparent"
              color="neutral"
              size="s"
              href="#"
              aria-label={back.label}
              onPress={back.onPress}
            >
              <Icon name="chevron_left" size="s" />
            </LinkButton>
          )}
          {leading}
          <Typography id="page-title" component="h1" size="xl" fontWeight="bold">
            {title}
          </Typography>
        </Stack>
        {actions !== undefined && (
          <Stack flexDirection="row" gap="xs" alignItems="center">
            {actions}
          </Stack>
        )}
      </Stack>
      {description !== undefined && (
        // 実物は <p> の margin を 0 にしている。Typography の <p> は UA の margin が残るので div にする
        <Typography component="div" size="xs" color="medium_emphasis">
          {description}
        </Typography>
      )}
    </Stack>
  )
}
