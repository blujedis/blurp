import { IPayload } from '../../types';
export interface ILabelTransformOptions {
    template?: string;
}
/**
 * Transforms payloads contianing errors.
 *
 * @see https://github.com/blujedis/ziplit
 *
 * @example
 * log.transforms.label({ template: '${label}:'});
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
export default function labelTransform<L extends string>(payload: IPayload<L>, options?: ILabelTransformOptions): IPayload<L>;
