import { TransformStackCallback, Callback, Reviver, ErrorExt, IPayload, OUTPUT } from './types';
import { Logger } from './logger';
import each from 'each-async';
import { Transport } from './transports';
import json from 'jsonata';
import { noop, logger, toDate } from './utils';
import { Stream } from 'readable-stream';
import { subDays } from 'date-fns';
import { inspect } from 'util';

export type QueryExecCallback = (report: IQueryReport) => void;

/**
 * NOTE: data MUST be an array of objects.
 */
export interface IQueryOptions<L extends string> {
  timestampKey?: string;              // the property containing ts       (default: 'timestamp')
  level?: L;                          // the level to query.              (default: undefined)
  from?: string | Date | number;      // including this date.             (default: start of day)
  to?: string | Date | number;        // including this date.             (default: now)
  limit?: number;                     // max rows.                        (default: 10)
  start?: number;                     // starting row by 0 index          (default: 0)
  sort?: 'asc' | 'desc';             // ascending or descending order.    (default: 'desc')  
  transform(value: string, reviver?: Reviver): IPayload<L>;            // (default: JSON.parse)
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

const DEFAULTS: IQueryOptions<any> = {
  timestampKey: 'timestamp',
  level: undefined,          // the level to query.
  from: undefined,           // including this date.            
  to: undefined,             // including this date.           
  limit: 10,                 // max rows (0 = unlimited)                  
  start: 0,                  // starting row by 0 index          
  sort: 'desc',             // ascending or descending order.
  transform: JSON.parse     // parse each row using JSON.parse.
};

const DEFAULT_REPORT: IQueryReport<any> = {
  queried: 0,
  success: 0,
  skipped: 0,
  rows: [],
  filtered: [],
  errors: [],
  show: noop
};

export class Query<L extends string, O extends IQueryOptions<L> = IQueryOptions<L>> {

  private _transports: Array<Transport<L, any>> = [];
  report: IQueryReport<L>; // last loaded report.
  logger: Logger<L>;
  options: O;

  constructor(instance: Logger<L>, options?: O) {
    this.logger = instance;
    this.options = { ...DEFAULTS, ...options };
  }

  /**
   * Gets the loaded rows using getter.
   */
  get rows() {
    return this.report.rows || [];
  }

  /**
   * Gets all filtered rows using getter.
   */
  get filtered() {
    return this.report.filtered || [];
  }

  /**
   * Gets all bound Transports for query.
   */
  get transports() {
    return this._transports;
  }

  /**
   * Sets Tranports array.
   * 
   * @param transports an array of Transport names or instances.
   */
  set transports(transports: Array<string | Transport<L, any>>) {
    this._transports = this.logger.transports.normalize(transports);
  }

  /**
   * Adds a Transport to be added to collection.
   * 
   * @param transport a Transport name or instance.
   */
  transport(transport: string | Transport<L, any>) {
    const transports = this.logger.transports.normalize([transport]);
    if (transports[0])
      this.transports = [...this.transports, transports[0]];
    return this;
  }

  /**
   * Validates object ensures in date range matches filter.
   * 
   * @param obj the payload object to validate.
   */
  isValid(obj: IPayload<L>) {

    const { timestampKey, level, from, to } = this.options;

    const _to = toDate(to || new Date());
    const _from = toDate(from || subDays(_to, 1));

    if (
      !obj || typeof obj !== 'object' ||
      !obj.hasOwnProperty(timestampKey) ||
      (level &&
        obj.level !== level)
    )
      return;

    const ts = toDate(obj[timestampKey]);

    if (ts < _from || ts > _to)
      return;

    return true;

  }

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
  transform(stream: Stream | string[], cb?: Callback<Array<IPayload<L>>>): this {

    const _stream = !Array.isArray(stream) ? stream as Stream : null;
    const _rows = Array.isArray(stream) ? stream as string[] : null;

    let buffer = '';
    let results: Array<IPayload<L>> = [];
    let row = 0;

    const { start, sort, limit } = this.options;

    // Normalize each buffer/string as payload object.
    const normalize = (val: string, emit = true) => {

      try {

        let obj = this.options.transform(val) as IPayload<L>;

        if (!this.isValid(obj)) return;

        if (results.length >= limit && sort !== 'desc') {
          if (_stream && _stream.readable)
            _stream.destroy();
          return;
        }

        if (sort === 'desc' && results.length >= limit)
          results.shift();

        // If user applies transformer we need to have
        // symbol properties on object.
        obj = this.logger.extendPayload(obj);

        results.push(obj);

      }

      catch (ex) {
        if (emit && _stream)
          _stream.emit('error', ex);
      }

    };

    // Iterate rows of data
    if (_rows) {
      // Nothing to normalize.
      if (!_rows.length) {
        cb(null, []);
        return;
      }
      // already normalized to payload objects.
      if (typeof _rows[0] === 'object') {
        cb(null, _rows as any);
        return;
      }
      _rows.forEach(r => normalize(r));
    }

    // Listen to data on stream build normalized rows.
    else {

      _stream.on('data', data => {
        const _data = (buffer + data).split(/\n+/);
        _data.pop(); // remove empty line.

        for (const line of _data) {
          if (!start || row >= start) {
            normalize(line);
          }
          row++;
        }

        buffer = data[_data.length];

      });

      // When error destroy the stream return results.
      _stream.on('error', err => {
        if (_stream.readable)
          _stream.destroy();
        if (!cb)
          return;
        // @ts-ignore
        if (err.code === 'ENOENT')
          err = null;
        return cb(err, !err && results);
      });

      // On close add buffer callback with results.
      _stream.on('close', () => {
        if (buffer)
          normalize(buffer, false);
        if (sort === 'desc')
          results = results.reverse();
        if (cb) cb(null, results);
      });

    }

    return this;

  }

  /**
   * Loads data from Transport's where a defined query method exists.
   * 
   * @param cb a callback to pass the report to on finished.
   */
  async exec(cb?: QueryExecCallback): Promise<IQueryReport>;

  /**
   * Loads data from Transport's where a defined query method exists.
   * 
   * @param transports an array of transports to query.
   * @param cb a callback to pass the report to on finished.
   */
  async exec(transports?: Array<string | Transport<L, any>>, cb?: QueryExecCallback): Promise<IQueryReport>;
  async exec(transports?: Array<string | Transport<L, any>> | QueryExecCallback, cb?: QueryExecCallback) {

    if (typeof transports === 'function') {
      cb = transports;
      transports = undefined;
    }

    // Ensure defaults.
    cb = cb || noop;

    const _transports = this.transports =
      !(transports || []).length ?
        this.transports :
        this.logger.transports.normalize(transports as Array<string | Transport<L, any>>);

    // reset the report.
    const report = this.report = { ...DEFAULT_REPORT };
    // @ts-ignore
    report.show = this.show.bind(this);

    // Handle each iteration either callback containing data
    // or handle stream then callback with result.
    const run = (transport: Transport<L, any>, i, next) => {

      // @ts-ignore
      if (!transport.query) {
        report.skipped += 1;
        return next();
      }

      const handle = (err: ErrorExt, data?: Array<IPayload<L>>) => {

        // If not object payloads then transform.
        if (typeof data[0] === 'string')
          return this.transform(data as any, handle);

        report.queried += 1;
        if (err)
          report.errors.push([transport.label, err, i]);
        else
          report.rows = [...report.rows, ...data];

        next();

      };

      // @ts-ignore
      const query = transport.query(this.options);

      if (typeof query === 'function')
        query(handle);
      else
        this.transform(query, handle);

    };

    return new Promise((res) => {

      each(_transports, run, () => {
        this.report = { ...report };
        cb(report);
        res(report);
      });

    });

  }

  /**
   * Filter the loaded rows using JSONata.
   * @see http://docs.jsonata.org/overview
   * 
   * @example
   * .filter('');
   * 
   * @param expressions an array of JSONata expressions to apply.
   */
  filter(...expressions: string[]) {
    return this.filtered;
  }

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
  show(rows?: boolean | Array<IPayload<L>> | TransformStackCallback<L>,
    transformer?: boolean | TransformStackCallback<L>) {

    if (typeof rows === 'function') {
      transformer = rows;
      rows = undefined;
    }

    let colorize = true;

    if (typeof rows === 'boolean') {
      colorize = rows;
      rows = undefined;
    }

    if (typeof transformer === 'boolean') {
      colorize = transformer;
      transformer = undefined;
    }

    const _rows = (rows || this.rows) as Array<IPayload<L>>;

    _rows.forEach(v => {
      if (transformer && typeof transformer === 'function') {
        const transformed = (transformer as TransformStackCallback<L>)(v);
        logger.log(transformed.payload[OUTPUT]);
      }
      else {
        logger.log(inspect(v, null, null, colorize));
      }
    });

    return this;

  }

  /**
   * Resets/clears report data.
   */
  clear() {
    this.report = { ...DEFAULT_REPORT };
    return this;
  }

}
