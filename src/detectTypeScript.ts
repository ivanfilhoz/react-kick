import { readFile } from 'fs/promises'

export default async function detectTypeScript () {
  try {
    const { findUp } = await import('find-up')
    const packagePath = await findUp('package.json')
    const packageContent = await readFile(packagePath)
    const packageJson = JSON.parse(packageContent.toString())

    return (
      'typescript' in packageJson.dependencies ||
      'typescript' in packageJson.devDependencies
    )
  } catch (err) {
    // Silently fails
    return false
  }
}
