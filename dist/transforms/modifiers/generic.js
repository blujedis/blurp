"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Generic modifier transform that simply callsback and returns the returned payload.
 *
 * @example
 * log.compiled.generic((payload) => {
 *    // do anything & return payload.
 *    return payload;
 * });
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
function genericTransform(payload, options) {
    return options(payload);
}
exports.default = genericTransform;
//# sourceMappingURL=generic.js.map