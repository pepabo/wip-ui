import type { FC, ReactNode } from 'react'

export type Flavor =
  | 'pepper'
  | 'minne'
  | 'apollo'
  | 'nachiguro'
  | 'flippers'
  | 'kung-pu'
  | 'lolipop'

export interface Props {
  /** 適用するデザイントークンのフレーバー。省略時は `pepper`。 */
  flavor?: Flavor
  /** フレーバーを適用する対象の React 要素 */
  children?: ReactNode
}

/**
 * 配下の wip-ui コンポーネントに適用するフレーバー（デザイントークンのテーマ）を切り替えるための Provider。
 * `wip-ui/css/all.css` をインポートするだけで pepper がデフォルト適用されるため、
 * この Provider はフレーバーを切り替えたい場合（別フレーバーの明示指定・領域別ネスト等）にのみ使用する。
 * 利用前に `wip-ui/css/all.css`（全フレーバー同梱）または `wip-ui/css/{flavor}.css`（単一フレーバー）の import が必要。
 *
 * @summary フレーバー（デザイントークンのテーマ）を切り替えるProvider
 */
export const FlavorProvider: FC<Props> = ({ flavor = 'pepper', children }) => (
  <div data-flavor={flavor} style={{ display: 'contents' }}>
    {children}
  </div>
)

export type { Props as FlavorProviderProps }
