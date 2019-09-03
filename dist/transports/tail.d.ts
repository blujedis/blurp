import { Stream } from 'readable-stream';
import { Callback } from 'types';
export interface ITailOptions {
    start?: number;
    timeout?: number;
    eol?: string | RegExp;
}
/**
 * Tails the specified file.
 *
 * Based on tail-file.js
 * Charlie Robbins
 * @see https://github.com/winstonjs/winston/blob/master/lib/winston/tail-file.js
 *
 * @example
 * tail('/path/to/file.log', (err, line) => { console.log(line); });
 *
 * @param file the file to tail.
 * @param handler the callback handler on file tailed.
 */
export declare function tail(file: string, handler?: Callback<string>): Stream;
/**
 * Tails the specified file.
 *
 * Based on tail-file.js
 * Charlie Robbins
 * @see https://github.com/winstonjs/winston/blob/master/lib/winston/tail-file.js
 *
 * @example
 * tail('/path/to/file.log', { start: 10 }, (err, line) => { console.log(line); });
 *
 * @param file the file to tail.
 * @param options tail file options.
 * @param handler the callback handler on file tailed.
 */
export declare function tail(file: string, options?: ITailOptions, handler?: Callback<string>): Stream;
