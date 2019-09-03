import { IPayload } from '../../types';
export interface IMetaTransformOptions {
    prop?: string;
    exclude?: string[];
}
/**
 * Moves all metadata into specified property on payload.
 *
 * @example
 * log.transforms.meta();
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
export default function metaTransform<L extends string>(payload: IPayload<L>, options?: IMetaTransformOptions): IPayload<L>;
