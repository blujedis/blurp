import { IPayload } from '../../types';
export interface IPrettyFormatOptions {
    props?: string[];
    exclude?: string[];
    showHidden?: boolean;
    depth?: number;
    color?: boolean;
}
/**
 * Formats output for pretty print, applies util.inspect
 * to entire payload. You can filter props using "options.props"
 *
 * @example
 * log.transforms.pretty();
 *
 * @param payload the current modified payload.
 * @param options the format's options.
 */
export default function prettyFormat<L extends string>(payload: IPayload<L>, options?: IPrettyFormatOptions): string;
