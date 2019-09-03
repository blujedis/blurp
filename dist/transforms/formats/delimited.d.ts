import { IPayload } from '../../types';
export interface IDelimitedFormatOptions {
    props?: string[];
    exclude?: string[];
    char?: ' ' | ',' | '\t' | string;
    withKeys?: boolean | string[];
}
/**
 * Formats output for delimited values.
 *
 * @example
 * log.transforms.delimited({ char: ',' });
 *
 * @param payload the current modified payload.
 * @param options the format's options.
 */
export default function delimitedFormat<L extends string>(payload: IPayload<L>, options?: IDelimitedFormatOptions): string;
