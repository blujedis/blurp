"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChildStore {
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
    toArray(...keys) {
        if (!keys)
            return [...this.values()];
        return [...this.values()].filter(tport => keys.includes(tport.label));
    }
    get(key) {
        return this.store.get(key);
    }
    add(key, child, parent) {
        if (this.store.has(key))
            throw new Error(`Child Logger "${key}" already exists, please remove or choose another name`);
        return this.store.set(key, child);
    }
    remove(key, cb) {
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
exports.ChildStore = ChildStore;
//# sourceMappingURL=child.js.map