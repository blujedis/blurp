import { ILoggerOptions, DefaultLevels, LoggerCompiled } from './types';
import { initTransforms, transforms } from './transforms';
import { combine, createFormatter, createModifier } from './create';
import { LoggerStore } from './stores';
import { ConsoleTransport, FileTransport, Transport } from './transports';
import { Logger } from './logger';
import { extend } from './utils';

const loggers = new LoggerStore();

/**
 * Creates a new Blurp Logger.
 * 
 * @param label the label or name of the Logger.
 * @param options the Logger's options.
 * @param force allows overwriting existing Loggers.
 */
function createLogger<L extends string>(
  label: string,
  options?: ILoggerOptions<L>, force: boolean = false): LoggerCompiled<L> {
  
  let logger = loggers.get<LoggerCompiled<L>>(label);
  
  // Return existing logger if 
  // exists and not force to recreate.
  if (logger && !force)
    return logger;

  logger = new Logger<L>(label as string, options) as LoggerCompiled<L>;
  loggers.add(label, logger, force);

  return logger;

}

/**
 * Creates the default logger for use with console/terminal.
 * 
 * @param name the name of the default logger.
 */
function defaultLogger<L extends string = DefaultLevels>() {

  const _transforms = initTransforms<L>();

  return createLogger<L>('default', {
    transports: [
      new ConsoleTransport(),
      new FileTransport({
        transforms: [
          _transforms.stack.file()
        ]
      })
    ],
    transforms: [
      _transforms.stack.terminal()
    ]
  });

}

function init() {

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
  return extend(defaultLogger(), extended);

}

export default init();
