import { Base } from '../base';
import { Writable, Readable } from 'readable-stream';
import {
  ITransportOptions, IPayload, SOURCE, ITransformResult,
  CONFIG, TransportWritable, Callback,
  ITransport,
  OUTPUT
} from '../types';
import { Logger } from '../logger';
import { combine } from '../create';
import { noop, ensureArray } from '../utils';

export abstract class Transport
  <L extends string, O extends ITransportOptions<L>> extends Base<L, O> implements ITransport<L> {

  stream: TransportWritable;
  logger: Logger<L>;
  finished: boolean;

  constructor(label: string, options?: O, highWaterMark: number = 16) {

    super(label, options);

    this.stream = new Writable({
      objectMode: true,
      highWaterMark
    });

    this.stream._write = this._write.bind(this);

    this.stream._writev = this._writev.bind(this);

    this.stream.once('pipe', this._pipe.bind(this));

    this.stream.once('unpipe', this._unpipe.bind(this));

  }

  private _pipe(transform: Readable & { logger: Logger<L> }) {
    this.logger = transform.logger;
    if (!this.transformer)
      this.compile();
  }

  private _unpipe(transform: Readable & { logger: Logger<L> }) {
    if (transform.logger === this.logger) {
      this.logger = null;
      if (this.close)
        this.close();
    }
  }

  // OVERRIDES //

  /**
   * Writes payload to stream.
   * 
   * @param payload the log payload object provided by Logger.
   * @param enc the encoding type.
   * @param cb the callback on finished to continue stream.
   */
  private _write(payload: IPayload<L>, enc: string, cb: Callback) {

    // prevent err.
    cb = cb || noop;

    if (!this.accept(payload))
      return cb(null);

    // Update the config with the name of the transform.
    // @ts-ignore
    payload[CONFIG].transform = this.label;

    if (payload.level === 'write' || payload.level === 'writeLn') {
      payload[OUTPUT] = payload.message;
      return this.log(payload, cb);
    }

    // If no transformer just return the payload.
    if (!this.transformer)
      return this.log(payload, cb);

    let tErr: Error;
    let result: ITransformResult<L>;

    try {
      result = this.transformer({ ...payload });
    }
    catch (ex) {
      tErr = ex;
    }

    if (tErr || result.errors.length) {
      cb();
      if (tErr) throw tErr;
      return;
    }

    return this.log(result.payload, cb);

  }

  /**
   * Writes an array of log payload objects.
   * 
   * @param payloads an array of log payload objects.
   * @param cb the callback on completed to continue stream.
   */
  private _writev(
    payloads: Array<{
      chunk: IPayload<L>, encoding: string,
      callback?: Callback
    }>, cb: Callback) {

    cb = cb || noop;

    // Check if logv is defined.
    // @ts-ignore
    if (this.logv) {

      const _payloads = payloads.filter(chunk => this.accept, this).map(p => p.chunk);
      if (!_payloads.length)
        return cb(null);
      // @ts-ignore
      return this.logv(_payloads, cb);

    }

    for (const obj of payloads) {

      obj.callback = obj.callback || noop;

      const payload = { ...obj.chunk };

      if (!this.accept(payload)) continue;

      // Update the config with the name of the transform.
      // @ts-ignore
      payload[CONFIG].transform = this.label;

      if (!this.transformer)
        return this.log(payload, obj.callback);

      let tErr: Error;
      let result: ITransformResult<L>;

      try {
        result = this.transformer({ ...payload });
      }
      catch (ex) {
        tErr = ex;
      }

      if (tErr || result.errors.length) {

        obj.callback();

        if (tErr) {
          cb(null);
          throw tErr;
        }

      }

      else {
        return this.log(result.payload, obj.callback);
      }

    }

    return cb(null);

  }

  // HELPERS //

  get level() {
    return this.options.level || this.logger.level;
  }

  set level(level: L) {
    if (!this.levels.includes(level)) {
      this.console.warn(`Level "${level} ignored, valid levels [${this.levels.join(', ')}]`);
      return;
    }
    this.options.level = level;
  }

  get levels() {
    return this.logger.levels;
  }

  get index() {
    if (['log', 'write', 'writeLn'].includes(this.level))
      return -1;
    return this.levels.indexOf(this.level);
  }

  /**
   * Compiles Transforms into single Transformer function.
   */
  protected compile() {
    const _transforms = ensureArray(this.options.transforms);
    const transforms = (_transforms || []).length ? _transforms :
      (this.logger && ensureArray(this.logger.get('transforms')) || []);
    if (transforms.length)
      this.transformer = combine(...transforms);
    return this;
  }

  /**
   * Gets the index of the specified level.
   * 
   * @param level the level to get index for.
   */
  getIndex(level: L) {
    if (['log', 'write', 'writeLn'].includes(this.level))
      return -1;
    return this.levels.indexOf(level);
  }

  /**
   * Checks if provided level is active.
   * 
   * @param index the index to verify as active.
   * @param max the max allowable index.
   */
  isActiveIndex(index: number, max?: number) {
    max = typeof max === 'undefined' ? this.index : max;
    return index <= max;
  }

  /**
   * Checks if provided level is active.
   * 
   * @param index the level to verify as active.
   * @param max the max allowable level.
   */
  isActiveLevel(level: L, max?: L) {
    return this.isActiveIndex(this.getIndex(level), this.getIndex(max));
  }

  /**
   * Checks if Payload can be accepted.
   * 
   * @param obj the Payload object or object containing write chunk.
   */
  accept(obj: { chunk: IPayload<L> } | IPayload<L>) {

    const payload = obj.chunk || obj;

    const { level, err } = payload[SOURCE];

    // If muted, invalid level or is exception reject.
    // exceptions handled directly by Exception stream.
    if (this.muted || !this.isActiveLevel(level as L, this.level) ||
      (err && err.isException && this.options.exceptions) ||
      (err && err.isRejection && this.options.rejections))
      return false;

    return true;

  }

  // MUST OVERRIDE LOG LEVELS //

  /**
   * Log handler that receives payload when Transport writes to stream.
   * 
   * @param payload the log payload object.
   * @param enc the encoding string.
   * @param cb callback called on completed to continue stream.
   */
  log(payload: IPayload<L>, cb: Callback) {
    throw new Error(`Transport ${this.label} does NOT implement .log()`);
  }

  close() {
    this.stream.emit('close');
  }

}
