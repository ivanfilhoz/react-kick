"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (name, { defaultExport }) => `
export * from './${name}'
${defaultExport ? `export { default } from './${name}'` : ''}
`;
