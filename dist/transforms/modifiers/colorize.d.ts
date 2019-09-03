import { IPayload, Styles } from '../../types';
export interface IColorizeConfig<L extends string> {
    prop?: string;
    matchProp?: string;
    matchSource?: 'payload' | 'source';
    condition?: string | number | object | RegExp | any[] | ((value: any, payload?: IPayload<L>) => any);
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
export default function colorizeTransform<L extends string>(payload: IPayload<L>, options?: IColorizeTransformOptions<L>): IPayload<L>;
