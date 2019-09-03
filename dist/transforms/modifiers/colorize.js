"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
const utils_1 = require("../../utils");
const lodash_isequal_1 = __importDefault(require("lodash.isequal"));
/**
 * Extends log payload with additional properties.
 *
 * @example
 * log.transforms.colorize({ message: ['bgRed', 'white']});
 * log.transforms.colorize({ error: { prop: 'level', condition: 'error', style: 'red' }});
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
function colorizeTransform(payload, options = {}) {
    for (const k in options) {
        if (!options.hasOwnProperty(k))
            continue;
        let conf = options[k];
        if (!Array.isArray(conf) && typeof conf === 'object') {
            conf = Object.assign({ matchSource: 'source', prop: k, matchProp: conf.prop || k }, conf);
            const { prop, matchProp, matchSource, condition, style } = conf;
            const val = payload[prop];
            if (typeof condition !== 'undefined') {
                let shouldColorize = true;
                if (typeof condition === 'function') {
                    shouldColorize = condition(val, payload);
                }
                else {
                    const matchVal = matchSource === 'payload' ? payload[matchProp] : payload[types_1.SOURCE][matchProp];
                    if (condition instanceof RegExp)
                        shouldColorize = condition.test(matchVal);
                    else
                        shouldColorize = lodash_isequal_1.default(condition, matchVal);
                }
                if (shouldColorize)
                    payload[prop] = utils_1.colorizer(val, style);
            }
        }
        else {
            payload[k] = utils_1.colorizer(payload[k], conf);
        }
    }
    return payload;
}
exports.default = colorizeTransform;
//# sourceMappingURL=colorize.js.map