import { Command, CommandHandler } from "@pordots/mediator";
import { TaskModel } from "../../models/task";
import type { TaskRepository } from "../../ports/task.repository";
import type { EventEmitter } from "../../ports/event-emitter";
import type { Transaction } from "../../ports/transaction";

export class UpdateTaskCommand extends Command(
  TaskModel.schema.partial().required({ id: true }),
).output(TaskModel) {}

export const UpdateTaskCommandHandler = CommandHandler(UpdateTaskCommand)
  .dependencies<{
    taskRepository: TaskRepository;
    eventEmitter: EventEmitter;
    transaction: Transaction;
  }>()
  .handler(async (input, dependencies) => {
    const task = await dependencies.taskRepository.get(input.id);
    task.update(input);

    await dependencies.transaction.execute(async () => {
      await dependencies.taskRepository.update(task);
      await dependencies.eventEmitter.emit("taskUpdated");
    });

    return task;
  });
