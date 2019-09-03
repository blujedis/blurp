"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.pkg = utils_1.readPkg();
exports.TRANSPORT_DEFAULTS = {
    transform: true,
    exceptions: false,
    rejections: false
};
exports.PAYLOAD_DEFAULTS = {
    level: 'log',
    message: ''
};
exports.FORMAT_EXP = /%[scdjifoO%]/g;
exports.DEFAULT_LEVELS = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'];
exports.DEFAULT_COLORS = {
    // Levels
    fatal: ['bgRed', 'yellow'],
    error: ['red', 'bold'],
    warn: 'yellow',
    info: 'cyan',
    debug: 'magenta',
    trace: 'blue'
};
//# sourceMappingURL=constants.js.map