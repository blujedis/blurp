import { Transport } from '../transports';
import { Callback } from '../types';
export declare class TransportStore<L extends string> {
    private store;
    keys(): IterableIterator<string>;
    values(): IterableIterator<Transport<L, any>>;
    has(key: string): boolean;
    toArray(...keys: string[]): Array<Transport<L, any>>;
    normalize(transports: Array<string | Transport<L, any>>): Transport<L, any>[];
    clear(): this;
    get(key: string): Transport<L, any>;
    add(key: string, transport: Transport<L, any>): this;
    remove(key: string, cb?: Callback): this;
}
