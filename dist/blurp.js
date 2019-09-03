"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transforms_1 = require("./transforms");
const create_1 = require("./create");
const stores_1 = require("./stores");
const transports_1 = require("./transports");
const logger_1 = require("./logger");
const utils_1 = require("./utils");
const loggers = new stores_1.LoggerStore();
function createLogger(label, options) {
    if (typeof label === 'object') {
        options = label;
        label = undefined;
    }
    // Random string good collide I guess but unlikely good enough for here.
    label = label || ('$' + (Math.random() * 0xFFFFFF << 0).toString(16));
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
    combine: create_1.combine,
    ConsoleTransport: transports_1.ConsoleTransport,
    FileTransport: transports_1.FileTransport,
    Transport: transports_1.Transport
};
// Merge instance with helpers.
const blurp = utils_1.extend(logger, extended);
exports.default = blurp;
//# sourceMappingURL=blurp.js.map