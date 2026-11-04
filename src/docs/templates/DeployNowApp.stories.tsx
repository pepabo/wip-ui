import { useState } from 'react'
import { composeStories } from '@storybook/react-vite'

import * as DeployNowAuth from './DeployNowAuth.stories'
import * as Deploys from './Deploys.stories'
import * as DeveloperSettings from './DeveloperSettings.stories'
import * as Domains from './Domains.stories'
import {
  DeployNowNavigationContext,
  deployNowStoryRoutes,
  resolveDeployNowDestination,
} from './deployNowShell'
import * as NewProject from './NewProject.stories'
import * as Projects from './Projects.stories'
import * as SiteSettings from './SiteSettings.stories'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentType } from 'react'
import type { DeployNowDestination } from './deployNowShell'

const meta = {
  title: 'Templates/DeployNow/App',
  // テンプレートはロリポップのトンマナを確かめる場所なので、フレーバーを lolipop に固定する
  globals: { flavor: 'lolipop' },
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// 行き先 → ストーリーの表は deployNowShell.tsx の deployNowStoryRoutes（画面ごとのストーリーの linkTo と共有）。
// ここでは表の title から、そのストーリーファイルを引く
const storyFiles: Record<string, Record<string, ComponentType>> = Object.fromEntries(
  [DeployNowAuth, Deploys, DeveloperSettings, Domains, NewProject, Projects, SiteSettings].map(
    (file) => [file.default.title, composeStories(file) as Record<string, ComponentType>]
  )
)

const screenOf = (to: DeployNowDestination): ComponentType | undefined => {
  const route = deployNowStoryRoutes[to]
  return route && storyFiles[route.title]?.[route.story]
}

// 最初の画面はプロジェクト一覧。実物の入り口 /（app/(dashboard)/page.tsx）は /projects へ redirect する
const INITIAL: DeployNowDestination = 'projects'

const App = () => {
  const [current, setCurrent] = useState<DeployNowDestination>(INITIAL)
  const Screen = screenOf(current)
  const navigate = (to: DeployNowDestination) => {
    // ログアウトするとログインの画面へ戻る
    const next = resolveDeployNowDestination(to)
    // テンプレートに画面が無い行き先（アカウント設定・ドキュメント・GitHub の画面など）は、今の画面のまま
    if (!screenOf(next)) return
    setCurrent(next)
    window.scrollTo(0, 0)
  }
  return (
    <DeployNowNavigationContext.Provider value={navigate}>
      {Screen && <Screen key={current} />}
    </DeployNowNavigationContext.Provider>
  )
}

/**
 * デプロイナウを 1 つのアプリとして動かす。ヘッダーのロゴとアカウントメニュー、プロジェクト詳細のタブ、
 * 一覧の行、ボタン、パンくずで、実物と同じ順に画面をたどれる。最初の画面はプロジェクト一覧。
 * 各画面の中身は、それぞれのテンプレートのストーリーと同じ。
 *
 * @summary 画面をたどって動かせるデプロイナウ
 */
export const Default: Story = {
  render: () => <App />,
}
