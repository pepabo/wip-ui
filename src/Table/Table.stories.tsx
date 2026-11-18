import { Checkbox } from '../Checkbox'
import { Cell, Column, Row, Table, TableBody, TableHeader } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Data Display/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['none', 'single', 'multiple'],
    },
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    'aria-label': 'ファイル一覧',
    selectionMode: 'none',
  },
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <Column isRowHeader>名前</Column>
        <Column>種類</Column>
        <Column>更新日</Column>
      </TableHeader>
      <TableBody>
        <Row>
          <Cell>Document.pdf</Cell>
          <Cell>PDF</Cell>
          <Cell>2024-01-15</Cell>
        </Row>
        <Row>
          <Cell>Image.png</Cell>
          <Cell>画像</Cell>
          <Cell>2024-01-14</Cell>
        </Row>
        <Row>
          <Cell>Spreadsheet.xlsx</Cell>
          <Cell>Excel</Cell>
          <Cell>2024-01-13</Cell>
        </Row>
      </TableBody>
    </Table>
  ),
}

export const SelectionMode: Story = {
  name: 'selectionMode',
  render: () => (
    <Table aria-label="ファイル一覧" selectionMode="multiple">
      <TableHeader>
        <Column>
          <Checkbox slot="selection">{null}</Checkbox>
        </Column>
        <Column isRowHeader>名前</Column>
        <Column>種類</Column>
        <Column>サイズ</Column>
      </TableHeader>
      <TableBody>
        <Row>
          <Cell>
            <Checkbox slot="selection">{null}</Checkbox>
          </Cell>
          <Cell>File1.txt</Cell>
          <Cell>テキスト</Cell>
          <Cell>1.2 KB</Cell>
        </Row>
        <Row>
          <Cell>
            <Checkbox slot="selection">{null}</Checkbox>
          </Cell>
          <Cell>File2.doc</Cell>
          <Cell>文書</Cell>
          <Cell>45 KB</Cell>
        </Row>
        <Row>
          <Cell>
            <Checkbox slot="selection">{null}</Checkbox>
          </Cell>
          <Cell>File3.jpg</Cell>
          <Cell>画像</Cell>
          <Cell>230 KB</Cell>
        </Row>
      </TableBody>
    </Table>
  ),
}

export const Align: Story = {
  name: 'Column / Cell align',
  render: () => (
    <Table aria-label="請求一覧">
      <TableHeader>
        <Column isRowHeader>プロジェクト</Column>
        <Column align="center">状態</Column>
        <Column align="end">リクエスト</Column>
        <Column align="end">利用額</Column>
      </TableHeader>
      <TableBody>
        <Row>
          <Cell>production</Cell>
          <Cell align="center">有効</Cell>
          <Cell align="end">9,466</Cell>
          <Cell align="end">¥2,398</Cell>
        </Row>
        <Row>
          <Cell>staging</Cell>
          <Cell align="center">有効</Cell>
          <Cell align="end">2,549</Cell>
          <Cell align="end">¥646</Cell>
        </Row>
        <Row>
          <Cell>翻訳バッチ</Cell>
          <Cell align="center">停止</Cell>
          <Cell align="end">273</Cell>
          <Cell align="end">¥69</Cell>
        </Row>
      </TableBody>
    </Table>
  ),
}
