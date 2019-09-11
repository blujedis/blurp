"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
const colorize_1 = __importDefault(require("../modifiers/colorize"));
const pad_1 = __importDefault(require("../modifiers/pad"));
const meta_1 = __importDefault(require("../modifiers/meta"));
const delimited_1 = __importDefault(require("../formats/delimited"));
const errorify_1 = __importDefault(require("../modifiers/errorify"));
const case_1 = __importDefault(require("../modifiers/case"));
const ziplit_1 = __importDefault(require("ziplit"));
const timestamp_1 = __importDefault(require("../modifiers/timestamp"));
const utils_1 = require("../../utils");
const label_1 = __importDefault(require("../modifiers/label"));
const splat_1 = __importDefault(require("../modifiers/splat"));
const private_1 = __importDefault(require("../modifiers/private"));
/**
 * Bundled stack for displaying logs in the terminal.
 *
 * @example
 * log.transforms.terminal();
 *
 * @param payload the current modified payload.
 * @param options the stack's options.
 */
function terminalFormat(payload, options = {}) {
    options = Object.assign({ errorify: 'stack', level: true, colorize: true, exclude: [], private: true, splat: true }, options);
    const { props, colorize, meta, extend, errorify, timestamp, label, splat, private: priv } = options;
    const { level } = payload[types_1.SOURCE];
    const { colors, levels } = payload[types_1.CONFIG];
    let _props = props || [];
    let _exclude = options.exclude;
    const _meta = meta === true ? 'meta' : meta;
    const _metaKeys = _meta ? false : true;
    const hasProps = _props.length;
    const addPropsIf = (...p) => (!hasProps ? _props = [..._props, ...p] : _props);
    if (priv && !private_1.default(payload))
        return null;
    const levelConf = options.level === true ? {
        pad: false,
        case: 'upper',
        template: '${level}:'
    } : options.level;
    const colorConf = utils_1.normalizeConf(colorize, {
        level: (colors || {})[level],
        message: null
    });
    if (extend)
        payload = Object.assign({}, payload, extend);
    if (splat)
        payload = splat_1.default(payload);
    if (timestamp) {
        const _format = timestamp === true ? 'short' : timestamp;
        payload = timestamp_1.default(payload, { format: _format });
        colorConf.timestamp = colorConf.timestamp || 'gray';
        addPropsIf('timestamp', 'level');
    }
    else {
        addPropsIf('level');
    }
    if (label) {
        const _template = label === true ? '${label}:' : label;
        payload = label_1.default(payload, { template: _template });
        colorConf.label = colorConf.label || 'white';
        addPropsIf('label');
    }
    addPropsIf('message', '...');
    if (levelConf) {
        if (levelConf.template)
            payload.level = ziplit_1.default.compile(levelConf.template).render(payload[types_1.SOURCE].level);
        if (levelConf.case)
            payload = case_1.default(payload, { level: levelConf.case });
        if (levelConf.pad)
            payload = pad_1.default(payload);
    }
    if (_meta) {
        payload = meta_1.default(payload, { prop: _meta });
        addPropsIf(_meta);
    }
    if (errorify)
        payload = errorify_1.default(payload, { format: errorify });
    if (colorize && colors) {
        const opts = {};
        for (const k in colors) {
            if (!colors.hasOwnProperty(k))
                continue;
            // Colorize the levels and optional matching message.
            if (levels.includes(k) || k === 'log') {
                if (level === k) {
                    if (colorConf.level) {
                        opts[k] = {
                            prop: 'level',
                            condition: k,
                            style: colors[k]
                        };
                    }
                    if (colorConf.message) {
                        // @ts-ignore override user constraint.
                        opts[k + '-message'] = {
                            prop: 'message',
                            matchProp: 'level',
                            condition: k,
                            style: colors[k]
                        };
                    }
                }
            }
            // Colorize non levels.
            else if (colorConf[k]) {
                opts[k] = colors[k];
            }
        }
        payload = colorize_1.default(payload, opts);
    }
    // If message level === 'log' remove timestamp, level & label
    // only include formatted message with meta if any.
    if (level === 'log')
        _exclude = [..._exclude, 'level', 'timestamp', 'label'];
    const withKeys = _metaKeys ? utils_1.getProps(payload, _props).filter(v => !_props.includes(v) && !_exclude.includes(v)) : [];
    return delimited_1.default(payload, {
        props: _props,
        exclude: _exclude,
        char: ' ',
        withKeys
    });
}
exports.default = terminalFormat;
//# sourceMappingURL=terminal.js.map