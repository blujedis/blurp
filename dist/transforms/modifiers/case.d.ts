/// <reference types="lodash" />
import camelcase from 'camelcase';
import { IPayload } from '../../types';
declare const caseMap: {
    cap: (v: string) => string;
    capitalize: (v: string) => string;
    lower: (v: string) => string;
    lowercase: (v: string) => string;
    upper: (v: string) => string;
    uppercase: (v: string) => string;
    camel: (v: string) => string;
    camelcase: {
        (input: import("lodash").Many<string>, options?: camelcase.Options): string;
        default: any;
    };
    pascal: (v: string) => any;
    pascalcase: any;
};
export declare type Case = keyof typeof caseMap;
export interface ICaseTransformOptions {
    [prop: string]: Case;
}
/**
 * Changes case to property.
 *
 * @example
 * log.transforms.case();
 *
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
export default function caseTransform<L extends string>(payload: IPayload<L>, options?: ICaseTransformOptions): IPayload<L>;
export {};
