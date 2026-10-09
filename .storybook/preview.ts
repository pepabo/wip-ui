import type { Decorator, Preview } from '@storybook/react-vite'
import { createElement } from 'react'

// Import icon font override for Storybook
import './icon-font-override.scss'
// Import docs page spacing overrides
import './docs-spacing.scss'

// Import pre-built flavor CSS files
import './flavors/pepper.css'
import './flavors/minne.css'
import './flavors/apollo.css'
import './flavors/nachiguro.css'
import './flavors/flippers.css'
import './flavors/kung-pu.css'
import './flavors/lolipop.css'

const flavorDecorator: Decorator = (Story, context) => {
  const flavor = (context.globals.flavor as string) ?? 'pepper'
  return createElement(
    'div',
    { 'data-flavor': flavor, style: { display: 'contents' } },
    createElement(Story)
  )
}

// コンポーネントを載せる面を切り替える。brightness の確認に使う
const BACKGROUNDS: Record<string, string> = {
  'apollo-page': '#04132B',
  'apollo-dialog': '#28354A',
  white: '#ffffff',
  well: '#f2f3f8',
}

const backgroundDecorator: Decorator = (Story, context) => {
  const color = BACKGROUNDS[context.globals.background as string]
  if (!color) return createElement(Story)
  return createElement('div', { style: { background: color, padding: '32px' } }, createElement(Story))
}

const preview: Preview = {
  globalTypes: {
    background: {
      description: 'Surface the component sits on',
      toolbar: {
        title: 'Background',
        icon: 'photo',
        items: [
          { value: 'none', title: 'なし' },
          { value: 'apollo-page', title: 'apollo ページ #04132B' },
          { value: 'apollo-dialog', title: 'apollo ダイアログ #28354A' },
          { value: 'white', title: '白 #ffffff' },
          { value: 'well', title: 'well #f2f3f8' },
        ],
        dynamicTitle: true,
      },
    },
    flavor: {
      description: 'Design token flavor / theme',
      toolbar: {
        title: 'Flavor',
        icon: 'paintbrush',
        items: [
          { value: 'pepper', title: 'Pepper' },
          { value: 'minne', title: 'Minne' },
          { value: 'apollo', title: 'Apollo' },
          { value: 'nachiguro', title: 'Nachiguro' },
          { value: 'flippers', title: 'Flippers' },
          { value: 'kung-pu', title: 'Kung-pu' },
          { value: 'lolipop', title: 'Lolipop' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    flavor: 'pepper',
    background: 'none',
  },
  decorators: [flavorDecorator, backgroundDecorator],
  parameters: {
    options: {
      storySort: {
        order: [
          'Introduction',
          ['Overview', 'Getting Started', 'FlavorProvider', 'Changelog'],
          'Foundations',
          ['Colors', 'Typography', 'Spacing', 'Elevation', 'Breakpoints', 'Icons'],
          'Components',
          [
            'Layout',
            'Actions',
            'Forms',
            'Data Display',
            'Surfaces',
            'Feedback',
            'Navigation',
          ],
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
