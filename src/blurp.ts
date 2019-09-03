import { ILoggerOptions, DefaultLevels, LoggerCompiled } from './types';
import { transforms } from './transforms';
import { combine, createFormatter, createModifier } from './create';
import { LoggerStore } from './stores';
import { ConsoleTransport, FileTransport, Transport } from './transports';
import { Logger } from './logger';
import { extend } from './utils';

const loggers = new LoggerStore();

/**
 * Creates a new Blurp Logger.
 * 
 * @param options the Logger's options.
 */
function createLogger<L extends string = DefaultLevels>(options?: ILoggerOptions<L>): LoggerCompiled<L>;

/**
 * Creates a new Blurp Logger.
 * 
 * @param label the label or name of the Logger.
 * @param options the Logger's options.
 */
function createLogger<L extends string = DefaultLevels>(
  label: string, options?: ILoggerOptions<L>): LoggerCompiled<L>;
function createLogger<L extends string = DefaultLevels>(
  label: string | ILoggerOptions<L>,
  options?: ILoggerOptions<L>): LoggerCompiled<L> {
  if (typeof label === 'object') {
    options = label;
    label = undefined;
  }
  // Random string good collide I guess but unlikely good enough for here.
 label = label || ('$' + (Math.random() * 0xFFFFFF << 0).toString(16));
  const log = new Logger<L>(label as string, options) as LoggerCompiled<L>;
  loggers.add(label as string, log);
  return log;
}

/**
 * Creates the default logger for use with console/terminal.
 * 
 * @param name the name of the default logger.
 */
function defaultLogger<L extends string = DefaultLevels>() {
  return createLogger<L>('default', {
    transports: [
      new ConsoleTransport(),
      new FileTransport({
        transforms: [
          transforms.stack.file()
        ]
      })
    ],
    transforms: [
      transforms.stack.terminal()
    ]
  });
}

const logger = defaultLogger();

const extended = {
  loggers,
  createLogger,
  createFormatter,
  createModifier,
  transforms,
  combine,
  ConsoleTransport,
  FileTransport,
  Transport
};

// Merge instance with helpers.
const blurp = extend(logger, extended);

export default blurp;
