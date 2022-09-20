import path from 'path'

export default function handleNamePrefix (nameWithPrefix: string) {
  const [...prefix] = nameWithPrefix.split(path.delimiter)
  const name = prefix.pop()

  return { prefix, name }
}
