import clsx from 'clsx'

import type { ComponentPropsWithoutRef, ElementType } from 'react'
import './_index.scss'

export interface Props extends ComponentPropsWithoutRef<'div'> {
  /** レンダリングするHTML要素 */
  component?: ElementType
}

/**
 * フレーバーのページ地（背景色と既定の文字色）を適用する最上位のレイアウトコンポーネント。
 * 画面のルートに一度だけ配置する。
 *
 * ダークなフレーバー（Apollo など）では、地色を塗らないとコンポーネントだけが暗くなり
 * 背景が白のまま残る。地色はどのコンポーネントの責務でもないため、Page が担う。
 *
 * @summary フレーバーのページ地を適用する最上位レイアウト
 */
export const Page = ({ component, className, ...props }: Props) => {
  const Component = (component ?? 'div') as ElementType
  return <Component className={clsx('wip-page', className)} {...props} />
}

export type { Props as PageProps }
