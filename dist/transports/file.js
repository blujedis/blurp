"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transport_1 = require("./transport");
const types_1 = require("../types");
const file_stream_rotator_1 = __importDefault(require("file-stream-rotator"));
const os_1 = require("os");
const fs_1 = require("fs");
const readable_stream_1 = require("readable-stream");
const tail_1 = require("./tail");
const query_1 = require("../query");
const DEFAULTS = {
    filename: './logs/%DATE%.log',
    frequency: 'daily',
    verbose: false,
    date_format: 'YYYY-MM-DD',
    size: '5m',
    max_logs: '7d',
    audit_file: './logs/_audit.json',
    file_options: { flags: 'a' },
    eol: os_1.EOL
};
class FileTransport extends transport_1.Transport {
    constructor(options) {
        super('console', Object.assign(Object.assign({}, DEFAULTS), options));
        options = this.options;
        const verbose = options.verbose;
        options.verbose = false;
        if (['hourly', 'minute'].includes(options.frequency))
            options.frequency = options.frequency.charAt(0);
        this.rotator = file_stream_rotator_1.default.getStream(options);
        if (options.onRotate)
            this.rotator.on('rotate', this.rotate.bind(this));
        if (options.onNew)
            this.rotator.on('new', this.newfile.bind(this));
        if (verbose)
            this.console.log(`Transport "${this.label} logging to file: ${this.options.filename}`);
    }
    /**
     * Gets the active filename.
     */
    get filename() {
        // @ts-ignore
        const files = this.rotator.auditLog.files;
        return files[files.length - 1].name;
    }
    /**
     * Callback handler on new file created.
     *
     * @param filename the new filename that was created.
     */
    newfile(newFile) {
        if (this.options.onRotate)
            return this.options.onNew(newFile);
        this.console.log(`Transport "${this.label}" logging to NEW file: ${newFile}`);
        return this;
    }
    /**
     * Callback handler on file rotated.
     *
     * @param oldFile the previous file path.
     * @param newFile the new or current file path.
     */
    rotate(oldFile, newFile) {
        if (this.options.onRotate)
            return this.options.onRotate(oldFile, newFile);
        // PLACEHOLDER: add gzip archiving.
        return this;
    }
    /**
     * Queries a
     * @param options options to apply to query logs.
     */
    query(options) {
        // Normalize options.
        const isQuery = options instanceof query_1.Query;
        options = isQuery ? options.options : options;
        const { filename, encoding } = options;
        // Create the file stream.
        const stream = fs_1.createReadStream(filename || this.filename, { encoding: encoding || 'utf8' });
        // Query instance passed just return stream.
        if (!isQuery)
            return stream;
        const query = options;
        query.transport(this);
        // Return the query user will call query.exec((err, data) => do something);
        return query;
    }
    /**
     * Enables connection to Logger for streaming events to firehose.
     *
     * @param options the config to pass to firehouse as options.
     */
    firehose(options) {
        const stream = new readable_stream_1.Stream();
        options = options || {};
        // @ts-ignore override destroy method.
        stream.destroy = tail_1.tail(this.filename, (err, line) => {
            if (err)
                return stream.emit('error', err);
            try {
                stream.emit('data', line);
                stream.emit('log', JSON.parse(line));
            }
            catch (e) {
                this.console.log(e);
                stream.emit('error', e);
            }
        });
        return stream;
    }
    /**
     * Log handler that receives payload when Transport writes to stream.
     *
     * @param result the log payload object.
     * @param enc the encoding string.
     * @param cb callback called on completed to continue stream.
     */
    log(payload, cb) {
        const { [types_1.OUTPUT]: output } = payload;
        setImmediate(() => this.emit('payload', payload));
        this.rotator.write(output + this.options.eol);
        cb();
    }
}
exports.FileTransport = FileTransport;
//# sourceMappingURL=file.js.map