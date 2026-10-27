<!-- このファイルは scripts/build-guidelines.mjs で各コンポーネントの md から自動生成しています。直接編集しないでください。 -->

# コンポーネントの選び方

作りたいコンテンツ・体験から、使うコンポーネントの候補を探すための一覧です。
候補が見つかったら、「使い方」の md（wip-ui パッケージ内のパス）で、使い分けと使い方を確認してください。
ここに該当するものが無い場合は、rules.md の「選べないとき」に従ってください。

## Actions

| コンポーネント | 用途 | 使い方 |
|---|---|---|
| Button | ユーザーのアクションを受け付けるボタン | `dist/js/Button/Button.md` |
| LinkButton | ページ遷移を伴うボタン風リンク | `dist/js/Button/LinkButton.md` |

## Forms

| コンポーネント | 用途 | 使い方 |
|---|---|---|
| Checkbox | 送信して確定する ON/OFF や複数選択に使うチェックボックス | `dist/js/Checkbox/Checkbox.md` |
| Radio | 複数の選択肢から 1 つだけを選ばせるラジオボタン | `dist/js/Radio/Radio.md` |
| Select | 定義済みの選択肢から 1 つを選ばせるドロップダウン | `dist/js/Select/Select.md` |
| Switch | 即時に反映される設定の ON/OFF を切り替えるスイッチ | `dist/js/Switch/Switch.md` |
| TextField | 1 行または複数行のテキストを自由入力させる入力欄 | `dist/js/TextField/TextField.md` |

## Layout

| コンポーネント | 用途 | 使い方 |
|---|---|---|
| Container | コンテンツの最大幅を制限して中央に配置するレイアウト | `dist/js/Container/Container.md` |
| Grid | 12 カラムでカラム幅をそろえたレイアウトを組む | `dist/js/Grid/Grid.md` |
| Stack | 子要素を縦または横に等間隔で並べるレイアウト | `dist/js/Stack/Stack.md` |

## Data Display

| コンポーネント | 用途 | 使い方 |
|---|---|---|
| Avatar | ユーザーのプロフィール画像を円形で表示する | `dist/js/Avatar/Avatar.md` |
| Divider | セクションや要素のまとまりを線で区切る | `dist/js/Divider/Divider.md` |
| Sticker | ステータスやカテゴリを小さなラベルで示す | `dist/js/Sticker/Sticker.md` |
| Table | 構造化されたデータを行と列で一覧表示する | `dist/js/Table/Table.md` |
| Typography | 見出しや本文などのテキストを表示する | `dist/js/Typography/Typography.md` |

## Surfaces

| コンポーネント | 用途 | 使い方 |
|---|---|---|
| Paper | 影やボーダーでコンテンツの面を浮かせる | `dist/js/Paper/Paper.md` |

## Feedback

| コンポーネント | 用途 | 使い方 |
|---|---|---|
| Callout | ページ内に表示し続ける重要な情報・注意 | `dist/js/Callout/Callout.md` |
| Dialog | モーダルダイアログ | `dist/js/Dialog/Dialog.md` |
| Loader | 読み込み中の待機インジケーター | `dist/js/Loader/Loader.md` |
| SnackBar | 操作結果を一時的に知らせる通知 | `dist/js/SnackBar/SnackBar.md` |

## Navigation

| コンポーネント | 用途 | 使い方 |
|---|---|---|
| AppBar | ページ上部でタイトルと主要なアクションを表示するナビゲーションバー | `dist/js/AppBar/AppBar.md` |
| Breadcrumbs | ページ階層のパンくずリスト | `dist/js/Breadcrumbs/Breadcrumbs.md` |
| Tabs | 同じ階層のコンテンツの表示を切り替えるタブ | `dist/js/Tab/Tabs.md` |

## FlavorProvider

| コンポーネント | 用途 | 使い方 |
|---|---|---|
| FlavorProvider | フレーバー（デザイントークンのテーマ）を切り替える Provider | `dist/js/FlavorProvider/FlavorProvider.md` |

## Icon

| コンポーネント | 用途 | 使い方 |
|---|---|---|
| Icon | アクションやオブジェクトの意味をアイコンで補う | `dist/js/Icon/Icon.md` |
