import * as sass from 'sass-embedded'
import postcss from 'postcss'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = path.resolve(import.meta.dirname, '..')
const NODE_MODULES = path.join(ROOT, 'node_modules')
const ENTRY_SCSS = path.join(ROOT, 'src', '_all.scss')
const OUTPUT_DIR = path.join(ROOT, '.storybook', 'flavors')
const DIST_DIR = path.join(ROOT, 'dist', 'css')
const ICON_FONT_PATH = path.join(
  NODE_MODULES,
  '@pepabo-inhouse',
  'icon',
  'dist',
  'inhouse-icons.woff2'
)

const FLAVORS = ['pepper', 'minne', 'apollo', 'nachiguro', 'flippers', 'kung-pu', 'lolipop']

// Inline the icon font as a base64 data URL so consumers get icons out of the
// box with a single CSS import. Only woff2 is included (≥97% browser support
// as of 2026). Storybook keeps its own @font-face override in
// .storybook/icon-font-override.scss, so the .storybook/flavors/*.css outputs
// intentionally omit this block to avoid double declarations.
const iconFontFace = (() => {
  const base64 = fs.readFileSync(ICON_FONT_PATH).toString('base64')
  return `@font-face{font-family:"Inhouse Icons";font-weight:400;font-style:normal;src:url("data:font/woff2;base64,${base64}") format("woff2")}\n`
})()

// Inline PostCSS plugin to prefix selectors with [data-flavor="xxx"].
// When `scopeRoot` is true, `:root` selectors are rewritten to the prefix so
// token declarations no longer live at document level. Required for the
// combined (`all.css`) build to avoid the last-flavor-wins cascade conflict
// when multiple flavors' `:root { --token: ... }` blocks are concatenated.
function prefixPlugin(prefix, { scopeRoot = false } = {}) {
  return {
    postcssPlugin: 'prefix-flavor',
    Rule(rule) {
      // Skip rules inside @keyframes
      if (rule.parent?.type === 'atrule') {
        const name = rule.parent.name
        if (name === 'keyframes' || name === '-webkit-keyframes') {
          return
        }
      }
      rule.selectors = rule.selectors.map((sel) => {
        // ::view-transition-* selectors must remain at document level
        if (sel.includes('::view-transition')) return sel
        if (sel === ':root') return scopeRoot ? prefix : sel
        if (sel.startsWith(':root')) {
          return scopeRoot ? prefix + sel.slice(':root'.length) : sel
        }
        return `${prefix} ${sel}`
      })
    },
  }
}
prefixPlugin.postcss = true

fs.mkdirSync(OUTPUT_DIR, { recursive: true })
fs.mkdirSync(DIST_DIR, { recursive: true })

console.log(`Building flavor CSS for ${FLAVORS.length} flavors...`)

const combinedParts = []

for (const flavor of FLAVORS) {
  const flavorVarsPath = path
    .join(NODE_MODULES, '@pepabo-inhouse', 'tokens', 'build', flavor, 'scss', '_variables.scss')
    .replace(/\\/g, '/')

  // Custom importer: intercept @pepabo-inhouse/flavor/tokens
  // and redirect to the target flavor's variables
  const flavorImporter = {
    canonicalize(url) {
      if (
        url === '@pepabo-inhouse/flavor/tokens' ||
        url === '@pepabo-inhouse/flavor/_tokens' ||
        url === '@pepabo-inhouse/flavor/_tokens.scss'
      ) {
        return new URL('flavor-tokens:override')
      }
      return null
    },
    load(canonicalUrl) {
      if (canonicalUrl.href === 'flavor-tokens:override') {
        return {
          contents: `@forward "${flavorVarsPath}";`,
          syntax: 'scss',
        }
      }
      return null
    },
  }

  try {
    const result = sass.compile(ENTRY_SCSS, {
      loadPaths: [NODE_MODULES],
      importers: [flavorImporter],
      silenceDeprecations: ['color-functions'],
      style: 'compressed',
    })

    // Remove @font-face blocks (icon-font-override.scss handles this in Storybook)
    let css = result.css.replace(/@font-face\s*\{[^}]*\}/gs, '')

    // Workaround: @pepabo-inhouse/* が生成する不正な CSS を修正。
    // ブラウザは黙って無視するが、lightningcss（Vite 8）がビルドエラーにする。
    // 上流修正先: pepabo/inhouse-components-web

    // 1) icon の style mixin が &::after を内包しており、
    //    breadcrumb・checkbox の ::after 内から呼ばれると ::after::after になる。
    css = css.replace(/::after::after/g, '::after')

    // 2) adapter の mq-boundary(up, xxl) が空の min-width を返し、
    //    @media screen and (min-width: ){...} が生成される。
    css = css.replace(/@media screen and \(min-width: \)\{([^}]*\{[^}]*\})*\s*\}/g, '')

    // Per-flavor file: `:root` remains at document level (unchanged behavior)
    const prefixed = postcss([
      prefixPlugin(`[data-flavor="${flavor}"]`),
    ]).process(css, { from: undefined })

    // Storybook output: no @font-face (Storybook has its own override)
    fs.writeFileSync(path.join(OUTPUT_DIR, `${flavor}.css`), prefixed.css)
    // Published output: prepend the icon @font-face so consumers get icons
    // when importing a single per-flavor CSS file
    fs.writeFileSync(path.join(DIST_DIR, `${flavor}.css`), iconFontFace + prefixed.css)

    // Combined build: `:root` rescoped to [data-flavor="xxx"] so concatenating
    // all flavors does not produce cascade conflicts at :root level
    const combined = postcss([
      prefixPlugin(`[data-flavor="${flavor}"]`, { scopeRoot: true }),
    ]).process(css, { from: undefined })
    combinedParts.push(combined.css)

    console.log(`  ✓ ${flavor}.css`)
  } catch (err) {
    console.error(`  ✗ ${flavor}: ${err.message}`)
    process.exit(1)
  }
}

// Combined CSS: single @font-face at the top, then all 7 flavors
fs.writeFileSync(
  path.join(DIST_DIR, 'all.css'),
  iconFontFace + combinedParts.join('\n')
)
console.log(`  ✓ all.css (combined, ${FLAVORS.length} flavors)`)

console.log('Done!')
