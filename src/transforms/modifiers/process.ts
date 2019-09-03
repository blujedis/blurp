import { IPayload } from '../../types';
import { pkg } from '../../constants';
import os from 'os';

export interface IProcessTransformInfoOptions {
  version?: boolean;
  pid?: boolean;
  cwd?: boolean;
  uid?: boolean;
  gid?: boolean;
  memoryUsage?: boolean;
  argv?: boolean;
  execArgv?: boolean;
  execPath?: boolean;
}

export interface IProcessTransformSystemOptions {
  platform?: boolean;
  arch?: boolean;
  hostname?: boolean;
  loadavg?: boolean;
  uptime?: boolean;
  totalmem?: boolean;
  freemem?: boolean;
}

export interface IProcessTransformOptions {
  processKey?: string;                                                  // (default: 'process')
  systemKey?: string;                                                   // (default: 'system')
  process?: 'basic' | 'advanced' | 'all' | IProcessTransformInfoOptions;        // node process info
  system?: 'basic' | 'advanced' | 'all' | IProcessTransformSystemOptions;       // host system info.
}

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

function loadProcess(keys: string[]) {
  return keys.reduce((result, key) => {
    const val = getOrCall(process, key);
    if (val === null)
      return result;
    key = key.replace(/^get/, '');
    result[key] = val;
    return result;
  }, {} as IProcessTransformInfoOptions);
}

function loadSystem(keys: string[]) {
  return keys.reduce((result, key) => {
    const val = getOrCall(os, key);
    if (val === null)
      return result;
    result[key] = val;
    return result;
  }, {} as IProcessTransformSystemOptions);
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
export default function processTransform<L extends string>(payload: IPayload<L>,
  options?: IProcessTransformOptions): IPayload<L> {
  options = { processKey: 'process', systemKey: 'system', process: 'basic', system: 'basic' };
  const { processKey, systemKey, system, process: proc } = options;

  let _process = {};
  let _system = {};

  if (proc) {
    if (typeof proc === 'string' && map.process[proc])
      _process = loadProcess(map.process[proc]);
    else
      _process = loadProcess(getActiveKeys(proc));
    payload = { ...payload, [processKey || 'process']: _process };
  }

  if (system) {
    if (typeof system === 'string' && map.system[system])
      _system = loadSystem(map.system[system]);
    else
      _system = loadSystem(getActiveKeys(system));
    payload = { ...payload, [systemKey || 'system']: _system };
  }

  return payload;

}
