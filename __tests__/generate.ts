import generate from '../src/generate'
import { Parameters } from '../src/types'

const testParams: Parameters = {
  defaultExport: true,
  withStyles: true,
  withTests: true,
  typescript: true,
  props: []
}

test('generates a CSS module', async () => {
  const generated = await generate('component', 'Foo', testParams)
  const key = Object.keys(generated).find(key => key.endsWith('.module.css'))

  expect(key).toBeTruthy()
})

test('generates a test example', async () => {
  const generated = await generate('component', 'Foo', testParams)
  const key = Object.keys(generated).find(key => key.endsWith('.test.tsx'))

  expect(key).toBeTruthy()
})

test('generates an index file', async () => {
  const generated = await generate('component', 'Foo', testParams)
  const key = Object.keys(generated).find(key => key.endsWith('index.ts'))

  expect(key).toBeTruthy()
})

test('ignores typescript if specified in config', async () => {
  const generated = await generate('component', 'Foo', {
    ...testParams,
    typescript: false
  })
  const key = Object.keys(generated).find(key => key.endsWith('.jsx'))

  expect(key).toBeTruthy()
})

test('adds props if specified in parameters', async () => {
  const generated = await generate('component', 'Foo', {
    ...testParams,
    props: ['myTestProp']
  })
  const key = Object.keys(generated).find(key => key.endsWith('.tsx'))
  const content = generated[key]

  expect(content).toMatch(/\(\{.*myTestProp.*\}: Props\)/g)
})
