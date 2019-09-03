import { IPayload, SOURCE, CONFIG } from '../../types';

export interface IMetaTransformOptions {
  prop?: string;            // (default: meta)
  exclude?: string[];       // (default: ['level', 'message'])
}

/**
 * Moves all metadata into specified property on payload.
 * 
 * @example
 * log.transforms.meta();
 * 
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
export default function metaTransform<L extends string>(payload: IPayload<L>,
  options?: IMetaTransformOptions): IPayload<L> {

  options = { prop: 'meta', exclude: ['level', 'message'], ...options };
  const { prop, exclude } = options;

  if (!prop) return payload;

  return Object.keys(payload).reduce((result, key) => {
    if (!payload.hasOwnProperty(key))
      return result;
    if (exclude.includes(key))
      result[key] = payload[key];
    else
      result[prop][key] = payload[key];
    return result;
  }, { [prop]: {}, [CONFIG]: payload[CONFIG], [SOURCE]: payload[SOURCE] } as IPayload<L>);

}
