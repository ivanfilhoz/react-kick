import { Parameters } from '../../src/types'

export default (name: string, { defaultExport }: Parameters) => `
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'
import ${defaultExport ? name : `{ ${name} }`} from '.'

test('says hello', () => {
  render(<${name} />)

  expect(screen.getByText(/hello/i)).toBeTruthy()
})
`
