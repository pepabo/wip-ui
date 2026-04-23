import { Grid } from '../Grid'
import { GridItem } from '../Grid/GridItem'
import { Paper } from '../Paper'
import { Stack } from '../Stack'
import { Typography } from '../Typography'

import type { Meta, StoryObj } from '@storybook/react-vite'

const levels = [
  { elevation: 0 as const, usage: '影なし。背景と同一面' },
  { elevation: 1 as const, usage: 'カード、ボタン' },
  { elevation: 2 as const, usage: 'ヘッダー、固定バー' },
  { elevation: 3 as const, usage: 'ツールチップ' },
  { elevation: 4 as const, usage: 'FAB' },
  { elevation: 5 as const, usage: 'メニュー、ドロップダウン' },
  { elevation: 6 as const, usage: 'ダイアログ、ドロワー' },
]

const ElevationDemo = () => (
  <Grid spacing="l" columns={12}>
    {levels.map(({ elevation, usage }) => (
      <GridItem key={elevation} size={{ xxs: 6, m: 4, l: 3 }}>
        <Paper elevation={elevation} style={{ padding: '24px', height: '100%' }}>
          <Stack gap="xs">
            <Typography size="xl" fontWeight="bold">
              {elevation}
            </Typography>
            <Typography size="xs" color="medium_emphasis">
              {usage}
            </Typography>
          </Stack>
        </Paper>
      </GridItem>
    ))}
    <GridItem size={{ xxs: 6, m: 4, l: 3 }}>
      <Paper outlined style={{ padding: '24px', height: '100%' }}>
        <Stack gap="xs">
          <Typography size="xl" fontWeight="bold">
            Outlined
          </Typography>
          <Typography size="xs" color="medium_emphasis">
            影の代わりにボーダーで区切る
          </Typography>
        </Stack>
      </Paper>
    </GridItem>
  </Grid>
)

const meta: Meta = {
  title: 'Foundations/Elevation/Demos',
  tags: ['!manifest'],
}

export default meta

/**
 * 7 段階のエレベーションレベルと outlined バリアント。実際の影の違いを比較できます。
 *
 * @summary エレベーションレベルのビジュアル比較
 */
export const Levels: StoryObj = {
  render: () => <ElevationDemo />,
}
