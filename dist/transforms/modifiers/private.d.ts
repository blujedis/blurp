import { IPayload } from '../../types';
export interface IPrivateTransformOptions<L extends string> {
    prop?: string;
    condition?: string | number | object | RegExp | any[] | ((value: any, payload?: IPayload<L>) => any);
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
export default function privateTransform<L extends string>(payload: IPayload<L>, options?: IPrivateTransformOptions<L>): IPayload<L>;
