# @itslil/hast-util-to-html

Official [`hast-util-to-html@9.0.5`](https://github.com/syntax-tree/hast-util-to-html) algorithms rewritten in LilScript. Official test suite 389/389. Not affiliated with upstream.

**Site:** [yeargun.github.io/hast-util-to-htmllil/](https://yeargun.github.io/hast-util-to-htmllil/)

```sh
npm install @itslil/hast-util-to-html
```

Two compiles ship from the same `.lil` source:

| Lane | Config | Meaning |
| --- | --- | --- |
| **library** (npm) | `lilscript.toml` · `--target js-module` | reusable ESM. Export names and `extern class` keys stay. |
| **closed** | `lilscript.closed.toml` · `--target js-module` | closed LilScript world. `extern class` keys may mangle. ESM export names stay so the lane is testable. |

You publish the library lane. The closed artifact is `dist/to-html.closed.js`.

The LilScript compiler lives next door at `../lilscript`.
