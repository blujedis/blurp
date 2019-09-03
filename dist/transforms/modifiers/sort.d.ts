import { IPayload } from '../../types';
export interface ISortTransformOptions {
    props?: string[];
}
/**
 * Sorts by property excluded keys are appended (Top Level keys ONLY)
 *
 * @example
 * log.transforms.sort({ props: ['level', 'message' ]});
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
export default function sortTransform<L extends string>(payload: IPayload<L>, options?: ISortTransformOptions): IPayload<L>;
