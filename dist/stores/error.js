"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorStore {
    constructor() {
        this.store = new Map();
    }
    keys() {
        return this.store.keys();
    }
    values() {
        return this.store.values();
    }
    has(transport) {
        return this.store.has(transport);
    }
    clear() {
        this.store.clear();
        return this;
    }
    get(key) {
        return this.store.get(key);
    }
    add(transport, stream) {
        this.store.set(transport, stream);
        return this;
    }
    remove(transport) {
        this.store.delete(transport);
        return this;
    }
}
exports.ErrorStore = ErrorStore;
//# sourceMappingURL=error.js.map