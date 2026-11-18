// lint の判定の元データ（lint/rules.json）から、次のファイルを生成する
// 1. Biome のプラグイン lint/biome/no-raw-element.grit
// 2. lint/README.md の「検出する要素」の表
// ESLint 版（lint/eslint/index.js）は rules.json を実行時に読むため、生成しない
import * as fs from 'node:fs'
import * as path from 'node:path'

import { formatMessage, rules } from '../lint/rules.js'

const ROOT = path.resolve(import.meta.dirname, '..')
const GRIT_PATH = path.join(ROOT, 'lint', 'biome', 'no-raw-element.grit')
const README_PATH = path.join(ROOT, 'lint', 'README.md')
const TABLE_START = '<!-- rules:start -->'
const TABLE_END = '<!-- rules:end -->'

// GritQL のパターンはクォートの種類まで区別するため、ダブルクォートとシングルクォートの両方を書く
const typeLiterals = (type) => [`\`type="${type}"\``, `\`type='${type}'\``]

// type で絞る規則は、Biome の既存の判定に合わせて自己終了タグ（<input ... />）だけを対象にする
// 属性は some で直下だけを見る（contains だと、属性に渡した JSX の中の type まで見てしまう）
const renderGritRule = (rule) => {
  const diagnostic = `    register_diagnostic(span=$el, message="${formatMessage(rule)}")`
  if (!rule.types) {
    const { element } = rule
    return [
      `  or { \`<${element} $attrs>$children</${element}>\`, \`<${element} $attrs />\` } as $el where {`,
      diagnostic,
      '  }',
    ].join('\n')
  }

  const types = `or { ${rule.types.flatMap(typeLiterals).join(', ')} }`
  const condition = rule.typeOmitted
    ? [
        '    or {',
        `      $attrs <: not some or { ${[...typeLiterals('$_'), '`type={$_}`'].join(', ')} },`,
        `      $attrs <: some ${types}`,
        '    },',
      ]
    : [`    $attrs <: some ${types},`]
  return [`  \`<${rule.element} $attrs />\` as $el where {`, ...condition, diagnostic, '  }'].join(
    '\n'
  )
}

const renderGrit = () =>
  [
    '// このファイルは scripts/build-lint.mjs で lint/rules.json から自動生成しています。直接編集しないでください。',
    '// wip-ui に置き換え先が1対1で決まっている素の HTML 要素を検出する Biome プラグイン',
    '// メッセージには、使うコンポーネントと、その md（wip-ui パッケージ内のパス）を書く',
    'or {',
    rules.map(renderGritRule).join(',\n'),
    '}',
    '',
  ].join('\n')

// type を1つに絞る規則は <input type="checkbox"> のように書く。それ以外の書き方が要るものは rules.json の label で指定する
const labelOf = (rule) => {
  if (rule.label) return rule.label
  if (rule.types?.length === 1 && !rule.typeOmitted) return `\`<${rule.element} type="${rule.types[0]}">\``
  return `\`<${rule.element}>\``
}

const renderTable = () =>
  [
    TABLE_START,
    '| 素の要素 | 使うコンポーネント |',
    '|---|---|',
    ...rules.map((rule) => `| ${labelOf(rule)} | ${rule.component} |`),
    TABLE_END,
  ].join('\n')

const replaceTable = (readme) => {
  const start = readme.indexOf(TABLE_START)
  const end = readme.indexOf(TABLE_END)
  if (start === -1 || end === -1) {
    console.error(`lint/README.md に ${TABLE_START} と ${TABLE_END} がありません`)
    process.exit(1)
  }
  return readme.slice(0, start) + renderTable() + readme.slice(end + TABLE_END.length)
}

fs.writeFileSync(GRIT_PATH, renderGrit())
fs.writeFileSync(README_PATH, replaceTable(fs.readFileSync(README_PATH, 'utf8')))
console.log(`Generated lint/biome/no-raw-element.grit and lint/README.md from ${rules.length} rule(s).`)
