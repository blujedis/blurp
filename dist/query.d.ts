import { TransformStackCallback, Callback, Reviver, ErrorExt, IPayload } from './types';
import { Logger } from './logger';
import { Transport } from './transports';
import { Stream } from 'readable-stream';
export declare type QueryExecCallback = (report: IQueryReport) => void;
/**
 * NOTE: data MUST be an array of objects.
 */
export interface IQueryOptions<L extends string> {
    timestampKey?: string;
    level?: L;
    from?: string | Date | number;
    to?: string | Date | number;
    limit?: number;
    start?: number;
    sort?: 'asc' | 'desc';
    transform(value: string, reviver?: Reviver): IPayload<L>;
    [key: string]: any;
}
export interface IQueryReport<L extends string = any> {
    queried?: number;
    success: number;
    skipped: number;
    rows: object[];
    filtered: object[];
    errors: Array<[string, ErrorExt, number]>;
    /**
     * Shows query results using util.inspect.
     *
     * @param colorize when true passes true to util.inspect for colors (default: true)
     */
    show(colorize?: boolean): this;
    /**
     * Shows query results as string after transformer is applied.
     *
     * @param transformer a combined transformer to apply or uses Logger's.
     */
    show(transformer: TransformStackCallback<L>): this;
    /**
     * Shows query results as util.inspect or string when transformer is provided.
     *
     * @param rows an array of loaded object rows to be displayed.
     * @param colorize when true util.inspect colors set to true.
     */
    show(rows: Array<IPayload<L>>, colorize?: boolean): this;
    /**
     * Shows query results as util.inspect or string when transformer is provided.
     *
     * @param rows an array of loaded object rows to be displayed.
     * @param transformer a combined transformer to apply or uses Logger's.
     */
    show(rows: Array<IPayload<L>>, transformer?: TransformStackCallback<L>): this;
}
export declare class Query<L extends string, O extends IQueryOptions<L> = IQueryOptions<L>> {
    private _transports;
    report: IQueryReport<L>;
    logger: Logger<L>;
    options: O;
    constructor(instance: Logger<L>, options?: O);
    /**
     * Gets the loaded rows using getter.
     */
    get rows(): object[];
    /**
     * Gets all filtered rows using getter.
     */
    get filtered(): object[];
    /**
     * Gets all bound Transports for query.
     */
    get transports(): Array<string | Transport<L, any>>;
    /**
     * Sets Tranports array.
     *
     * @param transports an array of Transport names or instances.
     */
    set transports(transports: Array<string | Transport<L, any>>);
    /**
     * Adds a Transport to be added to collection.
     *
     * @param transport a Transport name or instance.
     */
    transport(transport: string | Transport<L, any>): this;
    /**
     * Validates object ensures in date range matches filter.
     *
     * @param obj the payload object to validate.
     */
    isValid(obj: IPayload<L>): boolean;
    /**
     * Reads stream parsing rows of log payloads.
     *
     * @param rows array of payload objects to normalize/parse.
     * @param cb callback on finished.
     */
    transform(rows: string[], cb?: Callback<Array<IPayload<L>>>): Query<L>;
    /**
     * Reads stream parsing rows of log payloads.
     *
     * @param stream a readable stream.
     * @param cb callback on finished.
     */
    transform(stream: Stream, cb?: Callback<Array<IPayload<L>>>): Query<L>;
    /**
     * Loads data from Transport's where a defined query method exists.
     *
     * @param cb a callback to pass the report to on finished.
     */
    exec(cb?: QueryExecCallback): Promise<IQueryReport>;
    /**
     * Loads data from Transport's where a defined query method exists.
     *
     * @param transports an array of transports to query.
     * @param cb a callback to pass the report to on finished.
     */
    exec(transports?: Array<string | Transport<L, any>>, cb?: QueryExecCallback): Promise<IQueryReport>;
    /**
     * Filter the loaded rows using JSONata.
     * @see http://docs.jsonata.org/overview
     *
     * @example
     * .filter('');
     *
     * @param expressions an array of JSONata expressions to apply.
     */
    filter(...expressions: string[]): object[];
    /**
     * Shows query results using util.inspect
     *
     * @param colorize when true color true is passed to util.inspect (default: true)
     */
    show(colorize?: boolean): this;
    /**
     * Shows query results as string after transformer is applied.
     *
     * @param transformer a combined transformer to apply or uses Logger's.
     */
    show(transformer: TransformStackCallback<L>): this;
    /**
     * Shows query results as util.inspect or string when transformer is provided.
     *
     * @param rows an array of loaded object rows to be displayed.
     * @param colorize when true util.inspect colors set to true.
     */
    show(rows: Array<IPayload<L>>, colorize?: boolean): this;
    /**
     * Shows query results as util.inspect or string when transformer is provided.
     *
     * @param rows an array of loaded object rows to be displayed.
     * @param transformer a combined transformer to apply or uses Logger's.
     */
    show(rows: Array<IPayload<L>>, transformer?: TransformStackCallback<L>): this;
    /**
     * Resets/clears report data.
     */
    clear(): this;
}
