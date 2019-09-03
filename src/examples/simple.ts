import blurp from '../';

const { stack } = blurp.transforms;

const logger = blurp.createLogger('app', {
  transports: [
    new blurp.ConsoleTransport()
  ],
  transforms: [
    stack.terminal()
  ]
});
