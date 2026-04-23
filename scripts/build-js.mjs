import { execSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT_DIR = path.join(ROOT, 'dist', 'js')

fs.rmSync(OUT_DIR, { recursive: true, force: true })

console.log('Compiling TypeScript...')
execSync('tsc -p tsconfig.build.json', { stdio: 'inherit', cwd: ROOT })

console.log('Stripping SCSS imports from compiled output...')
const SCSS_IMPORT_PATTERN = /^\s*import\s+['"][^'"]+\.scss['"]\s*;?\s*\r?\n/gm

let strippedCount = 0
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(fullPath)
    } else if (entry.isFile() && (fullPath.endsWith('.js') || fullPath.endsWith('.d.ts'))) {
      const original = fs.readFileSync(fullPath, 'utf8')
      const stripped = original.replace(SCSS_IMPORT_PATTERN, '')
      if (stripped !== original) {
        fs.writeFileSync(fullPath, stripped)
        strippedCount++
      }
    }
  }
}
walk(OUT_DIR)

console.log(`Done. Stripped SCSS imports from ${strippedCount} file(s).`)
