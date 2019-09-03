import { Base } from './base';
import {
  ILoggerOptions, Colors, LoggerTransform, IPayload,
  ILogMessage, SOURCE, CONFIG, ErrorExt, MessageType, ITransportOptions,
  Callback, ITransportFirehoseOptions
} from './types';
import { DEFAULT_LEVELS, DEFAULT_COLORS, PAYLOAD_DEFAULTS, FORMAT_EXP } from './constants';
import { noop, ensureArray } from './utils';
import { ChildStore, TransportStore } from './stores';
import { inspect } from 'util';
import { EOL } from 'os';
import each from 'each-async';
import { ExceptionHandler, RejectionHandler } from './errors';
import { Transform, Stream } from 'readable-stream';
import { Transport } from './transports';
import { Query, IQueryOptions } from './query';

export class Logger<L extends string> extends Base<L, ILoggerOptions<L>> {

  stream: LoggerTransform<L>;
  children = new ChildStore<L>();
  transports = new TransportStore<L>();
  exceptions: ExceptionHandler<L>;
  rejections: RejectionHandler<L>;

  profilers: { [key: string]: number } = {};

  private lastLog: number;

  constructor(label: string, options?: ILoggerOptions<L>) {

    super(label, options);

    // No levels specified set defaults.
    if (!this.options.levels) {
      this.options.levels = DEFAULT_LEVELS as L[];
      // If colors aren't disabled by null.
      if (typeof this.options.colors === 'undefined' && this.options.colors !== null)
        this.options.colors = DEFAULT_COLORS as Colors<L>;
    }
    else {
      // Clone don't allow overwriting of levels.
      this.options.levels = [...this.options.levels];
    }

    if (!this.options.levels.length)
      throw new Error(`Cannot init Logger "${label}" using levels of undefined`);

    // If no level specified choose highest level.
    this.options.level = this.options.level || this.options.levels[this.options.levels.length - 1];

    // Initialize the Logger.
    this.init();

  }

  // PRIVATE //

  private initStream(highWaterMark: number = 16) {

    // Create Transform stream.
    this.stream = new Transform({ objectMode: true, highWaterMark }) as LoggerTransform<L>;

    this.stream.logger = this;

    this.stream._transform = (payload, enc, cb) => {

      // if streamed without hitting .log().
      if (this.muted)
        return cb();

      // No Transports can't do anything.
      if (!this.stream._readableState.pipes) {
        console.warn(
          `${EOL}Logger ${this.label} failed using Transports of undefined${EOL}${EOL}Payload:${EOL} %O${EOL}`, payload
        );
        return cb(null);
      }

      try {
        this.stream.push(payload);
      }

      catch (ex) {
        throw ex;
      }

      finally {
        cb();
      }

    };

    this.stream._final = (cb) => {
      each(this.piped, (transport, index, next) => {
        if (!transport || transport.finished)
          return setImmediate(next);
        transport.once('finish', next);
        transport.end();
      }, cb);
    };

    return this;

  }

  private init() {

    this.exceptions = new ExceptionHandler<L>(this);

    this.rejections = new RejectionHandler<L>(this);

    // Initialize the Transform stream.
    this.initStream();

    // Bind log levels.
    for (const level of this.levels) {
      this[level as string] = (msg: string | Error, ...meta: any[]) => {
        return this.log(level, msg, ...meta);
      };
    }

    // Add the transports.
    ensureArray(this.options.transports)
      .forEach((t) => this.transport(t));

    return this;

  }

  private onEvent(event: string, transport: Transport<L, any>) {

    const eventWrapper = (err) => {
      this.emit(event, err, transport);
    };

    const _event = `blurp:${event}`;

    if (!transport[_event]) {
      transport[_event] = eventWrapper;
      transport.on(event, transport[_event]);
    }

  }

  /**
   * Simple method to ensure string, used with .write() & .writeLn();
   * 
   * @param value the value to inspect
   */
  private stingify(value: any) {
    if (typeof value === 'string')
      return value;
    if (value instanceof Error)
      return value.stack || value.message;
    if (typeof value === 'object')
      return inspect(value);
    return String(value);
  }

  /**
   * Gets the elapsed time since last dispatch.
   */
  private getElapsed() {
    const now = Date.now();
    this.lastLog = this.lastLog || now;
    const elapsed = now - this.lastLog;
    this.lastLog = now;
    return elapsed;
  }

  /**
   * Parses callback from payload.splat or splat array.
   * 
   * @param payloadOrSplat the splat array or payload containing splat.
   */
  private parseCallback(payloadOrSplat: any[] | IPayload<L>) {
    const isArray = Array.isArray(payloadOrSplat);
    let splat = isArray ? payloadOrSplat : ((payloadOrSplat as IPayload<L>).splat || []);
    const cb = typeof splat[splat.length - 1] === 'function' ? splat[splat.length - 1] : undefined;
    if (cb)
      splat = splat.slice(0, splat.length - 1);
    return {
      payload: (!isArray ? { ...payloadOrSplat, splat } : undefined) as IPayload<L>,
      splat,
      cb
    };
  }


  /**
   * Creates the payload for stream.
   * 
   * @param level the level, message or payload to be logged.
   * @param message the message to be logged.
   * @param splat optional splat used for formatting message & metadata.
   */
  private createPayload(level: any, message?: any, splat: any[] = []) {

    let payload = {} as IPayload<L>;
    let cb = noop;
    let err: ErrorExt;

    if (typeof level === 'undefined') {
      payload = {
        level: 'log' as L,
        message: message || '',
        splat
      };
    }

    else {

      // Is ILogMessage object.
      if (typeof level === 'object' && level !== null) {
        payload = level as IPayload<L>;
      }

      else {

        // Logged with level or message as first prop.
        if (typeof level === 'string' && !this.levels.includes(level as L)) {
          if (typeof message !== 'undefined')
            splat.unshift(message);
          message = level;
          level = undefined;
        }

        payload = { level: level || 'log', message, splat };

      }

    }

    // Parse out any callback.
    const tmp = this.parseCallback(payload);
    payload = tmp.payload;
    cb = tmp.cb || noop;

    // Check if message is an error
    if (payload.message as any instanceof Error) {
      err = payload.message as any;
      payload = { ...payload, message: err.message };
      payload.err = err;
    }

    const tokenLen = (payload.message.match(FORMAT_EXP) || []).length;

    // Get message format token arguments.
    // const tokenArgs = payload.splat.slice(0, tokenLen);

    // Parse out any meta args and remaining splat args.
    // example: log('my name is %s', 'milton', { age: 30 }, 'waddams');
    // When transforms.splat() in stack JSON result:
    // example:      { message: 'my name is milton waddams', age: 30 }
    const parsed = payload.splat.slice(tokenLen).reduce((a, c) => {

      if (typeof c === 'undefined')
        return a;

      if (typeof c === 'object' && c !== null)
        a.meta = { ...a.meta, ...c };
      else
        a.splat = [...a.splat, c];

      return a;

    }, { meta: {}, splat: [] });

    // Add non token args to end of splat. util.format
    // will simply add these to end of formatted message.
    payload.splat = [...payload.splat.slice(0, tokenLen), ...parsed.splat];

    payload = {
      ...payload,
      ...parsed.meta // merge in any non-splat objects to payload.
    };

    return {
      payload: this.extendPayload(payload),
      cb
    };

  }

  // GETTERS //

  get levels() {
    return this.options.levels;
  }

  get index() {
    if (this.options.level === 'log')
      return -1;
    return this.levels.indexOf(this.options.level);
  }

  /**
   * Returns current piped Transports.
   */
  get piped() {
    const { pipes } = this.stream._readableState;
    return !Array.isArray(pipes) ? [pipes].filter(Boolean) : pipes;
  }

  /**
   * Ensures payload contains required defaults as well as source and options Symbols.
   * 
   * @param obj the configured payload object.
   */
  extendPayload(payload: IPayload<L>): IPayload<L> {

    // Ensure defaults.
    payload = { ...PAYLOAD_DEFAULTS, ...payload };

    // Clone payload as source object.
    const source = payload[SOURCE];
    payload[SOURCE] = { ...source, ...(payload as any) };

    // Create the configuration object.
    payload[CONFIG] = {
      label: this.label,
      levels: this.levels,
      colors: this.options.colors,
      elapsed: this.getElapsed()
    };

    // Error/clean stored in SOURCE clean from main payload.
    const { err, splat, ...clean } = payload;

    return clean;

  }

  // MUTING //

  /**
   * Mutes the Logger OR specified child Loggers.
   * 
   * @param child the child or children to mute.
   */
  mute(...child: string[]) {
    if (!child.length) {
      this.muted = true;
      return this;
    }
    this.children.toArray().forEach(c => child.includes(c.label) && c.mute());
    return this;
  }

  /**
   * Unmutes the Logger OR specified child Loggers.
   * 
   * @param child the child or children to unmute.
   */
  unmute(...child: string[]) {
    if (!child.length) {
      this.muted = false;
      return this;
    }
    this.children.toArray().forEach(c => child.includes(c.label) && c.unmute());
    return this;
  }

  // CHILDREN //

  /**
   * Adds a child Logger to the current Logger.
   * 
   * @param child the child Logger to be added.
   */
  child(label: string, meta: { [key: string]: any }) {
    const parent = this;
    const child = Object.create(parent) as Logger<L>;
    child.stream = Object.create(child.stream, {
      write: {
        value(chunk, cb) {
          chunk = { ...chunk, ...meta };
          parent.stream.write(chunk, cb);
          return true;
        }
      }
    });
    child.label = label;
    this.children.add(label, child, this);
    return child;
  }

  // TRANSPORTS //

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
  transport(transport: string | Transport<any, any>, ...transports: Array<Transport<any, any>>) {

    if (typeof transport === 'string')
      return this.transports.get(transport);

    [transport, ...transports].forEach(tport => {

      this.transports.add(tport.label, tport);

      this.onEvent('error', tport);
      this.onEvent('warn', tport);

      this.stream.pipe(tport.stream);

      if (tport.get('exceptions'))
        this.exceptions.handle(tport);

      if (tport.get('rejections'))
        this.rejections.handle(tport);
    });

    return this;
  }

  // LOGGING //

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
  log(level?: any, message?: any, ...splat: any[]) {
    if (this.muted)
      return this;
    const { payload, cb } = this.createPayload(level, message, splat);
    this.stream.write(payload, (err) => {
      if (err) throw err;
      cb(payload);
    });
    return this;
  }

  /**
   * Writes directly to stream WITHOUT line ending.
   * 
   * @param message the message to be written to the stream.
   * @param cb callback on stream finished writing.
   */
  write(message: any, cb: Callback) {
    this.stream.write(this.stingify(message), cb);
    return this;
  }

  /**
   * Writes directly to stream WITH line ending.
   * 
   * @param message the message to be written to the stream.
   * @param cb callback on stream finished writing.
   */
  writeLn(message: any, cb: Callback) {
    this.stream.write(this.stingify(message) + EOL, cb);
    return this;
  }

  /**
   * Enables profiling of a Logger by id with elapsed times.
   * 
   * @param id the identifier of the profile.
   * @param args optional aguments to be added to event.
   */
  profile(id: string, ...args) {

    const time = Date.now();

    if (this.profilers[id]) {

      const end = this.profilers[id];
      delete this.profilers[id];
      let obj = typeof args[args.length - 1] === 'object' ? args.pop() : {};

      // manually create payload
      // directly displatch.
      obj = {
        level: 'info',
        message: id,
        duration: time - end,
        ...obj
      };

      this.log(obj);

      return this;

    }

    this.profilers[id] = time;

    return this;

  }

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
  query<O extends IQueryOptions<L>>(options?: O, ...transports: Array<string | Transport<L, any>>): Query<L> {
    const query = new Query(this, options);
    if (!transports.length)
      transports = this.transports.toArray();
    query.transports = transports;
    return query;
  }

  /**
   * Creates a firehose like stream of all participating Transports.
   * 
   * @param options the funnel's options passed to participating transports.
   */
  firehose<O extends ITransportFirehoseOptions>(options?: O, ...transports: Array<string | Transport<L, any>>) {

    const stream = new Stream();
    const streams = [];

    // @ts-ignore
    stream._streams = streams;

    stream.destroy = () => {
      let i = streams.length;
      while (i--) {
        streams[i].destroy();
      }
      return stream;
    };

    const _transports = this.transports.normalize(transports);

    // @ts-ignore
    _transports.filter(transport => !!transport.firehose)
      .forEach(transport => {
        // @ts-ignore
        const hose = transport.firehose(options);

        if (!hose)
          return;

        hose.on('log', obj => {
          obj.transport = [...(obj.transport || []), transport.label];
          stream.emit('log', obj);
        });

        hose.on('error', (err: any) => {
          err.transport = [...(err.transport || []), transport.label];
          stream.emit('error', err);
        });

        streams.push(hose);

      });

    return stream;

  }

  // EXITING & CLOSING STREAM //

  /**
   * Unpipes the stream.
   */
  unpipe() {
    this.stream.unpipe();
    return this;
  }

  /**
   * Close the Logger emitting 'close' on stream.
   */
  close() {
    this.unpipe();
    this.stream.emit('close');
    return this;
  }

  /**
   * Quits the Logger.
   * 
   * @param cb optional callback on stream end.
   */
  exit(cb?: Callback) {
    this.close();
    this.stream.end(cb || noop);
  }

}
