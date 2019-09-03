const bench = require('fastbench');
const bunyan = require('bunyan');
const winston = require('winston');
const blurp = require('./dist').default;
const { createWriteStream } = require('fs');

const max = 10
const dest1 = createWriteStream('/dev/null');
const dest2 = createWriteStream('/dev/null');
const dest3 = createWriteStream('/dev/null');

// require('bole').output({
//   level: 'info',
//   stream: dest
// }).setFastTime(true);

const bun = bunyan.createLogger({
  name: 'myapp',
  streams: [{
    level: 'trace',
    stream: dest1
  }]
});

const win = winston.createLogger({
  transports: [
    new winston.transports.Stream({
      stream: dest2
    })
  ]
});

const blu = blurp.createLogger({
  transports: [
    new blurp.ConsoleTransport({
      stream: dest3
    })
  ]
});

const run = bench([
  function benchBunyan(cb) {
    for (var i = 0; i < max; i++) {
      bun.info('hello world')
    }
    setImmediate(cb)
  },
  function benchWinston(cb) {
    for (var i = 0; i < max; i++) {
      win.log('info', 'hello world')
    }
    setImmediate(cb)
  },
  function benchBlurp(cb) {
    for (var i = 0; i < max; i++) {
      blu.log('info', 'hello world')
    }
    setImmediate(cb)
  },
  // function benchBole (cb) {
  //   for (var i = 0; i < max; i++) {
  //     bole.info('hello world')
  //   }
  //   setImmediate(cb)
  // }
], 10000)

run(run);
