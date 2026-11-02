---
summary: モーダルダイアログ
category: Feedback
---

# Dialog

確認メッセージやフォーム入力など、ユーザーの注意を集中させる操作に使うモーダルダイアログです。
素の `<dialog>` や自作のモーダルの代わりに使います。
操作の結果を一時的に伝えるだけなら SnackBar、ページ内に表示し続ける情報なら Callout を使ってください。

## 基本の使い方

```tsx
import { Button, Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from 'wip-ui'

<Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
  <DialogHeader>
    <DialogTitle>このファイルを削除しますか？</DialogTitle>
  </DialogHeader>
  <DialogDescription>削除したファイルは元に戻せません。</DialogDescription>
  <DialogFooter>
    <Button appearance="outlined" onPress={() => setIsOpen(false)}>キャンセル</Button>
    <Button color="negative" onPress={handleDelete}>削除</Button>
  </DialogFooter>
</Dialog>
```

## 構成要素

| 部品 | 役割 |
|---|---|
| Dialog | ダイアログ全体 |
| DialogHeader | ヘッダー領域。DialogTitle を入れる |
| DialogTitle | ダイアログのタイトル |
| DialogDescription | 本文の説明テキスト |
| DialogFooter | フッター領域。アクションのボタンを入れる |

## 使う場面

- ユーザーに情報を提示し、確認後に閉じてもらうとき
- 削除や退会など、取り消せない操作の前に確認を求めるとき
- フォーム入力など、ほかの操作から切り離して集中してもらうとき

## 使い方

### 使わない場面

- [avoid] お気に入りの解除など、よく行う操作や、取り消せる操作の確認には使わない。手間が増えるだけで、確認の意味がないため
- [avoid] ページ1つ分の内容や、複数の手順が必要な作業を入れない。新しい画面にする

### ボタン

- [should] 確認を求めるときは、DialogFooter にキャンセルと実行の2つのボタンを置く。キャンセルを左、実行を右に置く
- [should] 情報を提示するだけのときは、DialogFooter に「閉じる」のボタンを1つだけ置く
- [should] キャンセルのボタンは、実行のボタンより目立たない外観にする（外観の目立つ順番は Button.md を参照）
- [should] 削除などの破壊的な操作を実行するボタンには color="negative" を使う

### 閉じ方

- [should] 確認を求めるダイアログと、入力途中のフォームがあるダイアログは、背景のクリックで閉じないようにする。うっかり閉じると、キャンセルしたのと同じになるため
- [should] Escape キーでは閉じられるようにする

## 文言

- [should] タイトルは、確認する操作が分かる簡潔な問いかけにする（例：「このファイルを削除しますか？」）
- [should] 本文には、操作の対象と、影響する範囲を書く
- [should] ボタンのラベルは、実行される操作を表す言葉にする。「はい」「いいえ」にしない

## アクセシビリティ

- [must] DialogTitle を置く。ダイアログの名前として読み上げに使われる
- [should] 削除など取り消せない操作の確認では、ダイアログを開いたときに、キャンセルのボタンにフォーカスを当てる
- [should] 削除など取り消せない操作の確認には、role="alertdialog" を指定する

## 実装

- 開閉の状態は、利用側で isOpen と onOpenChange で管理する
- [should] 背景のクリックで閉じないようにする場合は、isDismissable={false} を指定する。既定では、背景のクリックで閉じる
- [should] 開いたときにフォーカスを当てるボタンには、autoFocus を指定する

```tsx
// 取り消せない操作の確認
<Button onPress={() => setIsOpen(true)}>削除…</Button>
<Dialog isOpen={isOpen} onOpenChange={setIsOpen} isDismissable={false} role="alertdialog">
  <DialogHeader>
    <DialogTitle>このファイルを削除しますか？</DialogTitle>
  </DialogHeader>
  <DialogDescription>削除したファイルは元に戻せません。</DialogDescription>
  <DialogFooter>
    <Button appearance="outlined" onPress={() => setIsOpen(false)} autoFocus>キャンセル</Button>
    <Button color="negative" onPress={handleDelete}>削除</Button>
  </DialogFooter>
</Dialog>
```
