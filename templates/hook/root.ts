import { Parameters } from '../../src/types'

export default (name: string, { defaultExport }: Parameters) => `
export * from './${name}'
${defaultExport ? `export { default } from './${name}'` : ''}
`
