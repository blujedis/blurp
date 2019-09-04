import { Kleur } from 'kleur';
import { Transform, Writable, Stream } from 'readable-stream';
import { Logger } from './logger';
import { Transport } from './transports';
import { IQueryOptions } from './query';

// MISC //

export type DefaultLevels = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export type Style = keyof Kleur;

export type Styles = Style | Style[];

export type Colors<L extends string> =
  { [K in L]?: Styles } & { log?: Styles };

export type MessageType = string | Error;

export type Callback<T = any> = (err?: ErrorExt, data?: T) => void;

export type ConsoleLog = (message?: any, ...optionalParams: any[]) => void;

// MODIFIER //

export type TransformError = false | null | undefined | Error;

export type TransformErrorTuple = [string, TransformError];

export type TransformType = 'transform' | 'format';

export type TransformOptionsCallback<L extends string> = <O>(options?: O) => TransformResultCallback<L, O>;

export interface TransformResultCallback<L extends string, O = any> {
  (payload?: IPayload<L>, options?: O): ITransformResult<L>;
  _name: string;
  _type: TransformType;
  _options: O;
}

export interface TransformStackCallback<L extends string, O = any> {
  (payload?: IPayload<L>): ITransformResult<L>;
  _stack?: Array<TransformResultCallback<L, O>>;
}

export interface ITransformResult<L extends string> {
  payload: IPayload<L>;
  errors: TransformErrorTuple[];
}

// ADD TRANSFORM or FORMAT //

export type ModifierCallback<L extends string> =
  (payload: IPayload<L>, options?: any) => IPayload<L>;

export type FormatCallback<L extends string> =
  (payload: IPayload<L>, options?: any) => string;

export type TransformCallback<L extends string> = ModifierCallback<L> | FormatCallback<L>;

// PAYLOAD //

export const CONFIG = Symbol.for('CONFIG');

export const SOURCE = Symbol.for('SOURCE');

export const OUTPUT = Symbol.for('OUTPUT');

export type ErrorExt = Error & { [key: string]: any, isException?: boolean, isRejection?: boolean };

interface IPayloadBase {
  message: string;
  [key: string]: any;
}

export interface IPayloadSource<L extends string> extends IPayloadBase {
  level: L;
  splat?: any[];
  err?: ErrorExt;
}

export interface IPayloadConf<L extends string> {
  readonly label: string;
  readonly transform?: string;
  readonly levels: L[];
  readonly colors: Colors<L>;
  readonly elapsed: number;
}

export interface IPayload<L extends string> extends IPayloadBase {
  [CONFIG]?: IPayloadConf<L>;         // config object with levels/internal meta.
  [SOURCE]?: IPayloadSource<L>;       // copy of original payload.
  [OUTPUT]?: string;                  // the formatted output
  level: string | L;
}

export interface ILogMessage<L extends string> {
  level?: L;
  message: any;
  splat?: any[];
  [key: string]: any;
}

// TRANSPORT //

export type Reviver = (this: any, key: string, value: any) => any;

export interface ITransportFirehoseOptions {
  // Placeholder
  [key: string]: any;
}

export interface ITransportBaseOptions<L extends string> {
  level?: L;
  transforms?: TransformResultCallback<L> | Array<TransformResultCallback<L>>;
  transform?: boolean;
}

export interface ITransportOptions<L extends string> extends ITransportBaseOptions<L> {
  exceptions?: boolean;
  rejections?: boolean;
}

export interface ITransport<L extends string> {
  stream: TransportWritable;
  logger: Logger<L>;
  finished: boolean;
  logv?(payloads: Array<IPayload<L>>, cb?: Callback): void;
  query?<P extends IQueryOptions<L>>(options?: P): Stream | Callback<IPayload<L>>;
  firehose?<P extends ITransportFirehoseOptions>(options?: P): Stream;
}

export type TransportHandler<L extends string> = (payload: IPayload<L>, cb: Callback) => void;

// LOGGER //

export type LoggerCompiled<L extends string> = Logger<L> & LoggerMethods<L>;

export interface ILoggerMethod<L extends string> {
  (message: MessageType, ...meta: any[]): LoggerCompiled<L>;
  (payload: ILogMessage<L>): LoggerCompiled<L>;
}

export type LoggerMethods<L extends string> = { [K in L]: ILoggerMethod<L> };

export interface ILoggerOptions<L extends string> extends ITransportBaseOptions<L> {
  levels?: L[];
  colors?: Colors<L>;
  errorExit?: boolean;
  transports?: Transport<L, any> | Array<Transport<L, any>>;
}

export type LoggerTransform<L extends string> = Transform & { _readableState?: any, logger?: Logger<L> };

export type TransportWritable = Writable & { _readableState?: any };
