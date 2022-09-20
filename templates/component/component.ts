import { Parameters } from '../../src/types'

export default (
  name: string,
  { props, withStyles, typescript, defaultExport }: Parameters
) => {
  const hasTypes = props.length && typescript
  const hasPropTypes = props.length && !typescript

  let propsBlock = props.length
    ? `{ ${props.map(prop => prop).join(', ')} }`
    : ''

  if (propsBlock && typescript) {
    propsBlock += ': Props'
  }

  return `
import React from 'react'
${withStyles ? "import styles from './styles.module.css'" : ''}
${hasPropTypes ? "import PropTypes from 'prop-types'" : ''}

${
  hasTypes
    ? `
type Props = {
  ${props.map(prop => `${prop}: any`).join('\n')}
}
`
    : ''
}

export${defaultExport ? ' default' : ''} function ${name} (${propsBlock}) {
  return <div${
    withStyles ? ' className={styles.wrapper}' : ''
  }>Hello World!</div>
}

${
  hasPropTypes
    ? `
${name}.propTypes = {
  ${props.map(prop => `${prop}: PropTypes.any,`).join('\n')}
}
`
    : ''
}
`
}
