"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function clearLines(count) {
    for (let i = 0; i < count; i++) {
        process.stdout.moveCursor(0, -1);
        process.stdout.clearLine(1);
    }
}
exports.default = clearLines;
