import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { toHtml as official } from "hast-util-to-html"
import { toHtml } from "../dist/to-html.esm.js"

const flags = ["useNamedReferences", "useShortestReferences", "omitOptionalSemicolons"]
const value = `<>&"'<&a&!&=`

const trees = [
  { type: "text", value },
  { type: "comment", value: ">a<!--b-->" },
  { type: "comment", value, bogus: true },
  {
    type: "element",
    tagName: "x",
    properties: { "a&b": value, title: value },
    children: [],
  },
]

describe("characterReferences", () => {
  for (let mask = 0; mask < 8; mask++) {
    const characterReferences = Object.fromEntries(
      flags.map((flag, index) => [flag, Boolean(mask & (1 << index))]),
    )

    for (const [index, tree] of trees.entries()) {
      for (const preferUnquoted of [false, true]) {
        const options = {
          bogusComments: tree.bogus,
          characterReferences,
          preferUnquoted,
        }
        it(`matches 9.0.5 for flags ${mask}, context ${index}, unquoted ${preferUnquoted}`, () => {
          assert.equal(toHtml(tree, options), official(tree, options))
        })
      }
    }
  }

  it("handles reference termination at string boundaries", () => {
    for (const character of [`"`, "'", "&", "<", ">", "\0", "\t", "\n", "\f", "\r", " "]) {
      const tree = {
        type: "element",
        tagName: "x",
        properties: { title: character },
        children: [],
      }
      for (let mask = 0; mask < 8; mask++) {
        const characterReferences = Object.fromEntries(
          flags.map((flag, index) => [flag, Boolean(mask & (1 << index))]),
        )
        const options = { characterReferences }
        assert.equal(toHtml(tree, options), official(tree, options))
      }
    }
  })

  it("ignores inherited character-reference settings", () => {
    const characterReferences = Object.create({ useNamedReferences: true })
    const options = { characterReferences }
    const tree = { type: "text", value: "<&" }
    assert.equal(toHtml(tree, options), official(tree, options))
  })

  it("matches option and nested proxy evaluation order", () => {
    function observe(serializer) {
      const trace = []
      const characterReferences = new Proxy(
        { useNamedReferences: true },
        {
          ownKeys(target) {
            trace.push("characterReferences:ownKeys")
            return Reflect.ownKeys(target)
          },
          getOwnPropertyDescriptor(target, key) {
            trace.push(`characterReferences:descriptor:${String(key)}`)
            return Reflect.getOwnPropertyDescriptor(target, key)
          },
          get(target, key, receiver) {
            trace.push(`characterReferences:get:${String(key)}`)
            return Reflect.get(target, key, receiver)
          },
        },
      )
      const options = new Proxy(
        { characterReferences },
        {
          get(target, key, receiver) {
            trace.push(`options:get:${String(key)}`)
            return Reflect.get(target, key, receiver)
          },
        },
      )
      const output = serializer({ type: "text", value: "<&" }, options)
      return { output, trace }
    }

    assert.deepEqual(observe(toHtml), observe(official))
  })
})
