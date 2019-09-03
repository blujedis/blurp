"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = __importDefault(require("./base"));
class RejectionHandler extends base_1.default {
    constructor(logger) {
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
exports.RejectionHandler = RejectionHandler;
//# sourceMappingURL=rejection.js.map