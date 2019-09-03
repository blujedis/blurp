import { Transport } from '../transports';
import ExceptionStream from '../errors/stream';

export class ErrorStore<L extends string> {

  private store = new Map<Transport<L, any>, ExceptionStream<L>>();

  values() {
    return this.store.values();
  }

  has(transport: Transport<L, any>) {
    return this.store.has(transport);
  }

  clear() {
    this.store.clear();
    return this;
  }

  get(key: Transport<L, any>) {
    return this.store.get(key);
  }

  add(transport: Transport<L, any>, stream: ExceptionStream<L>) {
    this.store.set(transport, stream);
    return this;
  }

  remove(transport: Transport<L, any>) {
    this.store.delete(transport);
    return this;
  }

}
