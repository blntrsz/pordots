import { Command, CommandHandler } from "@pordots/mediator";
import { TaskModel } from "../../models/task";
import type { TaskRepository } from "../../ports/task.repository";
import type { EventEmitter } from "../../ports/event-emitter";
import type { Transaction } from "../../ports/transaction";

export class CreateTaskCommand extends Command(
  TaskModel.schema.pick({ title: true }),
).output(TaskModel) {}

export const CreateTaskCommandHandler = CommandHandler(CreateTaskCommand)
  .dependencies<{
    taskRepository: TaskRepository;
    eventEmitter: EventEmitter;
    transaction: Transaction;
  }>()
  .handler(async (input, dependencies) => {
    const task = TaskModel.create(input);

    await dependencies.transaction.execute(async () => {
      await dependencies.taskRepository.create(task);
      await dependencies.eventEmitter.emit("taskCreated");
    });

    return task;
  });
