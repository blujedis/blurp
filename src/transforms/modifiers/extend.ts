import { IPayload } from '../../types';

export interface IExtendTransformOptions {
  [key: string]: any;
}

/**
 * Extends log payload with additional properties.
 * 
 * @example
 * log.transforms.extend({ pid: process.pid });
 * 
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
export default function extendTransform<L extends string>(payload: IPayload<L>,
  options: IExtendTransformOptions): IPayload<L> {
  return { ...payload, ...options };
}
