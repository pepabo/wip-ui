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
 * 単一フレーバーを root で固定する用途のほか、ネストして領域ごとに異なるフレーバーを適用することもできる。
 * 利用前に `@pepabo/wip-ui/css/all.css`（全フレーバー同梱）または `@pepabo/wip-ui/css/{flavor}.css`（単一フレーバー）の import が必要。
 *
 * @summary フレーバー（デザイントークンのテーマ）を切り替えるProvider
 */
export const FlavorProvider: FC<Props> = ({ flavor = 'pepper', children }) => (
  <div data-flavor={flavor} style={{ display: 'contents' }}>
    {children}
  </div>
)

export type { Props as FlavorProviderProps }
