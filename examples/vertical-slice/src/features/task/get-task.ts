import { Command, CommandHandler } from "@pordots/mediator";
import { TaskModel } from "../../models/task";
import type { TaskRepository } from "../../ports/task.repository";

export class GetTaskCommand extends Command(
  TaskModel.schema.pick({ id: true }),
).output(TaskModel) {}

export const GetTaskCommandHandler = CommandHandler(GetTaskCommand)
  .dependencies<{
    taskRepository: TaskRepository;
  }>()
  .handler(async (input, dependencies) => {
    const task = await dependencies.taskRepository.get(input.id);

    return task;
  });
