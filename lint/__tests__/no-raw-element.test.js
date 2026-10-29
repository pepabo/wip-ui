// Biome 版と ESLint 版の no-raw-element が、lint/rules.json どおりに同じ判定をすることを確かめる
//
// 書く人によってテストの網羅がばらつかないように、例はできるだけ rules.json から自動で作る。
// 1. 規則ごとの例（GENERATED_CASES）：規則の種類ごとに決まった観点の例を作り、期待する判定と照らす
// 2. 総当たり（EXHAUSTIVE_LINES）：要素・属性・書き方を組み合わせ、期待値は書かずに Biome と ESLint の一致だけを見る
// 3. 手書きの例（HANDWRITTEN_CASES）：入れ子や複数行など、1 と 2 で作れない形だけを書く
import { execFileSync, spawnSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { Linter } from 'eslint'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import plugin from '../eslint/index.js'
import { formatMessage, rules } from '../rules.js'

const ROOT = path.resolve(import.meta.dirname, '../..')
const GRIT_PATH = path.join(ROOT, 'lint', 'biome', 'no-raw-element.grit')
const BIOME_BIN = path.join(ROOT, 'node_modules', '.bin', 'biome')

// どの規則の types にも入っていない type（対象外の input）
const UNLISTED_TYPES = ['hidden', 'date', 'file', '']

const messageOf = (id) => formatMessage(rules.find((rule) => rule.id === id))
const idsOf = (rule) => (rule ? [rule.id] : [])
const pascalCase = (name) => name[0].toUpperCase() + name.slice(1)

// 1. 規則ごとの例。[説明, JSX, 検出される規則の id]
const casesForElementRule = (rule) => {
  const { element: el, id } = rule
  return [
    [`${el}: 開始と終了のタグ`, `<${el}>内容</${el}>`, [id]],
    [`${el}: 自己終了タグ`, `<${el} />`, [id]],
    [`${el}: 属性と spread`, `<${el} className="a" {...props}>内容</${el}>`, [id]],
    [`${el}: 他の要素の中`, `<div><${el} /></div>`, [id]],
    [`${el}: 同じ名前の部品`, `<${pascalCase(el)} />`, []],
    [`${el}: 名前空間付き`, `<ui.${el} />`, []],
    [`${el}: カスタム要素`, `<${el}-x />`, []],
  ]
}

const casesForTypedRule = (rule) =>
  rule.types.flatMap((type) => {
      const el = rule.element
      return [
        [`${rule.id} ${type}: ダブルクォート`, `<${el} type="${type}" />`, [rule.id]],
        [`${rule.id} ${type}: シングルクォート`, `<${el} type='${type}' />`, [rule.id]],
        [`${rule.id} ${type}: 他の属性と spread`, `<${el} name="a" type="${type}" {...props} />`, [rule.id]],
        [`${rule.id} ${type}: 式（判定しない）`, `<${el} type={'${type}'} />`, []],
        [`${rule.id} ${type}: 大文字（判定しない）`, `<${el} type="${type.toUpperCase()}" />`, []],
        [`${rule.id} ${type}: 自己終了でない（判定しない）`, `<${el} type="${type}"></${el}>`, []],
      ]
    })

// type で絞る規則がある要素について、type の書き方によらない例
const casesForTypedElement = (el) => {
  const omitted = idsOf(rules.find((rule) => rule.element === el && rule.typeOmitted))
  const anyType = rules.find((rule) => rule.element === el).types[0]
  return [
    [`${el}: type 指定なし`, `<${el} />`, omitted],
    [`${el}: spread だけ`, `<${el} {...props} />`, omitted],
    [`${el}: 値のない type`, `<${el} type />`, omitted],
    [`${el}: type ではない属性`, `<${el} data-type="${anyType}" />`, omitted],
    [`${el}: 属性に渡した JSX の type`, `<${el} aria-label={<span type="${anyType}" />} />`, omitted],
    [`${el}: 式の type`, `<${el} type={type} />`, []],
    [`${el}: 同じ名前の部品`, `<${pascalCase(el)} type="${anyType}" />`, []],
    ...UNLISTED_TYPES.flatMap((type) => [
      [`${el}: 対象外の type="${type}"`, `<${el} type="${type}" />`, []],
      [`${el}: 対象外の type='${type}'`, `<${el} type='${type}' />`, []],
    ]),
  ]
}

const typedElements = [...new Set(rules.filter((rule) => rule.types).map((rule) => rule.element))]

const GENERATED_CASES = [
  ...rules.filter((rule) => !rule.types).flatMap(casesForElementRule),
  ...rules.filter((rule) => rule.types).flatMap(casesForTypedRule),
  ...typedElements.flatMap(casesForTypedElement),
]

// 3. 手書きの例。1 で作れない形だけを書く
const HANDWRITTEN_CASES = [
  ['入れ子の table と button', '<table><tbody><tr><td><button>a</button></td></tr></tbody></table>', [
    'table',
    'button',
  ]],
  ['複数行の input', '<input\n  type="radio"\n  name="a"\n/>', ['inputRadio']],
  ['関係ない要素', '<div><span>a</span></div>', []],
]

const CASES = [...GENERATED_CASES, ...HANDWRITTEN_CASES]

// 2. 総当たり。要素 × 属性 × 書き方のすべての組み合わせを1ファイルに並べる
const allTypes = [...new Set(rules.flatMap((rule) => rule.types ?? [])), ...UNLISTED_TYPES]
const EXHAUSTIVE_ELEMENTS = [...new Set(rules.map((rule) => rule.element)), 'div', 'a', 'Button', 'ui.button']
const EXHAUSTIVE_ATTRIBUTES = [
  '',
  ...allTypes.flatMap((type) => [
    ` type="${type}"`,
    ` type='${type}'`,
    ` type={'${type}'}`,
    ` type="${type.toUpperCase()}"`,
    ` name="a" type="${type}" {...props}`,
    ` aria-label={<span type="${type}" />}`,
  ]),
  ' type',
  ' type={type}',
  ' {...props}',
  ' data-type="checkbox"',
]
const EXHAUSTIVE_LINES = EXHAUSTIVE_ELEMENTS.flatMap((el) =>
  EXHAUSTIVE_ATTRIBUTES.flatMap((attributes) => [
    `<${el}${attributes} />`,
    `<${el}${attributes}>内容</${el}>`,
  ])
)
// Biome は1ファイルの要素が多いと急に遅くなるため、少しずつ別のファイルに分ける
const EXHAUSTIVE_CHUNK_SIZE = 25
const EXHAUSTIVE_CHUNKS = Array.from(
  { length: Math.ceil(EXHAUSTIVE_LINES.length / EXHAUSTIVE_CHUNK_SIZE) },
  (_, index) =>
    EXHAUSTIVE_LINES.slice(index * EXHAUSTIVE_CHUNK_SIZE, (index + 1) * EXHAUSTIVE_CHUNK_SIZE)
)
// 1行目は export、2行目から JSX が並ぶ
const toSource = (jsx) => `export const Example = (props) => (\n  ${jsx.replace(/\n/g, '\n  ')}\n)\n`
// 総当たりの1ファイル分。3行目から各組み合わせが並ぶ
const toExhaustiveSource = (lines) => toSource(['<>', ...lines.map((line) => `  ${line}`), '</>'].join('\n'))

// 抑制コメント。README に書いた書き方で、検出されなくなることを両方で確かめる
const suppressedSource = (comment) =>
  toSource(`<div>\n  {/* ${comment} */}\n  <button type="button">a</button>\n</div>`)
const SUPPRESSED = {
  eslint: suppressedSource('eslint-disable-next-line wip-ui/no-raw-element -- wip-ui に該当なし'),
  biome: suppressedSource('biome-ignore lint/plugin: wip-ui に該当なし'),
}

const linter = new Linter({ configType: 'flat' })
const ESLINT_CONFIG = [
  {
    files: ['**/*.jsx'],
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
  },
  plugin.configs.recommended,
]

const lintWithEslint = (source) =>
  linter
    .verify(source, ESLINT_CONFIG, 'example.jsx')
    .map(({ line, column, endLine, endColumn, message }) => ({
      line,
      column,
      endLine,
      endColumn,
      message,
    }))

// すべての例を1ファイルずつ置き、Biome を1回だけ実行して、ファイルごとの診断を集める
const lintAllWithBiome = (dir, files) => {
  fs.writeFileSync(
    path.join(dir, 'biome.json'),
    JSON.stringify({
      root: true,
      plugins: [GRIT_PATH],
      linter: { rules: { recommended: false } },
      formatter: { enabled: false },
      assist: { enabled: false },
    })
  )
  for (const [file, source] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, file), source)
  }
  const result = spawnSync(
    BIOME_BIN,
    ['lint', '--reporter=github', '--max-diagnostics=none', '.'],
    { cwd: dir, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }
  )
  const byFile = new Map()
  for (const match of result.stdout.matchAll(
    /^::error title=plugin,file=(.+?),line=(\d+),endLine=(\d+),col=(\d+),endColumn=(\d+)::(.*)$/gm
  )) {
    const [, file, line, endLine, column, endColumn, message] = match
    const diagnostics = byFile.get(file) ?? []
    diagnostics.push({
      line: Number(line),
      column: Number(column),
      endLine: Number(endLine),
      endColumn: Number(endColumn),
      message,
    })
    byFile.set(file, diagnostics)
  }
  return byFile
}

const byPosition = (a, b) => a.line - b.line || a.column - b.column

describe('no-raw-element', () => {
  let dir
  let biomeResults

  beforeAll(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wip-ui-lint-'))
    biomeResults = lintAllWithBiome(dir, {
      ...Object.fromEntries(CASES.map(([, jsx], index) => [`case-${index}.jsx`, toSource(jsx)])),
      ...Object.fromEntries(
        EXHAUSTIVE_CHUNKS.map((lines, index) => [`exhaustive-${index}.jsx`, toExhaustiveSource(lines)])
      ),
      'suppressed.jsx': SUPPRESSED.biome,
    })
  })

  afterAll(() => {
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it.each(CASES.map(([name, jsx, ids], index) => ({ name, jsx, ids, index })))(
    '$name: Biome 版と ESLint 版が rules.json どおりに同じ判定をする',
    ({ jsx, ids, index }) => {
      const eslint = lintWithEslint(toSource(jsx)).sort(byPosition)
      const biome = (biomeResults.get(`case-${index}.jsx`) ?? []).sort(byPosition)

      expect(eslint.map(({ message }) => message)).toEqual(ids.map(messageOf))
      expect(biome).toEqual(eslint)
    }
  )

  it(`総当たりの ${EXHAUSTIVE_LINES.length} 通りで、Biome 版と ESLint 版の判定が一致する`, () => {
    // 食い違ったときにどの組み合わせかが分かるように、診断に元の JSX を付けて比べる
    const withSource = (lines) => (diagnostic) => ({ ...diagnostic, jsx: lines[diagnostic.line - 3] })
    const results = EXHAUSTIVE_CHUNKS.map((lines, index) => ({
      eslint: lintWithEslint(toExhaustiveSource(lines)).map(withSource(lines)).sort(byPosition),
      biome: (biomeResults.get(`exhaustive-${index}.jsx`) ?? []).map(withSource(lines)).sort(byPosition),
    }))

    expect(results.flatMap(({ biome }) => biome)).toEqual(results.flatMap(({ eslint }) => eslint))
    // 総当たりの中に、検出されるものとされないものの両方があること（どちらも何も検出しない状態で通らないようにする）
    const detected = results.flatMap(({ eslint }) => eslint).length
    expect(detected).toBeGreaterThan(0)
    expect(detected).toBeLessThan(EXHAUSTIVE_LINES.length)
  })

  it('すべての規則に、検出される例がある', () => {
    const tested = new Set(CASES.flatMap(([, , ids]) => ids))
    expect(rules.map((rule) => rule.id).filter((id) => !tested.has(id))).toEqual([])
  })

  it('抑制コメントで検出しなくなる', () => {
    expect(lintWithEslint(SUPPRESSED.eslint)).toEqual([])
    expect(biomeResults.get('suppressed.jsx') ?? []).toEqual([])
  })

  // 利用側は Biome なら .grit をパスで、ESLint なら wip-ui/lint/eslint を import で読む。どちらも公開物に入っていること
  it('Biome 版と ESLint 版の読み込むファイルが、パッケージに入っている', () => {
    const [{ files }] = JSON.parse(
      execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
        cwd: ROOT,
        encoding: 'utf8',
      })
    )
    const packed = files.map((file) => file.path)
    expect(packed).toEqual(
      expect.arrayContaining([
        'lint/biome/no-raw-element.grit',
        'lint/eslint/index.js',
        'lint/rules.js',
        'lint/rules.json',
      ])
    )
    expect(packed.filter((file) => file.startsWith('lint/__tests__/'))).toEqual([])
  })

  it('wip-ui/lint/eslint として import できる', () => {
    const output = execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        "const { default: plugin } = await import('wip-ui/lint/eslint'); console.log(Object.keys(plugin.rules).join(','))",
      ],
      { cwd: ROOT, encoding: 'utf8' }
    )
    expect(output.trim()).toBe('no-raw-element')
  })
})
