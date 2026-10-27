---
summary: 構造化されたデータを行と列で一覧表示する
category: Data Display
---

# Table

商品やユーザーなど、同じ種類のオブジェクトの集まりを行と列で一覧表示するコンポーネントです。素の `<table>` の代わりに使います。行の選択やソートにも対応しています。

## 基本の使い方

```tsx
import { Cell, Column, Row, Table, TableBody, TableHeader } from 'wip-ui'

<Table aria-label="ファイル一覧">
  <TableHeader>
    <Column isRowHeader>名前</Column>
    <Column>種類</Column>
  </TableHeader>
  <TableBody>
    <Row>
      <Cell>Document.pdf</Cell>
      <Cell>PDF</Cell>
    </Row>
  </TableBody>
</Table>
```

## 構成要素

| 部品 | 役割 |
|---|---|
| Table | テーブル全体 |
| TableHeader | 見出し行。Column を並べる |
| Column | 列の見出し |
| TableBody | データ行のまとまり。Row を並べる |
| Row | 1 行分のデータ。Cell を並べる |
| Cell | 1 つのセル |
| ResizableTableContainer | 列幅をユーザーが変えられるようにするときに Table を囲む |
| ColumnResizer | 列幅を変えるためのハンドル。Column の中に置く |
| TableLoadMoreItem | 続きのデータを読み込むための行。TableBody の末尾に置く |

## 使う場面

- ファイル一覧やユーザー一覧など、項目ごとに同じ属性を持つデータを並べて比較させたいとき
- 一括削除や一括更新など、複数の行を選んでまとめて操作させたいとき

## 使い方

### データ

- [avoid] 商品とユーザーなど、異なる種類のオブジェクトを 1 つの Table に混在させない

### 選択

- [should] 複数の行をまとめて操作させるときは、複数の行を選べるようにする
- [should] 行を選べるようにするときは、各行の先頭にチェックボックスを置く。見出し行の先頭には、すべての行を選ぶチェックボックスを置く

### レイアウト

- [should] 画面幅が広い場合は、Container などで Table の外側の最大幅を制限する。Table を極端に横に広げると読みにくくなる

## アクセシビリティ

- [must] Table に aria-label を指定し、何の一覧かを伝える
- [should] 行を識別する列（名前や ID など）の Column に isRowHeader を指定する

## 実装

- [should] 複数の行を選べるようにするときは、Table に selectionMode="multiple" を指定する
- [should] 選択用のチェックボックスは、wip-ui の Checkbox に slot="selection" を指定して、各行の先頭の Cell と、見出しの先頭の Column に置く。ラベルは自動で付くため、children は空にする（例：`<Checkbox slot="selection">{null}</Checkbox>`）
