import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { describe, it } from "node:test"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const library = await import("../dist/to-html.esm.js")
const { toHtml } = library

const hi = {
  type: "element",
  tagName: "p",
  properties: {},
  children: [{ type: "text", value: "hi" }],
}

describe("@itslil/hast-util-to-html library", () => {
  it("exports toHtml and default", () => {
    assert.equal(typeof toHtml, "function")
    assert.equal(library.default, toHtml)
  })

  it("keeps pinned option and tree keys in the library artifact", () => {
    const source = readFileSync(resolve(root, "dist/to-html.esm.js"), "utf8")
    assert.match(source, /allowDangerousHtml/)
    assert.match(source, /closeSelfClosing/)
    assert.match(source, /\.type\b/)
    assert.match(source, /export\{[^}]*\btoHtml\b/)
  })

  it("serializes a hast fixture to html", () => {
    assert.equal(toHtml(hi), "<p>hi</p>")
    assert.equal(toHtml({ type: "root", children: [hi] }), "<p>hi</p>")
  })

  it("escapes text and attributes", () => {
    assert.equal(toHtml({ type: "text", value: "a&b<c>\"d" }), "a&amp;b&lt;c&gt;&quot;d")
    assert.equal(
      toHtml({
        type: "element",
        tagName: "a",
        properties: { href: "x&y", title: "<t>" },
        children: [],
      }),
      "<a href=\"x&amp;y\" title=\"&lt;t&gt;\"></a>",
    )
  })

  it("joins className and emits boolean and void markup", () => {
    assert.equal(
      toHtml({
        type: "element",
        tagName: "code",
        properties: { className: ["language-js", "ok"] },
        children: [],
      }),
      "<code class=\"language-js ok\"></code>",
    )
    assert.equal(
      toHtml({
        type: "element",
        tagName: "input",
        properties: { type: "checkbox", disabled: true, checked: true },
        children: [],
      }),
      "<input type=\"checkbox\" disabled checked>",
    )
    assert.equal(
      toHtml({ type: "element", tagName: "br", properties: {}, children: [] }),
      "<br>",
    )
    assert.equal(
      toHtml({ type: "element", tagName: "br", properties: {}, children: [] }, { closeSelfClosing: true }),
      "<br />",
    )
  })

  it("emits raw only when allowDangerousHtml is set", () => {
    const raw = { type: "raw", value: "<em>x</em>" }
    assert.equal(toHtml(raw), "")
    assert.equal(toHtml(raw, { allowDangerousHtml: true }), "<em>x</em>")
  })
})

describe("@itslil/hast-util-to-html closed lane", () => {
  it("exists and still serializes a tree", async () => {
    const closedPath = resolve(root, "dist/to-html.closed.js")
    assert.equal(existsSync(closedPath), true)
    const closed = await import(pathToFileURL(closedPath).href)
    assert.equal(typeof closed.toHtml, "function")
    assert.equal(closed.toHtml(hi), "<p>hi</p>")
  })
})
