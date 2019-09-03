import { Logger } from '../logger';
import { Callback } from '../types';

export class LoggerStore {

  private store = new Map<string, Logger<any>>();

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

  get(key: string) {
    return this.store.get(key);
  }

  add(key: string, logger: Logger<any>) {

    if (this.store.has(key))
      throw new Error(`Logger "${key}" already exists, please remove or choose another name`);

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
