import { access } from 'fs/promises'

export default async function folderExists (folderPath: string) {
  return access(folderPath)
    .then(() => true)
    .catch(() => false)
}
