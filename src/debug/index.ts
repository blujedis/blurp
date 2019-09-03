import blurp, { Transport } from '../';

const transport = blurp.transports.get('console');

// setTimeout(() => {
//   throw new Error('asdfasdfasdf');
// }, 100);

blurp.warn('My name is %s', 'John', { age: 33 });
