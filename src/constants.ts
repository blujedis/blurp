import { ITransportOptions, IPayload, DefaultLevels, Colors } from './types';
import { readPkg } from './utils';

export const pkg = readPkg();

export const TRANSPORT_DEFAULTS: ITransportOptions<any> = {
  transform: true,
  exceptions: false,
  rejections: false
};

export const PAYLOAD_DEFAULTS: IPayload<any> = {
  level: 'log',
  message: ''
};

export const FORMAT_EXP = /%[scdjifoO%]/g;

export const DEFAULT_LEVELS: DefaultLevels[] = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'];

export const DEFAULT_COLORS: Colors<DefaultLevels> = {

  // Levels
  fatal: ['bgRed', 'white', 'bold'],
  error: ['red'],
  warn: 'yellow',
  info: 'cyan',
  debug: 'magenta',
  trace: 'blue'

};
