"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const utils_1 = require("../../utils");
const templates = {
    short: 'HH:mm:ss.S',
    long: 'YYYY-MM-DD HH:mm:ss.S'
};
/**
 * Uses util.format to format message using token arguments.
 * @see https://date-fns.org/v2.0.1/docs/format
 *
 * @example
 * log.transforms.timestamp({ prop: 'ts', format: 'epoch' });
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
function timestampTransform(payload, options) {
    options = Object.assign({ prop: 'timestamp', format: 'short' }, options);
    const { prop, format } = options;
    // Check if there's already a timestamp this can happen when run after queries.
    const curVal = utils_1.toDate(payload[prop] || new Date());
    payload[prop] = format === 'epoch' ? curVal.getTime() : date_fns_1.format(new Date(), templates[format]);
    return payload;
}
exports.default = timestampTransform;
//# sourceMappingURL=timestamp.js.map