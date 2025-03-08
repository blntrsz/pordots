import { CommandBuilder, CommandHandlerBuilder } from "@pordots/mediator";
import { TaskSchema } from "./task";

export class CreateTaskCommand extends CommandBuilder.input(
  TaskSchema.omit({ id: true }),
).output(TaskSchema) {}

export class CreateTaskCommandHandler extends CommandHandlerBuilder.command(
  CreateTaskCommand,
).handler(async (input) => {
  console.log(input);

  return {
    id: "123",
    ...input,
  };
}) {}
