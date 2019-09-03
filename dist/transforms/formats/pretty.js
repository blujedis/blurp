"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const utils_1 = require("../../utils");
/**
 * Formats output for pretty print, applies util.inspect
 * to entire payload. You can filter props using "options.props"
 *
 * @example
 * log.transforms.pretty();
 *
 * @param payload the current modified payload.
 * @param options the format's options.
 */
function prettyFormat(payload, options) {
    payload = utils_1.reducePayload(payload, options.props, options.exclude);
    return util_1.inspect(payload, options.showHidden, options.depth, options.color);
}
exports.default = prettyFormat;
//# sourceMappingURL=pretty.js.map