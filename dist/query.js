"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const each_async_1 = __importDefault(require("each-async"));
const utils_1 = require("./utils");
const date_fns_1 = require("date-fns");
const util_1 = require("util");
const DEFAULTS = {
    timestampKey: 'timestamp',
    level: undefined,
    from: undefined,
    to: undefined,
    limit: 10,
    start: 0,
    sort: 'desc',
    transform: JSON.parse // parse each row using JSON.parse.
};
const DEFAULT_REPORT = {
    queried: 0,
    success: 0,
    skipped: 0,
    rows: [],
    filtered: [],
    errors: [],
    show: utils_1.noop
};
class Query {
    constructor(instance, options) {
        this._transports = [];
        this.logger = instance;
        this.options = Object.assign(Object.assign({}, DEFAULTS), options);
    }
    /**
     * Gets the loaded rows using getter.
     */
    get rows() {
        return this.report.rows || [];
    }
    /**
     * Gets all filtered rows using getter.
     */
    get filtered() {
        return this.report.filtered || [];
    }
    /**
     * Gets all bound Transports for query.
     */
    get transports() {
        return this._transports;
    }
    /**
     * Sets Tranports array.
     *
     * @param transports an array of Transport names or instances.
     */
    set transports(transports) {
        this._transports = this.logger.transports.normalize(transports);
    }
    /**
     * Adds a Transport to be added to collection.
     *
     * @param transport a Transport name or instance.
     */
    transport(transport) {
        const transports = this.logger.transports.normalize([transport]);
        if (transports[0])
            this.transports = [...this.transports, transports[0]];
        return this;
    }
    /**
     * Validates object ensures in date range matches filter.
     *
     * @param obj the payload object to validate.
     */
    isValid(obj) {
        const { timestampKey, level, from, to } = this.options;
        const _to = utils_1.toDate(to || new Date());
        const _from = utils_1.toDate(from || date_fns_1.subDays(_to, 1));
        if (!obj || typeof obj !== 'object' ||
            !obj.hasOwnProperty(timestampKey) ||
            (level &&
                obj.level !== level))
            return;
        const ts = utils_1.toDate(obj[timestampKey]);
        if (ts < _from || ts > _to)
            return;
        return true;
    }
    transform(stream, cb) {
        const _stream = !Array.isArray(stream) ? stream : null;
        const _rows = Array.isArray(stream) ? stream : null;
        let buffer = '';
        let results = [];
        let row = 0;
        const { start, sort, limit } = this.options;
        // Normalize each buffer/string as payload object.
        const normalize = (val, emit = true) => {
            try {
                let obj = this.options.transform(val);
                if (!this.isValid(obj))
                    return;
                if (results.length >= limit && sort !== 'desc') {
                    if (_stream && _stream.readable)
                        _stream.destroy();
                    return;
                }
                if (sort === 'desc' && results.length >= limit)
                    results.shift();
                // If user applies transformer we need to have
                // symbol properties on object.
                obj = this.logger.extendPayload(obj);
                results.push(obj);
            }
            catch (ex) {
                if (emit && _stream)
                    _stream.emit('error', ex);
            }
        };
        // Iterate rows of data
        if (_rows) {
            // Nothing to normalize.
            if (!_rows.length) {
                cb(null, []);
                return;
            }
            // already normalized to payload objects.
            if (typeof _rows[0] === 'object') {
                cb(null, _rows);
                return;
            }
            _rows.forEach(r => normalize(r));
        }
        // Listen to data on stream build normalized rows.
        else {
            _stream.on('data', data => {
                const _data = (buffer + data).split(/\n+/);
                _data.pop(); // remove empty line.
                for (const line of _data) {
                    if (!start || row >= start) {
                        normalize(line);
                    }
                    row++;
                }
                buffer = data[_data.length];
            });
            // When error destroy the stream return results.
            _stream.on('error', err => {
                if (_stream.readable)
                    _stream.destroy();
                if (!cb)
                    return;
                // @ts-ignore
                if (err.code === 'ENOENT')
                    err = null;
                return cb(err, !err && results);
            });
            // On close add buffer callback with results.
            _stream.on('close', () => {
                if (buffer)
                    normalize(buffer, false);
                if (sort === 'desc')
                    results = results.reverse();
                if (cb)
                    cb(null, results);
            });
        }
        return this;
    }
    exec(transports, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof transports === 'function') {
                cb = transports;
                transports = undefined;
            }
            // Ensure defaults.
            cb = cb || utils_1.noop;
            const _transports = this.transports =
                !(transports || []).length ?
                    this.transports :
                    this.logger.transports.normalize(transports);
            // reset the report.
            const report = this.report = Object.assign({}, DEFAULT_REPORT);
            // @ts-ignore
            report.show = this.show.bind(this);
            // Handle each iteration either callback containing data
            // or handle stream then callback with result.
            const run = (transport, i, next) => {
                // @ts-ignore
                if (!transport.query) {
                    report.skipped += 1;
                    return next();
                }
                const handle = (err, data) => {
                    // If not object payloads then transform.
                    if (typeof data[0] === 'string')
                        return this.transform(data, handle);
                    report.queried += 1;
                    if (err)
                        report.errors.push([transport.label, err, i]);
                    else
                        report.rows = [...report.rows, ...data];
                    next();
                };
                // @ts-ignore
                const query = transport.query(this.options);
                if (typeof query === 'function')
                    query(handle);
                else
                    this.transform(query, handle);
            };
            return new Promise((res) => {
                each_async_1.default(_transports, run, () => {
                    this.report = Object.assign({}, report);
                    cb(report);
                    res(report);
                });
            });
        });
    }
    /**
     * Filter the loaded rows using JSONata.
     * @see http://docs.jsonata.org/overview
     *
     * @example
     * .filter('');
     *
     * @param expressions an array of JSONata expressions to apply.
     */
    filter(...expressions) {
        return this.filtered;
    }
    show(rows, transformer) {
        if (typeof rows === 'function') {
            transformer = rows;
            rows = undefined;
        }
        let colorize = true;
        if (typeof rows === 'boolean') {
            colorize = rows;
            rows = undefined;
        }
        if (typeof transformer === 'boolean') {
            colorize = transformer;
            transformer = undefined;
        }
        const _rows = (rows || this.rows);
        _rows.forEach(v => {
            if (transformer && typeof transformer === 'function') {
                const transformed = transformer(v);
                utils_1.logger.log(transformed.payload[types_1.OUTPUT]);
            }
            else {
                utils_1.logger.log(util_1.inspect(v, null, null, colorize));
            }
        });
        return this;
    }
    /**
     * Resets/clears report data.
     */
    clear() {
        this.report = Object.assign({}, DEFAULT_REPORT);
        return this;
    }
}
exports.Query = Query;
//# sourceMappingURL=query.js.map