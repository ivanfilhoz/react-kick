"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (name, { defaultExport }) => `
export${defaultExport ? ' default' : ''}  function ${name}() {
  return 'Hello World!'
}
`;
