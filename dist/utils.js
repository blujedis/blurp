"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kleur_1 = __importDefault(require("kleur"));
const path_1 = require("path");
const fs_1 = require("fs");
const util_1 = require("util");
const os_1 = require("os");
const date_fns_1 = require("date-fns");
exports.noop = (v) => v;
let _pkg = null;
/**
 * Loads package.json.
 *
 * @param path optional package.json path otherwise uses {CWD}/package.json
 */
function readPkg(path) {
    if (_pkg)
        return _pkg;
    path = path || path_1.join(__dirname, '../package.json');
    try {
        _pkg = JSON.parse(fs_1.readFileSync(path).toString());
        return _pkg;
    }
    catch (ex) {
        throw new Error(`Jetti package.json could NOT be loaded at: ${path_1.relative(process.cwd(), path)}`);
    }
}
exports.readPkg = readPkg;
/**
 * Converts date strings or epochs to Date instance.
 *
 * @param date the date to be converted.
 */
function toDate(date) {
    if (date instanceof Date)
        return date;
    return date_fns_1.parseISO((new Date(date)).toISOString());
}
exports.toDate = toDate;
/**
 * Capitalize a string.
 *
 * @param str the string to be capitalized.
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
exports.capitalize = capitalize;
/**
 * Colorizes the value.
 *
 * @param styles the Kleur styles to be applied.
 * @param value the value to apply them to.
 */
function colorizer(value, styles) {
    if (!styles || typeof value === 'undefined' || value === null)
        return value;
    styles = Array.isArray(styles) ? styles : [styles];
    return styles.reduce((a, c) => {
        return kleur_1.default[c](a);
    }, value);
}
exports.colorizer = colorizer;
/**
 * Gets the week of the year the specified date resides in.
 *
 * @param date the date to get the week of the year from.
 */
function getWeek(date = new Date()) {
    const jan = (new Date(date.getFullYear(), 0, 1));
    return Math.ceil((((date.getTime() - jan.getTime()) / 86400000) + jan.getDay() + 1) / 7);
}
exports.getWeek = getWeek;
/**
 * Pads a value to the left.
 *
 * @param value the value to pad.
 * @param len the length to pad.
 * @param char the character to use to pad.
 */
function padLeft(value, len, char = ' ') {
    return char.repeat(len) + String(value);
}
exports.padLeft = padLeft;
/**
 * Pads a value to the right.
 *
 * @param value the value to pad.
 * @param len the length to pad.
 * @param char the character to use to pad.
 */
function padRight(value, len, char = ' ') {
    return String(value) + char.repeat(len);
}
exports.padRight = padRight;
/**
 * Checks if a value should be padded.
 *
 * @param direction the direction to pad.
 * @param value the value to be padded if exceeds max
 * @param min the min length required or should pad.
 * @param char the character to use to pad.
 */
function padIf(direction, value, min, char = ' ') {
    value = String(value);
    const offset = min - value.length;
    if (offset <= 0)
        return value;
    if (direction === 'left')
        return padLeft(value, offset, char);
    return padRight(value, offset, char);
}
exports.padIf = padIf;
/**
 * Converts an Error to a plain object optionally exluding or including specified props.
 *
 * @param err the Error instance to be converted.
 * @param props optional property props to include or omit.
 * @param omit when true omit specified props.
 */
function errorToObject(err, props = [], omit = false) {
    let ownProps = Object.getOwnPropertyNames(err);
    if (props.length) {
        if (!omit)
            ownProps = props;
        else
            ownProps = ownProps.filter(p => !props.includes(p));
    }
    return ownProps.reduce((a, c) => {
        a[c] = err[c];
        return a;
    }, {});
}
exports.errorToObject = errorToObject;
/**
 * Converts an object to any array of values by key.
 *
 * @param obj the object to convert to an array.
 * @param prop optional property to map instead of root.
 * @param extend extends resulting array with these values.
 * @param prepend when true extended values are prepended.
 */
function toObjectArray(obj, prop, extend = [], prepend = false) {
    if (!Array.isArray(extend))
        extend = [extend];
    const result = Object.keys(obj).map(k => prop ? obj[k][prop] : obj[k]);
    if (prepend)
        return [...extend, ...result];
    return [...result, ...extend];
}
exports.toObjectArray = toObjectArray;
/**
 * Converts an object to any array of values by property keys.
 *
 * @param obj the object to convert to an array.
 * @param prop specify props to include (default: all)
 * @param exclude array of props to exclude.
 * @param withKeys when true prepend all with key or array of keys to apply (default: false)
 */
function toArrayValues(obj, props, exclude, withKeys) {
    exclude = exclude || [];
    props = props || Object.keys(obj);
    let result = [];
    for (const prop of props) {
        if (!obj.hasOwnProperty(prop) || exclude.includes(prop))
            continue;
        const val = typeof obj[prop] === 'object' ? util_1.inspect(obj[prop]) : obj[prop];
        if (Array.isArray(withKeys) && withKeys.includes(prop))
            result = [...result, prop + ': ' + val];
        else if (withKeys === true)
            result = [...result, prop + ': ' + val];
        else
            result = [...result, val];
    }
    return result;
}
exports.toArrayValues = toArrayValues;
/**
 * Reduces an object by specified properties, includes undefined properties when "append" is true.
 *
 * @param obj the object to be reduced.
 * @param props the properties to include.
 * @param exclude array of properties to exclude.
 */
function reducePayload(obj, props, exclude) {
    return getProps(obj, props, exclude).reduce((result, key) => (Object.assign(Object.assign({}, result), { [key]: obj[key] })), {});
}
exports.reducePayload = reducePayload;
/**
 * Checks if string, object or array are empty.
 *
 * @param val the value to be inspected as empty.
 */
function isEmpty(val) {
    if (Array.isArray(val))
        return val.length === 0;
    if (typeof val === 'string')
        return val === '';
    return Object.keys(val).length === 0 && val.constructor === Object;
}
exports.isEmpty = isEmpty;
function getProps(obj, props, exclude, prune = true) {
    if (typeof exclude === 'boolean') {
        prune = exclude;
        exclude = undefined;
    }
    exclude = exclude || [];
    let _props = Object.keys(obj);
    if (!props)
        return _props.filter(p => !exclude.includes(p));
    const idx = props.findIndex((v) => v === '...');
    if (!~idx) {
        _props = props;
    }
    else {
        const unspecified = _props.filter(prop => !props.includes(prop));
        _props = [...props.slice(0, idx), ...unspecified, ...props.slice(idx + 1)];
    }
    return _props.reduce((result, prop) => {
        if (!obj.hasOwnProperty(prop) || (prune && typeof obj[prop] === 'undefined') ||
            exclude.includes(prop))
            return result;
        return [...result, prop];
    }, []);
}
exports.getProps = getProps;
/**
 * Normalizes option configuration returning null or valid conf object.
 *
 * @param conf the specified option configuration
 * @param defaults values to be merged or returned when conf === true.
 */
function normalizeConf(conf, defaults) {
    if (!conf)
        return null;
    if (conf === true)
        return Object.assign({}, defaults);
    return Object.assign(Object.assign({}, defaults), conf);
}
exports.normalizeConf = normalizeConf;
/**
 * Flattens an array recursively.
 *
 * @param arr the array to be flattened.
 */
function flattenArray(arr) {
    return arr.reduce((acc, v) => Array.isArray(v) ? acc.concat(flattenArray(v)) : acc.concat(v), []);
}
exports.flattenArray = flattenArray;
/**
 * Ensures value is an array optionallly flattens.
 * Returns empty array when value is undefined.
 *
 * @param value the value to ensure is an array.
 * @param flatten optionally flatten the resutl.
 */
function ensureArray(value, flatten = false) {
    if (typeof value === 'undefined')
        return [];
    if (!Array.isArray(value))
        value = [value];
    if (!flatten)
        return value;
    return flattenArray(value);
}
exports.ensureArray = ensureArray;
/**
 * Reduce function with break/continue option.
 *
 * @example
 * ['one', 'two', 'three', 'four'].reduceBreak((prev, curr, i) => {
 *    if (curr === 'three') return '--b';
 *    return [...prev, curr];
 * }, []);
 * Result: ['one', 'two'];
 *
 * @param fn the callback function for iteration.
 * @param result the initial result/value.
 * @param breakon --brk to break and return value, --con to continue to next.
 */
function reduceBreak(fn, result, breakon = '--b') {
    let i = 0;
    // @ts-ignore
    let arr = this;
    for (const val of arr) {
        const _result = fn(result, val, i, arr);
        if (_result === breakon) {
            if (breakon === '--b')
                return result;
            else
                i++;
        }
        else {
            result = _result;
            i++;
        }
    }
    return result;
}
exports.reduceBreak = reduceBreak;
/**
 * Extends target with source.
 *
 * @param target the target object.
 * @param source the source object to extend target with.
 */
function extend(target, source) {
    const result = target;
    for (const k in source) {
        if (!source.hasOwnProperty(k))
            continue;
        result[k] = source[k];
    }
    return result;
}
exports.extend = extend;
/**
 * Wraps stream or console into normalized method.
 *
 * @param stream a writable stream e.g. stream.write
 * @param fallback a console fallback e.g. console.log.
 * @param eol end of line char (default: os.EOL)
 */
function wrapStream(stream, fallback, eol) {
    return {
        write(msg) {
            if (stream && stream.write)
                return stream.write(msg + (eol || os_1.EOL));
            (fallback || console.log)(msg);
        }
    };
}
exports.wrapStream = wrapStream;
const logger = {
    log: (message, ...args) => {
        return _logger(null, message, ...args);
    },
    error: (message, ...args) => {
        return _logger('error', message, ...args);
    },
    warn: (message, ...args) => {
        return _logger('warn', message, ...args);
    }
};
exports.logger = logger;
/**
 * Simple internal logger.
 *
 * @param message the message to be logged.
 * @param args the format arguments if any.
 */
function _logger(type, message, ...args) {
    const writer = !type ?
        wrapStream(console._stdout, console.log) :
        wrapStream(console._stderr, console[type] || console.error);
    writer.write(util_1.format(message, ...args));
    return logger;
}
Array.prototype.$reduceBreak = reduceBreak;
//# sourceMappingURL=utils.js.map