import { Cell, Column, Row, Table, TableBody, TableHeader } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Data Display/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 構造化されたデータを行と列で一覧表示する基本形。
 *
 * @summary 構造化データの基本的な一覧表示
 */
export const Default: Story = {
  render: () => (
    <Table aria-label="Default table">
      <TableHeader>
        <Column>Name</Column>
        <Column>Type</Column>
        <Column>Date Modified</Column>
      </TableHeader>
      <TableBody>
        <Row>
          <Cell>Document.pdf</Cell>
          <Cell>PDF</Cell>
          <Cell>2024-01-15</Cell>
        </Row>
        <Row>
          <Cell>Image.png</Cell>
          <Cell>Image</Cell>
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

/**
 * ユーザー管理やデータ一覧など、表示項目が多い場面でのレイアウト確認。
 *
 * @summary 表示項目が多い場面でのレイアウト確認
 */
export const WithManyColumns: Story = {
  render: () => (
    <Table aria-label="Table with many columns">
      <TableHeader>
        <Column>ID</Column>
        <Column>Name</Column>
        <Column>Email</Column>
        <Column>Role</Column>
        <Column>Status</Column>
      </TableHeader>
      <TableBody>
        <Row>
          <Cell>1</Cell>
          <Cell>John Doe</Cell>
          <Cell>john@example.com</Cell>
          <Cell>Admin</Cell>
          <Cell>Active</Cell>
        </Row>
        <Row>
          <Cell>2</Cell>
          <Cell>Jane Smith</Cell>
          <Cell>jane@example.com</Cell>
          <Cell>User</Cell>
          <Cell>Active</Cell>
        </Row>
        <Row>
          <Cell>3</Cell>
          <Cell>Bob Johnson</Cell>
          <Cell>bob@example.com</Cell>
          <Cell>User</Cell>
          <Cell>Inactive</Cell>
        </Row>
      </TableBody>
    </Table>
  ),
}

/**
 * 大量データの一覧表示でのスクロールやパフォーマンスの確認。
 *
 * @summary 大量データ一覧でのスクロール確認
 */
export const WithManyRows: Story = {
  render: () => (
    <Table aria-label="Table with many rows">
      <TableHeader>
        <Column>Item</Column>
        <Column>Quantity</Column>
        <Column>Price</Column>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }, (_, i) => (
          <Row key={String(i)}>
            <Cell>Item {i + 1}</Cell>
            <Cell>{(i + 1) * 5}</Cell>
            <Cell>${(i + 1) * 10}</Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  ),
}

/**
 * 一括削除や一括更新など、複数行をまとめて操作したい場面で使用。
 *
 * @summary 複数行をまとめて操作したい場面向け
 */
export const Selectable: Story = {
  render: () => (
    <Table aria-label="Selectable table" selectionMode="multiple">
      <TableHeader>
        <Column>Name</Column>
        <Column>Type</Column>
        <Column>Size</Column>
      </TableHeader>
      <TableBody>
        <Row>
          <Cell>File1.txt</Cell>
          <Cell>Text</Cell>
          <Cell>1.2 KB</Cell>
        </Row>
        <Row>
          <Cell>File2.doc</Cell>
          <Cell>Document</Cell>
          <Cell>45 KB</Cell>
        </Row>
        <Row>
          <Cell>File3.jpg</Cell>
          <Cell>Image</Cell>
          <Cell>230 KB</Cell>
        </Row>
      </TableBody>
    </Table>
  ),
}
