"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transport_1 = require("./transport");
const types_1 = require("../types");
const os_1 = require("os");
const utils_1 = require("../utils");
class ConsoleTransport extends transport_1.Transport {
    constructor(options) {
        super('console', Object.assign({ eol: os_1.EOL, errorLevels: [] }, options));
        const { stream } = this.options;
        if (stream && !stream.writable) {
            utils_1.logger.warn(`Transport "${utils_1.capitalize(this.label)}" has unwritable stream falling back to process.stdout & process.stderr`);
            this.options.stream = undefined;
        }
    }
    /**
     * Gets stream from options.
     *
     * @param level the level of the log message.
     */
    dispatcher(level) {
        const eol = this.options.eol;
        if (this.options.stream)
            return { write: (message) => this.options.stream.write(message + eol) };
        // If not included in error levels use stdout or console.log.
        if (level === 'log' || !this.options.errorLevels.includes(level))
            return utils_1.wrapStream(console._stdout, console.log, eol);
        // if error or warn use for fallback
        const fallbackConsole = ['error', 'warn'].includes(level) ? console[level] : console.log;
        return utils_1.wrapStream(console._stderr, fallbackConsole, eol);
    }
    /**
     * Log handler that receives payload when Transport writes to stream.
     *
     * @param result the log payload object.
     * @param enc the encoding string.
     * @param cb callback called on completed to continue stream.
     */
    log(payload, cb) {
        setImmediate(() => this.emit('payload', payload));
        const { [types_1.SOURCE]: source, [types_1.OUTPUT]: output } = payload;
        if (source.level === 'write' || source.level === 'writeLn')
            process.stdout.write(output);
        else
            this.dispatcher(source.level).write(output);
        cb();
    }
}
exports.ConsoleTransport = ConsoleTransport;
//# sourceMappingURL=console.js.map