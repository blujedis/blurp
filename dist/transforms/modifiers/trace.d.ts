import { IPayload } from '../../types';
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
export default function traceTransform<L extends string>(payload: IPayload<L>, options?: ITraceTransformOptions): IPayload<L>;
