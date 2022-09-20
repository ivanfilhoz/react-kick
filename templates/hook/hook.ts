import { Parameters } from '../../src/types'

export default (name: string, { defaultExport }: Parameters) => `
export${defaultExport ? ' default' : ''}  function ${name}() {
  return 'Hello World!'
}
`
