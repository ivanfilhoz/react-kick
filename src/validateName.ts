import chalk from 'chalk'
import { Type } from './types'

export default function validateName (type: Type, name: string) {
  if (type !== 'component' && type !== 'hook') {
    throw new Error(
      `Invalid entity type. Use either ${chalk.cyan(
        'component'
      )} or ${chalk.cyan('hook')}.`
    )
  }

  if (!name) {
    throw new Error(
      `Please provide a name for your ${type}. Example: ${chalk.cyan(
        'rg component Hello'
      )}`
    )
  }

  if (!name.match(/^[\w/\\]+$/)) {
    throw new Error(
      `Symbols in the ${type} name are not supported. Use only letters, numbers and slashes (/).`
    )
  }

  if (
    type === 'hook' &&
    !name
      .split('/')
      .at(-1)!
      .startsWith('use')
  ) {
    throw new Error(
      `Hooks must start with 'use'. Example: ${chalk.cyan('useHello')}`
    )
  }
}
