import { Writable } from 'readable-stream';
import { Transport } from '../transports';
import { IPayload, Callback, SOURCE } from '../types';
import { Event } from './base';
import { EOL } from 'os';

export default class ExceptionStream<L extends string> extends Writable {

  constructor(public event: Event, public transport: Transport<L, any>) {
    super({ objectMode: true });
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
  _write(payload: IPayload<L>, enc: string, cb: Callback) {
    
    const { err } = payload[SOURCE];

    if (err && (err.isException || err.isRejection)) {
      try {
        // Even if we get errors in the transform
        // ignore still write to transport. Maybe
        // there's a use case not to but for now.
        const { payload: _payload } = this.transport.transformer(payload);
        return this.transport.log(_payload, cb);
      }
      catch (ex) {
        // If we get an error here just output to be safe.
        (console._stderr || process.stderr).write(ex + EOL);
      }
    }

    cb();
    return true;

  }

}
