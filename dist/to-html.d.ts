export interface Options {
  allowDangerousCharacters?: boolean | null
  allowDangerousHtml?: boolean | null
  allowParseErrors?: boolean | null
  bogusComments?: boolean | null
  characterReferences?: Record<string, unknown> | null
  closeEmptyElements?: boolean | null
  closeSelfClosing?: boolean | null
  collapseEmptyAttributes?: boolean | null
  omitOptionalTags?: boolean | null
  preferUnquoted?: boolean | null
  quote?: '"' | "'" | null
  quoteSmart?: boolean | null
  space?: "html" | "svg" | null
  tightAttributes?: boolean | null
  tightCommaSeparatedLists?: boolean | null
  tightDoctype?: boolean | null
  tightSelfClosing?: boolean | null
  upperDoctype?: boolean | null
  voids?: ReadonlyArray<string> | null
}

export function toHtml(tree: unknown, options?: Options | null): string
