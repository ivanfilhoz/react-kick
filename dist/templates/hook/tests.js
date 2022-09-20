"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (name, { defaultExport }) => `
import { renderHook } from '@testing-library/react-hooks'
import ${defaultExport ? name : `{ ${name} }`} from '.'

test('returns hello', () => {
  const { result } = renderHook(() => ${name}())

  expect(result.current).toMatch(/hello/i)
})
`;
