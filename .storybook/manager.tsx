import { useEffect } from 'react'
import { addons, types, useGlobals } from 'storybook/manager-api'
import { create } from 'storybook/theming/create'
import { getColorsByFlavor, type FlavorName } from '../src/Token/Color/byFlavor'

function buildTheme(flavor: FlavorName) {
  const colors = getColorsByFlavor(flavor)
  const gray = colors.primitive.gray
  const white = colors.primitive.white
  const informative = colors.semantic.informative

  return create({
    base: 'light',
    brandTitle: 'wip-ui',

    // UI colors
    colorPrimary: informative['600'],
    colorSecondary: informative['600'],

    // Background
    appBg: gray['50'],
    appContentBg: white['1000'],
    appPreviewBg: white['1000'],

    // Border
    appBorderColor: gray['100'],
    appBorderRadius: 8,

    // Text
    textColor: gray['900'],
    textInverseColor: white['1000'],

    // Toolbar
    barBg: white['1000'],
    barTextColor: gray['800'],
    barSelectedColor: informative['600'],
    barHoverColor: informative['600'],

    // Form
    inputBg: white['1000'],
    inputBorder: gray['100'],
    inputTextColor: gray['900'],
    inputBorderRadius: 4,
  })
}

const defaultTheme = buildTheme('pepper')

addons.setConfig({ theme: defaultTheme })

function ThemeSync() {
  const [globals] = useGlobals()
  const flavor = ((globals.flavor as string) ?? 'pepper') as FlavorName

  useEffect(() => {
    const theme = buildTheme(flavor)
    addons.setConfig({ theme })
    try {
      addons.getChannel().emit('forceReRender')
    } catch {
      // channel may not be ready on first mount
    }
  }, [flavor])

  return null
}

addons.register('flavor-theme-sync', () => {
  addons.add('flavor-theme-sync/tool', {
    type: types.TOOL,
    title: 'Flavor Theme Sync',
    render: ThemeSync,
    match: () => true,
  })
})
