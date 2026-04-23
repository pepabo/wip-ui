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

const preview: Preview = {
  globalTypes: {
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
  },
  decorators: [flavorDecorator],
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
