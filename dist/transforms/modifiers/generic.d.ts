import { IPayload } from '../../types';
export declare type GenericTransformOptions<L extends string> = (payload: IPayload<L>) => IPayload<L>;
/**
 * Generic modifier transform that simply callsback and returns the returned payload.
 *
 * @example
 * log.compiled.generic((payload) => {
 *    // do anything & return payload.
 *    return payload;
 * });
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
export default function genericTransform<L extends string>(payload: IPayload<L>, options: GenericTransformOptions<L>): IPayload<L>;
