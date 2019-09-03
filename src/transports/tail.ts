import { read, close, open } from 'fs';
import { Stream } from 'readable-stream';
import { StringDecoder } from 'string_decoder';
import { Callback } from 'types';

export interface ITailOptions {
  start?: number;                           // Starting index (default: undefined)
  timeout?: number;                         // Read timeout (default: 1000)
  eol?: string | RegExp;                    // Line ending (default: /\n+/)
}

const noop = v => v;

/**
 * Tails the specified file.
 * 
 * Based on tail-file.js
 * Charlie Robbins
 * @see https://github.com/winstonjs/winston/blob/master/lib/winston/tail-file.js
 * 
 * @example
 * tail('/path/to/file.log', (err, line) => { console.log(line); });
 * 
 * @param file the file to tail.
 * @param handler the callback handler on file tailed.
 */
export function tail(file: string, handler?: Callback<string>): Stream;

/**
 * Tails the specified file.
 * 
 * Based on tail-file.js
 * Charlie Robbins
 * @see https://github.com/winstonjs/winston/blob/master/lib/winston/tail-file.js
 * 
 * @example
 * tail('/path/to/file.log', { start: 10 }, (err, line) => { console.log(line); });
 * 
 * @param file the file to tail.
 * @param options tail file options.
 * @param handler the callback handler on file tailed.
 */
export function tail(file: string, options?: ITailOptions, handler?: Callback<string>): Stream;
export function tail(file: string, options?: ITailOptions | Callback<string>, handler?: Callback<string>) {

  if (typeof options === 'function') {
    handler = options;
    options = undefined;
  }

  const _options = { eol: /\n+/, timeout: 1000, ...options } as ITailOptions;

  const buffer = Buffer.alloc(64 * 1024);
  const decode = new StringDecoder('utf8');
  const stream = new Stream();

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

  open(file, 'a+', '0644', (err, fd) => {

    if (err) process.exit();

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
          close(fd, noop);
        return;
      }

      return read(fd, buffer, 0, buffer.length, position, (ex, bytes) => {

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
