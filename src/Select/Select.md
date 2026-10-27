---
summary: 定義済みの選択肢から 1 つを選ばせるドロップダウン
category: Forms
---

# Select

ドロップダウンで、定義済みの選択肢から 1 つを選ばせるフォームコンポーネントです。選択肢は SelectItem で渡します。
素の `<select>` の代わりに使います。
選択肢が 4 個以下の場合は RadioGroup + Radio、自由入力が必要な場合は TextField、複数選択には Checkbox、表示の切り替えには Tabs を使ってください。

## 基本の使い方

```tsx
import { Select, SelectItem } from 'wip-ui'

<Select label="都道府県" name="prefecture" placeholder="選択してください">
  <SelectItem id="hokkaido">北海道</SelectItem>
  <SelectItem id="aomori">青森県</SelectItem>
  <SelectItem id="iwate">岩手県</SelectItem>
</Select>
```

## 構成要素

| 部品 | 役割 |
|---|---|
| Select | ラベル・補足説明・ドロップダウンを含む本体 |
| SelectItem | 個々の選択肢 |

## 使う場面

- 5 個以上の選択肢から 1 つを選ばせるとき（例：都道府県、国名）
- テーブル内など、スペースが限られる場所で 1 つを選ばせるとき

## 使い方

### 選択肢

- [should] 選択肢が 4 個以下の場合は、Select ではなく RadioGroup + Radio を使う。ただし、テーブル内など並べるスペースがない場合は Select を使ってよい
- [should] 選択肢の並び順は、利用頻度よりも予測しやすさを優先する（例：都道府県は北から南の順）
- [avoid] 複数選択に使わない。複数選択には Checkbox を並べる
- [avoid] 表示の切り替えやナビゲーションに使わない。表示の切り替えには Tabs を使う
- 選択肢の絞り込み（検索）には対応していない

### 初期値と未選択状態

- [should] 既存の値がある場合は、その値を初期値にする
- [should] 既存の値がない場合は、初期値を設定せず placeholder を表示する

### ラベルと補足説明

- [should] label で何を選ぶのかを示す
- [should] 選択基準や注意事項を伝えたい場合は caption を使う

### サイズと幅

- [should] テーブル内など、スペースが限られる場面では size="s" を使う
- [should] size="l" の入力要素やボタンと並べる場合は、size="l" にそろえる
- [should] 他の入力要素と幅をそろえたい場合は width を指定する（例：full）

### 状態

- [should] エラーは、何をどう直せばよいかが分かる文言で示す
- [should] 権限不足や他の選択に依存して変更できない場合は isDisabled を指定する

## アクセシビリティ

- [must] label を省略する場合は aria-label を付与する

## 実装

- [must] 各 SelectItem に一意の id を指定する。選択値（selectedKey、defaultSelectedKey）は id で扱う
- [should] 初期値は defaultSelectedKey（制御する場合は selectedKey と onSelectionChange）で指定する
- [should] エラーの文言は validate で返す。返した文言が Select の下に表示される
- [should] フォームで送信する場合は name を指定する
