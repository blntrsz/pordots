import type { TaskModel } from "../models/task";
import type { TaskRepository } from "../ports/task.repository";

export class InMemoryTaskRepository implements TaskRepository {
  tasks: TaskModel[] = [];

  async get(id: string): Promise<TaskModel> {
    const task = this.tasks.find((task) => task.props.id === id);

    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }

    return task;
  }

  async create(task: TaskModel): Promise<void> {
    this.tasks.push(task);
  }

  async update(task: TaskModel): Promise<void> {
    const index = this.tasks.findIndex((t) => t.props.id === task.props.id);

    if (index === -1) {
      throw new Error(`Task with id ${task.props.id} not found`);
    }

    this.tasks[index] = task;
  }
}
