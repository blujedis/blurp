"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
const ziplit_1 = __importDefault(require("ziplit"));
/**
 * Transforms payloads contianing errors.
 *
 * @see https://github.com/blujedis/ziplit
 *
 * @example
 * log.transforms.label({ template: '${label}:'});
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
function labelTransform(payload, options) {
    payload.label = ziplit_1.default.compile(options.template || '${label}:').render(payload[types_1.CONFIG].label);
    return payload;
}
exports.default = labelTransform;
//# sourceMappingURL=label.js.map