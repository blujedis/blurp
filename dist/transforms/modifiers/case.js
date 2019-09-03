"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const camelcase_1 = __importDefault(require("camelcase"));
const pascalcase_1 = __importDefault(require("pascalcase"));
const lower = (v) => v.toLowerCase();
const upper = (v) => v.toUpperCase();
const camel = (v) => camelcase_1.default(v);
const pascal = (v) => pascalcase_1.default(v);
const cap = (v) => v.charAt(0).toUpperCase() + v.slice(1);
const caseMap = {
    cap,
    capitalize: cap,
    lower,
    lowercase: lower,
    upper,
    uppercase: upper,
    camel,
    camelcase: camelcase_1.default,
    pascal,
    pascalcase: pascalcase_1.default
};
/**
 * Changes case to property.
 *
 * @example
 * log.transforms.case();
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
function caseTransform(payload, options = {}) {
    for (const k in options) {
        if (!payload.hasOwnProperty(k) || !caseMap[options[k]] || typeof payload[k] === 'object')
            continue;
        payload[k] = caseMap[options[k]](String(payload[k]));
    }
    return payload;
}
exports.default = caseTransform;
//# sourceMappingURL=case.js.map