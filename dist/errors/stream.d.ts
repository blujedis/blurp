import { Writable } from 'readable-stream';
import { Transport } from '../transports';
import { IPayload, Callback } from '../types';
import { Event } from './base';
export default class ExceptionStream<L extends string> extends Writable {
    event: Event;
    transport: Transport<L, any>;
    constructor(event: Event, transport: Transport<L, any>);
    /**
     * Writes the error log payload to stream.
     *
     * @param payload the log payload object.
     * @param enc the encoding type.
     * @param cb the callback on completion to continue stream.
     */
    _write(payload: IPayload<L>, enc: string, cb: Callback): true | void;
}
