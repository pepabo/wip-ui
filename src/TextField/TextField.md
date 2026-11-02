---
summary: 1 行または複数行のテキストを自由入力させる入力欄
category: Forms
---

# TextField

ラベルと補足説明を備えた、テキストを自由入力させるための入力欄です。複数行の入力は component="textarea" で切り替えます。
素の `<input type="text">` や `<textarea>` の代わりに使います。
定義済みの選択肢から選ばせる場合は Select を使ってください。

## 基本の使い方

```tsx
import { TextField } from 'wip-ui'

<TextField label="メールアドレス" name="email" type="email" autoComplete="email" placeholder="email@example.com" />
```

## 使う場面

- 名前やメールアドレスなど、短いテキストを入力させるとき
- 説明文や問い合わせ内容など、改行を含む長文を入力させるとき（component="textarea"）

## 使い方

### ラベルと補足説明

- [must] label を付ける。検索など、コンテキストからひと目で分かる場合を除いて省略しない
- [should] 入力形式の例や文字数制限など、入力のルールは caption で示す

### 入力の種類

- [should] 改行を含むテキストの入力には component="textarea" を使う
- [should] メールアドレスや電話番号など、種類が決まっている入力では、それに合ったキーボードが出るようにする
- [should] 名前・住所・メールアドレスなど、利用者自身の情報を入力させる場合は、ブラウザの自動入力が使えるようにする

### 初期値

- [should] 既存の値がある場合は、その値を初期値にする。ない場合は空にする

### 状態

- [should] エラーは、何をどう直せばよいかが分かる文言で示す
- [should] 入力が必須の項目には isRequired を指定する
- [should] 権限不足や条件未達で編集できない場合は isDisabled を指定する
- [should] 編集はさせないが、値を表示して送信内容に含める場合は isReadOnly を使い、caption で読み取り専用であることを伝える

### サイズと幅

- [should] テーブル内やフィルターなど、スペースが限られる場面では size="s" を使う
- [should] size="l" の入力要素やボタンと並べる場合は、size="l" にそろえる
- [should] 幅は、入力される値の長さに合わせる。他の入力要素と幅をそろえたい場合は width を指定する（例：full）
- 入力欄の先頭・末尾にアイコン、テキスト（単位など）、ボタンを入れることには対応していない

## 文言

- [should] label は入力すべき内容を簡潔に示し、モバイル幅でも1行に収まる短さにする
- [should] placeholder には記入例を入れる
- [avoid] placeholder を label の代わりにしない
- [avoid] 入力に欠かせない情報を placeholder だけに書かない。入力を始めると消えるため、caption に書く

## アクセシビリティ

- [must] label を省略する場合は aria-label を付与する

## 実装

- [should] 種類が決まっている入力には type を指定する（例：email、tel）
- [should] 利用者自身の情報を入力させる場合は autoComplete を指定する
- [should] 初期値は defaultValue（制御する場合は value と onChange）で指定する
- [should] エラーの文言は validate で返す。返した文言が入力欄の下に表示される
- [should] フォームで送信する場合は name を指定する
