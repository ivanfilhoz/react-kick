"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blockPattern = /^(.*) *\/\/ block:(.+) *$/gm;
function renderTemplate({ template, replace = {}, blocks = {} }) {
    var _a;
    let render = template;
    for (const key in replace) {
        render = render.replace(new RegExp(key, 'g'), replace[key]);
    }
    const matches = render.matchAll(blockPattern);
    let match = matches.next();
    while (!match.done) {
        const [fullLine, codeLine, blockName] = match.value;
        const blockFn = blocks[blockName];
        const codeReplace = (_a = blockFn === null || blockFn === void 0 ? void 0 : blockFn(codeLine)) !== null && _a !== void 0 ? _a : codeLine;
        render = render.replace(fullLine, codeReplace);
        match = matches.next();
    }
    return render;
}
exports.default = renderTemplate;
