
interface Array<T> {
  $reduceBreak(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T, breakon?: any): T;
  $reduceBreak(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T, breakon?: any): T;
  $reduceBreak<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U, breakon?: any): U;
}

interface Console {
  _stdout?: NodeJS.WritableStream;
  _stderr?: NodeJS.WritableStream;
}