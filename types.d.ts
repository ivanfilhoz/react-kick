type Type = 'component' | 'hook'
type Options = {
  componentsPath: string
  hooksPath: string
  withTests: boolean
  withStyles: boolean
  defaultExport: boolean
  typescript: boolean
  formatCmd: string | null
}
