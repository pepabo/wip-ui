---
summary: 多くの選択肢から、検索しながら複数を選ばせるドロップダウン
category: Forms
---

# MultiSelect

定義済みの選択肢から複数を選ばせるフォームコンポーネントです。押すと選択肢の一覧が開き、検索で絞り込みながらチェックして選びます。選んだ項目は閉じた状態の欄に名前で表示されます。
素の `<select multiple>` の代わりに使います。
1 つだけを選ばせる場合は Select、選択肢が少なくすべてを見せたまま選ばせる場合は Checkbox、選択肢にない値を自由に入力して増やす場合は TextField を使ってください。

## 基本の使い方

```tsx
import { MultiSelect, MultiSelectItem } from 'wip-ui'

<MultiSelect label="利用するモデル" name="models" placeholder="選択してください">
  <MultiSelectItem id="model-a">Model A</MultiSelectItem>
  <MultiSelectItem id="model-b">Model B</MultiSelectItem>
  <MultiSelectItem id="model-c">Model C</MultiSelectItem>
</MultiSelect>
```

## 構成要素

| 部品 | 役割 |
|---|---|
| MultiSelect | ラベル・補足説明・選択欄・開いた一覧を含む本体。選択値を管理する |
| MultiSelectItem | 個々の選択肢 |
| MultiSelectSection | 選択肢のグループ。見出しを付けてまとめる |

## 使う場面

- 6 個以上の選択肢から複数を選ばせるとき（例：利用するモデル、通知を送る国）
- 選択肢が多く、検索で絞り込みながら選ばせたいとき

## 使い方

### 選択肢

- [should] 選択肢が 5 個以下の場合は、MultiSelect ではなく Checkbox を並べる。すべての選択肢が最初から見えるため
- [should] 選択肢の並び順は、利用頻度よりも予測しやすさを優先する
- [should] 選択肢に分類があり、分類を見ながら選ぶほうが分かりやすい場合は MultiSelectSection でグループにする
- [avoid] 選択肢にない値の入力には使わない。選択肢は定義済みのものに限る

### 一括選択

- [should] 多くの選択肢をまとめて選ぶことがある場合は allowsSelectAll を指定する。「すべて選択」は検索で表示中の選択肢だけを対象にするため、絞り込んでから一括で選べる
- [avoid] 一度にすべて選ぶことが想定されない、または選ぶと影響が大きい選択肢には allowsSelectAll を指定しない

### 初期値と未選択状態

- [should] 既存の値がある場合は、その値を初期値にする
- [should] 既存の値がない場合は、初期値を設定せず placeholder を表示する

### ラベルと補足説明

- [should] label で何を選ぶのかを示す
- [should] 選択基準や注意事項を伝えたい場合は caption を使う

### サイズと幅

- 幅は親要素いっぱいに広がり、選んだ数では変わらない。開いた部分も同じ幅になる
- [should] 隣に並ぶ Select や TextField と size をそろえる

### 状態

- [should] 権限不足や他の選択に依存して変更できない場合は isDisabled を指定する
- [should] 特定の選択肢だけを選べなくする場合は、その MultiSelectItem に isDisabled を指定する

## 文言

- [should] 選択肢のラベルは 1 行に収まる短さにする。閉じた状態では選んだ名前を「、」でつないで表示し、収まらない分は省略されるため
- [avoid] placeholder に選び方の説明を書かない。label と caption で伝える

## アクセシビリティ

- [must] label を省略する場合は aria-label を付与する
- 開くと検索欄にフォーカスが移り、矢印キーで選択肢を移動し、Space か Enter でチェックを切り替える。「すべて選択」には Tab で移動する。Escape で閉じる

## 実装

- [must] 各 MultiSelectItem に、MultiSelect の中で一意の id を指定する。選択値（selectedKeys、defaultSelectedKeys）は id の集合で扱う
- [must] MultiSelectItem の子が文字列でない場合は、textValue に検索と表示に使う文字列を指定する
- [should] 初期値は defaultSelectedKeys（制御する場合は selectedKeys と onSelectionChange）で指定する
- [should] フォームで送信する場合は name を指定する。選ばれた id ごとに同じ name の hidden input になる
