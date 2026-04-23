import { Divider } from '../Divider'
import { Stack } from '../Stack'
import { type FlavorName, getColorsByFlavor } from '../Token/Color/byFlavor'
import { Typography } from '../Typography'

import type { Meta, StoryObj } from '@storybook/react-vite'

const ColorStrip = ({ name, colorObj }: { name: string; colorObj: Record<string, string> }) => {
  const levels = Object.keys(colorObj).sort(
    (a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10)
  )
  return (
    <Stack gap="xs">
      <Typography size="m" fontWeight="bold">
        {name}
      </Typography>
      <div style={{ display: 'flex', borderRadius: '12px', overflow: 'hidden' }}>
        {levels.map((level) => (
          <div key={level} style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                height: '64px',
                backgroundColor: colorObj[level],
              }}
            />
            <div
              style={{
                padding: '8px 4px',
                textAlign: 'center',
                backgroundColor: 'var(--sb-docs-bg, #fff)',
              }}
            >
              <Typography size="xxs" fontWeight="bold">
                {level}
              </Typography>
              <Typography size="xxs" color="medium_emphasis">
                {colorObj[level]}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </Stack>
  )
}

const AllColorSwatches = ({ flavor }: { flavor: FlavorName }) => {
  const colors = getColorsByFlavor(flavor)
  return (
    <Stack gap="xl">
      <Stack gap="l">
        <Stack gap="xxs">
          <Typography size="l" fontWeight="bold">
            Primitive Colors
          </Typography>
          <Typography size="s" color="medium_emphasis">
            色名とレベル（明度段階）の組み合わせで定義される直接的な色値です。コンポーネント実装ではセマンティックカラーを使用してください。
          </Typography>
        </Stack>
        <Stack gap="l">
          <ColorStrip name="Black" colorObj={colors.primitive.black} />
          <ColorStrip name="White" colorObj={colors.primitive.white} />
          <ColorStrip name="Gray" colorObj={colors.primitive.gray} />
          <ColorStrip name="Blue" colorObj={colors.primitive.blue} />
          <ColorStrip name="Green" colorObj={colors.primitive.green} />
          <ColorStrip name="Red" colorObj={colors.primitive.red} />
          <ColorStrip name="Yellow" colorObj={colors.primitive.yellow} />
        </Stack>
      </Stack>
      <Divider />
      <Stack gap="l">
        <Stack gap="xxs">
          <Typography size="l" fontWeight="bold">
            Semantic Colors
          </Typography>
          <Typography size="s" color="medium_emphasis">
            意図（intention）に基づいた名前で定義される色です。コンポーネントの color prop
            はこの体系に対応しています。
          </Typography>
        </Stack>
        <Stack gap="l">
          <ColorStrip name="Neutral" colorObj={colors.semantic.neutral} />
          <ColorStrip name="Informative" colorObj={colors.semantic.informative} />
          <ColorStrip name="Positive" colorObj={colors.semantic.positive} />
          <ColorStrip name="Negative" colorObj={colors.semantic.negative} />
          <ColorStrip name="Notice" colorObj={colors.semantic.notice} />
        </Stack>
      </Stack>
    </Stack>
  )
}

const meta: Meta = {
  title: 'Foundations/Colors/Swatches',
  tags: ['!manifest'],
}

export default meta

/**
 * カラートークン一覧。ツールバーのフレーバー切り替えで各テーマのカラーを確認できます。
 *
 * @summary 全カラートークンのスウォッチ一覧
 */
export const Swatches: StoryObj = {
  render: (_args, { globals }) => {
    const flavor = (globals.flavor as FlavorName) ?? 'pepper'
    return <AllColorSwatches flavor={flavor} />
  },
}
