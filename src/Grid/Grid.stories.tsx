import { Container } from '../Container/'
import { Paper } from '../Paper/'
import { Stack } from '../Stack'
import { Grid, GridItem } from './'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

const spacings = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'] as const
const contentAlignments = [
  'start',
  'end',
  'center',
  'stretch',
  'space-around',
  'space-between',
] as const
const directions = ['row', 'row-reverse', 'column', 'column-reverse'] as const
const wraps = ['wrap', 'nowrap', 'wrap-reverse'] as const

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
      options: spacings,
    },
    gapless: {
      control: 'boolean',
    },
    alignContent: {
      control: 'select',
      options: contentAlignments,
    },
    justifyContent: {
      control: 'select',
      options: contentAlignments,
    },
    direction: {
      control: 'select',
      options: directions,
    },
    wrap: {
      control: 'select',
      options: wraps,
    },
  },
} satisfies Meta<typeof Grid>

export default meta
type Story = StoryObj<typeof meta>

const Wrapper = ({ children }: { children: ReactNode }) => (
  <div style={{ padding: '40px' }}>
    <Container size="xl">{children}</Container>
  </div>
)

const Item = ({ children }: { children: ReactNode }) => (
  <Paper style={{ padding: '16px' }}>{children}</Paper>
)

const threeItems = [1, 2, 3].map((n) => (
  <GridItem key={n} size={4}>
    <Item>{n}</Item>
  </GridItem>
))

export const Playground: Story = {
  args: {
    spacing: 'm',
    gapless: false,
    direction: 'row',
    wrap: 'wrap',
  },
  render: (args) => (
    <Wrapper>
      <Grid {...args}>{threeItems}</Grid>
    </Wrapper>
  ),
}

export const Spacing: Story = {
  name: 'spacing',
  render: () => (
    <Wrapper>
      <Stack gap="xl">
        {spacings.map((spacing) => (
          <Grid key={spacing} spacing={spacing}>
            <GridItem size={4}>
              <Item>{spacing}</Item>
            </GridItem>
            <GridItem size={4}>
              <Item>{spacing}</Item>
            </GridItem>
            <GridItem size={4}>
              <Item>{spacing}</Item>
            </GridItem>
          </Grid>
        ))}
      </Stack>
    </Wrapper>
  ),
}

export const SpacingResponsive: Story = {
  name: 'spacing (responsive)',
  render: () => (
    <Wrapper>
      <Grid spacing={{ xxs: 's', m: 'l', xl: 'xxl' }}>{threeItems}</Grid>
    </Wrapper>
  ),
}

export const Gapless: Story = {
  name: 'gapless',
  render: () => (
    <Wrapper>
      <Grid spacing="m" gapless>
        {threeItems}
      </Grid>
    </Wrapper>
  ),
}

export const JustifyContent: Story = {
  name: 'justifyContent',
  render: () => (
    <Wrapper>
      <Stack gap="xl">
        {contentAlignments.map((justifyContent) => (
          <Grid key={justifyContent} spacing="m" justifyContent={justifyContent}>
            <GridItem size={3}>
              <Item>{justifyContent}</Item>
            </GridItem>
            <GridItem size={3}>
              <Item>{justifyContent}</Item>
            </GridItem>
          </Grid>
        ))}
      </Stack>
    </Wrapper>
  ),
}

export const AlignContent: Story = {
  name: 'alignContent',
  render: () => (
    <Wrapper>
      <Stack flexDirection="row" gap="s">
        {contentAlignments.map((alignContent) => (
          <Grid
            key={alignContent}
            spacing="xs"
            alignContent={alignContent}
            style={{ height: '240px', flex: 1, background: '#f5f5f5' }}
          >
            <GridItem size={12}>
              <Item>{alignContent}</Item>
            </GridItem>
            <GridItem size={12}>
              <Item>{alignContent}</Item>
            </GridItem>
          </Grid>
        ))}
      </Stack>
    </Wrapper>
  ),
}

export const Direction: Story = {
  name: 'direction',
  render: () => (
    <Wrapper>
      <Stack gap="xl">
        {directions.map((direction) => (
          <Grid key={direction} spacing="m" direction={direction}>
            <GridItem size={4}>
              <Item>{direction} 1</Item>
            </GridItem>
            <GridItem size={4}>
              <Item>{direction} 2</Item>
            </GridItem>
            <GridItem size={4}>
              <Item>{direction} 3</Item>
            </GridItem>
          </Grid>
        ))}
      </Stack>
    </Wrapper>
  ),
}

export const Wrap: Story = {
  name: 'wrap',
  render: () => (
    <Wrapper>
      <Stack gap="xl">
        {wraps.map((wrap) => (
          <Grid key={wrap} spacing="m" wrap={wrap}>
            <GridItem size={6}>
              <Item>{wrap} 1</Item>
            </GridItem>
            <GridItem size={6}>
              <Item>{wrap} 2</Item>
            </GridItem>
            <GridItem size={6}>
              <Item>{wrap} 3</Item>
            </GridItem>
          </Grid>
        ))}
      </Stack>
    </Wrapper>
  ),
}

export const GridItemSize: Story = {
  name: 'GridItem size',
  render: () => (
    <Wrapper>
      <Grid spacing="m">
        <GridItem size={12}>
          <Item>12</Item>
        </GridItem>
        <GridItem size={8}>
          <Item>8</Item>
        </GridItem>
        <GridItem size={4}>
          <Item>4</Item>
        </GridItem>
        <GridItem size={6}>
          <Item>6</Item>
        </GridItem>
        <GridItem size={6}>
          <Item>6</Item>
        </GridItem>
        <GridItem size={3}>
          <Item>3</Item>
        </GridItem>
        <GridItem size={3}>
          <Item>3</Item>
        </GridItem>
        <GridItem size={3}>
          <Item>3</Item>
        </GridItem>
        <GridItem size={3}>
          <Item>3</Item>
        </GridItem>
      </Grid>
    </Wrapper>
  ),
}

export const GridItemSizeResponsive: Story = {
  name: 'GridItem size (responsive)',
  render: () => (
    <Wrapper>
      <Grid spacing="m">
        <GridItem size={{ xxs: 12, s: 6, m: 4 }}>
          <Item>1</Item>
        </GridItem>
        <GridItem size={{ xxs: 12, s: 6, m: 4 }}>
          <Item>2</Item>
        </GridItem>
        <GridItem size={{ xxs: 12, s: 6, m: 4 }}>
          <Item>3</Item>
        </GridItem>
      </Grid>
    </Wrapper>
  ),
}

export const GridItemOffset: Story = {
  name: 'GridItem offset',
  render: () => (
    <Wrapper>
      <Grid spacing="m">
        <GridItem size={6} offset={3}>
          <Item>size=6 offset=3</Item>
        </GridItem>
        <GridItem size={4} offset={2}>
          <Item>size=4 offset=2</Item>
        </GridItem>
        <GridItem size={4}>
          <Item>size=4</Item>
        </GridItem>
      </Grid>
    </Wrapper>
  ),
}
