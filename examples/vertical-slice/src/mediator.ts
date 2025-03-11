import { Mediator } from "@pordots/mediator";
import { CreateTaskCommandHandler } from "./features/task/create-task";
import { GetTaskCommandHandler } from "./features/task/get-task";
import { InMemoryTaskRepository } from "./adapters/inmemory.task.repository";
import { ConsoleEventEmitter } from "./adapters/console.event-emitter";
import { ConsoleTransaction } from "./adapters/console.transaction";

const taskRepository = new InMemoryTaskRepository();
const eventEmitter = new ConsoleEventEmitter();
const transaction = new ConsoleTransaction();

export const mediator = new Mediator([
  new CreateTaskCommandHandler({ taskRepository, eventEmitter, transaction }),
  new GetTaskCommandHandler({ taskRepository }),
]);
