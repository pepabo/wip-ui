# wip-ui

ペパボのデザインシステム UI コンポーネントライブラリ。React + TypeScript + SCSS で構築。

📘 **[Storybook](https://pepabo.github.io/wip-ui/)**

## インストール

```bash
npm install wip-ui
```

### Peer dependencies

本パッケージは以下の peer dependencies を必要とします。利用側でインストールしてください。

```bash
npm install react react-dom react-aria-components
```

- `react` >= 18.2.0
- `react-dom` >= 18.2.0
- `react-aria-components` ^1.12.2

## 使い方

CSS をインポートするだけで、デフォルトの `pepper` フレーバーでコンポーネントが描画されます。

```tsx
import { Button } from 'wip-ui'
import 'wip-ui/styles.css'

export const App = () => <Button>クリック</Button>
```

別のフレーバーを適用したい場合、あるいは領域ごとに異なるフレーバーを切り替えたい場合は `FlavorProvider` で対象領域を囲みます。

```tsx
import { FlavorProvider, Button } from 'wip-ui'
import 'wip-ui/styles.css'

export const App = () => (
  <FlavorProvider flavor="minne">
    <Button>クリック</Button>
  </FlavorProvider>
)
```

コンポーネント単位でのインポートも可能です。

```tsx
import { Button } from 'wip-ui/Button'
```

> **中の `FlavorProvider` で切り替える場合の注意**: フレーバーを入れ子にしたとき、CSS の詳細度が同じためソース順序が後ろ（`pepper` < `minne` < `apollo` < `nachiguro` < `flippers` < `kung-pu` < `lolipop` の順）のフレーバーが勝ちます。「外側 `lolipop` + 内側 `pepper`」のような組み合わせでは、内側が外側を上書きできない点にご注意ください。

### 利用可能なフレーバー

`wip-ui/styles.css` は以下の全フレーバーを含みます。

- `pepper`（デフォルト）
- `minne`
- `apollo`
- `nachiguro`
- `flippers`
- `kung-pu`
- `lolipop`

> **バンドルサイズを最適化したい場合**: 単一フレーバーのみ利用する場合は、`all.css` の代わりに `wip-ui/css/{flavor}.css` を読み込むこともできます。その場合は `FlavorProvider` の `flavor` と必ず一致させてください。

## Contributing

リポジトリのセットアップ方法・開発コマンドは [`CONTRIBUTING.md`](./CONTRIBUTING.md) を参照してください。

## License

[MIT](./LICENSE)
