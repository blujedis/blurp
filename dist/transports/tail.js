"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const readable_stream_1 = require("readable-stream");
const string_decoder_1 = require("string_decoder");
const noop = v => v;
function tail(file, options, handler) {
    if (typeof options === 'function') {
        handler = options;
        options = undefined;
    }
    const _options = Object.assign({ eol: /\n+/, timeout: 1000 }, options);
    const buffer = Buffer.alloc(64 * 1024);
    const decode = new string_decoder_1.StringDecoder('utf8');
    const stream = new readable_stream_1.Stream();
    if (_options.start === -1)
        delete _options.start;
    stream.readable = true;
    stream.destroy = () => {
        stream.destroyed = true;
        stream.emit('end');
        stream.emit('close');
        return stream;
    };
    let str = '';
    let position = 0;
    let row = 0;
    fs_1.open(file, 'a+', '0644', (err, fd) => {
        if (err)
            process.exit();
        // If Error emit and destroy.
        if (err) {
            if (!handler)
                stream.emit('error', err);
            else
                handler(err);
            stream.destroy();
            return;
        }
        // Self executing funtion returns fs.read reader.
        (function reader() {
            if (stream.destroyed) {
                fs_1.close(fd, noop);
                return;
            }
            return fs_1.read(fd, buffer, 0, buffer.length, position, (ex, bytes) => {
                if (ex) {
                    if (!handler)
                        stream.emit('error', ex);
                    else
                        handler(ex);
                    stream.destroy();
                    return;
                }
                // If no bytes emit or handle compiled string.
                if (!bytes) {
                    if (str) {
                        if (_options.start == null || row > _options.start) {
                            if (!handler)
                                stream.emit('line', str);
                            else
                                handler(null, str);
                        }
                        row++;
                        str = '';
                    }
                    return setTimeout(reader, _options.timeout);
                }
                // Decode byes split by line return (eol) 
                // iterate and emit lines.
                const decoded = decode.write(buffer.slice(0, bytes));
                if (!handler)
                    stream.emit('data', decoded);
                //  const data = (str + decoded).split(/\n+/);
                const data = (str + decoded).split(_options.eol);
                const len = data.length - 1;
                let i = 0;
                for (; i < len; i++) {
                    if (_options.start == null || row > _options.start) {
                        if (!handler)
                            stream.emit('line', data[i]);
                        else
                            handler(null, data[i]);
                    }
                    row++;
                }
                str = data[len];
                position += bytes;
                return reader();
            });
        }());
    });
    if (!handler)
        return stream;
    return stream.destroy;
}
exports.tail = tail;
//# sourceMappingURL=tail.js.map