// コンポーネントの md（src/<Folder>/<Name>.md）から、利用側向けのガイドラインを作る
// 1. 各 md の frontmatter を集めて guidelines/selector.md を生成する
// 2. 各 md に props の一覧（型定義から生成）を付け足し、dist/js/<Folder>/<Name>.md に置く
import * as fs from 'node:fs'
import * as path from 'node:path'
import { withCustomConfig } from 'react-docgen-typescript'

const ROOT = path.resolve(import.meta.dirname, '..')
const SRC_DIR = path.join(ROOT, 'src')
const DIST_DIR = path.join(ROOT, 'dist', 'js')
const SELECTOR_PATH = path.join(ROOT, 'guidelines', 'selector.md')
const LINT_PATH = path.join(ROOT, 'lint', 'biome', 'no-raw-element.grit')

const CATEGORIES = [
  'Actions',
  'Forms',
  'Layout',
  'Data Display',
  'Surfaces',
  'Feedback',
  'Navigation',
]

// react-aria 系から引き継いだ props のうち、どのコンポーネントにもある汎用的なものは一覧から外す
const EXCLUDED_PARENTS = new Set([
  'GlobalDOMAttributes',
  'GlobalDOMEvents',
  'TextInputDOMEvents',
  'KeyboardEvents',
  'FocusEvents',
  'HoverEvents',
])

const parser = withCustomConfig(path.join(ROOT, 'tsconfig.json'), {
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  savePropValueAsString: true,
  propFilter: (prop) => {
    if (!prop.parent) return true
    if (EXCLUDED_PARENTS.has(prop.parent.name)) return false
    return !/node_modules\/(?!(react-aria-components|react-aria|react-stately|@react-aria|@react-stately|@react-types)\/)/.test(
      prop.parent.fileName
    )
  },
})

const parseFrontmatter = (md) => {
  const match = md.match(/^---\n([\s\S]*?)\n---\n/)
  if (!match) return {}
  return Object.fromEntries(
    match[1]
      .split('\n')
      .map((line) => line.match(/^(\w+):\s*(.*)$/))
      .filter(Boolean)
      .map(([, key, value]) => [key, value.trim()])
  )
}

// src 直下の各フォルダから、コンポーネントの md とソースを集める（src/docs などは除く）
const collectFolders = () =>
  fs
    .readdirSync(SRC_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const dir = path.join(SRC_DIR, entry.name)
      const files = fs.readdirSync(dir)
      const mds = files
        .filter((file) => file.endsWith('.md'))
        .map((file) => ({ file, content: fs.readFileSync(path.join(dir, file), 'utf8') }))
      const sources = files.filter(
        (file) =>
          file.endsWith('.tsx') && !file.endsWith('.stories.tsx') && !file.endsWith('.figma.tsx')
      )
      // index.tsx は他の .tsx を再エクスポートしているだけのことが多いので、他に .tsx が無い場合だけ使う
      const componentSources =
        sources.length > 1 ? sources.filter((file) => file !== 'index.tsx') : sources
      return { folder: entry.name, dir, mds, componentSources }
    })
    .filter(({ mds }) => mds.length > 0)

const escapeCell = (text) =>
  String(text ?? '')
    .replace(/\r?\n+/g, ' ')
    .replace(/\|/g, '\\|')
    .trim()

const formatType = (type) => {
  if (type.name === 'enum' && Array.isArray(type.value)) {
    return type.value.map((item) => item.value).join(' \\| ')
  }
  return escapeCell(type.name)
}

const renderPropsTable = (component) => {
  const props = Object.values(component.props)
  if (props.length === 0) return ''
  const rows = props.map(
    (prop) =>
      `| ${prop.name}${prop.required ? '（必須）' : ''} | ${formatType(prop.type)} | ${escapeCell(
        prop.defaultValue?.value ?? '-'
      )} | ${escapeCell(prop.description) || '-'} |`
  )
  return [
    `### ${component.displayName}`,
    '',
    '| 名前 | 型 | 既定値 | 説明 |',
    '|---|---|---|---|',
    ...rows,
    '',
  ].join('\n')
}

const buildComponentDocs = (folders) => {
  if (!fs.existsSync(DIST_DIR)) {
    console.warn('dist/js が無いため、md のコピーを省略しました（npm run build:js を先に実行してください）')
    return
  }

  for (const { folder, dir, mds, componentSources } of folders) {
    // フォルダごとに解析する（まとめて解析すると、引き継いだ props の出方が変わるため）
    const components = parser.parse(componentSources.map((file) => path.join(dir, file)))

    for (const { file: mdFile, content } of mds) {
      const name = path.basename(mdFile, '.md')
      // フォルダに md が1つならその md に全コンポーネントを載せ、複数ならファイル名が同じものだけを載せる
      const owned = components
        .filter(
          (component) =>
            mds.length === 1 || path.basename(component.filePath, '.tsx') === name
        )
        .sort((a, b) =>
          a.displayName === name ? -1 : b.displayName === name ? 1 : a.displayName.localeCompare(b.displayName)
        )

      const md = content.trimEnd()
      const propsSection = [
        '## Props（自動生成）',
        '',
        '型定義から生成した props の一覧です。react-aria-components から引き継いだ props の説明は英語です。DOM の汎用的な属性・イベントは省略しています。',
        '',
        ...owned.map(renderPropsTable).filter(Boolean),
      ].join('\n')

      const outDir = path.join(DIST_DIR, folder)
      fs.mkdirSync(outDir, { recursive: true })
      fs.writeFileSync(path.join(outDir, mdFile), `${md}\n\n${propsSection}`)
    }
  }
}

const buildSelector = (folders) => {
  const entries = folders.flatMap(({ folder, mds }) =>
    mds.map(({ file: mdFile, content }) => {
      const frontmatter = parseFrontmatter(content)
      return {
        name: path.basename(mdFile, '.md'),
        summary: frontmatter.summary ?? '',
        category: frontmatter.category,
        docPath: `dist/js/${folder}/${mdFile}`,
      }
    })
  )

  const table = (items) => [
    '| コンポーネント | 用途 | 使い方 |',
    '|---|---|---|',
    ...items
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((item) => `| ${item.name} | ${escapeCell(item.summary)} | \`${item.docPath}\` |`),
    '',
  ]

  const sections = CATEGORIES.flatMap((category) => {
    const items = entries.filter((entry) => entry.category === category)
    return items.length ? [`## ${category}`, '', ...table(items)] : []
  })
  const uncategorized = entries
    .filter((entry) => !CATEGORIES.includes(entry.category))
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => [`## ${entry.name}`, '', ...table([entry])])

  const content = [
    '<!-- このファイルは scripts/build-guidelines.mjs で各コンポーネントの md から自動生成しています。直接編集しないでください。 -->',
    '',
    '# コンポーネントの選び方',
    '',
    '作りたいコンテンツ・体験から、使うコンポーネントの候補を探すための一覧です。',
    '候補が見つかったら、「使い方」の md（wip-ui パッケージ内のパス）で、使い分けと使い方を確認してください。',
    'ここに該当するものが無い場合は、rules.md の「選べないとき」に従ってください。',
    '',
    ...sections,
    ...uncategorized,
  ].join('\n')

  fs.writeFileSync(SELECTOR_PATH, `${content.trimEnd()}\n`)
}

// lint のメッセージに書いた md のパスが、実際に生成される md を指しているか確かめる
const checkLintPaths = (folders) => {
  const generated = new Set(
    folders.flatMap(({ folder, mds }) => mds.map(({ file }) => `dist/js/${folder}/${file}`))
  )
  const missing = [...fs.readFileSync(LINT_PATH, 'utf8').matchAll(/wip-ui\/(dist\/js\/\S+?\.md)/g)]
    .map(([, docPath]) => docPath)
    .filter((docPath) => !generated.has(docPath))
  if (missing.length > 0) {
    console.error(`lint のメッセージに、存在しない md のパスがあります: ${missing.join(', ')}`)
    process.exit(1)
  }
}

const folders = collectFolders()
checkLintPaths(folders)
buildSelector(folders)
buildComponentDocs(folders)
console.log(`Generated guidelines/selector.md and component docs for ${folders.length} folder(s).`)
