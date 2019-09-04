import blurp from '../';

const { stack } = blurp.transforms;

const logger = blurp.createLogger('app', {
  level: 'info',
  levels: ['error', 'warn', 'info', 'debug'],
  transports: [
    new blurp.ConsoleTransport(),
    new blurp.FileTransport({
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