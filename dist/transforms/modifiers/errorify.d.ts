import { IPayload } from '../../types';
export declare type ErrorifyFormat = 'message' | 'stack' | 'detail' | 'detailstack';
export interface IErrorifyTransformOptions {
    format?: ErrorifyFormat;
}
/**
 * Transforms payloads contianing errors.
 *
 * @example
 * log.transforms.errorify();
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
export default function errorifyTransform<L extends string>(payload: IPayload<L>, options?: IErrorifyTransformOptions): IPayload<L>;
