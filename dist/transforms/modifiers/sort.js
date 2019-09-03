"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
/**
 * Sorts by property excluded keys are appended (Top Level keys ONLY)
 *
 * @example
 * log.transforms.sort({ props: ['level', 'message' ]});
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
function sortTransform(payload, options) {
    return utils_1.reducePayload(payload, options.props);
}
exports.default = sortTransform;
//# sourceMappingURL=sort.js.map