"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
const util_1 = require("util");
/**
 * Uses util.format to format message using token arguments.
 *
 * @example
 * log.transforms.splat();
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
function splatTransform(payload, options) {
    const splat = payload[types_1.SOURCE].splat || [];
    payload.message = util_1.format(payload.message, ...splat);
    return payload;
}
exports.default = splatTransform;
//# sourceMappingURL=splat.js.map