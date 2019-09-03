import { IPayload, Styles, SOURCE, CONFIG } from '../../types';
import { colorizer } from '../../utils';
import isEqual from 'lodash.isequal';

export interface IColorizeConfig<L extends string> {
  prop?: string;                        // (default: object key)
  matchProp?: string;                   // (default: prop) use when matching prop to style another prop.
  matchSource?: 'payload' | 'source';   // (default: source)
  condition?: string | number | object | RegExp | any[] |
  ((value: any, payload?: IPayload<L>) => any);
  style: Styles;
}

export interface IColorizeTransformOptions<L extends string> {
  [key: string]: IColorizeConfig<L> | Styles;
}

/**
 * Extends log payload with additional properties.
 * 
 * @example
 * log.transforms.colorize({ message: ['bgRed', 'white']});
 * log.transforms.colorize({ error: { prop: 'level', condition: 'error', style: 'red' }});
 * 
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
export default function colorizeTransform<L extends string>(payload: IPayload<L>,
  options: IColorizeTransformOptions<L> = {}): IPayload<L> {

  for (const k in options) {

    if (!options.hasOwnProperty(k)) continue;

    let conf = options[k];

    if (!Array.isArray(conf) && typeof conf === 'object') {

      conf = { matchSource: 'source', prop: k, matchProp: conf.prop || k, ...conf };

      const { prop, matchProp, matchSource, condition, style } = conf;

      const val = payload[prop];

      if (typeof condition !== 'undefined') {

        let shouldColorize = true;

        if (typeof condition === 'function') {
          shouldColorize = condition(val, payload);
        }

        else {

          const matchVal = matchSource === 'payload' ? payload[matchProp] : payload[SOURCE][matchProp];

          if (condition instanceof RegExp)
            shouldColorize = condition.test(matchVal);
          else
            shouldColorize = isEqual(condition, matchVal);

        }

        if (shouldColorize)
          payload[prop] = colorizer(val, style);

      }

    }

    else {
      payload[k] = colorizer(payload[k], conf);
    }

  }

  return payload;

}
