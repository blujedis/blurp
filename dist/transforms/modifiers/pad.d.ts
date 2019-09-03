import { IPayload } from '../../types';
export interface IPadTransformOptions {
    char?: string;
    position?: 'left' | 'right';
}
/**
 * Pads level property to left or right (Top Level Props ONLY)
 *
 * @example
 * log.transforms.pad({ char: ' ', position: 'left'});
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
export default function pad<L extends string>(payload: IPayload<L>, options?: IPadTransformOptions): IPayload<L>;
