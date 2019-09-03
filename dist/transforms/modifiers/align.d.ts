import { IPayload } from '../../types';
export interface IAlignTransformOptions {
    props?: string[];
    char?: string;
}
/**
 * Aligns message using \t by default or pass custom props (Top Level Props ONLY)
 *
 * @example
 * log.transforms.align();
 * log.transforms.align({ char: '\t', props: ['level', 'message'] });
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
export default function alignTransform<L extends string>(payload: IPayload<L>, options: IAlignTransformOptions): IPayload<L>;
