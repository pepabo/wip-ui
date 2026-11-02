import { Grid } from '../Grid'
import { GridItem } from '../Grid/GridItem'
import { Icon } from '../Icon'
import { Paper } from '../Paper'
import { Stack } from '../Stack'
import { Typography } from '../Typography'

import type { Meta, StoryObj } from '@storybook/react-vite'

const iconNames = [
  'apple',
  'arrow_cross',
  'arrow_down',
  'arrow_drop_down',
  'arrow_drop_left',
  'arrow_drop_right',
  'arrow_drop_up',
  'arrow_left',
  'arrow_order',
  'arrow_right',
  'arrow_right_left',
  'arrow_up',
  'balloon',
  'bell',
  'bill',
  'bullet_circle',
  'calendar',
  'camera',
  'cart',
  'check',
  'check_on_circle',
  'chevron_double',
  'chevron_down',
  'chevron_left',
  'chevron_right',
  'chevron_up',
  'circle',
  'clip',
  'clock',
  'code',
  'copy',
  'cross',
  'cross_on_circle',
  'discord',
  'download',
  'drag_handle',
  'ellipsis_horizontal',
  'ellipsis_horizontal_on_circle',
  'ellipsis_vertical',
  'exclamation_on_triangle',
  'facebook',
  'figma',
  'first_page',
  'folder',
  'funnel',
  'garbage_can',
  'gear',
  'github',
  'hatena_bookmark',
  'heart',
  'heart_border',
  'home',
  'image',
  'in',
  'info_on_circle',
  'instagram',
  'last_page',
  'launch',
  'line',
  'location_pin',
  'lock',
  'magnifying_glass',
  'mail',
  'megaphone',
  'menu',
  'mic',
  'minus',
  'minus_on_circle',
  'misskey',
  'multi_pane',
  'node',
  'note',
  'notion',
  'out',
  'outside',
  'parameters',
  'pencil',
  'people',
  'pepapon',
  'person',
  'person_plus',
  'phone',
  'plus',
  'plus_on_circle',
  'podcast',
  'qr_code',
  'qr_code_scanner',
  'question_on_circle',
  'receipt',
  'roller',
  'rss_feed',
  'share',
  'spotify',
  'star',
  'tiktok',
  'upload',
  'x',
  'youtube',
] as const

const IconGridDemo = () => (
  <Grid spacing="xxs" columns={12}>
    {iconNames.map((name) => (
      <GridItem key={name} size={{ xxs: 3, s: 2, l: 1 }}>
        <Paper elevation={0} style={{ padding: '16px 8px' }}>
          <Stack gap="xs" alignItems="center">
            <Icon name={name} size="m" />
            <Typography size="xxs" color="medium_emphasis">
              {name}
            </Typography>
          </Stack>
        </Paper>
      </GridItem>
    ))}
  </Grid>
)

const meta: Meta = {
  title: 'Foundations/Icons/Demos',
  tags: ['!manifest', '!dev'],
}

export default meta

/**
 * 全アイコンのグリッド表示。アイコン名を確認できます。
 *
 * @summary 全アイコン一覧グリッド
 */
export const AllIcons: StoryObj = {
  render: () => <IconGridDemo />,
}
