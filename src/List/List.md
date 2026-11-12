---
summary: 設定の入口や連携したアカウントなど、同じ種類のものを行で並べる一覧
category: Data Display
---

# List

同じ種類のものを縦に並べ、1行を横に読む一覧です。行には先頭のアイコン、ラベル、補足の文、右端の値や操作を置けます。List の中に ListItem を置いて使います。
列見出しを付けて項目を縦に比べるときは Table、「…」から出る操作の一覧は Menu、ページの移動は SideNavigation、箇条書きは素の `<ul>` と Typography を使ってください。

## 基本の使い方

```tsx
import { Icon, List, ListItem, Paper } from 'wip-ui'

<Paper outlined style={{ overflow: 'hidden' }}>
  <List>
    <ListItem href="/settings/profile" trailing={<Icon name="chevron_right" size="s" aria-hidden="true" />}>
      プロフィール
    </ListItem>
    <ListItem href="/settings/notifications" trailing={<Icon name="chevron_right" size="s" aria-hidden="true" />}>
      通知
    </ListItem>
  </List>
</Paper>
```

## 構成要素

| 部品 | 役割 |
|---|---|
| List | 一覧全体。行の間の区切り線を持つ |
| ListItem | 1行。押せない行、リンクの行、ボタンの行になる |

## 使う場面

- 設定などの詳細の画面へ進む入口を並べるとき
- 数が少なく、行ごとに操作が違うものを並べるとき（例：連携したアカウント）
- 名前と補足があり、右端に状態や操作が付くものを並べるとき

## 使い方

### Table との使い分け

- [should] 行を横に読むなら List、列を縦に比べるなら Table にする。列見出しが要る、行ごとの項目を縦にそろえて見比べる、並べ替えや選択が要る場合は Table
- [should] 行ごとに中身の形が違う場合（操作が違う、補足の有無が違う）は List にする。Table は、すべての行が同じ列を持つことが前提

### 行の中身

- [should] ラベルは、その行が何の「もの」かが分かる名前にする
- [should] 補足には、ラベルを補う短い情報を1行で書く
- [should] 先頭にアイコンや Avatar を付ける場合は、すべての行に付け、種類と大きさをそろえる。付ける行と付けない行を混ぜたり、Icon の行と Avatar の行を混ぜたりすると、ラベルの開始位置がずれる
- [should] 右端に何かを置く場合は、状態、属性、短い値、操作のボタンのように、1つにまとまるものにする。複数の項目を並べる必要があるなら、Table にする
- [avoid] 同じ List に、違う種類のものを混ぜない

### 押せる行

- [should] 行を押すと別の画面に移るなら href、その場で何かが起きる（ダイアログが開く、選ばれる）なら onPress にする
- [should] 詳細の画面へ進む行は、右端に Icon name="chevron_right" を aria-hidden="true" で置き、押せることが分かるようにする。aria-hidden を付けないと、アイコンの名前が行の名前に混ざって読まれる
- [must] 押せる行の右端に、ボタンやリンクなどの押せる要素を置かない。行全体がリンクやボタンになるため、押せるものの中に押せるものが入る。操作のボタンが要る行は、押せない行にして、ボタンだけを押せるようにする
- [avoid] 押せる行と押せない行を、同じ List に混ぜない

### 区切り線

- 区切り線は初期で付く
- [should] 区切り線を消すのは、先頭の要素や行の余白だけで行の区切りが分かる場合に限る

### 面との関係

- List 自体は面を持たない。Paper などの面の中に入れて使う。行の左右の余白は行が持つため、面の余白は 0 にする
- [should] 見出しや説明文を付ける場合は、Paper の中で List の上に置く。List の中には置かない

## アクセシビリティ

- [must] 押せる行の名前は、ラベル・補足・右端の文字をつなげたものとして読まれる。ラベルだけで何の行かが分かるようにし、右端には読み上げに混ざっても意味が通る短いもの（状態、日時など）だけを置く
- [must] onPress の行で、ラベルから操作が分からない場合は、aria-label で行の名前を付ける

## 実装

- List は `<ul role="list">`、ListItem は `<li>` として描画される。押せる行は、`<li>` の中に `<a>` か `<button>` が入る
- [should] Paper の中に入れるときは、Paper に `overflow: hidden` を指定する。押せる行の hover の塗りが、Paper の角からはみ出るため
- [should] Next.js などのルーターでページを移動する場合は、react-aria-components の RouterProvider でアプリを囲む
