"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require("../"));
function _customModifier(payload, options) {
    // modify the payload then return it.
    return payload;
}
function _customFormat(payload, options) {
    // Do something and return a string.
    return payload.message;
}
const customModifier = __1.default.createModifier(_customModifier);
const customFormat = __1.default.createFormatter(_customFormat);
// You can also combine the transforms.
const combined = __1.default.combine(customModifier(), customFormat({ my: 'option' }));
const logger = __1.default.createLogger('app', {
    transports: [
        new __1.default.ConsoleTransport()
    ],
    transforms: [
        customModifier(),
        customFormat({ my: 'option' })
        // OR combined (see const combined above)
    ]
});
//# sourceMappingURL=custom.js.map