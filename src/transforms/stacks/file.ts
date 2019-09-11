import { IPayload, SOURCE, CONFIG } from '../../types';
import metaTransform from '../modifiers/meta';
import delimitedFormat from '../formats/delimited';
import errorifyTransform, { ErrorifyFormat } from '../modifiers/errorify';
import timestampTransform, { TimestampFormat } from '../modifiers/timestamp';
import splatTransform from '../modifiers/splat';
import privateTransform from '../modifiers/private';
import jsonFormat from '../formats/json';
import traceTransform from '../modifiers/trace';
import processTransform from '../modifiers/process';

export interface IFileFormatOptions {
  props?: string[];                      // (default: undefined) includes all when undefined.
  exclude?: string[];                    // (default: undefined) excludes none when undefined.
  format?: 'json' | 'csv' | 'tab';       // (default: json) the format to output.
  timestamp?: boolean | TimestampFormat; // (default: undefined) when 
  label?: boolean;                       // (default: undefined) when true adds label.
  private?: string | boolean;            // (default: true) when key is in payload abort the log event.
  meta?: string | boolean;               // (default: undefined) merges non meta properties to this prop.
  splat?: boolean;                       // (default: true) applies util.format on message and splat args.
  errorify?: ErrorifyFormat;             // (default: 'stack') format type when error is present.
  trace?: boolean | 'all';               // (default: true) add trace when error is present.
  process?: 'basic' | 'advanced' | 'all'; // (default: 'basic') adds process and system info.
  extend?: {
    [key: string]: any;
  };
  includeLog?: boolean;            // (default: false) when true includes .log() messages.
}

/**
 * Bundled stack for displaying logs in files.
 * 
 * @example
 * log.transforms.file();
 * 
 * @param payload the current modified payload.
 * @param options the stack's options.
 */
export default function fileFormat<L extends string>(payload: IPayload<L>,
  options: IFileFormatOptions = {}) {

  options = {
    includeLog: false, format: 'json', errorify: 'stack', exclude: [],
    private: true, splat: true, process: 'basic', ...options
  };

  const { props, meta, extend, errorify, timestamp, exclude,
    label, splat, private: priv, trace, process: proc } = options;

  const { level } = payload[SOURCE];

  // Exclude generic .log() messages from file.
  if (level === 'log' && !options.includeLog)
    return null;

  let _props = props || [];
  const _meta = meta === true ? 'meta' : meta;

  const hasProps = _props.length;
  const addPropsIf = (...p) => (!hasProps ? _props = [..._props, ...p] : _props);

  if (priv && !privateTransform(payload))
    return null;

  if (extend)
    payload = { ...payload, ...extend };

  if (splat)
    payload = splatTransform(payload);

  if (timestamp) {
    const _format = timestamp === true ? 'short' : timestamp;
    payload = timestampTransform(payload, { format: _format });
    addPropsIf('timestamp');
  }

  addPropsIf('level');

  if (label) {
    payload.label = payload[CONFIG].label;
    addPropsIf('label');
  }

  addPropsIf('message', '...');

  if (_meta) {
    payload = metaTransform(payload, { prop: _meta });
    addPropsIf(_meta);
  }

  if (errorify)
    payload = errorifyTransform(payload, { format: errorify });

  if (trace) {
    // All or accept trace defaults which are
    // triggered on rejections or exceptions.
    payload = traceTransform(payload, {
      all: trace === 'all'
    });
  }

  if (proc)
    payload = processTransform(payload, { process: proc, system: proc });

  if (options.format === 'json')
    return jsonFormat(payload, { props, exclude });

  const char = options.format === 'csv' ? ',' : '\t';

  return delimitedFormat(payload, {
    props: _props,
    exclude,
    char
  });

}
