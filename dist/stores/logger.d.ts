import { Logger } from '../logger';
import { Callback } from '../types';
export declare class LoggerStore {
    private store;
    keys(): IterableIterator<string>;
    values(): IterableIterator<Logger<any>>;
    has(key: string): boolean;
    clear(): this;
    get<T extends Logger<any> = Logger<any>>(key: string): T;
    add(key: string, logger: Logger<any>, force?: boolean): Map<string, Logger<any>>;
    remove(key: string, cb?: Callback): this;
}
