import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

const ITEMS_DIR = 'C:/Rev Ragezeira/Rev Ragezeira/game/data/xml/items'
const OUTPUT = './api/items-db.json'

const items = {}
let count = 0

const files = readdirSync(ITEMS_DIR).filter(f => f.endsWith('.xml'))

for (const file of files) {
  const content = readFileSync(join(ITEMS_DIR, file), 'utf-8')
  const matches = content.matchAll(/<item id="(\d+)"[^>]*name="([^"]+)"/g)
  for (const [, id, name] of matches) {
    items[id] = name
    count++
  }
}

writeFileSync(OUTPUT, JSON.stringify(items))
console.log(`Extraídos ${count} itens de ${files.length} arquivos → ${OUTPUT}`)
