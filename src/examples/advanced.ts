/**
 * When using Typescript with custom Levels
 * you need to tell it which Levels you wish to use.
 * You can also create the logger first then add Transports
 * to have your Level types inferred.
 */

import blurp from '../';
import { initTransforms } from '../transforms';

type Levels = 'error' | 'warn' | 'info' | 'debug';

const { stack } = initTransforms<Levels>();

const logger = blurp.createLogger<Levels>('app', {
  level: 'info',
  levels: ['error', 'warn', 'info', 'debug'],
  transports: [
    new blurp.ConsoleTransport<Levels>(),
    new blurp.FileTransport<Levels>({
      level: 'error',
      exceptions: true,     // have this transport handle exceptions.
      rejections: true,     // have this transport handle rejections.
      onRotate: ((oldFile, newFile) => {
        // do something like gzip/archive old file etc.
      })
    })
  ],
  transforms: [
    stack.terminal()
  ],
  errorExit: true,
});
