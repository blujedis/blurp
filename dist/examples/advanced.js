"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require("../"));
const { stack } = __1.default.transforms;
const logger = __1.default.createLogger('app', {
    level: 'info',
    levels: ['error', 'warn', 'info', 'debug'],
    transports: [
        new __1.default.ConsoleTransport(),
        new __1.default.FileTransport({
            level: 'error',
            exceptions: true,
            rejections: true,
            onRotate: ((oldFile, newFile) => {
                // do something like gzip/archive old file etc.
            })
        })
    ],
    transforms: [
        stack.terminal()
    ],
    errorExit: true,
});
//# sourceMappingURL=advanced.js.map