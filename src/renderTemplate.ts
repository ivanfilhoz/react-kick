type Params = {
  template: string
  replace?: { [key: string]: string | undefined }
  blocks?: { [key: string]: (line: string) => string }
}

const blockPattern = /^(.*) *\/\/ block:(.+) *$/gm

export default function renderTemplate ({
  template,
  replace = {},
  blocks = {}
}: Params) {
  let render = template

  for (const key in replace) {
    render = render.replace(new RegExp(key, 'g'), replace[key])
  }

  const matches = render.matchAll(blockPattern)
  let match = matches.next()
  while (!match.done) {
    const [fullLine, codeLine, blockName] = match.value
    const blockFn = blocks[blockName]
    const codeReplace = blockFn?.(codeLine) ?? codeLine
    render = render.replace(fullLine, codeReplace)
    match = matches.next()
  }

  return render
}
