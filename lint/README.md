# wip-ui lint

wip-ui のコンポーネントで置き換えられる素の HTML 要素を検出する lint です。[Biome](https://biomejs.dev/)（2 以上）と [ESLint](https://eslint.org/)（9 以上、flat config）のどちらからでも使えます。判定とメッセージはどちらも同じです。

## 検出する要素

<!-- rules:start -->
| 素の要素 | 使うコンポーネント |
|---|---|
| `<button>` | Button（ページ遷移なら LinkButton） |
| `<select>` | Select |
| `<textarea>` | TextField（`component="textarea"`） |
| `<input type="checkbox">` | Checkbox（即時に反映する設定なら Switch） |
| `<input type="radio">` | RadioGroup + Radio |
| テキスト入力の `<input>`（type 指定なし、text、email、password、search、tel、url、number） | TextField |
| `<table>` | Table |
| `<hr>` | Divider |
| `<dialog>` | Dialog |
<!-- rules:end -->

置き換え先が1対1で決まっている要素だけを対象にしています。エラーメッセージには、使うコンポーネントと、その使い方の md（wip-ui パッケージ内のパス）が書かれています。

## 使い方

### Biome

利用側の `biome.json` の `plugins` に追加します。

```json
{
  "plugins": ["./node_modules/wip-ui/lint/biome/no-raw-element.grit"]
}
```

### ESLint

利用側の `eslint.config.js` に追加します。ルール名は `wip-ui/no-raw-element` です。

```js
import wipUi from 'wip-ui/lint/eslint'

export default [
  // ...
  wipUi.configs.recommended,
]
```

対象のファイルを絞る場合や、重さを変える場合は、プラグインを直接指定します。

```js
import wipUi from 'wip-ui/lint/eslint'

export default [
  {
    files: ['src/**/*.{jsx,tsx}'],
    plugins: { 'wip-ui': wipUi },
    rules: { 'wip-ui/no-raw-element': 'error' },
  },
]
```

JSX を読めるパーサー（TypeScript なら typescript-eslint など）の設定は、利用側で行ってください。

## 例外として素の要素を使う場合

wip-ui に該当するコンポーネントがない場合は、独自実装せずに Slack の #hos-wip-ui に連絡してください。
やむを得ず素の要素を使う場合は、理由を書いて抑制します。

```tsx
// Biome
{/* biome-ignore lint/plugin: wip-ui に該当なし（#hos-wip-ui に連絡済み） */}
<button type="button">…</button>

// ESLint（-- のあとに理由を書く。要素の直前の行に置く）
{/* eslint-disable-next-line wip-ui/no-raw-element -- wip-ui に該当なし（#hos-wip-ui に連絡済み） */}
<button type="button">…</button>
```

## 判定を変える場合（wip-ui の開発者向け）

判定とメッセージの元データは `lint/rules.json` の1か所です。直接 `lint/biome/no-raw-element.grit` や上の表を編集せず、`lint/rules.json` を直してから `npm run build:lint` で生成してください。ESLint 版（`lint/eslint/index.js`）は `lint/rules.json` を実行時に読み込みます。

`npm test` で、Biome 版と ESLint 版が同じ判定をすることを確かめます。生成し忘れは、CI がビルド後の差分で検知します。

テストの例は、書く人によって網羅がばらつかないように、`lint/rules.json` から自動で作ります。規則を足すときに、テストを書き足す必要は基本的にありません。

- 規則ごとの例：クォートの違い、式、自己終了かどうか、同じ名前の部品など、決まった観点の例を規則ごとに作り、期待する判定と照らします
- 総当たり：要素・属性・書き方のすべての組み合わせで、Biome 版と ESLint 版の判定が一致することを確かめます（期待値は書きません）
- 手書きの例：入れ子や複数行など、上の2つで作れない形だけを `HANDWRITTEN_CASES` に書きます

`lint/rules.json` に新しい種類の条件を足すと、`lint/rules.js` の検査でエラーになります。Biome 版の生成（`scripts/build-lint.mjs`）、ESLint 版（`lint/eslint/index.js`）、テストの例の生成（`lint/__tests__/`）の3か所を対応させてから、`lint/rules.js` の項目に加えてください。
