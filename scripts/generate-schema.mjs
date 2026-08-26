import { writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { html, svg } from "/tmp/package/index.js"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")

function flagsOf(info) {
  let flags = ""
  if (info.boolean) flags += "b"
  if (info.overloadedBoolean) flags += "o"
  if (info.spaceSeparated) flags += "s"
  if (info.commaSeparated) flags += "c"
  return flags
}

function dump(schema) {
  const lines = []
  for (const [property, info] of Object.entries(schema.property)) {
    lines.push(`${property}|${info.attribute}|${flagsOf(info)}`)
  }
  return lines.join("\n")
}

function lilString(value) {
  return `"${value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, "\\\"")
    .replace(/\n/g, "\\n")}"`
}

const source = `export string htmlSchemaBlob = ${lilString(dump(html))};

export string svgSchemaBlob = ${lilString(dump(svg))};
`

writeFileSync(resolve(root, "src/schema_data.lil"), source)
console.log(`html props ${Object.keys(html.property).length}, svg props ${Object.keys(svg.property).length}`)
