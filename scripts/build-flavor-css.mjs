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

const FLAVORS = ['pepper', 'minne', 'apollo', 'nachiguro', 'flippers', 'kung-pu', 'lolipop']

// Inline PostCSS plugin to prefix selectors with [data-flavor="xxx"]
function prefixPlugin(prefix) {
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
        // Skip :root, ::view-transition-* selectors
        if (sel === ':root' || sel.startsWith(':root')) return sel
        if (sel.includes('::view-transition')) return sel
        return `${prefix} ${sel}`
      })
    },
  }
}
prefixPlugin.postcss = true

fs.mkdirSync(OUTPUT_DIR, { recursive: true })
fs.mkdirSync(DIST_DIR, { recursive: true })

console.log(`Building flavor CSS for ${FLAVORS.length} flavors...`)

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

    // Prefix selectors with [data-flavor="xxx"]
    const prefixed = postcss([prefixPlugin(`[data-flavor="${flavor}"]`)]).process(css, {
      from: undefined,
    })

    fs.writeFileSync(path.join(OUTPUT_DIR, `${flavor}.css`), prefixed.css)
    fs.writeFileSync(path.join(DIST_DIR, `${flavor}.css`), prefixed.css)
    console.log(`  ✓ ${flavor}.css`)
  } catch (err) {
    console.error(`  ✗ ${flavor}: ${err.message}`)
    process.exit(1)
  }
}

console.log('Done!')
