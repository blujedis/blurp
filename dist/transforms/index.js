"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_1 = require("../create");
const extend_1 = __importDefault(require("./modifiers/extend"));
const colorize_1 = __importDefault(require("./modifiers/colorize"));
const align_1 = __importDefault(require("./modifiers/align"));
const case_1 = __importDefault(require("./modifiers/case"));
const mask_1 = __importDefault(require("./modifiers/mask"));
const pad_1 = __importDefault(require("./modifiers/pad"));
const trace_1 = __importDefault(require("./modifiers/trace"));
const sort_1 = __importDefault(require("./modifiers/sort"));
const delimited_1 = __importDefault(require("./formats/delimited"));
const json_1 = __importDefault(require("./formats/json"));
const generic_1 = __importDefault(require("./modifiers/generic"));
const terminal_1 = __importDefault(require("./stacks/terminal"));
const pretty_1 = __importDefault(require("./formats/pretty"));
const meta_1 = __importDefault(require("./modifiers/meta"));
const splat_1 = __importDefault(require("./modifiers/splat"));
const label_1 = __importDefault(require("./modifiers/label"));
const timestamp_1 = __importDefault(require("./modifiers/timestamp"));
const errorify_1 = __importDefault(require("./modifiers/errorify"));
const private_1 = __importDefault(require("./modifiers/private"));
const file_1 = __importDefault(require("./stacks/file"));
__export(require("./modifiers/align"));
__export(require("./modifiers/case"));
__export(require("./modifiers/colorize"));
__export(require("./modifiers/extend"));
__export(require("./modifiers/meta"));
__export(require("./modifiers/generic"));
__export(require("./modifiers/mask"));
__export(require("./modifiers/pad"));
__export(require("./modifiers/sort"));
__export(require("./modifiers/trace"));
__export(require("./modifiers/meta"));
__export(require("./modifiers/splat"));
__export(require("./modifiers/label"));
__export(require("./modifiers/timestamp"));
__export(require("./modifiers/errorify"));
__export(require("./formats/pretty"));
__export(require("./formats/delimited"));
__export(require("./formats/json"));
__export(require("./stacks/terminal"));
/**
 * Initialize Transform Helpers.
 */
function initTransforms() {
    const json = create_1.createFormatter(json_1.default);
    const terminal = create_1.createFormatter(terminal_1.default);
    const modifier = {
        // Modifier Transforms
        align: create_1.createModifier(align_1.default),
        casing: create_1.createModifier(case_1.default),
        colorize: create_1.createModifier(colorize_1.default),
        extend: create_1.createModifier(extend_1.default),
        meta: create_1.createModifier(meta_1.default),
        generic: create_1.createModifier(generic_1.default),
        mask: create_1.createModifier(mask_1.default),
        pad: create_1.createModifier(pad_1.default),
        sort: create_1.createModifier(sort_1.default),
        trace: create_1.createModifier(trace_1.default),
        timestamp: create_1.createModifier(timestamp_1.default),
        errorify: create_1.createModifier(errorify_1.default),
        label: create_1.createModifier(label_1.default),
        splat: create_1.createModifier(splat_1.default),
        private: create_1.createModifier(private_1.default),
    };
    const format = {
        // Formatter Transforms
        delimited: create_1.createFormatter(delimited_1.default),
        pretty: create_1.createFormatter(pretty_1.default),
        json,
        JSON: json
    };
    const stack = {
        file: create_1.createFormatter(file_1.default),
        terminal,
        console: terminal
    };
    return {
        modifier,
        format,
        stack
    };
}
exports.initTransforms = initTransforms;
exports.transforms = initTransforms();
//# sourceMappingURL=index.js.map