"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
/**
 * Pads level property to left or right (Top Level Props ONLY)
 *
 * @example
 * log.transforms.pad({ char: ' ', position: 'left'});
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
function pad(payload, options) {
    options = Object.assign({ position: 'left', char: ' ' }, options);
    const { char, position } = options;
    const { levels } = payload[types_1.CONFIG];
    const { level } = payload[types_1.SOURCE];
    if (!levels.includes(level))
        return payload;
    // gets longest.
    const maxLen = Math.max(...levels.map(v => v.length));
    // get map of all paddings.
    const padMap = levels.reduce((a, c) => {
        const len = maxLen - c.length;
        const repeat = Math.floor(len / char.length);
        a[c] = `${char}${char.repeat(repeat)}`.slice(0, len);
        return a;
    }, {});
    if (position === 'right')
        payload.level = `${payload.level}${padMap[level]}`;
    else
        payload.level = `${padMap[level]}${payload.level}`;
    return payload;
}
exports.default = pad;
//# sourceMappingURL=pad.js.map