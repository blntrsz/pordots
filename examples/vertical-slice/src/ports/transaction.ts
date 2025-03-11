export interface Transaction {
  execute<T>(callback: () => Promise<T>): Promise<T>;
}
