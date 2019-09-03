import { IPayload } from '../../types';
import isEqual from 'lodash.isequal';

export interface IPrivateTransformOptions<L extends string> {
  prop?: string;                        // (default: 'private')
  // when condition is met abort the transformer and don't log.
  condition?: string | number | object | RegExp | any[] |
  ((value: any, payload?: IPayload<L>) => any);
}

/**
 * Inspects payload when prop is detected aborts transformation excluding from log.
 * 
 * @example
 * log.transforms.private({ prop: 'private' });
 * 
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
export default function privateTransform<L extends string>(payload: IPayload<L>,
  options?: IPrivateTransformOptions<L>): IPayload<L> {

  options = { prop: 'private', ...options };

  const { prop, condition } = options;

  if (!payload.hasOwnProperty(prop))
    return payload;

  // Prop is present return falsey value to abort.
  if (typeof condition === 'undefined')
    return null;

  const val = payload[prop];

  if (typeof condition === 'function' && condition(val, payload))
    return null;

  if (condition instanceof RegExp && condition.test(val))
    return null;

  if (isEqual(val, condition))
    return null;

  return payload;

}
