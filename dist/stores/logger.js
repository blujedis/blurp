"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LoggerStore {
    constructor() {
        this.store = new Map();
    }
    keys() {
        return this.store.keys();
    }
    values() {
        return this.store.values();
    }
    has(key) {
        return this.store.has(key);
    }
    clear() {
        this.store.clear();
        return this;
    }
    get(key) {
        return this.store.get(key);
    }
    add(key, logger) {
        if (this.store.has(key))
            throw new Error(`Logger "${key}" already exists, please remove or choose another name`);
        // Should never hit here but just in case.
        const levels = logger.get('levels');
        if (!levels.length)
            throw new Error(`Cannot init Logger "${key}" using levels of undefined`);
        return this.store.set(key, logger);
    }
    remove(key, cb) {
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
exports.LoggerStore = LoggerStore;
//# sourceMappingURL=logger.js.map