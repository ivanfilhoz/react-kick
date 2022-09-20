"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
function validateName(type, name) {
    if (type !== 'component' && type !== 'hook') {
        throw new Error(`Invalid entity type. Use either ${chalk_1.default.cyan('component')} or ${chalk_1.default.cyan('hook')}.`);
    }
    if (!name) {
        throw new Error(`Please provide a name for your ${type}. Example: ${chalk_1.default.cyan('rg component Hello')}`);
    }
    if (!name.match(/^[\w/\\]+$/)) {
        throw new Error(`Symbols in the ${type} name are not supported. Use only letters, numbers and slashes (/).`);
    }
    if (type === 'hook' &&
        !name
            .split('/')
            .at(-1)
            .startsWith('use')) {
        throw new Error(`Hooks must start with 'use'. Example: ${chalk_1.default.cyan('useHello')}`);
    }
}
exports.default = validateName;
