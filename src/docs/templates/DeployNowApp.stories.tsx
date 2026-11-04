import { useState } from 'react'
import { composeStories } from '@storybook/react-vite'

import * as DeployNowAuth from './DeployNowAuth.stories'
import * as Deploys from './Deploys.stories'
import * as DeveloperSettings from './DeveloperSettings.stories'
import * as Domains from './Domains.stories'
import { DeployNowNavigationContext } from './deployNowShell'
import * as NewProject from './NewProject.stories'
import * as Projects from './Projects.stories'
import * as SiteSettings from './SiteSettings.stories'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentType } from 'react'
import type { DeployNowDestination } from './deployNowShell'

const meta = {
  title: 'Templates/DeployNow/App',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const auth = composeStories(DeployNowAuth)
const deploys = composeStories(Deploys)
const developerSettings = composeStories(DeveloperSettings)
const domains = composeStories(Domains)
const newProject = composeStories(NewProject)
const projects = composeStories(Projects)
const siteSettings = composeStories(SiteSettings)

// 行き先ごとの画面（各テンプレートのストーリー）。行き先の名前は deployNowShell.tsx の冒頭のコメントにある
const screens: Partial<Record<DeployNowDestination, ComponentType>> = {
  projects: projects.Default,
  'project-deploys': deploys.Default,
  'project-env': siteSettings.EnvVars,
  'project-domains': domains.Default,
  'project-settings': siteSettings.Default,
  'deploy-detail': deploys.DeployDetailSucceeded,
  'new-project': newProject.UploadProject,
  'new-project-github': newProject.GitHubImport,
  'project-deployment-new': newProject.ProjectDeployment,
  'developer-github': developerSettings.Default,
  'developer-sessions': developerSettings.Sessions,
  start: newProject.Trial,
  login: auth.DeployNowLogin,
  signup: auth.DeployNowSignup,
}

// 最初の画面はプロジェクト一覧。実物の入り口 /（app/(dashboard)/page.tsx）は /projects へ redirect する
const INITIAL: DeployNowDestination = 'projects'

const App = () => {
  const [current, setCurrent] = useState<DeployNowDestination>(INITIAL)
  const Screen = screens[current]
  const navigate = (to: DeployNowDestination) => {
    // ログアウトするとログインの画面へ戻る
    const next = to === 'logout' ? 'login' : to
    // テンプレートに画面が無い行き先（アカウント設定・ドキュメント・GitHub の画面など）は、今の画面のまま
    if (!screens[next]) return
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
