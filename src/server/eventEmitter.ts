import EventEmitter from "events";
import { Character } from "graphql/server/types";

interface MyEvents {
  characters: (data: Character[]) => void;
  random: (data: number) => void;
}
declare interface MyEventEmitter {
  on<U extends keyof MyEvents>(event: U, listener: MyEvents[U]): this;
  once<U extends keyof MyEvents>(event: U, listener: MyEvents[U]): this;
  emit<U extends keyof MyEvents>(
    event: U,
    ...args: Parameters<MyEvents[U]>
  ): boolean;
}
class MyEventEmitter extends EventEmitter {}

declare global {
  var eventEmitter: MyEventEmitter | undefined;
}

export const eventEmitter = global.eventEmitter || new MyEventEmitter();

if (process.env.NODE_ENV !== "production") global.eventEmitter = eventEmitter;
