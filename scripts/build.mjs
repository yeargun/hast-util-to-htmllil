import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import {buildPackage} from './compiler-package.mjs'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
await buildPackage({root,
  profiles: [{name:'public', config:'lilscript.toml'}, {name:'closed', config:'lilscript.closed.toml'}],
  aliases: {'to-html.raw.js':'to-html.esm.js'},
  assets: [{source:'types/to-html.d.ts', destination:'to-html.d.ts'}],
})
