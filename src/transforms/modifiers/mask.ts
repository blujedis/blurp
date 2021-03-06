import { IPayload } from '../../types';

export interface IMaskTransformOptions {
  [prop: string]: string;
}

/**
 * Aligns message using \t by default or pass custom props.
 * 
 * @example
 * log.transforms.align({ 'meta.password': '*' });
 * 
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
export default function maskTransform<L extends string>(payload: IPayload<L>,
  options: IMaskTransformOptions = {}): IPayload<L> {
  for (const k in options) {
    if (!payload.hasOwnProperty(k) || typeof payload[k] === 'object') continue;
    payload[k] = options[k].repeat(String(payload[k]).length);
  }
  return payload;
}
