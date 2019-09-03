"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_isequal_1 = __importDefault(require("lodash.isequal"));
/**
 * Inspects payload when prop is detected aborts transformation excluding from log.
 *
 * @example
 * log.transforms.private({ prop: 'private' });
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
function privateTransform(payload, options) {
    options = Object.assign({ prop: 'private' }, options);
    const { prop, condition } = options;
    if (!payload.hasOwnProperty(prop))
        return payload;
    // Prop is present return falsey value to abort.
    if (typeof condition === 'undefined')
        return null;
    const val = payload[prop];
    if (typeof condition === 'function' && condition(val, payload))
        return null;
    if (condition instanceof RegExp && condition.test(val))
        return null;
    if (lodash_isequal_1.default(val, condition))
        return null;
    return payload;
}
exports.default = privateTransform;
//# sourceMappingURL=private.js.map