# Contributing to wip-ui

本ドキュメントはこのリポジトリで開発する人向けです。npm 経由で `wip-ui` を利用するだけの場合は [`README.md`](./README.md) を参照してください。

## セットアップ

```bash
git clone git@github.com:pepabo/wip-ui.git
cd wip-ui
npm install
```

## コマンド

| コマンド | 説明 |
|---------|------|
| `npm run storybook` | Storybook 開発サーバー起動 (port 6006) |
| `npm run build-storybook` | Storybook ビルド (`storybook-static/`) |
| `npm run build` | ライブラリのビルド (`dist/js/` + `dist/css/`) |
| `npm run typecheck` | TypeScript 型チェック |
| `npm run lint` | 型チェック + Biome チェック |
| `npm run lint:fix` | Biome による自動修正 |
| `npm run lint:staged <files>` | Biome による lint（ステージング対象） |

## リリース

Maintainer のみ。公開 npm への publish はローカルから実行します:

```bash
npm whoami                  # 公開 npm にログイン済みか確認
npm version <patch|minor|major>   # package.json の version を更新 + commit + tag
npm publish                 # 公開 npm へ公開（2FA が有効な場合 OTP を要求）
git push --follow-tags      # 新しい tag を origin にも push
```

より詳しい運用ポリシー（オーナー構成、トークン管理、障害対応等）は社内ドキュメントを参照してください。

## 構造

- `src/<Component>/*` — 各コンポーネント（React + SCSS）
- `src/_all.scss` — 全コンポーネント SCSS のエントリ
- `scripts/build-js.mjs` — TypeScript コンパイル + `.scss` import のストリップ
- `scripts/build-flavor-css.mjs` — フレーバーごとに SCSS をコンパイルし `[data-flavor="xxx"]` でスコープ化。`all.css`（全フレーバー結合）も生成。Inhouse Icons woff2 を base64 で埋め込み
- `.storybook/` — Storybook 設定とフレーバー別プレビュー CSS
