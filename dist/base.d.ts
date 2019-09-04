/// <reference types="node" />
import { ITransportOptions, TransformResultCallback, TransformStackCallback } from './types';
import { EventEmitter } from 'events';
import { InternalLogger } from './utils';
export declare abstract class Base<L extends string, O extends ITransportOptions<L>> extends EventEmitter {
    label: string;
    protected options: O;
    protected muted: boolean;
    transformer: TransformStackCallback<L>;
    constructor(label: string, options?: O);
    /**
     * Compiles Transforms and Formats into compiled function.
     */
    protected compile(): this;
    protected readonly console: InternalLogger;
    readonly level: L;
    /**
     * Gets all options.
     *
     * @param key the key within options to retrieve value for.
     */
    get(): O;
    /**
     * Gets option value by key.
     *
     * @param key the key within options to retrieve value for.
     */
    get<K extends keyof O>(key: K): O[K];
    /**
     * Updates options.tranforms with Transform or combined Transform.
     *
     * @param transform the Transform or combined transform to set.
     */
    transform(transform: TransformResultCallback<L>): this;
    /**
     * Updates options.tranforms with Transforms or combined Transforms stack.
     *
     * @param transforms the Transforms or combined Transforms to set.
     */
    transform(...transforms: Array<TransformResultCallback<L>>): this;
    /**
     * Mutes the instance.
     */
    mute(): void;
    /**
     * Unmutes the instance.
     */
    unmute(): void;
}
