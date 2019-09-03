import { IPayload } from '../../types';
import { ErrorifyFormat } from '../modifiers/errorify';
import { TimestampFormat } from '../modifiers/timestamp';
export interface IFileFormatOptions {
    props?: string[];
    exclude?: string[];
    format?: 'json' | 'csv' | 'tab';
    timestamp?: boolean | TimestampFormat;
    label?: boolean;
    private?: string | boolean;
    meta?: string | boolean;
    splat?: boolean;
    errorify?: ErrorifyFormat;
    trace?: boolean | 'all';
    process?: 'basic' | 'advanced' | 'all';
    extend?: {
        [key: string]: any;
    };
}
/**
 * Bundled stack for displaying logs in files.
 *
 * @example
 * log.transforms.file();
 *
 * @param payload the current modified payload.
 * @param options the stack's options.
 */
export default function fileFormat<L extends string>(payload: IPayload<L>, options?: IFileFormatOptions): string;
