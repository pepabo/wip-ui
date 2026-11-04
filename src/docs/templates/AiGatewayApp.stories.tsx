import { useState } from 'react'

import { ApiKeysScreen } from './ApiKeys.stories'
import { BillingScreen } from './Billing.stories'
import { MembersScreen } from './Members.stories'
import { productionUsage, UsageScreen } from './Usage.stories'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactElement } from 'react'
import type { AiGatewayScreen } from './aiGatewayShell'

/**
 * AI ゲートウェイ（octane/admin-ui）の顧客コンソールを 1 つのアプリとして動かす。
 * 行き先の名前と、どの要素を押すとどこへ移るかは aiGatewayShell.tsx と各ストーリーファイルの冒頭に書いてある。
 *
 * 画面がある行き先:
 * - 'usage'（組織の使用状況）/ 'project-usage'（production の使用状況）
 * - 'members'（組織のメンバー）
 * - 'billing'（クレジット）/ 'card-challenge-return'（カード認証。開くとすぐ 'billing' へ戻る）
 * - 'keys'（APIキー一覧）/ 'key-detail' / 'key-limits' / 'key-models' / 'key-guardrails'
 *
 * 画面が無い行き先（押しても今の画面のまま）:
 * - 'projects'（プロジェクト一覧）/ 'models' / 'tokens' / 'account-settings'
 * - 'project'（プロジェクトの概要）/ 'playground' / 'rules' / 'rule-detail' / 'byok' / 'project-members' / 'project-settings'
 * - 'logout'
 *
 * 実物はログイン後に最初の組織のプロジェクト一覧（'projects'）を開くが、その画面が無いので組織の使用状況から始める。
 */

const meta = {
  title: 'Templates/AiGateway/App',
  // テンプレートはロリポップのトンマナを確かめる場所なので、フレーバーを lolipop に固定する
  globals: { flavor: 'lolipop' },
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// 画面がある行き先は aiGatewayShell.tsx の aiGatewayStoryRoutes と同じ（画面ごとのストーリーの linkTo と共有）。
// ここではそれぞれの画面を、App の中で切り替える navigate を渡して描く
const screens: Record<AiGatewayScreen, (navigate: (to: string) => void) => ReactElement> = {
  usage: (navigate) => <UsageScreen onNavigate={navigate} />,
  'project-usage': (navigate) => (
    <UsageScreen initialProject={productionUsage} onNavigate={navigate} />
  ),
  members: (navigate) => <MembersScreen onNavigate={navigate} />,
  billing: (navigate) => <BillingScreen onNavigate={navigate} />,
  'card-challenge-return': (navigate) => (
    <BillingScreen view="cardChallengeReturn" onNavigate={navigate} />
  ),
  keys: (navigate) => <ApiKeysScreen onNavigate={navigate} />,
  'key-detail': (navigate) => <ApiKeysScreen page="detail" onNavigate={navigate} />,
  'key-limits': (navigate) => <ApiKeysScreen page="limits" onNavigate={navigate} />,
  'key-models': (navigate) => <ApiKeysScreen page="models" onNavigate={navigate} />,
  'key-guardrails': (navigate) => <ApiKeysScreen page="guardrails" onNavigate={navigate} />,
}

const AiGatewayApp = () => {
  const [current, setCurrent] = useState<AiGatewayScreen>('usage')
  // 画面が無い行き先は今の画面のまま
  const navigate = (to: string) => {
    if (to in screens) setCurrent(to as AiGatewayScreen)
  }
  // 行き先が変わったら画面の中の状態（開いているダイアログなど）を初めからにする
  return <div key={current}>{screens[current](navigate)}</div>
}

/**
 * サイドナビ・パンくず・一覧の行・ボタンを押して、実物と同じ順で画面をたどれる。
 *
 * @summary AI ゲートウェイのアプリ
 */
export const Default: Story = {
  render: () => <AiGatewayApp />,
}
