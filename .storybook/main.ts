import type { StorybookConfig } from '@storybook/react-vite'

const storyDirs = process.env.STORY_DIRS?.split(',').filter(Boolean)
const storyRoots = storyDirs?.length ? storyDirs.map((dir) => `../src/${dir}`) : ['../src']

const config: StorybookConfig = {
  stories: storyRoots.flatMap((root) => [
    `${root}/**/*.mdx`,
    `${root}/**/*.stories.@(js|jsx|mjs|ts|tsx)`,
  ]),
  addons: ['@storybook/addon-links', '@storybook/addon-docs', '@storybook/addon-mcp'],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules\/(?!react-aria-components)/.test(prop.parent.fileName) : true,
    },
  },

  viteFinal: async (config) => {
    return {
      ...config,
      css: {
        preprocessorOptions: {
          scss: {
            api: 'modern-compiler',
            silenceDeprecations: ['color-functions'],
          },
        },
      },
    }
  },
}

export default config
