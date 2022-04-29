import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'
import renderTemplate from './renderTemplate'

const readFile = promisify(fs.readFile)
const templatesPath = path.join(__dirname, '..', 'templates')

export default async function generate (
  type: Type,
  name: string,
  props: string[],
  options: Options
) {
  let generated = {}

  const ext = options.typescript ? 'ts' : 'js'
  const pathPrefix = {
    component: options.componentsPath,
    hook: options.hooksPath
  }[type]
  const outputPath = path.join(pathPrefix, name)
  const placeholder = {
    component: 'Placeholder',
    hook: 'usePlaceholder'
  }[type]
  const placeholderReplacer = { [placeholder]: name }

  const getTemplate = async (name: string) => {
    const buffer = await readFile(path.join(templatesPath, type, name))
    return buffer.toString()
  }
  const addFile = async (name: string, content: string) => {
    generated[path.join(outputPath, name)] = content
  }

  // index file
  addFile(
    `index.${ext}`,
    renderTemplate({
      template: await getTemplate('index.js'),
      replace: placeholderReplacer
    })
  )

  // main file
  const templateFile = {
    component: options.withStyles
      ? `${placeholder}WithStyles.jsx`
      : `${placeholder}.jsx`,
    hook: `${placeholder}.js`
  }[type]
  const outputFile = {
    component: `${name}.${ext}x`,
    hook: `${name}.${ext}`
  }[type]
  const typesTemplate = await getTemplate(
    options.typescript ? 'types.ts' : 'propTypes.js'
  )

  addFile(
    outputFile,
    renderTemplate({
      template: await getTemplate(templateFile),
      replace: placeholderReplacer,
      blocks: {
        component: line =>
          props.length ? line.replace('()', `({ ${props.join(', ')} })`) : line,
        types: () => {
          if (!options.typescript) return
          return renderTemplate({
            template: typesTemplate,
            blocks: {
              placeholder: line =>
                props.length
                  ? props.map(prop => `${prop}: any`).join('\n')
                  : line
            }
          })
        },
        propTypes: () => {
          if (options.typescript) return
          return renderTemplate({
            template: typesTemplate,
            blocks: {
              placeholder: line =>
                props.length
                  ? props.map(prop => `${prop}: PropTypes.any`).join(',\n')
                  : line
            }
          })
        },
        imports: () => {
          if (options.typescript) return
          let importLine: string
          renderTemplate({
            template: typesTemplate,
            blocks: {
              import: line => {
                importLine = line
                return line
              }
            }
          })
          return importLine
        }
      }
    })
  )

  // test file
  if (options.withTests) {
    addFile(
      `${name}.test.${ext}`,
      renderTemplate({
        template: await getTemplate(`${placeholder}.test.js`),
        replace: placeholderReplacer
      })
    )
  }

  // style file (component only)
  if (type === 'component' && options.withStyles) {
    addFile(
      'styles.module.css',
      renderTemplate({
        template: await getTemplate('styles.module.css')
      })
    )
  }

  return generated
}
