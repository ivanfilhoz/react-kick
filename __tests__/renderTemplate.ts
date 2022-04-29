import renderTemplate from '../src/renderTemplate'

test('replaces placeholder correctly', () => {
  const content = renderTemplate({
    template: `
      export { default } from './Placeholder'
      export * from './Placeholder'
    `,
    replace: { Placeholder: 'MyComponent' }
  })

  expect(content).not.toMatch(/Placeholder/g)
})

test('handles block rules', () => {
  const content = renderTemplate({
    template: 'const foo = "bar" // block:foo',
    blocks: { foo: line => line.replace('bar', 'baz') }
  })

  expect(content).toMatch(/baz/g)
})

test('strips out block comments', () => {
  const content = renderTemplate({
    template: '// block:foo'
  })

  expect(content).toBeFalsy()
})
