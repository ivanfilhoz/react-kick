# React Kick

⚡️ An opinionated CLI that generates boilerplate code instantly.

## Why
Even if your IDE has snippets, creating new components is still a boring, repetitive task that requires several files to be manually created. React Kick automates this task, sparing you from the tedium of copy-pasting repetitive code into your editor.

This tool aims to encourage you as a developer to create more components, each one with its purpose, leveraging the power of React the right way. It also suggests battle-tested patterns that I recommend you adopt in your project.

With a single command, you'll be able to generate the files in the appropriate filename structure and importing scheme to get you started quickly.

## Install

```bash
npm install -g react-kick
```

## Overview

Let's create a new component named `Greeting`. Run the following command:

```bash
$ rk component Greeting
```

You will notice that a new folder was created at `src/components/Greeting` along with the following files:

```js
// index.js
export { default } from './Greeting'
export * from './Greeting'
```

```jsx
// Greeting.jsx
import React from 'react'
import styles from './styles.module.css'

export default function Greeting () {
  return <div className={styles.wrapper}>Hello World!</div>
}
```

```jsx
// Greeting.test.js
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Greeting from '.'

test('says hello', () => {
  render(<Greeting />)

  expect(screen.getByText(/hello/i)).toBeTruthy()
})
```

```css
/* styles.module.css */
.wrapper {
  position: relative;
}
```

If you have `prettier` installed, the files will be formatted accordingly.

## Commands

### `rk component <name> [props...]`
Generates a component in the `src/components` folder.

Aliases: `rk c <name> [props...]`

### `rk hook <name>`
Generates a custom hook in the `src/hooks` folder.

Aliases: `rk h <name>`

## Options

### `--out [path]`
Forces a different output path.

Aliases: `-o [path]`

## Configuration
If you need to customize the settings, just create a `.kickrc` or `.kickrc.json` file in your project root folder, specifying only the properties you need to change.

The default settings are:
```jsonc
// .kickrc
{
  "componentsPath": "src/components", // path to components
  "hooksPath": "src/hooks", // path to hooks
  "withTests": true, // include test example
  "withStyles": true, // include CSS module
  "defaultExport": true, // export as default
  "typescript": "auto", // bool | "auto" (detects automatically)
  "formatCmd": "prettier --write", // string | null
}
```

## Examples

### Creating a component with props
```bash
$ rk component Input value onChange

# Output
└── components
    └── Input
        ├── index.js
        ├── Input.jsx
        ├── Input.test.js
        └── styles.module.css
```

### Creating an [atom](https://github.com/danilowoz/react-atomic-design)
```bash
$ rk component atoms/Button

# Output
└── components
    └── atoms
        └── Button
            ├── Button.jsx
            ├── Button.test.js
            ├── index.js
            └── styles.module.css
```

### Creating a custom hook
```bash
$ rk hook useProducts

# Output
└── hooks
    └── useProducts
        ├── index.js
        ├── useProducts.js
        └── useProducts.test.js
```

# To Do
- Support other styling options (i.e. makeStyles, styled-components);
- Support plugins to extend functionality (i.e. extra commands and/or options);

# Thanks
This program is inspired by some great people who write some great stuff:

- [Delightful React File/Directory Structure](https://www.joshwcomeau.com/react/file-structure/) by [@johnwcomeau](https://github.com/joshwcomeau)
- [Atomic Design and ReactJS](https://danilowoz.com/blog/atomic-design-with-react) by [@danilowoz](https://github.com/danilowoz)
- [React Architecture Patterns for Your Projects](https://blog.openreplay.com/react-architecture-patterns-for-your-projects) by [@amanhimself](https://medium.com/@amanhimself)

The list will be continuously updated with the references from which I borrow concepts and ideas.

# License
MIT