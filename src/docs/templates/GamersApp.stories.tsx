import { useState } from 'react'

import * as BackupStories from './Backup.stories'
import * as FileManagerStories from './FileManager.stories'
import * as AccountStories from './GamersAccount.stories'
import * as AuthStories from './GamersAuth.stories'
import * as PaymentStories from './GamersPayment.stories'
import * as SystemPagesStories from './GamersSystemPages.stories'
import * as GameSettingsStories from './GameSettings.stories'
import { GamersNavigationProvider } from './gamersShell'
import * as HomeStories from './Home.stories'
import * as ModsStories from './Mods.stories'
import * as OnboardingStories from './Onboarding.stories'
import * as OverviewStories from './Overview.stories'
import * as RenewalStories from './Renewal.stories'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import type { GamersDestination } from './gamersShell'

/**
 * ゲーマーズ（apollo/frontend）を 1 つのアプリとしてたどるストーリー。
 * 各画面は、それぞれのストーリーファイルのストーリーをそのまま描く（見た目は各ストーリーと同じ）。
 * 画面の中で押した要素は gamersShell.tsx の onNavigate を呼び、ここで行き先に合う画面に切り替える。
 * 行き先の名前と「どの要素を押すとどこへ移るか」は gamersShell.tsx の冒頭のコメントにある。
 *
 * - 入り口はログイン画面。実物の app/page.tsx が / を /login へ redirect するため
 * - logout はログイン画面へ移る（実物は signOut のあと /login へ replace）
 * - contact（Zendesk）と external（ヘルプ記事・IdP・決済ページ・サービストップなど、別タブで開くもの）は、
 *   アプリの外なので押しても今の画面のまま
 */

const meta = {
  title: 'Templates/Gamers/App',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// 各ストーリーファイルのストーリー。render を部品として描く
type AnyStory = { render?: (...args: never[]) => unknown }

const screens: Partial<Record<GamersDestination, AnyStory>> = {
  // (public)
  login: AuthStories.GamersLogin,
  'login-authcode': AuthStories.GamersLoginAuthcode,
  signup: AuthStories.GamersSignup,
  'signup-authcode': AuthStories.GamersSignupAuthcode,
  error: SystemPagesStories.GamersError,
  // (private)
  'signup-complete': AuthStories.GamersSignupComplete,
  home: HomeStories.Default,
  'home-backups': HomeStories.MyBackups,
  account: AccountStories.Default,
  'account-update-email': AccountStories.UpdateEmail,
  'account-newsletter': AccountStories.NewsletterSettings,
  // servers/[id]
  server: OverviewStories.Default,
  'server-game': GameSettingsStories.Default,
  'server-mods': ModsStories.Default,
  'server-files': FileManagerStories.Default,
  backup: BackupStories.Default,
  payment: PaymentStories.Default,
  'payment-history': PaymentStories.History,
  'payment-method-change': PaymentStories.ChangePaymentMethod,
  // 購入・更新
  'server-new': OnboardingStories.GameSelectStep,
  'server-new-plan': OnboardingStories.PlanSelectStep,
  'server-new-payment': OnboardingStories.PaymentInfoStep,
  billing: RenewalStories.Default,
}

/** アプリの外へ出る行き先。押しても今の画面のまま */
const stayDestinations: GamersDestination[] = ['contact', 'external']

// ストーリーの render は引数を使わない。中で hook を使うものもあるので、行き先ごとに key で作り直す
const StoryView = ({ story }: { story: AnyStory }) =>
  (story.render as (() => ReactNode) | undefined)?.() ?? null

const GamersApp = () => {
  const [current, setCurrent] = useState<GamersDestination>('login')
  const navigate = (to: GamersDestination) => {
    if (stayDestinations.includes(to)) return
    const next = to === 'logout' ? 'login' : to
    if (screens[next]) {
      setCurrent(next)
      window.scrollTo(0, 0)
    }
  }
  const story = screens[current]
  return (
    <GamersNavigationProvider onNavigate={navigate}>
      {story && <StoryView key={current} story={story} />}
    </GamersNavigationProvider>
  )
}

/**
 * ログイン画面から始め、ログイン → 認証コード → ホーム → サーバー（詳細・ゲーム設定・MOD・ファイル管理のタブ、
 * バックアップ、支払い）→ 申し込み・更新・アカウントへと、実物と同じ順で画面をたどれる。
 *
 * @summary ゲーマーズをアプリとしてたどる
 */
export const Default: Story = {
  render: () => <GamersApp />,
}
