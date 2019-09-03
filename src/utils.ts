import kleur from 'kleur';
import { Style } from './types';
import { join, relative } from 'path';
import { readFileSync } from 'fs';
import { inspect, format } from 'util';
import { EOL } from 'os';
import { parseISO } from 'date-fns';

export const noop = (v?) => v;

let _pkg = null;

/**
 * Loads package.json.
 * 
 * @param path optional package.json path otherwise uses {CWD}/package.json
 */
export function readPkg<T extends object = { [key: string]: any }>(path?: string): T {

  if (_pkg)
    return _pkg as T;

  path = path || join(__dirname, '../package.json');

  try {
    _pkg = JSON.parse(readFileSync(path).toString());
    return _pkg as T;
  }
  catch (ex) {
    throw new Error(`Jetti package.json could NOT be loaded at: ${relative(process.cwd(), path)}`);
  }

}

/**
 * Converts date strings or epochs to Date instance.
 * 
 * @param date the date to be converted.
 */
export function toDate(date: string | number | Date) {
  if (date instanceof Date)
    return date;
  return parseISO((new Date(date)).toISOString());
}

/**
 * Capitalize a string.
 * 
 * @param str the string to be capitalized.
 */
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Colorizes the value.
 * 
 * @param styles the Kleur styles to be applied.
 * @param value the value to apply them to.
 */
export function colorizer(value: any, styles: Style | Style[]) {
  if (!styles || typeof value === 'undefined' || value === null) return value;
  styles = Array.isArray(styles) ? styles : [styles];
  return styles.reduce((a, c) => {
    return kleur[c](a);
  }, value);
}

/**
 * Gets the week of the year the specified date resides in.
 * 
 * @param date the date to get the week of the year from.
 */
export function getWeek(date: Date = new Date()) {
  const jan = (new Date(date.getFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - jan.getTime()) / 86400000) + jan.getDay() + 1) / 7);
}

/**
 * Pads a value to the left.
 * 
 * @param value the value to pad.
 * @param len the length to pad.
 * @param char the character to use to pad.
 */
export function padLeft(value: any, len: number, char: string = ' ') {
  return char.repeat(len) + String(value);
}

/**
 * Pads a value to the right.
 * 
 * @param value the value to pad.
 * @param len the length to pad.
 * @param char the character to use to pad.
 */
export function padRight(value: any, len: number, char: string = ' ') {
  return String(value) + char.repeat(len);
}

/**
 * Checks if a value should be padded.
 * 
 * @param direction the direction to pad.
 * @param value the value to be padded if exceeds max
 * @param min the min length required or should pad.
 * @param char the character to use to pad.
 */
export function padIf(direction: 'left' | 'right', value: any, min: number, char: string = ' ') {
  value = String(value);
  const offset = min - value.length;
  if (offset <= 0)
    return value;
  if (direction === 'left')
    return padLeft(value, offset, char);
  return padRight(value, offset, char);
}

/**
 * Converts an Error to a plain object optionally exluding or including specified props.
 * 
 * @param err the Error instance to be converted.
 * @param props optional property props to include or omit.
 * @param omit when true omit specified props.
 */
export function errorToObject(err: Error, props: string[] = [], omit: boolean = false) {

  let ownProps = Object.getOwnPropertyNames(err);
  if (props.length) {
    if (!omit) ownProps = props;
    else ownProps.filter(p => !props.includes(p));
  }

  return ownProps.reduce((a, c) => {
    a[c] = err[c];
    return a;
  }, {});

}

/**
 * Converts an object to any array of values by key.
 * 
 * @param obj the object to convert to an array.
 * @param prop optional property to map instead of root.
 * @param extend extends resulting array with these values.
 * @param prepend when true extended values are prepended.
 */
export function toObjectArray<T = any>(
  obj: object, prop?: string, extend: T | T[] = [], prepend: boolean = false): T[] {
  if (!Array.isArray(extend))
    extend = [extend];
  const result = Object.keys(obj).map(k => prop ? obj[k][prop] : obj[k]);
  if (prepend)
    return [...extend, ...result];
  return [...result, ...extend];
}

/**
 * Converts an object to any array of values by property keys.
 * 
 * @param obj the object to convert to an array.
 * @param prop specify props to include (default: all)
 * @param exclude array of props to exclude.
 * @param withKeys when true prepend all with key or array of keys to apply (default: false)
 */
function toArrayValues(obj: object, props?: string[],
  exclude?: string[], withKeys?: boolean | string[]) {

  exclude = exclude || [];

  props = props || Object.keys(obj);
  let result = [];

  for (const prop of props) {

    if (!obj.hasOwnProperty(prop) || (exclude as string[]).includes(prop)) continue;

    const val = typeof obj[prop] === 'object' ? inspect(obj[prop]) : obj[prop];

    if (Array.isArray(withKeys) && withKeys.includes(prop))
      result = [...result, prop + ': ' + val];
    else if (withKeys === true)
      result = [...result, prop + ': ' + val];
    else
      result = [...result, val];

  }

  return result;

}

/**
 * Reduces an object by specified properties, includes undefined properties when "append" is true.
 * 
 * @param obj the object to be reduced.
 * @param props the properties to include.
 * @param exclude array of properties to exclude.
 */
export function reducePayload<T extends object = any>(obj: T, props?: string[], exclude?: string[]) {
  return getProps(obj, props, exclude).reduce((result, key) => ({ ...result, [key]: obj[key] }), {}) as T;
}

/**
 * Checks if string, object or array are empty.
 * 
 * @param val the value to be inspected as empty.
 */
export function isEmpty(val: string | object | any[]) {
  if (Array.isArray(val))
    return val.length === 0;
  if (typeof val === 'string')
    return val === '';
  return Object.keys(val).length === 0 && val.constructor === Object;
}

/**
 * Normalizes props for the specified object appending or filling as specified.
 * Use "..." without quotes to fill unspecified properties.
 * 
 * @param obj the object to get/normalize props for.
 * @param props array of defined props in specified order.
 * @param prune when true exclude if not has own property.
 */
function getProps(obj: object, props?: string[], prune?: boolean): string[];

/**
 * Normalizes props for the specified object appending or filling as specified.
 * Use "..." without quotes to fill unspecified properties.
 * 
 * @param obj the object to get/normalize props for.
 * @param props array of defined props in specified order.
 * @param exclude array of props to exclude.
 * @param prune when true exclude if not has own property.
 */
function getProps(obj: object, props?: string[], exclude?: string[], prune?: boolean): string[];
function getProps(obj: object, props?: string[], exclude?: boolean | string[], prune: boolean = true) {

  if (typeof exclude === 'boolean') {
    prune = exclude;
    exclude = undefined;
  }

  exclude = exclude || [];

  let _props = Object.keys(obj);

  if (!props) return _props.filter(p => !(exclude as string[]).includes(p));

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
      (exclude as string[]).includes(prop))
      return result;
    return [...result, prop];
  }, []);

}

/**
 * Normalizes option configuration returning null or valid conf object.
 * 
 * @param conf the specified option configuration 
 * @param defaults values to be merged or returned when conf === true.
 */
export function normalizeConf<T extends object>(conf: boolean | T, defaults: Partial<T>) {
  if (!conf)
    return null;
  if (conf === true)
    return { ...defaults };
  return { ...defaults, ...conf };
}

/**
 * Flattens an array recursively.
 * 
 * @param arr the array to be flattened.
 */
export function flattenArray<T = any>(arr: T[]) {
  return arr.reduce((acc, v) => Array.isArray(v) ? acc.concat(flattenArray(v)) : acc.concat(v), []);
}

/**
 * Ensures value is an array optionallly flattens.
 * Returns empty array when value is undefined.
 * 
 * @param value the value to ensure is an array.
 * @param flatten optionally flatten the resutl.
 */
export function ensureArray<T = any>(value: T | T[], flatten: boolean = false): T[] {
  if (typeof value === 'undefined')
    return [];
  if (!Array.isArray(value))
    value = [value];
  if (!flatten)
    return value;
  return flattenArray(value);
}

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
export function reduceBreak(
  fn: (prev, curr, i, arr) => any, result?: any, breakon: '--b' | '--c' = '--b'): any {
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

/**
 * Extends target with source.
 * 
 * @param target the target object.
 * @param source the source object to extend target with.
 */
export function extend<T, U>(target: T, source: U) {
  const result: Partial<T & U> = target;
  for (const k in source) {
    if (!source.hasOwnProperty(k)) continue;
    result[k] = (source as any)[k];
  }
  return result as T & U;
}

/**
 * Wraps stream or console into normalized method.
 * 
 * @param stream a writable stream e.g. stream.write
 * @param fallback a console fallback e.g. console.log.
 * @param eol end of line char (default: os.EOL)
 */
export function wrapStream(stream: NodeJS.WritableStream, fallback: (message, ...args) => void,
  eol?: string) {
  return {
    write(msg) {
      if (stream && stream.write)
        return stream.write(msg + (eol || EOL));
      (fallback || console.log)(msg);
    }
  };
}

const logger = {

  log: (message: any, ...args: any[]) => {
    return _logger(null, message, ...args);
  },

  error: (message: any, ...args: []) => {
    return _logger('error', message, ...args);
  },

  warn: (message: any, ...args: []) => {
    return _logger('warn', message, ...args);
  }

};

/**
 * Simple internal logger.
 * 
 * @param message the message to be logged.
 * @param args the format arguments if any.
 */
function _logger(type: 'error' | 'warn' | null, message: any, ...args: any[]) {
  const writer = !type ?
    wrapStream(console._stdout, console.log) :
    wrapStream(console._stderr, console[type] || console.error);
  writer.write(format(message, ...args));
  return logger;
}

Array.prototype.$reduceBreak = reduceBreak;

export { getProps, toArrayValues, logger };
