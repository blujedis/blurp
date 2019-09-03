import { IPayload } from '../../types';
export interface ISplatTransformOptions {
}
/**
 * Uses util.format to format message using token arguments.
 *
 * @example
 * log.transforms.splat();
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
export default function splatTransform<L extends string>(payload: IPayload<L>, options?: ISplatTransformOptions): IPayload<L>;
