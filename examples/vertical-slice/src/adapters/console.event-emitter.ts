import type { EventEmitter } from "../ports/event-emitter";

export class ConsoleEventEmitter implements EventEmitter {
  async emit(event: any): Promise<void> {
    console.log(event);
  }
}
