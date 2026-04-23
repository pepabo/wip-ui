import { Divider } from '../Divider'
import { Grid } from '../Grid'
import { GridItem } from '../Grid/GridItem'
import { Paper } from '../Paper'
import { Stack } from '../Stack'
import { Typography } from '../Typography'

import type { Meta, StoryObj } from '@storybook/react-vite'

const sizes = [
  { token: 'xxxl', px: '32px', usage: 'ページタイトル' },
  { token: 'xxl', px: '26px', usage: 'セクション見出し' },
  { token: 'xl', px: '21px', usage: 'サブ見出し' },
  { token: 'l', px: '18px', usage: '強調テキスト' },
  { token: 'm', px: '16px', usage: '本文（デフォルト）' },
  { token: 's', px: '14px', usage: '補足テキスト' },
  { token: 'xs', px: '12px', usage: 'キャプション、ラベル' },
  { token: 'xxs', px: '11px', usage: '最小テキスト' },
] as const

const TypeScaleDemo = () => (
  <Stack gap="l">
    {sizes.map(({ token, px, usage }) => (
      <Grid key={token} spacing="m" columns={12}>
        <GridItem size={2}>
          <Stack gap="xxs">
            <Typography size="xs" fontWeight="bold">
              {token}
            </Typography>
            <Typography size="xxs" color="low_emphasis">
              {px}
            </Typography>
          </Stack>
        </GridItem>
        <GridItem size={10}>
          <Typography size={token}>{usage}</Typography>
        </GridItem>
      </Grid>
    ))}
  </Stack>
)

const densities = [
  { name: 'comfort', usage: '長文の本文。読みやすさを重視', lineHeight: '28px' },
  { name: 'normal', usage: '標準。多くの場面で適切（デフォルト）', lineHeight: '24px' },
  { name: 'dense', usage: 'UI ラベル、省スペースが必要な場面', lineHeight: '20px' },
] as const

const DensityDemo = () => (
  <Stack gap="l">
    {densities.map(({ name, usage, lineHeight }) => (
      <Paper key={name} outlined style={{ padding: '24px' }}>
        <Stack gap="s">
          <Stack flexDirection="row" gap="s" alignItems="center">
            <Typography size="s" fontWeight="bold">
              {name}
            </Typography>
            <Typography size="xxs" color="low_emphasis">
              行間 {lineHeight}（size=m）
            </Typography>
          </Stack>
          <Typography density={name}>
            wip-ui のタイポグラフィは inhouse のタイポグラフィトークンに基づいています。 4px
            のバーティカルリズムグリッドに沿ったフォントサイズと行間が定義されています。
            {name === 'comfort' && 'ブログ記事やヘルプページなど、長文を読む場面に適しています。'}
          </Typography>
          <Typography size="xxs" color="medium_emphasis">
            {usage}
          </Typography>
        </Stack>
      </Paper>
    ))}
  </Stack>
)

const colors = [
  { name: 'high_emphasis', label: 'High Emphasis', usage: '最も重要なテキスト。見出し、本文' },
  {
    name: 'medium_emphasis',
    label: 'Medium Emphasis',
    usage: '補足的なテキスト。キャプション、説明文',
  },
  {
    name: 'low_emphasis',
    label: 'Low Emphasis',
    usage: '最も控えめなテキスト。プレースホルダー、非活性ラベル',
  },
] as const

const semanticColors = [
  { name: 'informative', label: 'Informative', usage: '情報提供やリンク' },
  { name: 'positive', label: 'Positive', usage: '成功、完了' },
  { name: 'notice', label: 'Notice', usage: '警告、注意' },
  { name: 'negative', label: 'Negative', usage: 'エラー、否定' },
] as const

const ColorDemo = () => (
  <Stack gap="l">
    <Stack gap="s">
      <Typography size="s" fontWeight="bold">
        強調度
      </Typography>
      <Stack gap="xs">
        {colors.map(({ name, label, usage }) => (
          <Grid key={name} spacing="m" columns={12}>
            <GridItem size={3}>
              <Typography size="xs" color="medium_emphasis">
                {name}
              </Typography>
            </GridItem>
            <GridItem size={9}>
              <Typography color={name}>
                {label} - {usage}
              </Typography>
            </GridItem>
          </Grid>
        ))}
      </Stack>
    </Stack>
    <Divider />
    <Stack gap="s">
      <Typography size="s" fontWeight="bold">
        セマンティック
      </Typography>
      <Stack gap="xs">
        {semanticColors.map(({ name, label, usage }) => (
          <Grid key={name} spacing="m" columns={12}>
            <GridItem size={3}>
              <Typography size="xs" color="medium_emphasis">
                {name}
              </Typography>
            </GridItem>
            <GridItem size={9}>
              <Typography color={name}>
                {label} - {usage}
              </Typography>
            </GridItem>
          </Grid>
        ))}
      </Stack>
    </Stack>
  </Stack>
)

const meta: Meta = {
  title: 'Foundations/Typography/Demos',
  tags: ['!manifest'],
}

export default meta

/**
 * 8 段階のフォントサイズスケール。実際のレンダリングとトークン名・ピクセル値を並べて確認できます。
 *
 * @summary フォントサイズスケールのビジュアル一覧
 */
export const TypeScale: StoryObj = {
  render: () => <TypeScaleDemo />,
}

/**
 * 3 段階の行間密度。同じテキストを異なる density で比較できます。
 *
 * @summary 行間密度の比較
 */
export const Density: StoryObj = {
  render: () => <DensityDemo />,
}

/**
 * テキストカラーの強調度とセマンティックカラーの一覧。
 *
 * @summary テキストカラーのビジュアル一覧
 */
export const TextColors: StoryObj = {
  render: () => <ColorDemo />,
}
