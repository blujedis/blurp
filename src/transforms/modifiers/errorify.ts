import { IPayload, SOURCE } from '../../types';
import { EOL } from 'os';

export type ErrorifyFormat = 'message' | 'stack' | 'detail' | 'detailstack';

export interface IErrorifyTransformOptions {

  // WHEN ERROR IS PRESENT //

  // message    - does nothing just uses default.
  // stack      - replaces message with stacktrace.
  // detail     - replaces message with error name/type and message.
  // pushstack  - 

  format?: ErrorifyFormat;    // (default: stack)

}

/**
 * Transforms payloads contianing errors.
 * 
 * @example
 * log.transforms.errorify();
 * 
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
export default function errorifyTransform<L extends string>(payload: IPayload<L>,
  options?: IErrorifyTransformOptions): IPayload<L> {
  options = { format: 'stack', ...options };
  const { format } = options;
  const { err } = payload[SOURCE];
  if (!err || format === 'message')
    return payload;
  let msg = err.name + ': ' + err.message; // detail view with name/type.
  if (format === 'stack') {
    msg = err.stack || payload.message;
  }
  else if (format === 'detailstack') {
    // Get stack without first line containing message.
    const stack = err.stack.split(EOL).slice(1).join(EOL);
    msg += EOL + stack;
  }
  payload.message = msg;
  return payload;
}
