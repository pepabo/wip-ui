---
summary: セクションや要素のまとまりを線で区切る
category: Data Display
---

# Divider

セクションや要素のまとまりを線で区切るコンポーネントです。素の `<hr>` の代わりに使います。要素同士の間隔を空けたいだけの場合は Divider ではなく Stack の `gap` などを使います。

## 基本の使い方

```tsx
import { Divider } from 'wip-ui'

<Divider />
```

## 使う場面

- 縦に並んだセクション同士を明確に分けたいとき
- ツールバーやヘッダーなど、横に並んだ要素のグループを区切りたいとき
- リストやメニューで、項目の間を区切りたいとき

## 使い方

### 向き

- [should] 縦に並んだ要素の間は水平の線で、横に並んだ要素の間は垂直の線で区切る

### 線の範囲

- [should] セクション間をはっきり区切るときは、線を端から端まで引く（fullWidth）
- [should] リストやメニューで、先頭のアイコン領域を避けてテキスト部分だけを区切るときは inset を使う
- [should] 左右に余白を設けて控えめに区切るときは middle を使う

## アクセシビリティ

- [should] 垂直の線にするときは、aria-orientation="vertical" を指定する。指定しないと、読み上げでは水平の区切りとして扱われる

## 実装

- [should] 垂直の線は orientation="vertical" で指定する。Stack の flexDirection="row" などの中で使うときは flexItem を指定し、並んだ要素の高さに合わせて伸ばす
- [avoid] className や classes で線の色や太さを上書きしない
