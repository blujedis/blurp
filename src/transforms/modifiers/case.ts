import camelcase from 'camelcase';
import pascalcase from 'pascalcase';
import { IPayload } from '../../types';

const lower = (v: string) => v.toLowerCase();
const upper = (v: string) => v.toUpperCase();
const camel = (v: string) => camelcase(v);
const pascal = (v: string) => pascalcase(v);
const cap = (v: string) => v.charAt(0).toUpperCase() + v.slice(1);

const caseMap = {
  cap,
  capitalize: cap,
  lower,
  lowercase: lower,
  upper,
  uppercase: upper,
  camel,
  camelcase,
  pascal,
  pascalcase
};

export type Case = keyof typeof caseMap;

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
export default function caseTransform<L extends string>(payload: IPayload<L>,
  options: ICaseTransformOptions = {}): IPayload<L> {

  for (const k in options) {
    if (!payload.hasOwnProperty(k) || !caseMap[options[k]] || typeof payload[k] === 'object') continue;
    payload[k] = caseMap[options[k]](String(payload[k]));
  }

  return payload;

}
