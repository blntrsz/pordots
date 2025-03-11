import type { Transaction } from "../ports/transaction";

export class ConsoleTransaction implements Transaction {
  execute<T>(callback: () => Promise<T>): Promise<T> {
    return callback();
  }
}
