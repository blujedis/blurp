import { Logger } from '../logger';
import { Callback } from '../types';
export declare class ChildStore<L extends string> {
    private store;
    keys(): IterableIterator<string>;
    values(): IterableIterator<Logger<L>>;
    has(key: string): boolean;
    clear(): this;
    toArray(...keys: string[]): Array<Logger<L>>;
    get(key: string): Logger<L>;
    add(key: string, child: Logger<L>, parent: Logger<L>): Map<string, Logger<L>>;
    remove(key: string, cb?: Callback): this;
}
