
import { Logger } from '../logger';
import { Callback } from '../types';

export class ChildStore<L extends string> {

  private store = new Map<string, Logger<L>>();

  values() {
    return this.store.values();
  }

  has(key: string) {
    return this.store.has(key);
  }

  clear() {
    this.store.clear();
    return this;
  }

  toArray(...keys: string[]): Array<Logger<L>> {
    if (!keys)
      return [...this.values()];
    return [...this.values()].filter(tport => keys.includes(tport.label));
  }

  get(key: string) {
    return this.store.get(key);
  }

  add(key: string, child: Logger<L>, parent: Logger<L>) {
    if (this.store.has(key)) 
      throw new Error(`Child Logger "${key}" already exists, please remove or choose another name`);
    return this.store.set(key, child);
  }

  remove(key: string, cb?: Callback) {
    const logger = this.get(key);
    if (!logger)
      return this;
    logger.exit((err) => {
      this.store.delete(key);
      cb(err);
    });
    return this;
  }

}
