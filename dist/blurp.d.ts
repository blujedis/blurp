import { ILoggerOptions, DefaultLevels, LoggerCompiled } from './types';
import { combine, createFormatter, createModifier } from './create';
import { LoggerStore } from './stores';
import { ConsoleTransport, FileTransport, Transport } from './transports';
import { Logger } from './logger';
/**
 * Creates a new Blurp Logger.
 *
 * @param label the label or name of the Logger.
 * @param options the Logger's options.
 * @param force allows overwriting existing Loggers.
 */
declare function createLogger<L extends string>(label: string, options?: ILoggerOptions<L>, force?: boolean): LoggerCompiled<L>;
declare const _default: Logger<DefaultLevels> & import("./types").LoggerMethods<DefaultLevels> & {
    loggers: LoggerStore;
    createLogger: typeof createLogger;
    createFormatter: typeof createFormatter;
    createModifier: typeof createModifier;
    transforms: {
        modifier: {
            align: (options?: import("./transforms").IAlignTransformOptions) => {
                (payload: import("./types").IPayload<any>): {
                    payload: import("./types").IPayload<any>;
                    errors: any[];
                };
                _name: string;
                _type: import("./types").TransformType;
                _options: import("./transforms").IAlignTransformOptions;
            };
            casing: (options?: import("./transforms").ICaseTransformOptions) => {
                (payload: import("./types").IPayload<any>): {
                    payload: import("./types").IPayload<any>;
                    errors: any[];
                };
                _name: string;
                _type: import("./types").TransformType;
                _options: import("./transforms").ICaseTransformOptions;
            };
            colorize: (options?: import("./transforms").IColorizeTransformOptions<any>) => {
                (payload: import("./types").IPayload<any>): {
                    payload: import("./types").IPayload<any>;
                    errors: any[];
                };
                _name: string;
                _type: import("./types").TransformType;
                _options: import("./transforms").IColorizeTransformOptions<any>;
            };
            extend: (options?: import("./transforms").IExtendTransformOptions) => {
                (payload: import("./types").IPayload<any>): {
                    payload: import("./types").IPayload<any>;
                    errors: any[];
                };
                _name: string;
                _type: import("./types").TransformType;
                _options: import("./transforms").IExtendTransformOptions;
            };
            meta: (options?: import("./transforms").IMetaTransformOptions) => {
                (payload: import("./types").IPayload<any>): {
                    payload: import("./types").IPayload<any>;
                    errors: any[];
                };
                _name: string;
                _type: import("./types").TransformType;
                _options: import("./transforms").IMetaTransformOptions;
            };
            generic: (options?: import("./transforms").GenericTransformOptions<any>) => {
                (payload: import("./types").IPayload<any>): {
                    payload: import("./types").IPayload<any>;
                    errors: any[];
                };
                _name: string;
                _type: import("./types").TransformType;
                _options: import("./transforms").GenericTransformOptions<any>;
            };
            mask: (options?: import("./transforms").IMaskTransformOptions) => {
                (payload: import("./types").IPayload<any>): {
                    payload: import("./types").IPayload<any>;
                    errors: any[];
                };
                _name: string;
                _type: import("./types").TransformType;
                _options: import("./transforms").IMaskTransformOptions;
            };
            pad: (options?: import("./transforms").IPadTransformOptions) => {
                (payload: import("./types").IPayload<any>): {
                    payload: import("./types").IPayload<any>;
                    errors: any[];
                };
                _name: string;
                _type: import("./types").TransformType;
                _options: import("./transforms").IPadTransformOptions;
            };
            sort: (options?: import("./transforms").ISortTransformOptions) => {
                (payload: import("./types").IPayload<any>): {
                    payload: import("./types").IPayload<any>;
                    errors: any[];
                };
                _name: string;
                _type: import("./types").TransformType;
                _options: import("./transforms").ISortTransformOptions;
            };
            trace: (options?: import("./transforms").ITraceTransformOptions) => {
                (payload: import("./types").IPayload<any>): {
                    payload: import("./types").IPayload<any>;
                    errors: any[];
                };
                _name: string;
                _type: import("./types").TransformType;
                _options: import("./transforms").ITraceTransformOptions;
            };
            timestamp: (options?: import("./transforms").ITimestampTransformOptions) => {
                (payload: import("./types").IPayload<any>): {
                    payload: import("./types").IPayload<any>;
                    errors: any[];
                };
                _name: string;
                _type: import("./types").TransformType;
                _options: import("./transforms").ITimestampTransformOptions;
            };
            errorify: (options?: import("./transforms").IErrorifyTransformOptions) => {
                (payload: import("./types").IPayload<any>): {
                    payload: import("./types").IPayload<any>;
                    errors: any[];
                };
                _name: string;
                _type: import("./types").TransformType;
                _options: import("./transforms").IErrorifyTransformOptions;
            };
            label: (options?: import("./transforms").ILabelTransformOptions) => {
                (payload: import("./types").IPayload<any>): {
                    payload: import("./types").IPayload<any>;
                    errors: any[];
                };
                _name: string;
                _type: import("./types").TransformType;
                _options: import("./transforms").ILabelTransformOptions;
            };
            splat: (options?: import("./transforms").ISplatTransformOptions) => {
                (payload: import("./types").IPayload<any>): {
                    payload: import("./types").IPayload<any>;
                    errors: any[];
                };
                _name: string;
                _type: import("./types").TransformType;
                _options: import("./transforms").ISplatTransformOptions;
            };
            private: (options?: import("./transforms/modifiers/private").IPrivateTransformOptions<any>) => {
                (payload: import("./types").IPayload<any>): {
                    payload: import("./types").IPayload<any>;
                    errors: any[];
                };
                _name: string;
                _type: import("./types").TransformType;
                _options: import("./transforms/modifiers/private").IPrivateTransformOptions<any>;
            };
        };
        format: {
            delimited: (options?: import("./transforms").IDelimitedFormatOptions) => {
                (payload: import("./types").IPayload<any>): {
                    payload: import("./types").IPayload<any>;
                    errors: any[];
                };
                _name: string;
                _type: import("./types").TransformType;
                _options: import("./transforms").IDelimitedFormatOptions;
            };
            pretty: (options?: import("./transforms").IPrettyFormatOptions) => {
                (payload: import("./types").IPayload<any>): {
                    payload: import("./types").IPayload<any>;
                    errors: any[];
                };
                _name: string;
                _type: import("./types").TransformType;
                _options: import("./transforms").IPrettyFormatOptions;
            };
            json: (options?: import("./transforms").IJsonFormatOptions) => {
                (payload: import("./types").IPayload<any>): {
                    payload: import("./types").IPayload<any>;
                    errors: any[];
                };
                _name: string;
                _type: import("./types").TransformType;
                _options: import("./transforms").IJsonFormatOptions;
            };
            JSON: (options?: import("./transforms").IJsonFormatOptions) => {
                (payload: import("./types").IPayload<any>): {
                    payload: import("./types").IPayload<any>;
                    errors: any[];
                };
                _name: string;
                _type: import("./types").TransformType;
                _options: import("./transforms").IJsonFormatOptions;
            };
        };
        stack: {
            file: (options?: import("./transforms/stacks/file").IFileFormatOptions) => {
                (payload: import("./types").IPayload<any>): {
                    payload: import("./types").IPayload<any>;
                    errors: any[];
                };
                _name: string;
                _type: import("./types").TransformType;
                _options: import("./transforms/stacks/file").IFileFormatOptions;
            };
            terminal: (options?: import("./transforms").ITerminalFormatOptions) => {
                (payload: import("./types").IPayload<any>): {
                    payload: import("./types").IPayload<any>;
                    errors: any[];
                };
                _name: string;
                _type: import("./types").TransformType;
                _options: import("./transforms").ITerminalFormatOptions;
            };
            console: (options?: import("./transforms").ITerminalFormatOptions) => {
                (payload: import("./types").IPayload<any>): {
                    payload: import("./types").IPayload<any>;
                    errors: any[];
                };
                _name: string;
                _type: import("./types").TransformType;
                _options: import("./transforms").ITerminalFormatOptions;
            };
        };
    };
    combine: typeof combine;
    ConsoleTransport: typeof ConsoleTransport;
    FileTransport: typeof FileTransport;
    Transport: typeof Transport;
};
export default _default;
