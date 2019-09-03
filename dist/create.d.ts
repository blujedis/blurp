import { IPayload, TransformType, TransformResultCallback, FormatCallback, ModifierCallback } from './types';
/**
 * Creates a modifier callback wrapper.
 *
 * @param fn the callback the Logger will call to transform the payload.
 */
export declare function createModifier<L extends string, O>(fn: ModifierCallback<L>): (options?: O) => {
    (payload: IPayload<L>): {
        payload: IPayload<L>;
        errors: any[];
    };
    _name: string;
    _type: TransformType;
    _options: O;
};
/**
 * Creates a format callback wrapper.
 *
 * @param fn the callback the Logger will call to format the result.
 */
export declare function createFormatter<L extends string, O>(fn: FormatCallback<L>): (options?: O) => {
    (payload: IPayload<L>): {
        payload: IPayload<L>;
        errors: any[];
    };
    _name: string;
    _type: TransformType;
    _options: O;
};
/**
 * Combines callback functions into single function for convenience, creates & sorts stack.
 * Format _type is sorted to last.
 *
 * @param stack the helper callback stack of functions to be combined.
 */
export declare function combine<L extends string>(...stack: Array<TransformResultCallback<L>>): {
    (payload: IPayload<L>): {
        payload: IPayload<L>;
        errors: any[];
    };
    _stack: TransformResultCallback<L, any>[];
};
