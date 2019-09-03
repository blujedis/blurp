import { IPayload } from '../../types';
import { reducePayload } from '../../utils';

export interface ISortTransformOptions {
  props?: string[];             // (default: all)
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
export default function sortTransform<L extends string>(payload: IPayload<L>,
  options?: ISortTransformOptions): IPayload<L> {
  return reducePayload(payload, options.props);
}
