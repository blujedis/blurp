import { Transport } from './transport';
import {
  ITransportOptions, OUTPUT, IPayload, Callback,
  ITransportFirehoseOptions,
  DefaultLevels
} from '../types';
import rotator from 'file-stream-rotator';
import { EOL } from 'os';
import { WriteStream, createReadStream } from 'fs';
import { Stream } from 'readable-stream';
import { tail } from './tail';
import { IQueryOptions, Query } from '../query';

export type Frequency = 'minute' | 'hourly' | 'daily' | 'custom' | 'test' | 'h' | 'm';

export interface IFileOptions {
  flags?: string;
  encoding?: string;
  fd?: number;
  mode?: number;
  autoClose?: boolean;
  start?: number;
  highWaterMark?: number;
}

/**
 * @see https://www.npmjs.com/package/file-stream-rotator
 */
export interface IFileTransportOptions<L extends string> extends ITransportOptions<L> {
  filename?: string;                                    // file path for logs
  frequency?: Frequency;                                // (default: YYYYMMDD)             
  verbose?: boolean;                                    // (default: true)
  date_format?: string;                                 // uses moment.js formatting.
  size?: string;                                        // numeric w/ k, m or g
  max_logs?: string | number;                           // numeric or num with d for days
  audit_file?: string;                                  // optional path to write audit file.
  end_stream?: boolean;                                 // use true if looping (default: false)
  file_options?: IFileOptions;                          // node file option flags.
  eol?: string;                                         // (default: os.EOL)define end of line.
  onRotate?(oldFile?: string, newFile?: string): void;  // callback on file rotation.
  onNew?(newFile?: string): void;                       // callback on file rotation.
}

const DEFAULTS: IFileTransportOptions<any> = {
  filename: './logs/%DATE%.log',
  frequency: 'daily',
  verbose: false,
  date_format: 'YYYY-MM-DD',
  size: '5m',
  max_logs: '7d',
  audit_file: './logs/_audit.json',
  file_options: { flags: 'a' },
  eol: EOL
};

export class FileTransport<L extends string> extends Transport<L, IFileTransportOptions<L>> {

  rotator: WriteStream;

  constructor(options?: IFileTransportOptions<L>) {
    super('console', { ...DEFAULTS, ...options });

    options = this.options;

    const verbose = options.verbose;
    options.verbose = false;

    if (['hourly', 'minute'].includes(options.frequency))
      options.frequency = options.frequency.charAt(0) as 'h' | 'm';

    this.rotator = rotator.getStream(options);

    if (options.onRotate)
      this.rotator.on('rotate', this.rotate.bind(this));

    if (options.onNew)
      this.rotator.on('new', this.newfile.bind(this));

    if (verbose)
      this.console.log(`Transport "${this.label} logging to file: ${this.options.filename}`);
  }

  /** 
   * Gets the active filename.
   */
  get filename(): string {
    // @ts-ignore
    const files = this.rotator.auditLog.files;
    return files[files.length - 1].name;
  }

  /**
   * Callback handler on new file created.
   * 
   * @param filename the new filename that was created.
   */
  newfile(newFile: string) {
    if (this.options.onRotate)
      return this.options.onNew(newFile);
    this.console.log(`Transport "${this.label}" logging to NEW file: ${newFile}`);
    return this;
  }

  /**
   * Callback handler on file rotated.
   * 
   * @param oldFile the previous file path.
   * @param newFile the new or current file path.
   */
  rotate(oldFile: string, newFile: string) {
    if (this.options.onRotate)
      return this.options.onRotate(oldFile, newFile);
    // PLACEHOLDER: add gzip archiving.
    return this;
  }

  /**
   * Queries a 
   * @param options options to apply to query logs.
   */
  query(options: Query<L> | IQueryOptions<L>) {

    // Normalize options.
    const isQuery = options instanceof Query;
    options = isQuery ? (options as Query<L>).options : options;
    const { filename, encoding } = options as IQueryOptions<L>;

    // Create the file stream.
    const stream = createReadStream(filename || this.filename, { encoding: encoding || 'utf8' });

    // Query instance passed just return stream.
    if (!isQuery)
      return stream;

    const query = options as Query<L>;
    query.transport(this);

    // Return the query user will call query.exec((err, data) => do something);
    return query;

  }

  /**
   * Enables connection to Logger for streaming events to firehose.
   * 
   * @param options the config to pass to firehouse as options.
   */
  firehose(options?: ITransportFirehoseOptions) {

    const stream = new Stream();
    options = options || {} as ITransportFirehoseOptions;

    // @ts-ignore override destroy method.
    stream.destroy = tail(this.filename, (err, line) => {

      if (err)
        return stream.emit('error', err);

      try {
        stream.emit('data', line);
        stream.emit('log', JSON.parse(line));
      }

      catch (e) {
        this.console.log(e);
        stream.emit('error', e);
      }

    });

    return stream;

  }

  /**
   * Log handler that receives payload when Transport writes to stream.
   * 
   * @param result the log payload object.
   * @param enc the encoding string.
   * @param cb callback called on completed to continue stream.
   */
  log(payload: IPayload<L>, cb: Callback) {
    const { [OUTPUT]: output } = payload;
    setImmediate(() => this.emit('payload', payload));
    this.rotator.write(output + this.options.eol);
    cb();
  }

}
