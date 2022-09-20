import { Parameters } from '../../src/types'

export default (name: string, { defaultExport }: Parameters) => `
import { renderHook } from '@testing-library/react-hooks'
import ${defaultExport ? name : `{ ${name} }`} from '.'

test('returns hello', () => {
  const { result } = renderHook(() => ${name}())

  expect(result.current).toMatch(/hello/i)
})
`
