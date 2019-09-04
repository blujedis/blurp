/// <reference types="node" />
import { Transport } from './transport';
import { ITransportOptions, IPayload, Callback, ITransportFirehoseOptions } from '../types';
import { WriteStream } from 'fs';
import { Stream } from 'readable-stream';
import { IQueryOptions, Query } from '../query';
export declare type Frequency = 'minute' | 'hourly' | 'daily' | 'custom' | 'test' | 'h' | 'm';
export interface IFileOptions {
    flags?: string;
    encoding?: string;
    fd?: number;
    mode?: number;
    autoClose?: boolean;
    start?: number;
    highWaterMark?: number;
}
/**
 * @see https://www.npmjs.com/package/file-stream-rotator
 */
export interface IFileTransportOptions<L extends string> extends ITransportOptions<L> {
    filename?: string;
    frequency?: Frequency;
    verbose?: boolean;
    date_format?: string;
    size?: string;
    max_logs?: string | number;
    audit_file?: string;
    end_stream?: boolean;
    file_options?: IFileOptions;
    eol?: string;
    onRotate?(oldFile?: string, newFile?: string): void;
    onNew?(newFile?: string): void;
}
export declare class FileTransport<L extends string> extends Transport<L, IFileTransportOptions<L>> {
    rotator: WriteStream;
    constructor(options?: IFileTransportOptions<L>);
    /**
     * Gets the active filename.
     */
    readonly filename: string;
    /**
     * Callback handler on new file created.
     *
     * @param filename the new filename that was created.
     */
    newfile(newFile: string): void | this;
    /**
     * Callback handler on file rotated.
     *
     * @param oldFile the previous file path.
     * @param newFile the new or current file path.
     */
    rotate(oldFile: string, newFile: string): void | this;
    /**
     * Queries a
     * @param options options to apply to query logs.
     */
    query(options: Query<L> | IQueryOptions<L>): import("fs").ReadStream | Query<L, IQueryOptions<L>>;
    /**
     * Enables connection to Logger for streaming events to firehose.
     *
     * @param options the config to pass to firehouse as options.
     */
    firehose(options?: ITransportFirehoseOptions): Stream;
    /**
     * Log handler that receives payload when Transport writes to stream.
     *
     * @param result the log payload object.
     * @param enc the encoding string.
     * @param cb callback called on completed to continue stream.
     */
    log(payload: IPayload<L>, cb: Callback): void;
}
