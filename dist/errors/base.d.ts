import { Logger } from '../logger';
import { Transport } from '../transports';
import { ErrorStore } from '../stores';
import { ErrorExt } from '../types';
export declare type Event = 'uncaughtException' | 'unhandledRejection';
export declare type Handler = (value: Error | {} | null | undefined, promise?: Promise<any>) => void;
export default class BaseHandler<L extends string = any> {
    logger: Logger<L>;
    protected _store: ErrorStore<L>;
    protected _event: any;
    private _handler;
    constructor(event: Event, logger: Logger<L>);
    /**
     * Common handler called on error.
     *
     * @param err the error passed from the process handler.
     */
    protected handler(err?: ErrorExt): void;
    /**
     * Creates stream and binds/pipes from Logger.
     *
     * @param transport the transport to be bound.
     */
    protected add(transport: Transport<L, any>): void;
    /**
     * Gets list of handlers that support event type.
     */
    readonly transports: Array<Transport<L, any>>;
    /**
     * Iterates array of Transports and binds handlers.
     *
     * @param transports array of Transports.
     */
    handle(...transports: Array<Transport<L, any>>): void;
    /**
     * Unhandle the Transport listener.
     */
    unhandle(): void;
}
