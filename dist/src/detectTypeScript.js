"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
function detectTypeScript() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { findUp } = yield import('find-up');
            const packagePath = yield findUp('package.json');
            const packageContent = yield (0, promises_1.readFile)(packagePath);
            const packageJson = JSON.parse(packageContent.toString());
            return ('typescript' in packageJson.dependencies ||
                'typescript' in packageJson.devDependencies);
        }
        catch (err) {
            // Silently fails
            return false;
        }
    });
}
exports.default = detectTypeScript;
