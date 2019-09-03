/// <reference types="node" />
import { Transport } from './transport';
import { ITransportOptions, IPayload, Callback } from '../types';
export interface IConsoleTransportOptions<L extends string> extends ITransportOptions<L> {
    stream?: NodeJS.WritableStream;
    errorLevels?: L[];
    eol?: string;
}
export declare class ConsoleTransport<L extends string> extends Transport<L, IConsoleTransportOptions<L>> {
    constructor(options?: IConsoleTransportOptions<L>);
    /**
     * Gets stream from options.
     *
     * @param level the level of the log message.
     */
    private dispatcher;
    /**
     * Log handler that receives payload when Transport writes to stream.
     *
     * @param result the log payload object.
     * @param enc the encoding string.
     * @param cb callback called on completed to continue stream.
     */
    log(payload: IPayload<L>, cb: Callback): void;
}
