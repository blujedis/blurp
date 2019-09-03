"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = __importDefault(require("./base"));
class ExceptionHandler extends base_1.default {
    constructor(logger) {
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
exports.ExceptionHandler = ExceptionHandler;
//# sourceMappingURL=exception.js.map