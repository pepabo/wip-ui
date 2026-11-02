# プロバイダーのロゴ

`shared/ui/ProviderIcon` が `LOGO_MAP` 経由で参照する SVG を置く。

## 出どころ

**正本は LP（`lp/public/providers/`）。** ここはその写し。

LP と管理画面で同じ提供元が別の絵になると、同じサービスに見えなくなる。増やすとき・
差し替えるときは LP 側を直してから写す。LP に無い提供元を管理画面だけで足さない。

## 足すとき

1. `lp/public/providers/` に SVG を置く
2. ここへ写す
3. `shared/ui/ProviderIcon` の `LOGO_MAP` にキーを足す

`LOGO_MAP` のキーはモデル名から取り出すベンダー名（`<調達先>/<ベンダー>/<モデル>` の
真ん中）と、`providers.name`（調達先）の両方が来る。別名は同じ絵へ寄せてよい
（Vertex AI は Google Cloud なので `google.svg`、Kimi は Moonshot AI なので
`kimi.svg` など）。

表に無いキーは、`ProviderIcon` が頭文字の色付きブロックへ落とす。ロゴが出ないときは
まずキーの綴りを疑う。
