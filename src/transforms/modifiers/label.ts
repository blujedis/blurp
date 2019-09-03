import { IPayload, CONFIG } from '../../types';
import ziplit from 'ziplit';

export interface ILabelTransformOptions {
  template?: string;            // (default: '${label}:')  
}

/**
 * Transforms payloads contianing errors.
 * 
 * @see https://github.com/blujedis/ziplit
 * 
 * @example
 * log.transforms.label({ template: '${label}:'});
 * 
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
export default function labelTransform<L extends string>(payload: IPayload<L>,
  options?: ILabelTransformOptions): IPayload<L> {
    payload.label = ziplit.compile(options.template || '${label}:').render(payload[CONFIG].label);
    return payload;
}
