import defaultOptions from '../.reactgenrc.json'
import generate from '../src/generate'

const testOptions: Options = {
  ...defaultOptions,
  typescript: true
}

test('generates a CSS module', async () => {
  const generated = await generate('component', 'Foo', [], testOptions)
  const key = Object.keys(generated).find(key => key.endsWith('.module.css'))

  expect(key).toBeTruthy()
})

test('generates a test example', async () => {
  const generated = await generate('component', 'Foo', [], testOptions)
  const key = Object.keys(generated).find(key => key.endsWith('.test.ts'))

  expect(key).toBeTruthy()
})

test('generates an index file', async () => {
  const generated = await generate('component', 'Foo', [], testOptions)
  const key = Object.keys(generated).find(key => key.endsWith('index.ts'))

  expect(key).toBeTruthy()
})

test('ignores typescript if specified in config', async () => {
  const generated = await generate('component', 'Foo', [], {
    ...testOptions,
    typescript: false
  })
  const key = Object.keys(generated).find(key => key.endsWith('.jsx'))

  expect(key).toBeTruthy()
})

test('adds props if specified in parameters', async () => {
  const generated = await generate(
    'component',
    'Foo',
    ['myTestProp'],
    testOptions
  )
  const key = Object.keys(generated).find(key => key.endsWith('.tsx'))
  const content = generated[key]

  expect(content).toMatch(/\(\{.*myTestProp.*\}\)/g)
})
