import { renderHook } from '@testing-library/react-hooks'
import usePlaceholder from '.'

test('returns hello', () => {
  const { result } = renderHook(() => usePlaceholder())

  expect(result.current).toMatch(/hello/i)
})
