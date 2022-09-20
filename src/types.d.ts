export type Type = 'component' | 'hook'

export type Options = {
  out?: string
  props?: string[]
}

export type Config = {
  componentsPath: string
  hooksPath: string
  withTests: boolean
  withStyles: boolean
  defaultExport: boolean
  typescript: boolean | 'auto'
  formatCmd: string | null
}

export type Parameters = {
  withTests: boolean
  withStyles: boolean
  defaultExport: boolean
  typescript: boolean
  props: string[]
}

export type Result = {
  [path: string]: string
}
