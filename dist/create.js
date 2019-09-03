"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
// CREATE & WRAP //
/**
 * Creates a transform callback handler for modifiers and formatters.
 *
 * @param type the type of helper to be created.
 * @param fn the callback function to be executed.
 */
function createTransform(type, fn) {
    return (options) => {
        function wrapper(payload) {
            const result = {
                payload,
                errors: []
            };
            const applied = fn(payload, options);
            if (applied === false || typeof applied === 'undefined' ||
                applied === null || applied instanceof Error) {
                result.errors = [...result.errors, [fn.name, applied]];
            }
            else {
                if (type === 'format') {
                    result.payload[types_1.OUTPUT] = applied;
                }
                else {
                    result.payload = applied;
                }
            }
            return result;
        }
        // Bind name, type and options to funcion.
        wrapper._name = fn.name;
        wrapper._type = type;
        wrapper._options = options;
        return wrapper;
    };
}
/**
 * Creates a modifier callback wrapper.
 *
 * @param fn the callback the Logger will call to transform the payload.
 */
function createModifier(fn) {
    return createTransform('transform', fn);
}
exports.createModifier = createModifier;
/**
 * Creates a format callback wrapper.
 *
 * @param fn the callback the Logger will call to format the result.
 */
function createFormatter(fn) {
    return createTransform('format', fn);
}
exports.createFormatter = createFormatter;
// UTILS //
/**
 * Expands callbacks by type.
 *
 * @param stack the stack of transforms, formats and combined stacks to expand.
 */
function expand(stack) {
    return stack.reduce((result, fn) => {
        // If already combined flatten.
        // @ts-ignore
        if (fn._stack) {
            // @ts-ignore
            const flattened = expand(fn._stack);
            result.transforms = [...result.transforms, ...flattened.transforms];
            result.formats = [...result.formats, ...flattened.formats];
        }
        else {
            if (!fn._type)
                throw new Error(`Transform or format ${fn._name || 'unknown'} missing "_type" property, use "createTransform", "createFormat", "blurp.format()" or "blurp.transform()"`);
            else if (fn._type === 'transform')
                result.transforms.push(fn);
            else if (fn._type === 'format')
                result.formats.push(fn);
        }
        return result;
    }, { transforms: [], formats: [] });
}
/**
 * Combines callback functions into single function for convenience, creates & sorts stack.
 * Format _type is sorted to last.
 *
 * @param stack the helper callback stack of functions to be combined.
 */
function combine(...stack) {
    // Expand by type then flatten.
    const expanded = expand(stack);
    stack = [...expanded.transforms, ...expanded.formats];
    function combineWrapper(payload) {
        const _result = stack.$reduceBreak((result, fn) => {
            const tmp = fn(result.payload);
            if (tmp.errors.length) {
                result.errors = [...result.errors, ...tmp.errors];
                return '--b';
            }
            // Overwrite with new values.
            return Object.assign({}, result, tmp);
        }, { payload, errors: [] });
        // Default output to message.
        let { [types_1.OUTPUT]: output, [types_1.SOURCE]: source } = _result.payload;
        const { err } = source;
        if (!output)
            output = err ? err.stack || err.message : _result.payload.message;
        _result.payload[types_1.OUTPUT] = output;
        return _result;
    }
    combineWrapper._stack = stack;
    return combineWrapper;
}
exports.combine = combine;
//# sourceMappingURL=create.js.map