"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Aligns message using \t by default or pass custom props (Top Level Props ONLY)
 *
 * @example
 * log.transforms.align();
 * log.transforms.align({ char: '\t', props: ['level', 'message'] });
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
function alignTransform(payload, options) {
    options = Object.assign({ char: '\t', props: ['message'] }, options);
    const { char, props } = options;
    for (const prop of props) {
        if (payload.hasOwnProperty(prop))
            continue;
        payload[prop] = `${char}${payload[prop]}`;
    }
    return payload;
}
exports.default = alignTransform;
//# sourceMappingURL=align.js.map