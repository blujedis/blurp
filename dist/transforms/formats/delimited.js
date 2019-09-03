"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
/**
 * Formats output for delimited values.
 *
 * @example
 * log.transforms.delimited({ char: ',' });
 *
 * @param payload the current modified payload.
 * @param options the format's options.
 */
function delimitedFormat(payload, options) {
    options = Object.assign({ char: ',', exclude: [] }, options);
    const { props, withKeys, char, exclude } = options;
    return utils_1.toArrayValues(payload, utils_1.getProps(payload, props, exclude), null, withKeys).join(char);
}
exports.default = delimitedFormat;
//# sourceMappingURL=delimited.js.map