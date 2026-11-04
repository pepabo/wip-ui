import { RouterProvider } from 'react-aria-components'
import { linkTo } from '@storybook/addon-links'
import { storyNameFromExport, toId } from 'storybook/internal/csf'

import type { ReactNode } from 'react'

/** 行き先の画面を描くストーリー。title はストーリーファイルの meta.title、story はストーリーの export 名 */
export type StoryRoute = { title: string; story: string }

/**
 * 行き先の画面のストーリーへ、Storybook の中で移る（@storybook/addon-links の linkTo）。
 * App ストーリーの外（画面ごとのストーリー）で、シェルの onNavigate の既定として使う。
 * route が無い（テンプレートに画面が無い）ときは何もしない。
 * ストーリーの ID は export 名から作られるので、表示名（name）を変えたストーリーでも同じ ID になる
 */
export const openStory = (route: StoryRoute | undefined) => {
  if (!route) return
  linkTo(toId(route.title, storyNameFromExport(route.story)))()
}

/**
 * テンプレートの中のリンク（react-aria-components の Link。LinkButton・SideNavigationItem・Breadcrumb）の、
 * ブラウザの既定の移動を止める。画面の移動は各要素の onPress（onNavigate）が受け持つ。
 * Storybook の iframe は <base target="_parent"> を持つので、止めないと href="#" を押したときに
 * マネージャーの画面ごと iframe の URL へ移ってしまう。別タブ（target="_blank"）のリンクは止まらない
 */
export const TemplateRouter = ({ children }: { children: ReactNode }) => (
  <RouterProvider navigate={() => {}}>{children}</RouterProvider>
)
