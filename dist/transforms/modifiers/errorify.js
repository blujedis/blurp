"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
const os_1 = require("os");
/**
 * Transforms payloads contianing errors.
 *
 * @example
 * log.transforms.errorify();
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
function errorifyTransform(payload, options) {
    options = Object.assign({ format: 'stack' }, options);
    const { format } = options;
    const { err } = payload[types_1.SOURCE];
    if (!err || format === 'message')
        return payload;
    let msg = err.name + ': ' + err.message; // detail view with name/type.
    if (format === 'stack') {
        msg = err.stack || payload.message;
    }
    else if (format === 'detailstack') {
        // Get stack without first line containing message.
        const stack = err.stack.split(os_1.EOL).slice(1).join(os_1.EOL);
        msg += os_1.EOL + stack;
    }
    payload.message = msg;
    return payload;
}
exports.default = errorifyTransform;
//# sourceMappingURL=errorify.js.map