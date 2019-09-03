"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
const stack_trace_1 = __importDefault(require("stack-trace"));
const path_1 = require("path");
/**
 * Adds trace to payload or adds only when error is detected.
 *
 * @example
 * log.transforms.trace();
 * log.transforms.trace({ exceptions: true, rejections: true });
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
function traceTransform(payload, options) {
    options = Object.assign({ all: false, exceptions: true, rejections: true }, options);
    const { all, exceptions, rejections } = options;
    const { err } = payload[types_1.SOURCE].err;
    // Check if should trace.
    const shouldTrace = all || (exceptions && err && err.isException) ||
        (rejections && err && err.isRejection);
    if (!shouldTrace)
        return payload;
    const stacktrace = err ? stack_trace_1.default.parse(err) : stack_trace_1.default.get();
    payload.trace = stacktrace.map(callsite => {
        const traced = {
            method: callsite.getMethodName(),
            file: callsite.getFileName(),
            column: callsite.getColumnNumber(),
            line: callsite.getLineNumber(),
            function: callsite.getFunctionName(),
            native: callsite.isNative(),
            short: undefined
        };
        const safeFile = typeof traced.file === 'string' ? path_1.basename(traced.file) : '';
        traced.short = `${safeFile} ${traced.line}:${traced.column}`;
        return traced;
    });
    return payload;
}
exports.default = traceTransform;
//# sourceMappingURL=trace.js.map