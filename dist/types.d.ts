import { Kleur } from 'kleur';
import { Transform, Writable, Stream } from 'readable-stream';
import { Logger } from './logger';
import { Transport } from 'transports/transport';
import { IQueryOptions } from './query';
export declare type DefaultLevels = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
export declare type Style = keyof Kleur;
export declare type Styles = Style | Style[];
export declare type Colors<L extends string> = {
    [K in L]?: Styles;
} & {
    log?: Styles;
};
export declare type MessageType = string | Error;
export declare type Callback<T = any> = (err?: ErrorExt, data?: T) => void;
export declare type ConsoleLog = (message?: any, ...optionalParams: any[]) => void;
export declare type TransformError = false | null | undefined | Error;
export declare type TransformErrorTuple = [string, TransformError];
export declare type TransformType = 'transform' | 'format';
export declare type TransformOptionsCallback<L extends string> = <O>(options?: O) => TransformResultCallback<L, O>;
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
export declare type ModifierCallback<L extends string> = (payload: IPayload<L>, options?: any) => IPayload<L>;
export declare type FormatCallback<L extends string> = (payload: IPayload<L>, options?: any) => string;
export declare type TransformCallback<L extends string> = ModifierCallback<L> | FormatCallback<L>;
export declare const CONFIG: unique symbol;
export declare const SOURCE: unique symbol;
export declare const OUTPUT: unique symbol;
export declare type ErrorExt = Error & {
    [key: string]: any;
    isException?: boolean;
    isRejection?: boolean;
};
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
    [CONFIG]?: IPayloadConf<L>;
    [SOURCE]?: IPayloadSource<L>;
    [OUTPUT]?: string;
    level: string | L;
}
export interface ILogMessage<L extends string> {
    level?: L;
    message: any;
    splat?: any[];
    [key: string]: any;
}
export declare type Reviver = (this: any, key: string, value: any) => any;
export interface ITransportFirehoseOptions {
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
export declare type TransportHandler<L extends string> = (payload: IPayload<L>, cb: Callback) => void;
export declare type LoggerCompiled<L extends string> = Logger<L> & LoggerMethods<L>;
export interface ILoggerMethod<L extends string> {
    (message: MessageType, ...meta: any[]): LoggerCompiled<L>;
    (payload: ILogMessage<L>): LoggerCompiled<L>;
}
export declare type LoggerMethods<L extends string> = {
    [K in L]: ILoggerMethod<L>;
};
export interface ILoggerOptions<L extends string> extends ITransportBaseOptions<L> {
    levels?: L[];
    colors?: Colors<L>;
    errorExit?: boolean;
    transports?: Transport<L, any> | Array<Transport<L, any>>;
}
export declare type LoggerTransform<L extends string> = Transform & {
    _readableState?: any;
    logger?: Logger<L>;
};
export declare type TransportWritable = Writable & {
    _readableState?: any;
};
export {};
