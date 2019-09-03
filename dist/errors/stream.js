"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readable_stream_1 = require("readable-stream");
const types_1 = require("../types");
const os_1 = require("os");
class ExceptionStream extends readable_stream_1.Writable {
    constructor(event, transport) {
        super({ objectMode: true });
        this.event = event;
        this.transport = transport;
        if (!transport)
            throw new Error('ExceptionStream requires a TransportStream instance.');
    }
    /**
     * Writes the error log payload to stream.
     *
     * @param payload the log payload object.
     * @param enc the encoding type.
     * @param cb the callback on completion to continue stream.
     */
    _write(payload, enc, cb) {
        const { err } = payload[types_1.SOURCE];
        if (err && err.isException) {
            try {
                // Even if we get errors in the transform
                // ignore still write to transport. Maybe
                // there's a use case not to be for now.
                const { payload: _payload } = this.transport.transformer(payload);
                return this.transport.log(_payload, cb);
            }
            catch (ex) {
                // If we get an error here just output to be safe.
                (console._stderr || process.stderr).write(ex + os_1.EOL);
            }
        }
        cb();
        return true;
    }
}
exports.default = ExceptionStream;
//# sourceMappingURL=stream.js.map