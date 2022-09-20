import templates from '../templates'
import { Parameters, Result, Type } from './types'

export default async function generate (
  type: Type,
  name: string,
  params: Parameters
) {
  let generated: Result = {}

  const ext = params.typescript ? 'ts' : 'js'
  const isComponent = type === 'component'

  const render = async (filename: string, template: string) => {
    generated[filename] = templates[type][template](name, params)
  }

  // index file
  render(`index.${ext}`, 'root')

  // main file
  render(
    `${name}.${ext}${isComponent ? 'x' : ''}`,
    type // 'component' | 'hook'
  )

  // test file
  if (params.withTests) {
    render(`${name}.test.${ext}${isComponent ? 'x' : ''}`, 'tests')
  }

  // style file (component only)
  if (isComponent && params.withStyles) {
    render('styles.module.css', 'styles')
  }

  return generated
}
