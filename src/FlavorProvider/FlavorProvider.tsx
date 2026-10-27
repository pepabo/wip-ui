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

export const FlavorProvider: FC<Props> = ({ flavor = 'pepper', children }) => (
  <div data-flavor={flavor} style={{ display: 'contents' }}>
    {children}
  </div>
)

export type { Props as FlavorProviderProps }
