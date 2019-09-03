"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Extends log payload with additional properties.
 *
 * @example
 * log.transforms.extend({ pid: process.pid });
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
function extendTransform(payload, options) {
    return Object.assign({}, payload, options);
}
exports.default = extendTransform;
//# sourceMappingURL=extend.js.map