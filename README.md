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

アプリのルートで `FlavorProvider` を配置し、全フレーバー同梱の CSS を読み込みます。`flavor` prop は省略時 `pepper` が適用されます。

```tsx
import { FlavorProvider, Button } from 'wip-ui'
import 'wip-ui/css/all.css'

export const App = () => (
  <FlavorProvider>
    <Button>クリック</Button>
  </FlavorProvider>
)
```

別のフレーバーに切り替える場合は `flavor` prop を指定します。ネストして領域ごとに異なるフレーバーを適用することもできます。

```tsx
<FlavorProvider flavor="minne">
  <Button>クリック</Button>
</FlavorProvider>
```

コンポーネント単位でのインポートも可能です。

```tsx
import { Button } from 'wip-ui/Button'
```

### 利用可能なフレーバー

`wip-ui/css/all.css` は以下の全フレーバーを含みます。

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
