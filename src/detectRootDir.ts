import path from 'path'

export default async function detectRootDir () {
  try {
    const { findUp } = await import('find-up')
    const packagePath = await findUp('package.json')
    return path.dirname(packagePath)
  } catch (err) {
    throw new Error('Could not find project root directory.')
  }
}
