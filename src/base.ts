import { ITransportOptions, TransformResultCallback, TransformStackCallback } from './types';
import { TRANSPORT_DEFAULTS } from './constants';
import { combine } from './create';
import { EventEmitter } from 'events';

export abstract class Base<L extends string, O extends ITransportOptions<L>> extends EventEmitter {

  protected muted = false;
  transformer: TransformStackCallback<L>;

  constructor(public label: string, protected options?: O) {

    super();
    this.setMaxListeners(10);

    this.options = { ...TRANSPORT_DEFAULTS as O, ...options };

    // Compile Transformer.
    this.compile();

  }

  /**
   * Compiles Transforms and Formats into compiled function.
   */
  protected compile() {
    if (!this.options.transforms || !this.options.transforms.length)
      return;
    this.transformer = combine(...this.options.transforms);
    return this;
  }

  // GETTERS //

  get level() {
    return this.options.level;
  }

  // OPTIONS //

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

  get<K extends keyof O>(key?: K) {
    if (!key)
      return { ...this.options };
    return this.options[key];
  }

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
  transform(...transforms: Array<TransformResultCallback<L>>) {
    this.options.transforms = [...this.options.transforms, ...transforms];
    this.compile();
    return this;
  }

  // MUTING //

  /**
   * Mutes the instance.
   */
  mute() { this.muted = true; }

  /**
   * Unmutes the instance.
   */
  unmute() { this.muted = false; }

}
