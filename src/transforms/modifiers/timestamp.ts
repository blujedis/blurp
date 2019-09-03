import { IPayload } from '../../types';
import { format as tsformat } from 'date-fns';
import { toDate } from '../../utils';

export type TimestampFormat = 'short' | 'long' | 'epoch' | string;

const templates = {
  short: 'HH:mm:ss.S',
  long: 'YYYY-MM-DD HH:mm:ss.S'
};

export interface ITimestampTransformOptions {

  prop?: string;                                 // (default: 'timestamp')
  // short    - 'HH:mm:ss.S
  // long     - 'YYYY-MM-DD HH:mm:ss.S'
  // string   - any date-fns format
  format?: TimestampFormat;            // (default: 'short')

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
export default function timestampTransform<L extends string>(payload: IPayload<L>,
  options?: ITimestampTransformOptions): IPayload<L> {
  options = { prop: 'timestamp', format: 'short', ...options };
  const { prop, format } = options;
  // Check if there's already a timestamp this can happen when run after queries.
  const curVal = toDate(payload[prop] || new Date());
  payload[prop] = format === 'epoch' ? curVal.getTime() : tsformat(new Date(), templates[format]);
  return payload;
}
