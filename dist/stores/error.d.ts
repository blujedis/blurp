import { Transport } from '../transports';
import ExceptionStream from '../errors/stream';
export declare class ErrorStore<L extends string> {
    private store;
    keys(): IterableIterator<Transport<L, any>>;
    values(): IterableIterator<ExceptionStream<L>>;
    has(transport: Transport<L, any>): boolean;
    clear(): this;
    get(key: Transport<L, any>): ExceptionStream<L>;
    add(transport: Transport<L, any>, stream: ExceptionStream<L>): this;
    remove(transport: Transport<L, any>): this;
}
