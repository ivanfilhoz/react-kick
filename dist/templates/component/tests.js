"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (name, { defaultExport }) => `
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'
import ${defaultExport ? name : `{ ${name} }`} from '.'

test('says hello', () => {
  render(<${name} />)

  expect(screen.getByText(/hello/i)).toBeTruthy()
})
`;
