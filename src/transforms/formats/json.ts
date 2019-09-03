import { IPayload } from '../../types';
import { reducePayload } from '../../utils';
import stringify from 'fast-safe-stringify';

export interface IJsonFormatOptions {
  props?: string[];                             // (default: all)
  exclude?: string[];                           // (default: [])
  space?: string | number;                      // (default: undefined)
  stable?: boolean;                             // (default: undefined)
  replacer?: (key: string, value: any) => any;
}

/**
 * Formats output for console/terminal using JSON.
 * @see https://www.npmjs.com/package/fast-safe-stringify
 * 
 * @example
 * log.transforms.json({ stable: true }); // alpha orders props.
 * 
 * @param payload the current modified payload.
 * @param options the format's options.
 */
export default function jsonFormat<L extends string>(
  payload: IPayload<L>, options?: IJsonFormatOptions) {

  options = { space: 0, stable: false, ...options };
  const { stable, space, replacer, props, exclude } = options;

  const _replacer = replacer || ((key, value) => {
    if (value === '[Circular]') // ignore circular.
      return;
    if (value instanceof Buffer) 
      return value.toString('base64');
    if (typeof value === 'bigint')
      return value.toString();
    return value;
  });

  const stringifier = stable ? stringify.stableStringify : stringify;

  if (!props)
    return stringifier(payload, _replacer, space);

  return stringifier(reducePayload(payload, props, exclude), _replacer, space);

}
