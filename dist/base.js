"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const create_1 = require("./create");
const events_1 = require("events");
const utils_1 = require("./utils");
class Base extends events_1.EventEmitter {
    constructor(label, options = {}) {
        super();
        this.label = label;
        this.options = options;
        this.muted = false;
        this.setMaxListeners(10);
        options.transforms = utils_1.ensureArray(options.transforms);
        this.options = Object.assign(Object.assign({}, constants_1.TRANSPORT_DEFAULTS), options);
        // Compile Transformer.
        this.compile();
    }
    /**
     * Compiles Transforms and Formats into compiled function.
     */
    compile() {
        if (!this.options.transforms || !this.options.transforms.length)
            return;
        this.transformer = create_1.combine(...utils_1.ensureArray(this.options.transforms));
        return this;
    }
    get console() {
        return utils_1.logger;
    }
    // GETTERS //
    get level() {
        return this.options.level;
    }
    get(key) {
        if (!key)
            return Object.assign({}, this.options);
        return this.options[key];
    }
    transform(...transforms) {
        this.options.transforms = [...utils_1.ensureArray(this.options.transforms), ...transforms];
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
exports.Base = Base;
//# sourceMappingURL=base.js.map