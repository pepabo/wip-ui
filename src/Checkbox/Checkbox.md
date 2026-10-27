---
summary: 送信して確定する ON/OFF や複数選択に使うチェックボックス
category: Forms
---

# Checkbox

ラベル付きのチェックボックスで、ある項目を ON にするかどうかや、複数の選択肢から任意の数を選ばせるときに使います。
素の `<input type="checkbox">` の代わりに使います。
即時に反映する設定には Switch、選択肢から 1 つだけを選ばせる場合は RadioGroup + Radio を使ってください。

## 基本の使い方

```tsx
import { Checkbox } from 'wip-ui'

<Checkbox>利用規約に同意する</Checkbox>
```

## 使う場面

- 「ある項目を ON にするか」を選ばせるとき
- 複数の選択肢から任意の数を選ばせるとき
- 「全選択」のチェックボックスで、子項目の一部だけが選択されていることを示すとき

## 使い方

### 状態

- [should] 権限不足や条件未達で変更できない場合は isDisabled を指定する

### 複数選択

- 複数のチェックボックスをまとめて、グループとして名前を付けるコンポーネント（CheckboxGroup）はない

### 親子関係（全選択）

- [should] 子項目の一部だけが選択されている場合は、親のチェックボックスに isIndeterminate を指定する
- [should] 親を ON にしたらすべての子を ON に、OFF にしたらすべての子を OFF にする
- [should] isIndeterminate の親を押したときは、すべての子を OFF にする

## アクセシビリティ

- [must] 見えるラベルを付けない場合は、aria-label でチェックボックスの名前を付ける

## 実装

- 親子の選択状態は自動では連動しない。onChange で受け取り、各チェックボックスの isSelected と isIndeterminate を制御する
