"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Aligns message using \t by default or pass custom props.
 *
 * @example
 * log.transforms.align({ 'meta.password': '*' });
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
function maskTransform(payload, options = {}) {
    for (const k in options) {
        if (!payload.hasOwnProperty(k) || typeof payload[k] === 'object')
            continue;
        payload[k] = options[k].repeat(String(payload[k]).length);
    }
    return payload;
}
exports.default = maskTransform;
//# sourceMappingURL=mask.js.map