"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transports_1 = require("../transports");
class TransportStore {
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
    toArray(...keys) {
        if (!keys || !keys.length)
            return [...this.values()];
        return [...this.values()].filter(tport => keys.includes(tport.label));
    }
    normalize(transports) {
        return (transports || []).reduce((result, transport) => {
            if (transport instanceof transports_1.Transport)
                return [...result, transport];
            transport = this.get(transport);
            if (!transport)
                return result;
            return [...result, transport];
        }, []);
    }
    clear() {
        this.store.clear();
        return this;
    }
    get(key) {
        return this.store.get(key);
    }
    add(key, transport) {
        if (!transport.stream)
            throw new Error(`Attempted to add Transport "${key}" but required stream is missing`);
        const isObjectMode = transport.stream._readableState && transport.stream._readableState.objectMode;
        if (isObjectMode)
            throw new Error(`Attempted to add Transport "${key}" with unsupported objectMode stream`);
        this.store.set(key, transport);
        return this;
    }
    remove(key, cb) {
        const transport = this.get(key);
        transport.close();
        transport.stream.on('close', () => {
            this.store.delete(key);
        });
        return this;
    }
}
exports.TransportStore = TransportStore;
//# sourceMappingURL=transport.js.map