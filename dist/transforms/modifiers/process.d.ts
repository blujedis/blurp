import { IPayload } from '../../types';
export interface IProcessTransformInfoOptions {
    version?: boolean;
    pid?: boolean;
    cwd?: boolean;
    uid?: boolean;
    gid?: boolean;
    memoryUsage?: boolean;
    argv?: boolean;
    execArgv?: boolean;
    execPath?: boolean;
}
export interface IProcessTransformSystemOptions {
    platform?: boolean;
    arch?: boolean;
    hostname?: boolean;
    loadavg?: boolean;
    uptime?: boolean;
    totalmem?: boolean;
    freemem?: boolean;
}
export interface IProcessTransformOptions {
    processKey?: string;
    systemKey?: string;
    process?: 'basic' | 'advanced' | 'all' | IProcessTransformInfoOptions;
    system?: 'basic' | 'advanced' | 'all' | IProcessTransformSystemOptions;
}
/**
 * Extends log payload with process and os properties useful when writing to file.
 *
 * @example
 * log.transforms.process({ process: 'basic', system: 'advanced', systemKey: '_system' });
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
export default function processTransform<L extends string>(payload: IPayload<L>, options?: IProcessTransformOptions): IPayload<L>;
