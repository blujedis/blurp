import { IPayload } from '../../types';
import { toArrayValues, getProps } from '../../utils';

export interface IDelimitedFormatOptions {
  props?: string[];                       // (default: all)
  exclude?: string[];                     // (default: [])
  char?: ' ' | ',' | '\t' | string;       // (default: ',')
  withKeys?: boolean | string[];          // (default: false) array of props that should key:value
}

/**
 * Formats output for delimited values.
 * 
 * @example
 * log.transforms.delimited({ char: ',' });
 * 
 * @param payload the current modified payload.
 * @param options the format's options.
 */
export default function delimitedFormat<L extends string>(payload: IPayload<L>,
  options?: IDelimitedFormatOptions) {
  options = { char: ',', exclude: [], ...options };
  const { props, withKeys, char, exclude } = options;
  return toArrayValues(payload, getProps(payload, props, exclude), null, withKeys).join(char);
}
