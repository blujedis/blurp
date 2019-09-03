import { IPayload, Styles } from '../../types';
import { ErrorifyFormat } from '../modifiers/errorify';
import { Case } from '../modifiers/case';
import { TimestampFormat } from '../modifiers/timestamp';
export interface ITerminalFormatStyleOptions {
    level?: Styles;
    message?: Styles;
    [key: string]: Styles;
}
export interface ITerminalFormatLevelOptions {
    pad?: boolean;
    case?: Case;
    template?: string;
}
export interface ITerminalFormatOptions {
    props?: string[];
    exclude?: string[];
    timestamp?: boolean | TimestampFormat;
    level?: boolean | ITerminalFormatLevelOptions;
    label?: boolean | '${label}:';
    colorize?: boolean | ITerminalFormatStyleOptions;
    private?: boolean | string;
    meta?: string | boolean;
    metaKeys?: boolean;
    splat?: boolean;
    errorify?: ErrorifyFormat;
    extend?: {
        [key: string]: any;
    };
}
/**
 * Bundled stack for displaying logs in the terminal.
 *
 * @example
 * log.transforms.terminal();
 *
 * @param payload the current modified payload.
 * @param options the stack's options.
 */
export default function terminalFormat<L extends string>(payload: IPayload<L>, options?: ITerminalFormatOptions): string;
