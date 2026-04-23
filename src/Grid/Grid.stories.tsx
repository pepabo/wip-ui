import { Container } from '../Container/'
import { Paper } from '../Paper/'
import { Grid, GridItem } from './'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/Layout/Grid',
  component: Grid,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    spacing: {
      control: 'select',
      options: ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'],
    },
    gapless: {
      control: 'boolean',
    },
    alignContent: {
      control: 'select',
      options: ['start', 'end', 'center', 'stretch', 'space-around', 'space-between'],
    },
    justifyContent: {
      control: 'select',
      options: ['start', 'end', 'center', 'stretch', 'space-around', 'space-between'],
    },
    direction: {
      control: 'select',
      options: ['row', 'row-reverse', 'column', 'column-reverse'],
    },
    wrap: {
      control: 'select',
      options: ['wrap', 'nowrap', 'wrap-reverse'],
    },
  },
} satisfies Meta<typeof Grid>

export default meta
type Story = StoryObj<typeof meta>

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div style={{ padding: '40px' }}>{children}</div>
)

/**
 * 12 カラムグリッドで自由な幅配分のレイアウトを組む基本形。
 *
 * @summary 自由な幅配分でレイアウトを組む基本形
 */
export const Default: Story = {
  args: {
    spacing: 'm',
  },
  render: (args) => (
    <Wrapper>
      <Container size="xl">
        <Grid {...args}>
          <GridItem size={4}>
            <Paper>size=4</Paper>
          </GridItem>
          <GridItem size={4}>
            <Paper>size=4</Paper>
          </GridItem>
          <GridItem size={2}>
            <Paper>size=4</Paper>
          </GridItem>
        </Grid>
      </Container>
    </Wrapper>
  ),
}

/**
 * 比較表や左右対称のコンテンツなど、均等に2分割したい場合に使用。
 *
 * @summary コンテンツを均等に2分割したい場合
 */
export const EqualColumns: Story = {
  args: {
    spacing: 'm',
  },
  render: (args) => (
    <Wrapper>
      <Container size="xl">
        <Grid {...args}>
          <GridItem size={6}>
            <Paper>size=6</Paper>
          </GridItem>
          <GridItem size={6}>
            <Paper>size=6</Paper>
          </GridItem>
        </Grid>
      </Container>
    </Wrapper>
  ),
}

/**
 * メインコンテンツ + サイドバーなど、異なる幅を持つカラムを組み合わせる場合に使用。
 *
 * @summary 異なる幅のカラムを組み合わせる場合
 */
export const UnequalColumns: Story = {
  args: {
    spacing: 'xxl',
  },
  render: (args) => (
    <Wrapper>
      <Container size="xl">
        <Grid {...args}>
          <GridItem size={8}>
            <Paper>size=8</Paper>
          </GridItem>
          <GridItem size={4}>
            <Paper>size=4</Paper>
          </GridItem>
          <GridItem size={4}>
            <Paper>size=4</Paper>
          </GridItem>
          <GridItem size={8}>
            <Paper>size=8</Paper>
          </GridItem>
        </Grid>
      </Container>
    </Wrapper>
  ),
}

/**
 * カード一覧やタイル表示など、アイテム間の余白を調整したい場合の指定方法。
 *
 * @summary アイテム間の余白を調整したい場合
 */
export const WithSpacing: Story = {
  args: {
    spacing: 'l',
  },
  render: (args) => (
    <Wrapper>
      <Container size="xl">
        <Grid {...args}>
          <GridItem size={4}>
            <Paper>size=4</Paper>
          </GridItem>
          <GridItem size={4}>
            <Paper>size=4</Paper>
          </GridItem>
          <GridItem size={4}>
            <Paper>size=4</Paper>
          </GridItem>
          <GridItem size={6}>
            <Paper>size=6</Paper>
          </GridItem>
          <GridItem size={6}>
            <Paper>size=6</Paper>
          </GridItem>
        </Grid>
      </Container>
    </Wrapper>
  ),
}

/**
 * 画像ギャラリーやタイルなど、要素を隙間なく敷き詰めたい場合に使用。
 *
 * @summary 要素を隙間なく敷き詰めたい場合
 */
export const Gapless: Story = {
  args: {
    gapless: true,
  },
  render: (args) => (
    <Wrapper>
      <Container size="xl">
        <Grid {...args}>
          <GridItem size={4}>
            <Paper>size=4</Paper>
          </GridItem>
          <GridItem size={4}>
            <Paper>size=4</Paper>
          </GridItem>
          <GridItem size={4}>
            <Paper>size=4</Paper>
          </GridItem>
        </Grid>
      </Container>
    </Wrapper>
  ),
}

/**
 * コンテンツを中央寄せしたり、左側に余白を設けたい場合に使用。
 *
 * @summary 中央寄せや左側余白を設けたい場合
 */
export const WithOffset: Story = {
  args: {
    spacing: 'm',
  },
  render: (args) => (
    <Wrapper>
      <Container size="xl">
        <Grid {...args}>
          <GridItem size={4} offset={2}>
            <Paper>size=4, offset=2</Paper>
          </GridItem>
          <GridItem size={4}>
            <Paper>size=4</Paper>
          </GridItem>
          <GridItem size={6} offset={3}>
            <Paper>size=6, offset=3</Paper>
          </GridItem>
        </Grid>
      </Container>
    </Wrapper>
  ),
}

/**
 * ブレークポイントごとにカラム数を変更するレスポンシブレイアウト。
 * モバイルでは1列、タブレットで2列、デスクトップで4列に変化。
 *
 * @summary レスポンシブなカラム変更
 */
export const ResponsiveColumns: Story = {
  args: {
    spacing: 'm',
  },
  render: (args) => (
    <Wrapper>
      <Container size="xl">
        <Grid {...args}>
          <GridItem size={{ xxs: 12, s: 6, m: 4, l: 3 }}>
            <Paper>Responsive</Paper>
          </GridItem>
          <GridItem size={{ xxs: 12, s: 6, m: 4, l: 3 }}>
            <Paper>Responsive</Paper>
          </GridItem>
          <GridItem size={{ xxs: 12, s: 6, m: 4, l: 3 }}>
            <Paper>Responsive</Paper>
          </GridItem>
          <GridItem size={{ xxs: 12, s: 6, m: 4, l: 3 }}>
            <Paper>Responsive</Paper>
          </GridItem>
        </Grid>
      </Container>
    </Wrapper>
  ),
}

/**
 * ブレークポイントごとにスペースを変更するレスポンシブレイアウト。
 *
 * @summary レスポンシブなスペース変更
 */
export const ResponsiveSpacing: Story = {
  render: () => (
    <Wrapper>
      <Container size="xl">
        <Grid spacing={{ xxs: 's', m: 'l', xl: 'xxl' }}>
          <GridItem size={{ xxs: 12, s: 6, m: 4 }}>
            <Paper>Item 1</Paper>
          </GridItem>
          <GridItem size={{ xxs: 12, s: 6, m: 4 }}>
            <Paper>Item 2</Paper>
          </GridItem>
          <GridItem size={{ xxs: 12, s: 6, m: 4 }}>
            <Paper>Item 3</Paper>
          </GridItem>
        </Grid>
      </Container>
    </Wrapper>
  ),
}

/**
 * ヘッダー、メインコンテンツ、サイドバー、フッターを組み合わせた実践的なレイアウト例。
 *
 * @summary 実践的なページレイアウト
 */
export const ComplexLayout: Story = {
  args: {
    spacing: 'm',
  },
  render: (args) => (
    <Wrapper>
      <Container size="xl">
        <Grid {...args}>
          <GridItem size={12}>
            <Paper>Full width header (size=12)</Paper>
          </GridItem>
          <GridItem size={8}>
            <Paper>Main content (size=8)</Paper>
          </GridItem>
          <GridItem size={4}>
            <Paper>Sidebar (size=4)</Paper>
          </GridItem>
          <GridItem size={4}>
            <Paper>Footer column 1</Paper>
          </GridItem>
          <GridItem size={4}>
            <Paper>Footer column 2</Paper>
          </GridItem>
          <GridItem size={4}>
            <Paper>Footer column 3</Paper>
          </GridItem>
        </Grid>
      </Container>
    </Wrapper>
  ),
}

/**
 * ヘッダー・メイン・フッターのような縦方向の積み重ねレイアウトに使用。
 *
 * @summary 縦方向の積み重ねレイアウト向け
 */
export const WithDirection: Story = {
  args: {
    spacing: 'm',
    direction: 'column',
  },
  render: (args) => (
    <Wrapper>
      <Container size="xl">
        <Grid {...args}>
          <GridItem size={12}>
            <Paper style={{ minHeight: '60px' }}>Header</Paper>
          </GridItem>
          <GridItem size={12}>
            <Paper style={{ minHeight: '200px' }}>Main content</Paper>
          </GridItem>
          <GridItem size={12}>
            <Paper style={{ minHeight: '60px' }}>Footer</Paper>
          </GridItem>
        </Grid>
      </Container>
    </Wrapper>
  ),
}

/**
 * 水平スクロールやカルーセルなど、アイテムを折り返さずに1行で並べたい場合に使用。
 *
 * @summary アイテムを折り返さず1行で並べたい場合
 */
export const WithWrapNowrap: Story = {
  args: {
    spacing: 'm',
    wrap: 'nowrap',
  },
  render: (args) => (
    <Wrapper>
      <Container size="xl">
        <Grid {...args}>
          <GridItem size={4}>
            <Paper style={{ height: '100%' }}>Item 1</Paper>
          </GridItem>
          <GridItem size={4}>
            <Paper style={{ height: '100%' }}>Item 2</Paper>
          </GridItem>
          <GridItem size={4}>
            <Paper style={{ height: '100%' }}>Item 3</Paper>
          </GridItem>
          <GridItem size={4}>
            <Paper style={{ height: '100%' }}>Item 4 (overflows)</Paper>
          </GridItem>
        </Grid>
      </Container>
    </Wrapper>
  ),
}
