import type { TaskModel } from "../models/task";

export interface TaskRepository {
  get(id: string): Promise<TaskModel>;
  create(task: TaskModel): Promise<void>;
  update(task: TaskModel): Promise<void>;
}
