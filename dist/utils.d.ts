/// <reference types="node" />
import { Style } from './types';
export declare const noop: (v?: any) => any;
/**
 * Loads package.json.
 *
 * @param path optional package.json path otherwise uses {CWD}/package.json
 */
export declare function readPkg<T extends object = {
    [key: string]: any;
}>(path?: string): T;
/**
 * Converts date strings or epochs to Date instance.
 *
 * @param date the date to be converted.
 */
export declare function toDate(date: string | number | Date): Date;
/**
 * Capitalize a string.
 *
 * @param str the string to be capitalized.
 */
export declare function capitalize(str: string): string;
/**
 * Colorizes the value.
 *
 * @param styles the Kleur styles to be applied.
 * @param value the value to apply them to.
 */
export declare function colorizer(value: any, styles: Style | Style[]): any;
/**
 * Gets the week of the year the specified date resides in.
 *
 * @param date the date to get the week of the year from.
 */
export declare function getWeek(date?: Date): number;
/**
 * Pads a value to the left.
 *
 * @param value the value to pad.
 * @param len the length to pad.
 * @param char the character to use to pad.
 */
export declare function padLeft(value: any, len: number, char?: string): string;
/**
 * Pads a value to the right.
 *
 * @param value the value to pad.
 * @param len the length to pad.
 * @param char the character to use to pad.
 */
export declare function padRight(value: any, len: number, char?: string): string;
/**
 * Checks if a value should be padded.
 *
 * @param direction the direction to pad.
 * @param value the value to be padded if exceeds max
 * @param min the min length required or should pad.
 * @param char the character to use to pad.
 */
export declare function padIf(direction: 'left' | 'right', value: any, min: number, char?: string): any;
/**
 * Converts an Error to a plain object optionally exluding or including specified props.
 *
 * @param err the Error instance to be converted.
 * @param props optional property props to include or omit.
 * @param omit when true omit specified props.
 */
export declare function errorToObject(err: Error, props?: string[], omit?: boolean): {};
/**
 * Converts an object to any array of values by key.
 *
 * @param obj the object to convert to an array.
 * @param prop optional property to map instead of root.
 * @param extend extends resulting array with these values.
 * @param prepend when true extended values are prepended.
 */
export declare function toObjectArray<T = any>(obj: object, prop?: string, extend?: T | T[], prepend?: boolean): T[];
/**
 * Converts an object to any array of values by property keys.
 *
 * @param obj the object to convert to an array.
 * @param prop specify props to include (default: all)
 * @param exclude array of props to exclude.
 * @param withKeys when true prepend all with key or array of keys to apply (default: false)
 */
declare function toArrayValues(obj: object, props?: string[], exclude?: string[], withKeys?: boolean | string[]): any[];
/**
 * Reduces an object by specified properties, includes undefined properties when "append" is true.
 *
 * @param obj the object to be reduced.
 * @param props the properties to include.
 * @param exclude array of properties to exclude.
 */
export declare function reducePayload<T extends object = any>(obj: T, props?: string[], exclude?: string[]): T;
/**
 * Checks if string, object or array are empty.
 *
 * @param val the value to be inspected as empty.
 */
export declare function isEmpty(val: string | object | any[]): boolean;
/**
 * Normalizes props for the specified object appending or filling as specified.
 * Use "..." without quotes to fill unspecified properties.
 *
 * @param obj the object to get/normalize props for.
 * @param props array of defined props in specified order.
 * @param prune when true exclude if not has own property.
 */
declare function getProps(obj: object, props?: string[], prune?: boolean): string[];
/**
 * Normalizes props for the specified object appending or filling as specified.
 * Use "..." without quotes to fill unspecified properties.
 *
 * @param obj the object to get/normalize props for.
 * @param props array of defined props in specified order.
 * @param exclude array of props to exclude.
 * @param prune when true exclude if not has own property.
 */
declare function getProps(obj: object, props?: string[], exclude?: string[], prune?: boolean): string[];
/**
 * Normalizes option configuration returning null or valid conf object.
 *
 * @param conf the specified option configuration
 * @param defaults values to be merged or returned when conf === true.
 */
export declare function normalizeConf<T extends object>(conf: boolean | T, defaults: Partial<T>): Partial<T>;
/**
 * Flattens an array recursively.
 *
 * @param arr the array to be flattened.
 */
export declare function flattenArray<T = any>(arr: T[]): any;
/**
 * Ensures value is an array optionallly flattens.
 * Returns empty array when value is undefined.
 *
 * @param value the value to ensure is an array.
 * @param flatten optionally flatten the resutl.
 */
export declare function ensureArray<T = any>(value: T | T[], flatten?: boolean): T[];
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
export declare function reduceBreak(fn: (prev: any, curr: any, i: any, arr: any) => any, result?: any, breakon?: '--b' | '--c'): any;
/**
 * Extends target with source.
 *
 * @param target the target object.
 * @param source the source object to extend target with.
 */
export declare function extend<T, U>(target: T, source: U): T & U;
/**
 * Wraps stream or console into normalized method.
 *
 * @param stream a writable stream e.g. stream.write
 * @param fallback a console fallback e.g. console.log.
 * @param eol end of line char (default: os.EOL)
 */
export declare function wrapStream(stream: NodeJS.WritableStream, fallback: (message: any, ...args: any[]) => void, eol?: string): {
    write(msg: any): boolean;
};
declare const logger: {
    log: (message: any, ...args: any[]) => any;
    error: (message: any) => any;
    warn: (message: any) => any;
};
export { getProps, toArrayValues, logger };
