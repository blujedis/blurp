import { Transport } from '../transports';
import { Callback } from '../types';

type TransportExt<L extends string> = Transport<L, any>;

export class TransportStore<L extends string>  {

  private store = new Map<string, TransportExt<L>>();

  values() {
    return this.store.values();
  }

  has(key: string) {
    return this.store.has(key);
  }

  toArray(...keys: string[]): Array<Transport<L, any>>{
    if (!keys || !keys.length)
      return [...this.values()];
    return [...this.values()].filter(tport => keys.includes(tport.label));
  }

  normalize(transports: Array<string | Transport<L, any>>) {
    return (transports || []).reduce((result, transport) => {
      if (transport instanceof Transport)
        return [...result, transport];
      transport = this.get(transport);
      if (!transport)
        return result;
      return [...result, transport];
    }, [] as Array<Transport<L, any>>);
  }

  clear() {
    this.store.clear();
    return this;
  }

  get(key: string) {
    return this.store.get(key);
  }

  add(key: string, transport: Transport<L, any>) {
    if (!transport.stream)
      throw new Error(`Attempted to add Transport "${key}" but required stream is missing`);
    const isObjectMode = transport.stream._readableState && transport.stream._readableState.objectMode;
    if (isObjectMode)
      throw new Error(`Attempted to add Transport "${key}" with unsupported objectMode stream`);
    this.store.set(key, transport);
    return this;
  }

  remove(key: string, cb?: Callback) {
    const transport = this.get(key);
    transport.close();
    transport.stream.on('close', () => {
      this.store.delete(key);
    });
    return this;
  }

}
