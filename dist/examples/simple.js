"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require("../"));
const { stack } = __1.default.transforms;
const logger = __1.default.createLogger('app', {
    transports: [
        new __1.default.ConsoleTransport()
    ],
    transforms: [
        stack.terminal()
    ]
});
//# sourceMappingURL=simple.js.map