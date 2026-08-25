export interface Options {
  allowDangerousHtml?: boolean | null
  closeSelfClosing?: boolean | null
}

export function toHtml(tree: unknown, options?: Options | null): string
export default toHtml
