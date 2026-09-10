# @itslil/hast-util-to-html

<!-- current-build-audit -->
**Build audit, 2026-09-10:** [verified; compiler, machine, build times, version gaps and behavior checks](https://yeargun.github.io/hast-util-to-htmllil/#build-audit). The [JSON receipt](site/build-audit.json) records the current comparison; older benchmark prose retains its original scope.


Official [`hast-util-to-html@9.0.5`](https://github.com/syntax-tree/hast-util-to-html) algorithms rewritten in LilScript. Official test suite 381/381. Not affiliated with upstream.

**Site:** [yeargun.github.io/hast-util-to-htmllil/](https://yeargun.github.io/hast-util-to-htmllil/)

```sh
npm install @itslil/hast-util-to-html
```

Two compiles ship from the same `.lil` source:

| Lane | Config | Meaning |
| --- | --- | --- |
| **library** (npm) | `lilscript.toml` · `--target js-module` | reusable ESM. Export names and `extern class` keys stay. |
| **closed** | `lilscript.closed.toml` · `--target js-module` | closed LilScript world. `extern class` keys may mangle. ESM export names stay so the lane is testable. |

You publish the library lane. `dist/to-html.closed.js` is diagnostic only.

The LilScript compiler lives next door at `../lilscript`.
