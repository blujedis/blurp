import { IPayload, SOURCE } from '../../types';
import { format } from 'util';

export interface ISplatTransformOptions {
  // Placeholder
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
export default function splatTransform<L extends string>(payload: IPayload<L>,
  options?: ISplatTransformOptions): IPayload<L> {
    const splat = payload[SOURCE].splat || [];
    payload.message = format(payload.message, ...splat);
    return payload;
}
