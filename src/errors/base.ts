import each from 'each-async';
import once from 'one-time';
import ExceptionStream from './stream';
import { Logger } from '../logger';
import { Transport } from '../transports';
import { ErrorStore } from '../stores';
import { ErrorExt } from '../types';
import { capitalize } from '../utils';

export type Event = 'uncaughtException' | 'unhandledRejection';
export type Handler = (value: Error | {} | null | undefined, promise?: Promise<any>) => void;

export default class BaseHandler<L extends string = any> {

  protected _store = new ErrorStore<L>();
  protected _event: any;
  private _handler: Handler;

  constructor(event: Event, public logger: Logger<L>) {
    if (!event || !logger)
      throw new Error('Uncaught error handlers require event name and Logger');
    this._event = event;
  }

  /**
   * Common handler called on error.
   * 
   * @param err the error passed from the process handler.
   */
  protected handler(err?: ErrorExt) {

    const transports = this.transports;
    let shouldExit = this.logger.get('errorExit');
    err = typeof err === 'string' ? new Error(err as string) as any : err;
    let timeoutId;

    function gracefulExit() {
      // @ts-ignore
      if (shouldExit && !process._exiting) {
        if (timeoutId)
          clearTimeout(timeoutId);
        process.exit(1);
      }
    }

    if (!transports.length && shouldExit) {
      if (this._event === 'uncaughtException')
        console.warn(`${capitalize(this.logger.label)}: cannot "errorExit" with 0 exception Transports`);
      else
        console.warn(`${capitalize(this.logger.label)}: cannot "errorExit" with 0 rejection Transports`);
      console.warn(`${capitalize(this.logger.label)}: ignoring error exit`);
      shouldExit = false;
    }

    if (!transports || transports.length === 0)
      return process.nextTick(gracefulExit);

    each(transports, (transport, idx, next) => {

      const done = once(next);

      function onDone(e) {
        return () => done;
      }

      transport._exiting = true;
      transport.once('finish', onDone('finished'));
      transport.once('error', onDone('error'));

    }, () => shouldExit && gracefulExit());

    if (this._event === 'uncaughtException')
      err.isException = true;
    else
      err.isRejection = true;

    // @ts-ignore
    this.logger.log({
      message: err
    });

    if (shouldExit)
      timeoutId = setTimeout(gracefulExit, 3000);

  }

  /**
   * Creates stream and binds/pipes from Logger.
   * 
   * @param transport the transport to be bound.
   */
  protected add(transport: Transport<L, any>) {
    if (!this._store.has(transport)) {
      if (this._event === 'uncaughtException') 
        // @ts-ignore
        transport.options.exceptions = true;
      else
        // @ts-ignore
        transport.options.rejections = true;
      const stream = new ExceptionStream(this._event, transport);
      this._store.add(transport, stream);
      this.logger.stream.pipe(stream);
    }
  }

  /**
   * Gets list of handlers that support event type.
   */
  get transports(): Array<Transport<L, any>> {
    throw new Error(`Must override getter this.transports in BaseHandler`);
  }

  /**
   * Iterates array of Transports and binds handlers.
   * 
   * @param transports array of Transports. 
   */
  handle(...transports: Array<Transport<L, any>>) {
    if (transports.length)
      transports.forEach(transport => this.add(transport));
    if (!this._handler) {
      this._handler = this.handler.bind(this) as Handler;
      process.on(this._event, this._handler);
    }
  }

  /**
   * Unhandle the Transport listener.
   */
  unhandle() {
    if (this._handler) {
      process.removeListener(this._event, this._handler);
      this._handler = null;
      [...this._store.values()]
        .forEach(stream => this.logger.stream.unpipe(stream));
    }
  }

}
