---
summary: ページ遷移を伴うボタン風リンク
category: Actions
---

# LinkButton

ページ遷移を伴うボタン風のリンクコンポーネントです。
ボタンの見た目でページ遷移する素の `<a>` の代わりに使います。その場でアクションを実行するには Button を使ってください。
文章の中のテキストリンクには使えません（wip-ui にはテキストリンクのコンポーネントがありません）。

## 基本の使い方

```tsx
import { LinkButton } from 'wip-ui'

<LinkButton href="/orders">注文履歴</LinkButton>
```

## 使う場面

- 別のページへ遷移する（URL が変わる）

## 使い方

色・外観、サイズ・幅、アイコンの使い方は Button と同じです（Button.md を参照）。

### 新しいタブで開く
- [should] 新しいタブで開く場合は、trailing にアイコンを置いてそのことを示す

## 文言

文言の基本ルールは Button と同じです（Button.md を参照）。

- [should] 遷移先の内容を簡潔に表す名詞をラベルにする（例：「注文履歴」）

## アクセシビリティ

- [must] iconOnly のときは aria-label などでリンクの名前を付ける
