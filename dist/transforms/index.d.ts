import { IExtendTransformOptions } from './modifiers/extend';
import { IColorizeTransformOptions } from './modifiers/colorize';
import { IAlignTransformOptions } from './modifiers/align';
import { ICaseTransformOptions } from './modifiers/case';
import { IMaskTransformOptions } from './modifiers/mask';
import { IPadTransformOptions } from './modifiers/pad';
import { ITraceTransformOptions } from './modifiers/trace';
import { ISortTransformOptions } from './modifiers/sort';
import { IDelimitedFormatOptions } from './formats/delimited';
import { IJsonFormatOptions } from './formats/json';
import { GenericTransformOptions } from './modifiers/generic';
import { ITerminalFormatOptions } from './stacks/terminal';
import { IPrettyFormatOptions } from './formats/pretty';
import { IMetaTransformOptions } from './modifiers/meta';
import { ISplatTransformOptions } from './modifiers/splat';
import { ILabelTransformOptions } from './modifiers/label';
import { ITimestampTransformOptions } from './modifiers/timestamp';
import { IErrorifyTransformOptions } from './modifiers/errorify';
import { IPrivateTransformOptions } from './modifiers/private';
import { IFileFormatOptions } from './stacks/file';
export * from './modifiers/align';
export * from './modifiers/case';
export * from './modifiers/colorize';
export * from './modifiers/extend';
export * from './modifiers/meta';
export * from './modifiers/generic';
export * from './modifiers/mask';
export * from './modifiers/pad';
export * from './modifiers/sort';
export * from './modifiers/trace';
export * from './modifiers/meta';
export * from './modifiers/splat';
export * from './modifiers/label';
export * from './modifiers/timestamp';
export * from './modifiers/errorify';
export * from './formats/pretty';
export * from './formats/delimited';
export * from './formats/json';
export * from './stacks/terminal';
/**
 * Initialize Transform Helpers.
 */
export declare function initTransforms<L extends string = any>(): {
    modifier: {
        align: (options?: IAlignTransformOptions) => {
            (payload: import("../types").IPayload<L>): {
                payload: import("../types").IPayload<L>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IAlignTransformOptions;
        };
        casing: (options?: ICaseTransformOptions) => {
            (payload: import("../types").IPayload<L>): {
                payload: import("../types").IPayload<L>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: ICaseTransformOptions;
        };
        colorize: (options?: IColorizeTransformOptions<L>) => {
            (payload: import("../types").IPayload<L>): {
                payload: import("../types").IPayload<L>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IColorizeTransformOptions<L>;
        };
        extend: (options?: IExtendTransformOptions) => {
            (payload: import("../types").IPayload<L>): {
                payload: import("../types").IPayload<L>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IExtendTransformOptions;
        };
        meta: (options?: IMetaTransformOptions) => {
            (payload: import("../types").IPayload<L>): {
                payload: import("../types").IPayload<L>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IMetaTransformOptions;
        };
        generic: (options?: GenericTransformOptions<L>) => {
            (payload: import("../types").IPayload<L>): {
                payload: import("../types").IPayload<L>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: GenericTransformOptions<L>;
        };
        mask: (options?: IMaskTransformOptions) => {
            (payload: import("../types").IPayload<L>): {
                payload: import("../types").IPayload<L>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IMaskTransformOptions;
        };
        pad: (options?: IPadTransformOptions) => {
            (payload: import("../types").IPayload<L>): {
                payload: import("../types").IPayload<L>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IPadTransformOptions;
        };
        sort: (options?: ISortTransformOptions) => {
            (payload: import("../types").IPayload<L>): {
                payload: import("../types").IPayload<L>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: ISortTransformOptions;
        };
        trace: (options?: ITraceTransformOptions) => {
            (payload: import("../types").IPayload<L>): {
                payload: import("../types").IPayload<L>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: ITraceTransformOptions;
        };
        timestamp: (options?: ITimestampTransformOptions) => {
            (payload: import("../types").IPayload<L>): {
                payload: import("../types").IPayload<L>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: ITimestampTransformOptions;
        };
        errorify: (options?: IErrorifyTransformOptions) => {
            (payload: import("../types").IPayload<L>): {
                payload: import("../types").IPayload<L>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IErrorifyTransformOptions;
        };
        label: (options?: ILabelTransformOptions) => {
            (payload: import("../types").IPayload<L>): {
                payload: import("../types").IPayload<L>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: ILabelTransformOptions;
        };
        splat: (options?: ISplatTransformOptions) => {
            (payload: import("../types").IPayload<L>): {
                payload: import("../types").IPayload<L>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: ISplatTransformOptions;
        };
        private: (options?: IPrivateTransformOptions<L>) => {
            (payload: import("../types").IPayload<L>): {
                payload: import("../types").IPayload<L>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IPrivateTransformOptions<L>;
        };
    };
    format: {
        delimited: (options?: IDelimitedFormatOptions) => {
            (payload: import("../types").IPayload<L>): {
                payload: import("../types").IPayload<L>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IDelimitedFormatOptions;
        };
        pretty: (options?: IPrettyFormatOptions) => {
            (payload: import("../types").IPayload<L>): {
                payload: import("../types").IPayload<L>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IPrettyFormatOptions;
        };
        json: (options?: IJsonFormatOptions) => {
            (payload: import("../types").IPayload<L>): {
                payload: import("../types").IPayload<L>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IJsonFormatOptions;
        };
        JSON: (options?: IJsonFormatOptions) => {
            (payload: import("../types").IPayload<L>): {
                payload: import("../types").IPayload<L>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IJsonFormatOptions;
        };
    };
    stack: {
        file: (options?: IFileFormatOptions) => {
            (payload: import("../types").IPayload<L>): {
                payload: import("../types").IPayload<L>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IFileFormatOptions;
        };
        terminal: (options?: ITerminalFormatOptions) => {
            (payload: import("../types").IPayload<L>): {
                payload: import("../types").IPayload<L>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: ITerminalFormatOptions;
        };
        console: (options?: ITerminalFormatOptions) => {
            (payload: import("../types").IPayload<L>): {
                payload: import("../types").IPayload<L>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: ITerminalFormatOptions;
        };
    };
};
export declare const transforms: {
    modifier: {
        align: (options?: IAlignTransformOptions) => {
            (payload: import("../types").IPayload<any>): {
                payload: import("../types").IPayload<any>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IAlignTransformOptions;
        };
        casing: (options?: ICaseTransformOptions) => {
            (payload: import("../types").IPayload<any>): {
                payload: import("../types").IPayload<any>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: ICaseTransformOptions;
        };
        colorize: (options?: IColorizeTransformOptions<any>) => {
            (payload: import("../types").IPayload<any>): {
                payload: import("../types").IPayload<any>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IColorizeTransformOptions<any>;
        };
        extend: (options?: IExtendTransformOptions) => {
            (payload: import("../types").IPayload<any>): {
                payload: import("../types").IPayload<any>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IExtendTransformOptions;
        };
        meta: (options?: IMetaTransformOptions) => {
            (payload: import("../types").IPayload<any>): {
                payload: import("../types").IPayload<any>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IMetaTransformOptions;
        };
        generic: (options?: GenericTransformOptions<any>) => {
            (payload: import("../types").IPayload<any>): {
                payload: import("../types").IPayload<any>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: GenericTransformOptions<any>;
        };
        mask: (options?: IMaskTransformOptions) => {
            (payload: import("../types").IPayload<any>): {
                payload: import("../types").IPayload<any>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IMaskTransformOptions;
        };
        pad: (options?: IPadTransformOptions) => {
            (payload: import("../types").IPayload<any>): {
                payload: import("../types").IPayload<any>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IPadTransformOptions;
        };
        sort: (options?: ISortTransformOptions) => {
            (payload: import("../types").IPayload<any>): {
                payload: import("../types").IPayload<any>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: ISortTransformOptions;
        };
        trace: (options?: ITraceTransformOptions) => {
            (payload: import("../types").IPayload<any>): {
                payload: import("../types").IPayload<any>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: ITraceTransformOptions;
        };
        timestamp: (options?: ITimestampTransformOptions) => {
            (payload: import("../types").IPayload<any>): {
                payload: import("../types").IPayload<any>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: ITimestampTransformOptions;
        };
        errorify: (options?: IErrorifyTransformOptions) => {
            (payload: import("../types").IPayload<any>): {
                payload: import("../types").IPayload<any>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IErrorifyTransformOptions;
        };
        label: (options?: ILabelTransformOptions) => {
            (payload: import("../types").IPayload<any>): {
                payload: import("../types").IPayload<any>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: ILabelTransformOptions;
        };
        splat: (options?: ISplatTransformOptions) => {
            (payload: import("../types").IPayload<any>): {
                payload: import("../types").IPayload<any>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: ISplatTransformOptions;
        };
        private: (options?: IPrivateTransformOptions<any>) => {
            (payload: import("../types").IPayload<any>): {
                payload: import("../types").IPayload<any>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IPrivateTransformOptions<any>;
        };
    };
    format: {
        delimited: (options?: IDelimitedFormatOptions) => {
            (payload: import("../types").IPayload<any>): {
                payload: import("../types").IPayload<any>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IDelimitedFormatOptions;
        };
        pretty: (options?: IPrettyFormatOptions) => {
            (payload: import("../types").IPayload<any>): {
                payload: import("../types").IPayload<any>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IPrettyFormatOptions;
        };
        json: (options?: IJsonFormatOptions) => {
            (payload: import("../types").IPayload<any>): {
                payload: import("../types").IPayload<any>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IJsonFormatOptions;
        };
        JSON: (options?: IJsonFormatOptions) => {
            (payload: import("../types").IPayload<any>): {
                payload: import("../types").IPayload<any>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IJsonFormatOptions;
        };
    };
    stack: {
        file: (options?: IFileFormatOptions) => {
            (payload: import("../types").IPayload<any>): {
                payload: import("../types").IPayload<any>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: IFileFormatOptions;
        };
        terminal: (options?: ITerminalFormatOptions) => {
            (payload: import("../types").IPayload<any>): {
                payload: import("../types").IPayload<any>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: ITerminalFormatOptions;
        };
        console: (options?: ITerminalFormatOptions) => {
            (payload: import("../types").IPayload<any>): {
                payload: import("../types").IPayload<any>;
                errors: any[];
            };
            _name: string;
            _type: import("../types").TransformType;
            _options: ITerminalFormatOptions;
        };
    };
};
