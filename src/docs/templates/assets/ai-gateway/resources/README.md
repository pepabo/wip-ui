# 関連リソースのサムネイル

概要画面（`features/ProjectDetail` の `RelatedResourcesSection`）のカードに敷く絵を置く。

| ファイル | カード |
|---|---|
| `api-keys.webp` | APIキー |
| `rules.webp` | ルール |
| `byok.webp` | BYOK |
| `docs.webp` | ドキュメント |

## 出どころ

デザイナー支給の PNG（1200x675）。`rules.webp` の元も「ルール」という名前で渡された絵を使用している。

## 書き出しかた

```bash
# octane/ で実行（sharp はルートの node_modules にある）
node -e "
const sharp = require('sharp');
sharp('<支給PNG>')
  .flatten({ background: '#ffffff' })
  .resize(1200, 628, { fit: 'cover', position: 'center' })
  .webp({ quality: 90, effort: 6, smartSubsample: false })
  .toFile('admin-ui/public/resources/<名前>.webp');
"
```

**1200x628 に切る** — カード側の面は `styles.module.css` の `.resourceThumb` が
`aspect-ratio: 1.91 / 1` を持つ。支給の 16:9 をそのまま置くと上下が切れるので、
書き出しの時点で中央から切っておく。絵は中央に寄っているので欠けない。

**アルファを落とす** — 支給の絵はアルファを持つが中身は全面不透明なので、白へ落として
3チャンネルにする。

**非可逆で持つ** — 地色のメッシュグラデーションはロスレスだと1枚 108〜168KB まで膨らむ。
q90 なら1枚 11〜13KB（4枚で 49KB）に収まり、地色の階調の誤差は最大 4/255 でバンディングも
出ない。差が大きく出るのは白抜きアイコンの輪郭だけで、表示は 1/4 に縮むため見えない。

**1200px 幅で持つ** — 600px 未満の1列表示が最大 3x の端末でも粗くならないようにするため。
