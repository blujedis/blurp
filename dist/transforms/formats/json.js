"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const fast_safe_stringify_1 = __importDefault(require("fast-safe-stringify"));
/**
 * Formats output for console/terminal using JSON.
 * @see https://www.npmjs.com/package/fast-safe-stringify
 *
 * @example
 * log.transforms.json({ stable: true }); // alpha orders props.
 *
 * @param payload the current modified payload.
 * @param options the format's options.
 */
function jsonFormat(payload, options) {
    options = Object.assign({ space: 0, stable: false }, options);
    const { stable, space, replacer, props, exclude } = options;
    const _replacer = replacer || ((key, value) => {
        if (value === '[Circular]') // ignore circular.
            return;
        if (value instanceof Buffer)
            return value.toString('base64');
        if (typeof value === 'bigint')
            return value.toString();
        return value;
    });
    const stringifier = stable ? fast_safe_stringify_1.default.stableStringify : fast_safe_stringify_1.default;
    if (!props)
        return stringifier(payload, _replacer, space);
    return stringifier(utils_1.reducePayload(payload, props, exclude), _replacer, space);
}
exports.default = jsonFormat;
//# sourceMappingURL=json.js.map