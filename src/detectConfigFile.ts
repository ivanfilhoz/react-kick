import { readFile } from 'fs/promises'
import { Config } from './types'

export default async function detectConfigFile () {
  const { findUp } = await import('find-up')
  const path = await findUp(['.kickrc', '.kickrc.json'])
  const content = await readFile(path)

  try {
    return JSON.parse(content.toString()) as Config
  } catch (err) {
    throw new Error('Configuration file is invalid.')
  }
}
