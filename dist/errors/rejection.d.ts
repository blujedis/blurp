import BaseHandler from './base';
import { Logger } from '../logger';
export declare class RejectionHandler<L extends string> extends BaseHandler {
    constructor(logger: Logger<L>);
    /**
     * Gets bound Transports of type handleRejections.
     */
    get transports(): import("..").Transport<any, any>[];
}
