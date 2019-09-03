import blurp from '../';

const { stack } = blurp.transforms;

const logger = blurp.createLogger('app', {
  level: 'info',
  levels: ['error', 'warn', 'info', 'debug'],
  transports: [
    new blurp.ConsoleTransport(),
    new blurp.FileTransport({
      level: 'error',
      exceptions: true,
      rejections: true,
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
