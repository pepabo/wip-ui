# wip-ui lint

wip-ui のコンポーネントで置き換えられる素の HTML 要素を検出する、[Biome](https://biomejs.dev/) のプラグインです（Biome 2 以上）。

## 検出する要素

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

置き換え先が1対1で決まっている要素だけを対象にしています。エラーメッセージには、使うコンポーネントと、その使い方の md（wip-ui パッケージ内のパス）が書かれています。

## 使い方

利用側の `biome.json` の `plugins` に追加します。

```json
{
  "plugins": ["./node_modules/wip-ui/lint/biome/no-raw-element.grit"]
}
```

## 例外として素の要素を使う場合

wip-ui に該当するコンポーネントがない場合は、独自実装せずに Slack の #hos-wip-ui に連絡してください。
やむを得ず素の要素を使う場合は、理由を書いて抑制します。

```tsx
{/* biome-ignore lint/plugin: wip-ui に該当なし（#hos-wip-ui に連絡済み） */}
<button type="button">…</button>
```
