import { Logger } from '../logger';
import { Callback } from '../types';
export declare class LoggerStore {
    private store;
    values(): IterableIterator<Logger<any>>;
    has(key: string): boolean;
    clear(): this;
    get(key: string): Logger<any>;
    add(key: string, logger: Logger<any>): Map<string, Logger<any>>;
    remove(key: string, cb?: Callback): this;
}
