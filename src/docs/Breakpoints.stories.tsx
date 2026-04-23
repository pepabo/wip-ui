import { useEffect, useState } from 'react'

import { Stack } from '../Stack'
import { Typography } from '../Typography'

import type { Meta, StoryObj } from '@storybook/react-vite'

const breakpoints = [
  { name: 'xxs', min: 330, description: '小型スマートフォン' },
  { name: 'xs', min: 480, description: 'スマートフォン' },
  { name: 's', min: 600, description: '大型スマートフォン・小型タブレット' },
  { name: 'm', min: 768, description: 'タブレット' },
  { name: 'l', min: 1024, description: '小型デスクトップ' },
  { name: 'xl', min: 1280, description: 'デスクトップ' },
  { name: 'xxl', min: 1400, description: '大型デスクトップ' },
]

const BreakpointIndicatorDemo = () => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  const active = [...breakpoints].reverse().find((bp) => width >= bp.min)

  return (
    <Stack gap="l">
      <Stack flexDirection="row" gap="s" alignItems="center">
        <Typography size="s" color="medium_emphasis">
          現在のビューポート幅:
        </Typography>
        <Typography size="s" fontWeight="bold">
          {width}px
        </Typography>
        {active && (
          <>
            <Typography size="s" color="medium_emphasis">
              —
            </Typography>
            <Typography size="s" fontWeight="bold" color="informative">
              {active.name}
            </Typography>
            <Typography size="xs" color="medium_emphasis">
              ({active.description})
            </Typography>
          </>
        )}
      </Stack>
      <Stack flexDirection="row" gap="xxs">
        {breakpoints.map((bp) => {
          const isActive = width >= bp.min
          return (
            <div
              key={bp.name}
              style={{
                flex: 1,
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                backgroundColor: isActive
                  ? 'var(--wip-color-semantic-informative-200, #93c5fd)'
                  : 'var(--wip-color-semantic-neutral-100, #e5e7eb)',
                transition: 'all 0.2s ease',
              }}
            >
              <Typography
                size="xs"
                fontWeight={isActive ? 'bold' : 'normal'}
                color={isActive ? 'informative' : 'low_emphasis'}
              >
                {bp.name}
              </Typography>
            </div>
          )
        })}
      </Stack>
    </Stack>
  )
}

const meta: Meta = {
  title: 'Foundations/Breakpoints/Demos',
  tags: ['!manifest'],
}

export default meta

/**
 * ビューポート幅に連動するブレークポイントインジケーター。ウィンドウをリサイズして確認できます。
 *
 * @summary ブレークポイントのリアルタイム表示
 */
export const Indicator: StoryObj = {
  render: () => <BreakpointIndicatorDemo />,
}
