import BaseHandler from './base';
import { Logger } from '../logger';
export declare class ExceptionHandler<L extends string> extends BaseHandler {
    constructor(logger: Logger<L>);
    /**
     * Gets bound Transports of type handleExceptions.
     */
    readonly transports: import("..").Transport<any, any>[];
}
