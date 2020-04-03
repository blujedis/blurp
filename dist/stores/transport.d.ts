import { Transport } from '../transports';
import { Callback } from '../types';
declare type TransportExt<L extends string> = Transport<L, any>;
export declare class TransportStore<L extends string> {
    private store;
    keys(): IterableIterator<string>;
    values(): IterableIterator<TransportExt<L>>;
    has(key: string): boolean;
    toArray(...keys: string[]): Array<Transport<L, any>>;
    normalize(transports: Array<string | Transport<L, any>>): Transport<L, any>[];
    clear(): this;
    get(key: string): TransportExt<L>;
    add(key: string, transport: Transport<L, any>): this;
    remove(key: string, cb?: Callback): this;
}
export {};
