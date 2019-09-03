"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
/**
 * Moves all metadata into specified property on payload.
 *
 * @example
 * log.transforms.meta();
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
function metaTransform(payload, options) {
    options = Object.assign({ prop: 'meta', exclude: ['level', 'message'] }, options);
    const { prop, exclude } = options;
    if (!prop)
        return payload;
    return Object.keys(payload).reduce((result, key) => {
        if (!payload.hasOwnProperty(key))
            return result;
        if (exclude.includes(key))
            result[key] = payload[key];
        else
            result[prop][key] = payload[key];
        return result;
    }, { [prop]: {}, [types_1.CONFIG]: payload[types_1.CONFIG], [types_1.SOURCE]: payload[types_1.SOURCE] });
}
exports.default = metaTransform;
//# sourceMappingURL=meta.js.map