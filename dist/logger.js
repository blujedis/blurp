"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const types_1 = require("./types");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const stores_1 = require("./stores");
const util_1 = require("util");
const os_1 = require("os");
const each_async_1 = __importDefault(require("each-async"));
const errors_1 = require("./errors");
const readable_stream_1 = require("readable-stream");
const query_1 = require("./query");
class Logger extends base_1.Base {
    constructor(label, options) {
        super(label, options);
        this.children = new stores_1.ChildStore();
        this.transports = new stores_1.TransportStore();
        this.profilers = {};
        // No levels specified set defaults.
        if (!this.options.levels) {
            this.options.levels = constants_1.DEFAULT_LEVELS;
            // If colors aren't disabled by null.
            if (typeof this.options.colors === 'undefined' && this.options.colors !== null)
                this.options.colors = constants_1.DEFAULT_COLORS;
        }
        else {
            // Clone don't allow overwriting of levels.
            this.options.levels = [...this.options.levels];
        }
        if (!this.options.levels.length)
            throw new Error(`Cannot init Logger "${label}" using levels of undefined`);
        // If no level specified choose highest level.
        this.options.level = this.options.level || this.options.levels[this.options.levels.length - 1];
        // Initialize the Logger.
        this.init();
    }
    // PRIVATE //
    initStream(highWaterMark = 16) {
        // Create Transform stream.
        this.stream = new readable_stream_1.Transform({ objectMode: true, highWaterMark });
        this.stream.logger = this;
        this.stream._transform = (payload, enc, cb) => {
            // if streamed without hitting .log().
            if (this.muted)
                return cb();
            // No Transports can't do anything.
            if (!this.stream._readableState.pipes) {
                const _a = types_1.CONFIG, c = payload[_a], _b = types_1.SOURCE, s = payload[_b], _c = types_1.OUTPUT, o = payload[_c], clean = __rest(payload, [typeof _a === "symbol" ? _a : _a + "", typeof _b === "symbol" ? _b : _b + "", typeof _c === "symbol" ? _c : _c + ""]);
                console.warn(`${os_1.EOL}Logger ${this.label} failed using Transports of undefined${os_1.EOL}${os_1.EOL}Payload:${os_1.EOL} %O${os_1.EOL}`, clean);
                return cb(null);
            }
            try {
                this.stream.push(payload);
            }
            catch (ex) {
                throw ex;
            }
            finally {
                cb();
            }
        };
        this.stream._final = (cb) => {
            each_async_1.default(this.piped, (transport, index, next) => {
                if (!transport || transport.finished)
                    return setImmediate(next);
                transport.once('finish', next);
                transport.end();
            }, cb);
        };
        return this;
    }
    init() {
        this.exceptions = new errors_1.ExceptionHandler(this);
        this.rejections = new errors_1.RejectionHandler(this);
        // Initialize the Transform stream.
        this.initStream();
        // Bind log levels.
        for (const level of this.levels) {
            this[level] = (msg, ...meta) => {
                return this.log(level, msg, ...meta);
            };
        }
        // Add the transports.
        utils_1.ensureArray(this.options.transports)
            .forEach((t) => this.transport(t));
        return this;
    }
    onEvent(event, transport) {
        const eventWrapper = (err) => {
            this.emit(event, err, transport);
        };
        const _event = `blurp:${event}`;
        if (!transport[_event]) {
            transport[_event] = eventWrapper;
            transport.on(event, transport[_event]);
        }
    }
    /**
     * Simple method to ensure string, used with .write() & .writeLn();
     *
     * @param value the value to inspect
     */
    stingify(value) {
        if (typeof value === 'string')
            return value;
        if (value instanceof Error)
            return value.stack || value.message;
        if (typeof value === 'object')
            return util_1.inspect(value);
        return String(value);
    }
    /**
     * Gets the elapsed time since last dispatch.
     */
    getElapsed() {
        const now = Date.now();
        this.lastLog = this.lastLog || now;
        const elapsed = now - this.lastLog;
        this.lastLog = now;
        return elapsed;
    }
    /**
     * Parses callback from payload.splat or splat array.
     *
     * @param payloadOrSplat the splat array or payload containing splat.
     */
    parseCallback(payloadOrSplat) {
        const isArray = Array.isArray(payloadOrSplat);
        let splat = isArray ? payloadOrSplat : (payloadOrSplat.splat || []);
        const cb = typeof splat[splat.length - 1] === 'function' ? splat[splat.length - 1] : undefined;
        if (cb)
            splat = splat.slice(0, splat.length - 1);
        return {
            payload: (!isArray ? Object.assign({}, payloadOrSplat, { splat }) : undefined),
            splat,
            cb
        };
    }
    /**
     * Creates the payload for stream.
     *
     * @param level the level, message or payload to be logged.
     * @param message the message to be logged.
     * @param splat optional splat used for formatting message & metadata.
     */
    createPayload(level, message, splat = []) {
        let payload = {};
        let cb = utils_1.noop;
        let err;
        if (typeof level === 'undefined') {
            payload = {
                level: 'log',
                message: message || '',
                splat
            };
        }
        else {
            // Is ILogMessage object.
            if (typeof level === 'object' && level !== null) {
                payload = level;
            }
            else {
                // Logged with level or message as first prop.
                if (typeof level === 'string' && !this.levels.includes(level)) {
                    if (typeof message !== 'undefined')
                        splat.unshift(message);
                    message = level;
                    level = undefined;
                }
                payload = { level: level || 'log', message, splat };
            }
        }
        // Parse out any callback.
        const tmp = this.parseCallback(payload);
        payload = tmp.payload;
        cb = tmp.cb || utils_1.noop;
        // Check if message is an error
        if (payload.message instanceof Error) {
            err = payload.message;
            payload = Object.assign({}, payload, { message: err.message });
            payload.err = err;
        }
        const tokenLen = (payload.message.match(constants_1.FORMAT_EXP) || []).length;
        // Get message format token arguments.
        // const tokenArgs = payload.splat.slice(0, tokenLen);
        // Parse out any meta args and remaining splat args.
        // example: log('my name is %s', 'milton', { age: 30 }, 'waddams');
        // When transforms.splat() in stack JSON result:
        // example:      { message: 'my name is milton waddams', age: 30 }
        const parsed = payload.splat.slice(tokenLen).reduce((a, c) => {
            if (typeof c === 'undefined')
                return a;
            if (typeof c === 'object' && c !== null)
                a.meta = Object.assign({}, a.meta, c);
            else
                a.splat = [...a.splat, c];
            return a;
        }, { meta: {}, splat: [] });
        // Add non token args to end of splat. util.format
        // will simply add these to end of formatted message.
        payload.splat = [...payload.splat.slice(0, tokenLen), ...parsed.splat];
        payload = Object.assign({}, payload, parsed.meta // merge in any non-splat objects to payload.
        );
        return {
            payload: this.extendPayload(payload),
            cb
        };
    }
    // GETTERS //
    get levels() {
        return this.options.levels;
    }
    get level() {
        return this.options.level;
    }
    set level(level) {
        if (!this.options.levels.includes(level)) {
            this.console.warn(`Level "${level} ignored, valid levels [${this.options.levels.join(', ')}]`);
            return;
        }
        this.options.level = level;
    }
    get index() {
        if (this.options.level === 'log')
            return -1;
        return this.levels.indexOf(this.options.level);
    }
    /**
     * Returns current piped Transports.
     */
    get piped() {
        const { pipes } = this.stream._readableState;
        return !Array.isArray(pipes) ? [pipes].filter(Boolean) : pipes;
    }
    /**
     * Ensures payload contains required defaults as well as source and options Symbols.
     *
     * @param obj the configured payload object.
     */
    extendPayload(payload) {
        // Ensure defaults.
        payload = Object.assign({}, constants_1.PAYLOAD_DEFAULTS, payload);
        // Clone payload as source object.
        const source = payload[types_1.SOURCE];
        payload[types_1.SOURCE] = Object.assign({}, source, payload);
        // Create the configuration object.
        payload[types_1.CONFIG] = {
            label: this.label,
            levels: this.levels,
            colors: this.options.colors,
            elapsed: this.getElapsed()
        };
        // Error/clean stored in SOURCE clean from main payload.
        const { err, splat } = payload, clean = __rest(payload, ["err", "splat"]);
        return clean;
    }
    // MUTING //
    /**
     * Mutes the Logger OR specified child Loggers.
     *
     * @param child the child or children to mute.
     */
    mute(...child) {
        if (!child.length) {
            this.muted = true;
            return this;
        }
        if (child[0] === '*')
            child = [...this.children.keys()];
        this.children.toArray().forEach(c => child.includes(c.label) && c.mute());
        return this;
    }
    /**
     * Unmutes the Logger OR specified child Loggers.
     *
     * @param child the child or children to unmute.
     */
    unmute(...child) {
        if (!child.length) {
            this.muted = false;
            return this;
        }
        if (child[0] === '*')
            child = [...this.children.keys()];
        this.children.toArray().forEach(c => child.includes(c.label) && c.unmute());
        return this;
    }
    // CHILDREN //
    /**
     * Gets or Adds a child Logger to the current Logger.
     *
     * @param child the child Logger to be added.
     */
    child(label, meta) {
        let child;
        if (!meta)
            child = this.children.get(label);
        if (child)
            return child;
        const parent = this;
        child = Object.create(parent);
        child.stream = Object.create(child.stream, {
            write: {
                value(chunk, cb) {
                    chunk = Object.assign({}, chunk, meta);
                    parent.stream.write(chunk, cb);
                    return true;
                }
            }
        });
        child.label = label;
        this.children.add(label, child, this);
        return child;
    }
    transport(transport, ...transports) {
        if (typeof transport === 'string')
            return this.transports.get(transport);
        [transport, ...transports].forEach(tport => {
            this.transports.add(tport.label, tport);
            this.onEvent('error', tport);
            this.onEvent('warn', tport);
            this.stream.pipe(tport.stream);
            if (tport.get('exceptions'))
                this.exceptions.handle(tport);
            if (tport.get('rejections'))
                this.rejections.handle(tport);
        });
        return this;
    }
    log(level, message, ...splat) {
        if (this.muted)
            return this;
        const { payload, cb } = this.createPayload(level, message, splat);
        this.stream.write(payload, (err) => {
            if (err)
                throw err;
            cb(payload);
        });
        return this;
    }
    /**
     * Writes directly to stream WITHOUT line ending.
     *
     * @param message the message to be written to the stream.
     * @param cb callback on stream finished writing.
     */
    write(message, cb = utils_1.noop) {
        message = this.stingify(message);
        const payload = {
            level: 'write',
            message
        };
        this.stream.write(this.extendPayload(payload), cb);
        return this;
    }
    /**
     * Writes directly to stream WITH line ending.
     *
     * @param message the message to be written to the stream.
     * @param cb callback on stream finished writing.
     */
    writeLn(message, cb = utils_1.noop) {
        message = this.stingify(message) + os_1.EOL;
        const payload = {
            level: 'writeLn',
            message
        };
        this.stream.write(this.extendPayload(payload), cb);
        return this;
    }
    /**
     * Enables profiling of a Logger by id with elapsed times.
     *
     * @param id the identifier of the profile.
     * @param args optional aguments to be added to event.
     */
    profile(id, ...args) {
        const time = Date.now();
        if (this.profilers[id]) {
            const end = this.profilers[id];
            delete this.profilers[id];
            let obj = typeof args[args.length - 1] === 'object' ? args.pop() : {};
            // manually create payload
            // directly displatch.
            obj = Object.assign({ level: 'info', message: id, duration: time - end }, obj);
            this.log(obj);
            return this;
        }
        this.profilers[id] = time;
        return this;
    }
    /**
     * Queries any participating Transport with ".query()" method. Transport
     * queries compile the data this method merely bundles the results.
     *
     * @example
     * blurp.query({ })
     *
     * @param options options to pass to the query.
     * @param cb optional callback on results compiled.
     */
    query(options, ...transports) {
        const query = new query_1.Query(this, options);
        if (!transports.length)
            transports = this.transports.toArray();
        query.transports = transports;
        return query;
    }
    /**
     * Creates a firehose like stream of all participating Transports.
     *
     * @param options the funnel's options passed to participating transports.
     */
    firehose(options, ...transports) {
        const stream = new readable_stream_1.Stream();
        const streams = [];
        // @ts-ignore
        stream._streams = streams;
        stream.destroy = () => {
            let i = streams.length;
            while (i--) {
                streams[i].destroy();
            }
            return stream;
        };
        const _transports = this.transports.normalize(transports);
        // @ts-ignore
        _transports.filter(transport => !!transport.firehose)
            .forEach(transport => {
            // @ts-ignore
            const hose = transport.firehose(options);
            if (!hose)
                return;
            hose.on('log', obj => {
                obj.transport = [...(obj.transport || []), transport.label];
                stream.emit('log', obj);
            });
            hose.on('error', (err) => {
                err.transport = [...(err.transport || []), transport.label];
                stream.emit('error', err);
            });
            streams.push(hose);
        });
        return stream;
    }
    // EXITING & CLOSING STREAM //
    /**
     * Unpipes the stream.
     */
    unpipe() {
        this.stream.unpipe();
        return this;
    }
    /**
     * Close the Logger emitting 'close' on stream.
     */
    close() {
        this.unpipe();
        this.stream.emit('close');
        return this;
    }
    /**
     * Quits the Logger.
     *
     * @param cb optional callback on stream end.
     */
    exit(cb) {
        this.close();
        this.stream.end(cb || utils_1.noop);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map