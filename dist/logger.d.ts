import { Base } from './base';
import { ILoggerOptions, LoggerTransform, IPayload, ILogMessage, MessageType, ITransportOptions, Callback, ITransportFirehoseOptions } from './types';
import { ChildStore, TransportStore } from './stores';
import { ExceptionHandler, RejectionHandler } from './errors';
import { Stream } from 'readable-stream';
import { Transport } from './transports';
import { Query, IQueryOptions } from './query';
export declare class Logger<L extends string> extends Base<L, ILoggerOptions<L>> {
    stream: LoggerTransform<L>;
    children: ChildStore<L>;
    transports: TransportStore<L>;
    exceptions: ExceptionHandler<L>;
    rejections: RejectionHandler<L>;
    profilers: {
        [key: string]: number;
    };
    private lastLog;
    constructor(label: string, options?: ILoggerOptions<L>);
    private initStream;
    private init;
    private onEvent;
    /**
     * Simple method to ensure string, used with .write() & .writeLn();
     *
     * @param value the value to inspect
     */
    private stingify;
    /**
     * Gets the elapsed time since last dispatch.
     */
    private getElapsed;
    /**
     * Parses callback from payload.splat or splat array.
     *
     * @param payloadOrSplat the splat array or payload containing splat.
     */
    private parseCallback;
    /**
     * Creates the payload for stream.
     *
     * @param level the level, message or payload to be logged.
     * @param message the message to be logged.
     * @param splat optional splat used for formatting message & metadata.
     */
    private createPayload;
    readonly levels: L[];
    level: L;
    readonly index: number;
    /**
     * Returns current piped Transports.
     */
    readonly piped: any[];
    /**
     * Ensures payload contains required defaults as well as source and options Symbols.
     *
     * @param obj the configured payload object.
     */
    extendPayload(payload: IPayload<L>): IPayload<L>;
    /**
     * Mutes the Logger OR specified child Loggers.
     *
     * @param child the child or children to mute.
     */
    mute(...child: string[]): this;
    /**
     * Unmutes the Logger OR specified child Loggers.
     *
     * @param child the child or children to unmute.
     */
    unmute(...child: string[]): this;
    /**
     * Adds a child Logger to the current Logger.
     *
     * @param child the child Logger to be added.
     */
    child(label: string, meta: {
        [key: string]: any;
    }): Logger<L>;
    /**
     * Gets a Transport by name.
     *
     * @param transport the name of the Transport to get.
     */
    transport<V extends string, O extends ITransportOptions<V>>(transport: string): Transport<V, O>;
    /**
     * Adds a Transport(s) to the collection.
     *
     * @param transport the Transport to add to the collection.
     */
    transport<V extends string, O extends ITransportOptions<V>>(...transports: Array<Transport<V, O>>): this;
    /**
     * Log a message manually specifying level.
     *
     * @param level the log level to apply.
     * @param message the message or error to be logged.
     * @param meta optional metadata to include.
     */
    log(level: L, message: MessageType, ...meta: any[]): this;
    /**
     * Log simple message without log level.
     *
     * @param message the message or error instance to log.
     * @param meta optional metadata to include.
     */
    log(message: MessageType, ...meta: any[]): this;
    /**
     * Logs a message using a configured log payload object.
     *
     * @param payload a pre-configured log payload message.
     */
    log(payload: ILogMessage<L>): this;
    /**
     * Logs and empty string on new line.
     */
    log(): this;
    /**
     * Writes directly to stream WITHOUT line ending.
     *
     * @param message the message to be written to the stream.
     * @param cb callback on stream finished writing.
     */
    write(message: any, cb?: Callback): this;
    /**
     * Writes directly to stream WITH line ending.
     *
     * @param message the message to be written to the stream.
     * @param cb callback on stream finished writing.
     */
    writeLn(message: any, cb?: Callback): this;
    /**
     * Enables profiling of a Logger by id with elapsed times.
     *
     * @param id the identifier of the profile.
     * @param args optional aguments to be added to event.
     */
    profile(id: string, ...args: any[]): this;
    /**
     * Queries any participating Transport with ".query()" method. Transport
     * queries compile the data this method merely bundles the results.
     *
     * @example
     * blurp.query({ })
     *
     * @param options options to pass to the query.
     * @param cb optional callback on results compiled.
     */
    query<O extends IQueryOptions<L>>(options?: O, ...transports: Array<string | Transport<L, any>>): Query<L>;
    /**
     * Creates a firehose like stream of all participating Transports.
     *
     * @param options the funnel's options passed to participating transports.
     */
    firehose<O extends ITransportFirehoseOptions>(options?: O, ...transports: Array<string | Transport<L, any>>): Stream;
    /**
     * Unpipes the stream.
     */
    unpipe(): this;
    /**
     * Close the Logger emitting 'close' on stream.
     */
    close(): this;
    /**
     * Quits the Logger.
     *
     * @param cb optional callback on stream end.
     */
    exit(cb?: Callback): void;
}
