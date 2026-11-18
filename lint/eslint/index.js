// wip-ui に置き換え先が1対1で決まっている素の HTML 要素を検出する ESLint プラグイン（flat config 用）
// 判定とメッセージは lint/rules.json から作り、Biome 版（lint/biome/no-raw-element.grit）と揃える
import * as fs from 'node:fs'

import { formatMessage, rules } from '../rules.js'

const { version } = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8'))

// 要素名ごとの規則。rules.js の検査で、1つの要素に当たる規則は並び順によらず1つに決まる
const rulesByElement = new Map()
for (const rule of rules) {
  rulesByElement.set(rule.element, [...(rulesByElement.get(rule.element) ?? []), rule])
}

// JSX の type 属性の値。値なし（<input type />）は null、式（type={t}）は式のノード
const typeAttributeValues = (openingElement) =>
  openingElement.attributes
    .filter(
      (attribute) =>
        attribute.type === 'JSXAttribute' &&
        attribute.name.type === 'JSXIdentifier' &&
        attribute.name.name === 'type'
    )
    .map((attribute) => attribute.value)

// Biome 版に合わせて、type で絞る規則は自己終了タグ（<input ... />）だけを対象にし、
// type は文字列リテラルだけを見る（type={'checkbox'} などの式は判定しない）
const findTypedRule = (candidates, openingElement) => {
  if (!openingElement.selfClosing) return undefined
  const values = typeAttributeValues(openingElement)
  const literals = values.filter((value) => value?.type === 'Literal').map((value) => value.value)
  return candidates.find(
    (rule) =>
      literals.some((literal) => rule.types.includes(literal)) ||
      (rule.typeOmitted && values.every((value) => value === null))
  )
}

const noRawElement = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'wip-ui のコンポーネントで置き換えられる素の HTML 要素を禁止する',
      url: 'https://github.com/pepabo/wip-ui/tree/main/lint',
    },
    schema: [],
    messages: Object.fromEntries(rules.map((rule) => [rule.id, formatMessage(rule)])),
  },
  create(context) {
    return {
      JSXElement(node) {
        const { openingElement } = node
        if (openingElement.name.type !== 'JSXIdentifier') return
        const candidates = rulesByElement.get(openingElement.name.name)
        if (!candidates) return
        const rule = candidates[0].types ? findTypedRule(candidates, openingElement) : candidates[0]
        if (rule) context.report({ node, messageId: rule.id })
      },
    }
  },
}

const plugin = {
  meta: { name: 'wip-ui', version },
  rules: { 'no-raw-element': noRawElement },
  configs: {},
}

plugin.configs.recommended = {
  plugins: { 'wip-ui': plugin },
  rules: { 'wip-ui/no-raw-element': 'error' },
}

export default plugin
