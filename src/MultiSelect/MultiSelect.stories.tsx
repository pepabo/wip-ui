import { Stack } from '../Stack'
import { MultiSelect, MultiSelectItem, MultiSelectSection } from './index'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Forms/MultiSelect',
  component: MultiSelect,
  subcomponents: { MultiSelectItem, MultiSelectSection },
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    children: null,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['s', 'm', 'l'],
    },
  },
} satisfies Meta<typeof MultiSelect>

export default meta
type Story = StoryObj<typeof meta>

const items = [
  <MultiSelectItem key="jp" id="jp">
    日本
  </MultiSelectItem>,
  <MultiSelectItem key="kr" id="kr">
    韓国
  </MultiSelectItem>,
  <MultiSelectItem key="us" id="us">
    アメリカ
  </MultiSelectItem>,
  <MultiSelectItem key="ca" id="ca">
    カナダ
  </MultiSelectItem>,
  <MultiSelectItem key="de" id="de">
    ドイツ
  </MultiSelectItem>,
  <MultiSelectItem key="fr" id="fr">
    フランス
  </MultiSelectItem>,
]

export const Playground: Story = {
  args: {
    label: '配信する国',
    caption: '選んだ国のユーザーに配信されます',
    placeholder: '選択してください',
    size: 'm',
    allowsSelectAll: false,
    isDisabled: false,
    children: items,
  },
}

export const Caption: Story = {
  name: 'caption',
  render: () => (
    <MultiSelect
      label="配信する国"
      caption="選んだ国のユーザーに配信されます"
      placeholder="選択してください"
    >
      {items}
    </MultiSelect>
  ),
}

export const Size: Story = {
  name: 'size',
  render: () => (
    <Stack gap="m">
      <MultiSelect label="配信する国" placeholder="選択してください" size="s">
        {items}
      </MultiSelect>
      <MultiSelect label="配信する国" placeholder="選択してください" size="m">
        {items}
      </MultiSelect>
      <MultiSelect label="配信する国" placeholder="選択してください" size="l">
        {items}
      </MultiSelect>
    </Stack>
  ),
}

export const DefaultSelectedKeys: Story = {
  name: 'defaultSelectedKeys',
  render: () => (
    <MultiSelect
      label="配信する国"
      placeholder="選択してください"
      defaultSelectedKeys={['jp', 'us']}
    >
      {items}
    </MultiSelect>
  ),
}

export const AllowsSelectAll: Story = {
  name: 'allowsSelectAll',
  render: () => (
    <MultiSelect label="配信する国" placeholder="選択してください" allowsSelectAll>
      {items}
    </MultiSelect>
  ),
}

export const IsDisabled: Story = {
  name: 'isDisabled',
  render: () => (
    <MultiSelect label="配信する国" placeholder="選択してください" isDisabled>
      {items}
    </MultiSelect>
  ),
}

export const Section: Story = {
  name: 'MultiSelectSection',
  render: () => (
    <MultiSelect label="配信する国" placeholder="選択してください">
      <MultiSelectSection title="アジア">
        <MultiSelectItem id="jp">日本</MultiSelectItem>
        <MultiSelectItem id="kr">韓国</MultiSelectItem>
      </MultiSelectSection>
      <MultiSelectSection title="北米">
        <MultiSelectItem id="us">アメリカ</MultiSelectItem>
        <MultiSelectItem id="ca">カナダ</MultiSelectItem>
      </MultiSelectSection>
      <MultiSelectSection title="ヨーロッパ">
        <MultiSelectItem id="de">ドイツ</MultiSelectItem>
        <MultiSelectItem id="fr">フランス</MultiSelectItem>
      </MultiSelectSection>
    </MultiSelect>
  ),
}

export const ItemIsDisabled: Story = {
  name: 'MultiSelectItem isDisabled',
  render: () => (
    <MultiSelect label="配信する国" placeholder="選択してください">
      <MultiSelectItem id="jp">日本</MultiSelectItem>
      <MultiSelectItem id="kr" isDisabled>
        韓国
      </MultiSelectItem>
      <MultiSelectItem id="us">アメリカ</MultiSelectItem>
    </MultiSelect>
  ),
}
