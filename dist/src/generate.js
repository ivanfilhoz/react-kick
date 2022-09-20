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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const templates_1 = __importDefault(require("../templates"));
function generate(type, name, params) {
    return __awaiter(this, void 0, void 0, function* () {
        let generated = {};
        const ext = params.typescript ? 'ts' : 'js';
        const isComponent = type === 'component';
        const render = (filename, template) => __awaiter(this, void 0, void 0, function* () {
            generated[filename] = templates_1.default[type][template](name, params);
        });
        // index file
        render(`index.${ext}`, 'root');
        // main file
        render(`${name}.${ext}${isComponent ? 'x' : ''}`, type // 'component' | 'hook'
        );
        // test file
        if (params.withTests) {
            render(`${name}.test.${ext}${isComponent ? 'x' : ''}`, 'tests');
        }
        // style file (component only)
        if (isComponent && params.withStyles) {
            render('styles.module.css', 'styles');
        }
        return generated;
    });
}
exports.default = generate;
