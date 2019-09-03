import { IPayload, SOURCE, CONFIG, Styles } from '../../types';
import colorizeTransform, { IColorizeTransformOptions } from '../modifiers/colorize';
import padTransform from '../modifiers/pad';
import metaTransform from '../modifiers/meta';
import delimitedFormat from '../formats/delimited';
import errorifyTransform, { ErrorifyFormat } from '../modifiers/errorify';
import caseTransform, { Case } from '../modifiers/case';
import ziplit from 'ziplit';
import timestampTransform, { TimestampFormat } from '../modifiers/timestamp';
import { normalizeConf, getProps } from '../../utils';
import labelTransform from '../modifiers/label';
import splatTransform from '../modifiers/splat';
import privateTransform from '../modifiers/private';

export interface ITerminalFormatStyleOptions {
  level?: Styles;                   // (default: looks up styles from options.colors for level)
  message?: Styles;                 // (default: null)
  [key: string]: Styles;
}

export interface ITerminalFormatLevelOptions {
  pad?: boolean;                    // (default: false) pads levels.
  case?: Case;                      // (default: true) the level will be transformed to uppercase.
  template?: string;                // (default: '${level}:')              
}

export interface ITerminalFormatOptions {
  props?: string[];                 // (default: undefined) includes all when undefined.
  exclude?: string[];               // (default: undefined) excludes none when undefined.
  timestamp?: boolean | TimestampFormat;
  level?: boolean | ITerminalFormatLevelOptions;
  label?: boolean | '${label}:';                                  // (default: undefined) when true adds label.
  colorize?: boolean | ITerminalFormatStyleOptions; // (default: true) colorizes level.
  private?: boolean | string;      // (default: true) when key is in payload abort the log event.
  meta?: string | boolean;          // (default: undefined) merges non meta properties to this prop.
  metaKeys?: boolean;               // (default: true when meta is undefined)
  splat?: boolean;                // (default: true) applies util.format on message and splat args.
  errorify?: ErrorifyFormat;       // (default: 'stack') format type when error is present.
  extend?: {
    [key: string]: any;
  };
}

/**
 * Bundled stack for displaying logs in the terminal.
 * 
 * @example
 * log.transforms.terminal();
 * 
 * @param payload the current modified payload.
 * @param options the stack's options.
 */
export default function terminalFormat<L extends string>(payload: IPayload<L>,
  options?: ITerminalFormatOptions) {

  options = { errorify: 'stack', level: true, colorize: true, exclude: [], private: true, splat: true, ...options };

  const { props, colorize, meta, extend, errorify, timestamp, label, splat, private: priv } = options;
  const { level } = payload[SOURCE];
  const { colors, levels } = payload[CONFIG];

  let _props = props || [];
  let _exclude = options.exclude;
  const _meta = meta === true ? 'meta' : meta;
  const _metaKeys = _meta ? false : true;

  const hasProps = _props.length;
  const addPropsIf = (...p) => (!hasProps ? _props = [..._props, ...p] : _props);

  if (priv && !privateTransform(payload))
    return null;

  const levelConf = options.level === true ? {
    pad: false,
    case: 'upper',
    template: '${level}:'
  } : options.level;

  const colorConf = normalizeConf(colorize, {
    level: colors[level as L],
    message: null
  });

  if (extend)
    payload = { ...payload, ...extend };

  if (splat)
    payload = splatTransform(payload);

  if (timestamp) {
    const _format = timestamp === true ? 'short' : timestamp;
    payload = timestampTransform(payload, { format: _format });
    colorConf.timestamp = colorConf.timestamp || 'gray';
    addPropsIf('timestamp', 'level');
  }
  else {
    addPropsIf('level');
  }

  if (label) {
    const _template = label === true ? '${label}:' : label;
    payload = labelTransform(payload, { template: _template });
    colorConf.label = colorConf.label || 'white';
    addPropsIf('label');
  }

  addPropsIf('message', '...');

  if (levelConf) {

    if (levelConf.template)
      payload.level = ziplit.compile(levelConf.template).render(payload[SOURCE].level);

    if (levelConf.case)
      payload = caseTransform(payload, { level: levelConf.case as Case });

    if (levelConf.pad)
      payload = padTransform(payload);

  }

  if (_meta) {
    payload = metaTransform(payload, { prop: _meta });
    addPropsIf(_meta);
  }

  if (errorify)
    payload = errorifyTransform(payload, { format: errorify });

  if (colorize && colors) {

    const opts: IColorizeTransformOptions<L> = {};

    for (const k in colors) {

      if (!colors.hasOwnProperty(k)) continue;

      // Colorize the levels and optional matching message.

      if (levels.includes(k as L) || k === 'log') {

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

    payload = colorizeTransform(payload, opts);

  }

  // If message level === 'log' remove level
  if (level === 'log')
    _exclude = [..._exclude, 'level'];

  const withKeys = _metaKeys ? getProps(payload, _props).filter(v => !_props.includes(v) && !_exclude.includes(v)) : [];

  return delimitedFormat(payload, {
    props: _props,
    exclude: _exclude,
    char: ' ',
    withKeys
  });

}
