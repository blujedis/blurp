import { Transport } from './transport';
import { ITransportOptions, SOURCE, OUTPUT, IPayload, Callback, DefaultLevels } from '../types';
import { EOL } from 'os';
import { logger, capitalize, wrapStream } from '../utils';

export interface IConsoleTransportOptions<L extends string> extends ITransportOptions<L> {
  stream?: NodeJS.WritableStream; // optional custom stream.
  errorLevels?: L[];   // levels that should write to stderr or console.error.
  eol?: string;
}

export class ConsoleTransport<L extends string> extends Transport<L, IConsoleTransportOptions<L>> {

  constructor(options?: IConsoleTransportOptions<L>) {

    super('console', { eol: EOL, errorLevels: [], ...options });
    const { stream } = this.options;

    if (stream && !stream.writable) {
      logger.warn(`Transport "${capitalize(this.label)}" has unwritable stream falling back to process.stdout & process.stderr`);
      this.options.stream = undefined;
    }

  }

  /**
   * Gets stream from options.
   * 
   * @param level the level of the log message.
   */
  private dispatcher(level: L) {

    const eol = this.options.eol;

    if (this.options.stream)
      return { write: (message) => this.options.stream.write(message + eol) };

    // If not included in error levels use stdout or console.log.
    if (level === 'log' || !this.options.errorLevels.includes(level))
      return wrapStream(console._stdout, console.log, eol);

    // if error or warn use for fallback
    const fallbackConsole = ['error', 'warn'].includes(level) ? console[level as string] : console.log;
    return wrapStream(console._stderr, fallbackConsole, eol);

  }

  /**
   * Log handler that receives payload when Transport writes to stream.
   * 
   * @param result the log payload object.
   * @param enc the encoding string.
   * @param cb callback called on completed to continue stream.
   */
  log(payload: IPayload<L>, cb: Callback) {

    setImmediate(() => this.emit('payload', payload));
    const { [SOURCE]: source, [OUTPUT]: output } = payload;
    if (source.level === 'write' || source.level === 'writeLn')
      process.stdout.write(output);
    else
      this.dispatcher(source.level).write(output);
    cb();

  }

}
