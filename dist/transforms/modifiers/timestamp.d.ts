import { IPayload } from '../../types';
export declare type TimestampFormat = 'short' | 'long' | 'epoch' | string;
export interface ITimestampTransformOptions {
    prop?: string;
    format?: TimestampFormat;
}
/**
 * Uses util.format to format message using token arguments.
 * @see https://date-fns.org/v2.0.1/docs/format
 *
 * @example
 * log.transforms.timestamp({ prop: 'ts', format: 'epoch' });
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
export default function timestampTransform<L extends string>(payload: IPayload<L>, options?: ITimestampTransformOptions): IPayload<L>;
