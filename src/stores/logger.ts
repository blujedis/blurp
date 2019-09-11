import { Logger } from '../logger';
import { Callback } from '../types';

export class LoggerStore {

  private store = new Map<string, Logger<any>>();

  keys() {
    return this.store.keys();
  }

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

  get<T extends Logger<any> = Logger<any>>(key: string) {
    return this.store.get(key) as T;
  }

  add(key: string, logger: Logger<any>, force: boolean = false) {

    if (this.store.has(key) && !force)
      throw new Error(`Logger "${key}" already exists, please choose another name or use "force"`);

    // Should never hit here but just in case.
    const levels = logger.get('levels');
    if (!levels.length)
      throw new Error(`Cannot init Logger "${key}" using levels of undefined`);

    return this.store.set(key, logger);

  }

  remove(key: string, cb?: Callback) {
    const logger = this.store.get(key);
    if (!logger)
      return this;
    logger.exit((err) => {
      this.store.delete(key);
      cb(err);
    });
    return this;
  }

}
