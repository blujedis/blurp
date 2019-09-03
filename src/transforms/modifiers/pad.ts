import { IPayload, SOURCE, CONFIG } from '../../types';

export interface IPadTransformOptions {
  char?: string;
  position?: 'left' | 'right'; // (default: right)
}

/**
 * Pads level property to left or right (Top Level Props ONLY)
 * 
 * @example
 * log.transforms.pad({ char: ' ', position: 'left'});
 * 
 * @param payload the current modified payload.
 * @param options the transform's options.
 */
export default function pad<L extends string>(payload: IPayload<L>,
  options?: IPadTransformOptions) {

  options = { position: 'left', char: ' ', ...options };

  const { char, position } = options;

  const { levels } = payload[CONFIG];
  const { level } = payload[SOURCE];

  // gets longest.
  const maxLen = Math.max(...levels.map(v => v.length));

  // get map of all paddings.
  const padMap =
    levels.reduce((a, c) => {
      const len = maxLen + 1 - c.length;
      const repeat = Math.floor(len / char.length);
      a[c as string] = `${char}${char.repeat(repeat)}`.slice(0, len);
      return a;
    }, {});

  if (position === 'right')
    payload.level = `${payload.level}${padMap[level as string]}`;
  else
    payload.level = `${padMap[level as string]}${payload.level}`;

  return payload;

}
