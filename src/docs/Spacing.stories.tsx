import { Grid } from '../Grid'
import { GridItem } from '../Grid/GridItem'
import { Stack } from '../Stack'
import { Typography } from '../Typography'

import type { Meta, StoryObj } from '@storybook/react-vite'

const spacingScale = [
  { token: 'xxs', px: 4 },
  { token: 'xs', px: 8 },
  { token: 's', px: 12 },
  { token: 'm', px: 16 },
  { token: 'l', px: 24 },
  { token: 'xl', px: 32 },
  { token: 'xxl', px: 48 },
  { token: 'xxxl', px: 64 },
]

const SpacingDemo = () => (
  <Stack gap="m">
    {spacingScale.map(({ token, px }) => (
      <Grid key={token} spacing="m" columns={12}>
        <GridItem size={1}>
          <Typography size="xs" fontWeight="bold">
            {token}
          </Typography>
        </GridItem>
        <GridItem size={1}>
          <Typography size="xxs" color="medium_emphasis">
            {px}px
          </Typography>
        </GridItem>
        <GridItem size={10}>
          <div
            style={{
              width: `${px}px`,
              height: '24px',
              borderRadius: '4px',
              backgroundColor: 'var(--wip-color-semantic-informative-200, #93c5fd)',
            }}
          />
        </GridItem>
      </Grid>
    ))}
  </Stack>
)

const GapDemo = () => (
  <Stack gap="xxl">
    {(['xs', 's', 'm', 'l', 'xl'] as const).map((gap) => (
      <Stack key={gap} gap="xs">
        <Typography size="xs" color="medium_emphasis">
          gap=&quot;{gap}&quot;
        </Typography>
        <Stack flexDirection="row" gap={gap}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                backgroundColor: 'var(--wip-color-semantic-informative-200, #93c5fd)',
              }}
            />
          ))}
        </Stack>
      </Stack>
    ))}
  </Stack>
)

const meta: Meta = {
  title: 'Foundations/Spacing/Demos',
  tags: ['!manifest'],
}

export default meta

/**
 * スペーシングスケールの実寸バー表示。トークン名・ピクセル値と実際のサイズを確認できます。
 *
 * @summary スペーシングスケールのビジュアル一覧
 */
export const Scale: StoryObj = {
  render: () => <SpacingDemo />,
}

/**
 * Stack の gap prop を変えたときの間隔の違いを比較できます。
 *
 * @summary gap 値によるスペーシングの比較
 */
export const GapComparison: StoryObj = {
  render: () => <GapDemo />,
}
