import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'
import Placeholder from '.'

test('says hello', () => {
  render(<Placeholder />)

  expect(screen.getByText(/hello/i)).toBeTruthy()
})
