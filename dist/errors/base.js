"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const each_async_1 = __importDefault(require("each-async"));
const one_time_1 = __importDefault(require("one-time"));
const stream_1 = __importDefault(require("./stream"));
const stores_1 = require("../stores");
const utils_1 = require("../utils");
class BaseHandler {
    constructor(event, logger) {
        this.logger = logger;
        this._store = new stores_1.ErrorStore();
        if (!event || !logger)
            throw new Error('Uncaught error handlers require event name and Logger');
        this._event = event;
    }
    /**
     * Common handler called on error.
     *
     * @param err the error passed from the process handler.
     */
    handler(err) {
        const transports = this.transports;
        let shouldExit = this.logger.get('errorExit');
        err = typeof err === 'string' ? new Error(err) : err;
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
                console.warn(`${utils_1.capitalize(this.logger.label)}: cannot "errorExit" with 0 exception Transports`);
            else
                console.warn(`${utils_1.capitalize(this.logger.label)}: cannot "errorExit" with 0 rejection Transports`);
            console.warn(`${utils_1.capitalize(this.logger.label)}: ignoring error exit`);
            shouldExit = false;
        }
        if (!transports || transports.length === 0)
            return process.nextTick(gracefulExit);
        each_async_1.default(transports, (transport, idx, next) => {
            const done = one_time_1.default(next);
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
        this.logger.log({
            // @ts-ignore
            level: this.logger.options.errorLevel,
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
    add(transport) {
        if (!this._store.has(transport)) {
            if (this._event === 'uncaughtException')
                // @ts-ignore
                transport.options.exceptions = true;
            else
                // @ts-ignore
                transport.options.rejections = true;
            const stream = new stream_1.default(this._event, transport);
            this._store.add(transport, stream);
            this.logger.stream.pipe(stream);
        }
    }
    /**
     * Gets list of handlers that support event type.
     */
    get transports() {
        throw new Error(`Must override getter this.transports in BaseHandler`);
    }
    /**
     * Iterates array of Transports and binds handlers.
     *
     * @param transports array of Transports.
     */
    handle(...transports) {
        if (transports.length)
            transports.forEach(transport => this.add(transport));
        if (!this._handler) {
            this._handler = this.handler.bind(this);
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
exports.default = BaseHandler;
//# sourceMappingURL=base.js.map