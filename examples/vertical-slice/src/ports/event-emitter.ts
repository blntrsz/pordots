export interface EventEmitter {
  emit(event: any): Promise<void>;
}
