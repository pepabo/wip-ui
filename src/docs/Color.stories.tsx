import { Divider } from '../Divider'
import { Stack } from '../Stack'
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../Table'
import { type FlavorName, getColorsByFlavor } from '../Token/Color/byFlavor'
import { Typography } from '../Typography'

import type { Meta, StoryObj } from '@storybook/react-vite'

const capitalize = (name: string) => name.charAt(0).toUpperCase() + name.slice(1)

const ColorStrip = ({ name, colorObj }: { name: string; colorObj: Record<string, string> }) => {
  const levels = Object.keys(colorObj).sort(
    (a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10)
  )
  return (
    <Stack gap="xs">
      <Typography size="m" fontWeight="bold">
        {name}
      </Typography>
      <div
        style={{
          display: 'flex',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        {levels.map((level) => (
          <div
            key={level}
            style={{ flex: 1, minWidth: 0, height: '64px', backgroundColor: colorObj[level] }}
          />
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        {levels.map((level) => (
          <div key={level} style={{ flex: 1, minWidth: 0, padding: '0 4px', textAlign: 'center' }}>
            <Typography size="xxs" fontWeight="bold">
              {level}
            </Typography>
            <Typography size="xxs" color="medium_emphasis">
              {colorObj[level]}
            </Typography>
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
          {Object.entries(colors.primitive).map(([name, colorObj]) => (
            <ColorStrip key={name} name={capitalize(name)} colorObj={colorObj} />
          ))}
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
          {Object.entries(colors.semantic).map(([name, colorObj]) => (
            <ColorStrip key={name} name={capitalize(name)} colorObj={colorObj} />
          ))}
        </Stack>
      </Stack>
    </Stack>
  )
}

const meta: Meta = {
  title: 'Foundations/Colors/Swatches',
  // Colors の Docs ページ（Color.mdx）に埋め込むためのもの。サイドバーには単独のページとして出さない
  tags: ['!manifest', '!dev'],
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

// プリミティブカラーの系統とレベルの範囲。系統はフレーバーによって違う（lolipop には brown がある など）
const PrimitiveList = ({ flavor }: { flavor: FlavorName }) => {
  const { primitive } = getColorsByFlavor(flavor)
  const rows = Object.entries(primitive).map(([name, colorObj]) => {
    const levels = Object.keys(colorObj)
      .map((level) => Number.parseInt(level, 10))
      .sort((a, b) => a - b)
    const first = levels[0]
    const last = levels[levels.length - 1]
    return { name: capitalize(name), range: first === last ? `${first}` : `${first}〜${last}` }
  })
  return (
    <Table aria-label="プリミティブカラー一覧">
      <TableHeader>
        <Column id="name" isRowHeader>
          色名
        </Column>
        <Column id="range">レベル範囲</Column>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <Row key={row.name}>
            <Cell>{row.name}</Cell>
            <Cell>{row.range}</Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  )
}

/**
 * プリミティブカラーの系統とレベル範囲。ツールバーのフレーバーに合わせて切り替わります。
 *
 * @summary フレーバーごとのプリミティブカラーの系統
 */
export const Primitives: StoryObj = {
  render: (_args, { globals }) => {
    const flavor = (globals.flavor as FlavorName) ?? 'pepper'
    return <PrimitiveList flavor={flavor} />
  },
}
