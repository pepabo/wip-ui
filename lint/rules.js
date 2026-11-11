// lint の判定の元データ（rules.json）を読み、Biome 版と ESLint 版で共通に使う形にする
import * as fs from 'node:fs'

export const { rules } = JSON.parse(
  fs.readFileSync(new URL('./rules.json', import.meta.url), 'utf8')
)

// メッセージの末尾に、使うコンポーネントの md（wip-ui パッケージ内のパス）を付ける
export const formatMessage = (rule) => `${rule.message}使い方: wip-ui/${rule.doc}`

// 判定に使う項目は、Biome 版の生成・ESLint 版・テストのすべてが対応しているものだけにする。
// 新しい条件を足すときは、ここと3か所すべてを直す（どこかが知らない条件を黙って無視しないようにするため）
const REQUIRED_KEYS = ['id', 'element', 'component', 'message', 'doc']
const OPTIONAL_KEYS = ['label', 'types', 'typeOmitted']

const validate = () => {
  const errors = []
  const ids = new Set()
  for (const rule of rules) {
    const name = rule.id ?? JSON.stringify(rule)
    for (const key of REQUIRED_KEYS) {
      if (typeof rule[key] !== 'string' || rule[key] === '') errors.push(`${name}: ${key} がありません`)
    }
    for (const key of Object.keys(rule)) {
      if (!REQUIRED_KEYS.includes(key) && !OPTIONAL_KEYS.includes(key)) {
        errors.push(`${name}: 知らない項目 ${key} があります`)
      }
    }
    // Biome（2.3 時点）は GritQL の文字列の \" を最初の1つしか戻さないため、" と \ はメッセージに使えない
    if (/["\\]/.test(formatMessage(rule))) {
      errors.push(`${name}: message と doc に " と \\ は使えません（「」などを使ってください）`)
    }
    if (ids.has(rule.id)) errors.push(`${name}: id が重複しています`)
    ids.add(rule.id)
    if (rule.types !== undefined) {
      if (!Array.isArray(rule.types) || rule.types.length === 0) {
        errors.push(`${name}: types は1つ以上の文字列の配列にしてください`)
      }
    } else if (rule.typeOmitted !== undefined) {
      errors.push(`${name}: typeOmitted は types と一緒に使ってください`)
    }
  }
  // 1つの要素に当たる規則が1つに決まるようにする（規則の並び順で判定が変わらないようにするため）
  for (const element of new Set(rules.map((rule) => rule.element))) {
    const sameElement = rules.filter((rule) => rule.element === element)
    if (sameElement.some((rule) => !rule.types) && sameElement.length > 1) {
      errors.push(`${element}: type で絞らない規則は、同じ要素に1つだけにしてください`)
    }
    const types = sameElement.flatMap((rule) => (Array.isArray(rule.types) ? rule.types : []))
    const duplicated = types.filter((type, index) => types.indexOf(type) !== index)
    if (duplicated.length > 0) errors.push(`${element}: type ${duplicated.join(', ')} が複数の規則にあります`)
    if (sameElement.filter((rule) => rule.typeOmitted).length > 1) {
      errors.push(`${element}: typeOmitted は同じ要素に1つだけにしてください`)
    }
  }
  if (errors.length > 0) throw new Error(`lint/rules.json が不正です\n${errors.join('\n')}`)
}

validate()

