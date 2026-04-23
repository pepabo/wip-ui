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
  /** 適用するデザイントークンのフレーバー */
  flavor: Flavor
  /** フレーバーを適用する対象の React 要素 */
  children?: ReactNode
}

/**
 * 配下の wip-ui コンポーネントに適用するフレーバー（デザイントークンのテーマ）を切り替えるための Provider。
 * 単一フレーバーを root で固定する用途のほか、ネストして領域ごとに異なるフレーバーを適用することもできる。
 * 利用前に対応する `wip-ui/css/{flavor}.css` の import が必要。
 *
 * @summary フレーバー（デザイントークンのテーマ）を切り替えるProvider
 */
export const FlavorProvider: FC<Props> = ({ flavor, children }) => (
  <div data-flavor={flavor} style={{ display: 'contents' }}>
    {children}
  </div>
)

export type { Props as FlavorProviderProps }
