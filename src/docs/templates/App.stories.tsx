import { useState } from 'react'
import { composeStories } from '@storybook/react-vite'

import * as Account from './Account.stories'
import * as ApiKeys from './ApiKeys.stories'
import { AppNavigationContext } from './AppShell'
import * as Backup from './Backup.stories'
import * as Billing from './Billing.stories'
import * as Deploys from './Deploys.stories'
import * as DeveloperSettings from './DeveloperSettings.stories'
import * as Domains from './Domains.stories'
import * as FileManager from './FileManager.stories'
import * as GameSettings from './GameSettings.stories'
import * as Home from './Home.stories'
import * as Mods from './Mods.stories'
import * as Overview from './Overview.stories'
import * as SiteSettings from './SiteSettings.stories'
import * as Usage from './Usage.stories'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentType } from 'react'
import type { AppDestination } from './AppShell'

const meta = {
  title: 'Templates/App',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!manifest'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// 各画面の Default ストーリーを、移動先ごとに並べる
const screens: Record<AppDestination, ComponentType> = {
  home: composeStories(Home).Default,
  overview: composeStories(Overview).Default,
  game: composeStories(GameSettings).Default,
  mods: composeStories(Mods).Default,
  files: composeStories(FileManager).Default,
  backup: composeStories(Backup).Default,
  deploys: composeStories(Deploys).Default,
  domains: composeStories(Domains).Default,
  site: composeStories(SiteSettings).Default,
  apikeys: composeStories(ApiKeys).Default,
  usage: composeStories(Usage).Default,
  billing: composeStories(Billing).Default,
  account: composeStories(Account).Default,
  developer: composeStories(DeveloperSettings).Default,
}

const App = () => {
  const [current, setCurrent] = useState<AppDestination>('home')
  const Screen = screens[current]
  const navigate = (to: AppDestination) => {
    setCurrent(to)
    window.scrollTo(0, 0)
  }
  return (
    <AppNavigationContext.Provider value={navigate}>
      <Screen key={current} />
    </AppNavigationContext.Provider>
  )
}

/**
 * 管理画面を 1 つのアプリとして動かす。サイドナビと、ユーザーメニューの「アカウント設定」「デベロッパー設定」で画面が切り替わる。
 * 各画面の中身は、それぞれのテンプレートの Default ストーリーと同じ。
 *
 * @summary 画面を切り替えて動かせる管理画面
 */
export const Default: Story = {
  render: () => <App />,
}
