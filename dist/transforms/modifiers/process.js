"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const map = {
    process: {
        basic: ['version', 'pid'],
        advanced: ['version', 'pid', 'memoryUsage', 'getuid', 'getgid'],
        all: ['version', 'pid', 'cwd', 'getuid', 'getgid', 'memoryUsage', 'argv', 'execArgv', 'execPath']
    },
    system: {
        basic: ['hostname', 'totalmem', 'freemem'],
        advanced: ['hostname', 'uptime', 'loadavg', 'totalmem', 'freemem'],
        all: ['platform', 'arch', 'hostname', 'uptime', 'loadavg', 'totalmem', 'freemem']
    }
};
function getOrCall(from, prop) {
    try {
        if (typeof from[prop] === 'function')
            return from[prop]();
        return from[prop];
    }
    catch (ex) {
        return null;
    }
}
function loadProcess(keys) {
    return keys.reduce((result, key) => {
        const val = getOrCall(process, key);
        if (val === null)
            return result;
        key = key.replace(/^get/, '');
        result[key] = val;
        return result;
    }, {});
}
function loadSystem(keys) {
    return keys.reduce((result, key) => {
        const val = getOrCall(os_1.default, key);
        if (val === null)
            return result;
        result[key] = val;
        return result;
    }, {});
}
const getActiveKeys = obj => Object.keys(obj).filter(k => obj[k] === true);
/**
 * Extends log payload with process and os properties useful when writing to file.
 *
 * @example
 * log.transforms.process({ process: 'basic', system: 'advanced', systemKey: '_system' });
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
function processTransform(payload, options) {
    options = { processKey: 'process', systemKey: 'system', process: 'basic', system: 'basic' };
    const { processKey, systemKey, system, process: proc } = options;
    let _process = {};
    let _system = {};
    if (proc) {
        if (typeof proc === 'string' && map.process[proc])
            _process = loadProcess(map.process[proc]);
        else
            _process = loadProcess(getActiveKeys(proc));
        payload = Object.assign({}, payload, { [processKey || 'process']: _process });
    }
    if (system) {
        if (typeof system === 'string' && map.system[system])
            _system = loadSystem(map.system[system]);
        else
            _system = loadSystem(getActiveKeys(system));
        payload = Object.assign({}, payload, { [systemKey || 'system']: _system });
    }
    return payload;
}
exports.default = processTransform;
//# sourceMappingURL=process.js.map