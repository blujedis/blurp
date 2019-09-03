import { IPayload, SOURCE } from '../../types';
import stackTrace from 'stack-trace';
import { basename } from 'path';

export interface ITrace {
  method: string;
  file: string;
  column: number;
  line: number;
  function: string;
  native: boolean;
  short: string;
}

export interface ITraceTransformOptions {
  all?: boolean;
  exceptions?: boolean;
  rejections?: boolean;
}

/**
 * Adds trace to payload or adds only when error is detected.
 * 
 * @example
 * log.transforms.trace();
 * log.transforms.trace({ exceptions: true, rejections: true });
 * 
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
export default function traceTransform<L extends string>(payload: IPayload<L>,
  options?: ITraceTransformOptions): IPayload<L> {

  options = { all: false, exceptions: true, rejections: true, ...options };
  const { all, exceptions, rejections } = options;
  const { err } = payload[SOURCE].err;

  // Check if should trace.
  const shouldTrace = all || (exceptions && err && err.isException) ||
    (rejections && err && err.isRejection);

  if (!shouldTrace) return payload;

  const stacktrace = err ? stackTrace.parse(err) : stackTrace.get();

  payload.trace = stacktrace.map(callsite => {
    const traced = {
      method: callsite.getMethodName(),
      file: callsite.getFileName(),
      column: callsite.getColumnNumber(),
      line: callsite.getLineNumber(),
      function: callsite.getFunctionName(),
      native: callsite.isNative(),
      short: undefined
    };
    const safeFile = typeof traced.file === 'string' ? basename(traced.file) : '';
    traced.short = `${safeFile} ${traced.line}:${traced.column}`;
    return traced;
  }) as ITrace[];

  return payload;

}
