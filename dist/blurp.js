"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transforms_1 = require("./transforms");
const create_1 = require("./create");
const stores_1 = require("./stores");
const transports_1 = require("./transports");
const logger_1 = require("./logger");
const utils_1 = require("./utils");
const loggers = new stores_1.LoggerStore();
/**
 * Creates a new Blurp Logger.
 *
 * @param label the label or name of the Logger.
 * @param options the Logger's options.
 */
function createLogger(label, options) {
    const log = new logger_1.Logger(label, options);
    loggers.add(label, log);
    return log;
}
/**
 * Creates the default logger for use with console/terminal.
 *
 * @param name the name of the default logger.
 */
function defaultLogger() {
    return createLogger('default', {
        transports: [
            new transports_1.ConsoleTransport(),
            new transports_1.FileTransport({
                transforms: [
                    transforms_1.transforms.stack.file()
                ]
            })
        ],
        transforms: [
            transforms_1.transforms.stack.terminal()
        ]
    });
}
const logger = defaultLogger();
const extended = {
    loggers,
    createLogger,
    createFormatter: create_1.createFormatter,
    createModifier: create_1.createModifier,
    transforms: transforms_1.transforms,
    combine: create_1.combine
};
// Merge instance with helpers.
const blurp = utils_1.extend(logger, extended);
exports.default = blurp;
//# sourceMappingURL=blurp.js.map