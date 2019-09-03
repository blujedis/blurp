import { IPayload } from '../../types';
export interface IJsonFormatOptions {
    props?: string[];
    exclude?: string[];
    space?: string | number;
    stable?: boolean;
    replacer?: (key: string, value: any) => any;
}
/**
 * Formats output for console/terminal using JSON.
 * @see https://www.npmjs.com/package/fast-safe-stringify
 *
 * @example
 * log.transforms.json({ stable: true }); // alpha orders props.
 *
 * @param payload the current modified payload.
 * @param options the format's options.
 */
export default function jsonFormat<L extends string>(payload: IPayload<L>, options?: IJsonFormatOptions): string;
