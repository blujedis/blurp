import { IPayload } from '../../types';
import { inspect } from 'util';
import { reducePayload } from '../../utils';

export interface IPrettyFormatOptions {
  props?: string[];           // (default: all)
  exclude?: string[];         // (default: [])
  showHidden?: boolean;
  depth?: number;
  color?: boolean;
}

/**
 * Formats output for pretty print, applies util.inspect 
 * to entire payload. You can filter props using "options.props"
 * 
 * @example
 * log.transforms.pretty();
 * 
 * @param payload the current modified payload.
 * @param options the format's options.
 */
export default function prettyFormat<L extends string>(payload: IPayload<L>,
  options?: IPrettyFormatOptions) {
    payload = reducePayload(payload, options.props, options.exclude);
  return inspect(payload, options.showHidden, options.depth, options.color);
}
