import { useContext, useEffect, useState } from 'react'
import { DocsContext } from '@storybook/addon-docs/blocks'
import { GLOBALS_UPDATED } from 'storybook/internal/core-events'

import { Cell, Column, Row, Table, TableBody, TableHeader } from '../Table'
import { type FlavorName, getColorsByFlavor } from '../Token/Color/byFlavor'

const capitalize = (name: string) => name.charAt(0).toUpperCase() + name.slice(1)

type DocsContextValue = {
  store?: { userGlobals?: { globals?: { flavor?: string } } }
  channel?: {
    on: (event: string, handler: (payload: { globals: { flavor?: string } }) => void) => void
    off: (event: string, handler: (payload: { globals: { flavor?: string } }) => void) => void
  }
}

// docs ページの本文に直接置くため、ストーリーの globals ではなく DocsContext からフレーバーを読む。
// Canvas に入れると docs の表のスタイルが当たらず、ほかの表と見た目がそろわない
const useDocsFlavor = (): FlavorName => {
  const context = useContext(DocsContext) as unknown as DocsContextValue
  const [flavor, setFlavor] = useState(
    (context.store?.userGlobals?.globals?.flavor as FlavorName | undefined) ?? 'pepper'
  )
  useEffect(() => {
    const channel = context.channel
    if (!channel) return
    const handle = ({ globals }: { globals: { flavor?: string } }) => {
      if (globals.flavor) setFlavor(globals.flavor as FlavorName)
    }
    channel.on(GLOBALS_UPDATED, handle)
    return () => channel.off(GLOBALS_UPDATED, handle)
  }, [context.channel])
  return flavor
}

/** プリミティブカラーの系統とレベル範囲。系統はフレーバーによって違うため、選んでいるフレーバーのトークンから作る */
export const PrimitiveColorTable = () => {
  const flavor = useDocsFlavor()
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
