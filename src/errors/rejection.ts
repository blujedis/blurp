import BaseHandler from './base';
import { Logger } from '../logger';

export class RejectionHandler<L extends string> extends BaseHandler {

  constructor(logger: Logger<L>) {
    super('unhandledRejection', logger);
  }

  /**
   * Gets bound Transports of type handleRejections.
   */
  get transports() {
    return [...this.logger.transports.values()]
      .filter(transport => transport.get('rejections'));
  }

}
