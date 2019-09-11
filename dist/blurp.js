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
 * @param force allows overwriting existing Loggers.
 */
function createLogger(label, options, force = false) {
    let logger = loggers.get(label);
    // Return existing logger if 
    // exists and not force to recreate.
    if (logger && !force)
        return logger;
    logger = new logger_1.Logger(label, options);
    loggers.add(label, logger, force);
    return logger;
}
/**
 * Creates the default logger for use with console/terminal.
 *
 * @param name the name of the default logger.
 */
function defaultLogger() {
    const _transforms = transforms_1.initTransforms();
    return createLogger('default', {
        transports: [
            new transports_1.ConsoleTransport(),
            new transports_1.FileTransport({
                transforms: [
                    _transforms.stack.file()
                ]
            })
        ],
        transforms: [
            _transforms.stack.terminal()
        ]
    });
}
function init() {
    const extended = {
        loggers,
        createLogger,
        createFormatter: create_1.createFormatter,
        createModifier: create_1.createModifier,
        transforms: transforms_1.transforms,
        combine: create_1.combine,
        ConsoleTransport: transports_1.ConsoleTransport,
        FileTransport: transports_1.FileTransport,
        Transport: transports_1.Transport
    };
    // Merge instance with helpers.
    return utils_1.extend(defaultLogger(), extended);
}
exports.default = init();
//# sourceMappingURL=blurp.js.map