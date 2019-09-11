"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
const meta_1 = __importDefault(require("../modifiers/meta"));
const delimited_1 = __importDefault(require("../formats/delimited"));
const errorify_1 = __importDefault(require("../modifiers/errorify"));
const timestamp_1 = __importDefault(require("../modifiers/timestamp"));
const splat_1 = __importDefault(require("../modifiers/splat"));
const private_1 = __importDefault(require("../modifiers/private"));
const json_1 = __importDefault(require("../formats/json"));
const trace_1 = __importDefault(require("../modifiers/trace"));
const process_1 = __importDefault(require("../modifiers/process"));
/**
 * Bundled stack for displaying logs in files.
 *
 * @example
 * log.transforms.file();
 *
 * @param payload the current modified payload.
 * @param options the stack's options.
 */
function fileFormat(payload, options = {}) {
    options = Object.assign({ includeLog: false, format: 'json', errorify: 'stack', exclude: [], private: true, splat: true, process: 'basic' }, options);
    const { props, meta, extend, errorify, timestamp, exclude, label, splat, private: priv, trace, process: proc } = options;
    const { level } = payload[types_1.SOURCE];
    // Exclude generic .log() messages from file.
    if (level === 'log' && !options.includeLog)
        return null;
    let _props = props || [];
    const _meta = meta === true ? 'meta' : meta;
    const hasProps = _props.length;
    const addPropsIf = (...p) => (!hasProps ? _props = [..._props, ...p] : _props);
    if (priv && !private_1.default(payload))
        return null;
    if (extend)
        payload = Object.assign({}, payload, extend);
    if (splat)
        payload = splat_1.default(payload);
    if (timestamp) {
        const _format = timestamp === true ? 'short' : timestamp;
        payload = timestamp_1.default(payload, { format: _format });
        addPropsIf('timestamp');
    }
    addPropsIf('level');
    if (label) {
        payload.label = payload[types_1.CONFIG].label;
        addPropsIf('label');
    }
    addPropsIf('message', '...');
    if (_meta) {
        payload = meta_1.default(payload, { prop: _meta });
        addPropsIf(_meta);
    }
    if (errorify)
        payload = errorify_1.default(payload, { format: errorify });
    if (trace) {
        // All or accept trace defaults which are
        // triggered on rejections or exceptions.
        payload = trace_1.default(payload, {
            all: trace === 'all'
        });
    }
    if (proc)
        payload = process_1.default(payload, { process: proc, system: proc });
    if (options.format === 'json')
        return json_1.default(payload, { props, exclude });
    const char = options.format === 'csv' ? ',' : '\t';
    return delimited_1.default(payload, {
        props: _props,
        exclude,
        char
    });
}
exports.default = fileFormat;
//# sourceMappingURL=file.js.map