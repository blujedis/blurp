import BaseHandler from './base';
import { Logger } from '../logger';

export class ExceptionHandler<L extends string> extends BaseHandler {

  constructor(logger: Logger<L>) {
    super('uncaughtException', logger);
  }

  /**
   * Gets bound Transports of type handleExceptions.
   */
  get transports() {
    return [...this.logger.transports.values()]
      .filter(transport => transport.get('exceptions'));
  }

}
