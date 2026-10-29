---
summary: ボタンから開く、操作の一覧のメニュー
category: Actions
---

# Menu

ボタンを押すと開き、同じ対象に関係する複数の操作を一覧で選ばせるメニューです。MenuTrigger の中に、開くボタンと Menu を置いて使います。
自作のドロップダウンメニューや、「…」ボタンのポップアップの代わりに使います。値を1つ選ばせるフォームの入力には Select、画面の表示の切り替えには Tabs を使ってください。

## 基本の使い方

```tsx
import { Button, Menu, MenuItem, MenuTrigger } from 'wip-ui'

<MenuTrigger>
  <Button appearance="outlined">ファイルの操作</Button>
  <Menu>
    <MenuItem onAction={handleEdit}>編集</MenuItem>
    <MenuItem onAction={handleDuplicate}>複製</MenuItem>
    <MenuItem color="negative" onAction={handleDelete}>削除</MenuItem>
  </Menu>
</MenuTrigger>
```

## 構成要素

| 部品 | 役割 |
|---|---|
| MenuTrigger | 開くボタンとメニューをまとめ、開閉を管理する |
| Menu | 開いたときに表示される、操作の一覧 |
| MenuItem | 1つの操作 |
| MenuSection | 見出しを付けた、操作のまとまり |
| MenuDivider | 見出しを付けずに、操作のまとまりを区切る線 |

## 使う場面

- テーブルの行やカードなど、1つの対象に対する複数の操作をまとめたいとき（例：編集・複製・削除）
- アカウントのメニューなど、画面に常に並べるほどではない操作をまとめたいとき

## 使い方

### 開くボタン

- [should] 「…」のアイコンだけのボタンは、表の行の中など、狭い場所に限る

### 項目

- [should] 項目は、ひと目で把握できる数にする
- [should] よく使う順に並べる（例：編集 → 複製 → 削除）
- [must] 削除などの破壊的な操作は、一覧の最後に置き、color="negative" にする
- [should] 操作の種類が分かれる場合は、MenuSection で見出しを付けるか、MenuDivider で区切る
- [should] アイコンを付ける場合は、すべての項目に付ける。付ける項目と付けない項目を混ぜない
- [avoid] テキストの入力など、フォームの部品をメニューの中に置かない。絞り込みが必要な選択には Select やダイアログを使う
- [avoid] 選んだ状態を残す選択には使わない。値を選ばせる場合は Select・Radio・Checkbox を使う

### 表示する位置

- [should] メニューは、開くボタンが置かれている側にそろえ、画面や領域の内側に向かって開くようにする
- [avoid] 開いたメニューで、開くボタンや、操作に必要なほかの内容（隣のボタン、入力欄など）を隠さない。隠れる場合は、反対の向きに開く
- 画面の端で収まらない場合は、上下の反転と位置の調整が自動で行われる

### 状態

- [should] 権限などで今は実行できない操作は、項目を消さずに isDisabled にする
- [should] isDisabled にした項目には、description で押せない理由を書く（例：「オーナーのみ実行できます」）

## 文言

- [should] 項目のラベルは、Button と同じく、実行される操作を表す言葉にする（Button.md を参照）

## アクセシビリティ

- [must] アイコンだけの開くボタンには、aria-label でボタンの名前を付ける
- [must] 項目の中身が文字だけでない場合は、textValue で読み上げとキーボード検索に使う文字を指定する

## 実装

- [should] 開くボタンは、wip-ui の Button を MenuTrigger の最初の子に置く。押したときの開閉は、MenuTrigger が自動で行う
- [should] 項目を選んだときの処理は、MenuItem の onAction か、Menu の onAction（項目の id を受け取る）に書く
- [should] ページ遷移する項目は、MenuItem に href を指定する
- [should] 表示する位置は placement で指定する。右側にある開くボタンは "bottom end"、下に開くとほかの内容を隠す場合は "top start" / "top end" にする

```tsx
// 表の行の中など、狭い場所のアイコンだけのボタン
<MenuTrigger>
  <Button iconOnly appearance="transparent" size="s" aria-label="ファイルの操作">
    <Icon name="ellipsis_vertical" aria-hidden="true" />
  </Button>
  <Menu placement="bottom end">
    <MenuItem>編集</MenuItem>
    <MenuItem color="negative">削除</MenuItem>
  </Menu>
</MenuTrigger>
```
