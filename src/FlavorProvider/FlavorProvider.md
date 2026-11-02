---
summary: フレーバー（デザイントークンのテーマ）を切り替える Provider
---

# FlavorProvider

配下の wip-ui コンポーネントに適用するフレーバー（デザイントークンのテーマ）を指定する Provider です。
`wip-ui/styles.css` を読み込むと pepper が既定で適用されるため、別のフレーバーを使うときや、領域ごとにフレーバーを変えるときに使います。

## 基本の使い方

```tsx
import { FlavorProvider } from 'wip-ui'
import 'wip-ui/css/lolipop.css'

function App() {
  return <FlavorProvider flavor="lolipop">{/* アプリケーション全体 */}</FlavorProvider>
}
```

## サービスとフレーバー

| フレーバー | サービス |
|---|---|
| lolipop | ロリポップ！ |
| apollo | ゲーマーズ |

pepper / minne / nachiguro / flippers / kung-pu は、現状 wip-ui 上での利用実績がありません。

## 使う場面

- アプリ全体に、サービスのフレーバーを適用するとき
- 1つのページ内で、領域ごとに異なるフレーバーを適用するとき

## 使い方

- [should] サービスでは、上の表のそのサービスのフレーバーを使う

## 実装

- [must] アプリのエントリーポイントで、`wip-ui/styles.css`（全フレーバー同梱）または `wip-ui/css/{flavor}.css`（単一フレーバー）を import する
- [must] `wip-ui/css/{flavor}.css` を使う場合は、同じフレーバーを指定した FlavorProvider でアプリを囲む。単一フレーバーの CSS は、FlavorProvider の配下にしかスタイルが当たらない
- [should] アプリ全体にフレーバーを適用する場合は、アプリケーションのルートに置く
- 領域ごとにフレーバーを変える場合は、FlavorProvider をネストする。この場合は `wip-ui/styles.css` を import する
- FlavorProvider は `display: contents` の要素を出力するため、レイアウトには影響しない
