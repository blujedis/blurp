import { Base } from '../base';
import { ITransportOptions, IPayload, TransportWritable, Callback, ITransport } from '../types';
import { Logger } from '../logger';
export declare abstract class Transport<L extends string, O extends ITransportOptions<L>> extends Base<L, O> implements ITransport<L> {
    stream: TransportWritable;
    logger: Logger<L>;
    finished: boolean;
    constructor(label: string, options?: O, highWaterMark?: number);
    private _pipe;
    private _unpipe;
    /**
     * Writes payload to stream.
     *
     * @param payload the log payload object provided by Logger.
     * @param enc the encoding type.
     * @param cb the callback on finished to continue stream.
     */
    private _write;
    /**
     * Writes an array of log payload objects.
     *
     * @param payloads an array of log payload objects.
     * @param cb the callback on completed to continue stream.
     */
    private _writev;
    get level(): L;
    set level(level: L);
    get levels(): L[];
    get index(): number;
    /**
     * Compiles Transforms into single Transformer function.
     */
    protected compile(): this;
    /**
     * Gets the index of the specified level.
     *
     * @param level the level to get index for.
     */
    getIndex(level: L): number;
    /**
     * Checks if provided level is active.
     *
     * @param index the index to verify as active.
     * @param max the max allowable index.
     */
    isActiveIndex(index: number, max?: number): boolean;
    /**
     * Checks if provided level is active.
     *
     * @param index the level to verify as active.
     * @param max the max allowable level.
     */
    isActiveLevel(level: L, max?: L): boolean;
    /**
     * Checks if Payload can be accepted.
     *
     * @param obj the Payload object or object containing write chunk.
     */
    accept(obj: {
        chunk: IPayload<L>;
    } | IPayload<L>): boolean;
    /**
     * Log handler that receives payload when Transport writes to stream.
     *
     * @param payload the log payload object.
     * @param enc the encoding string.
     * @param cb callback called on completed to continue stream.
     */
    log(payload: IPayload<L>, cb: Callback): void;
    close(): void;
}
