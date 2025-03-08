import { StandardSchemaV1 } from "@standard-schema/spec";

export interface ICommand<
  TInput extends StandardSchemaV1,
  TOutput extends StandardSchemaV1,
> {
  inputSchema: TInput;
  outputSchema: TOutput;
  input: StandardSchemaV1.InferOutput<TInput>;
}

export namespace CommandBuilder {
  export function input<TInput extends StandardSchemaV1>(inputSchema: TInput) {
    return {
      output<TOutput extends StandardSchemaV1>(outputSchema: TOutput) {
        return class Command implements ICommand<TInput, TOutput> {
          inputSchema = inputSchema;
          outputSchema = outputSchema;
          input: StandardSchemaV1.InferOutput<TInput>;

          constructor(input: StandardSchemaV1.InferOutput<TInput>) {
            this.input = input;
          }
        };
      },
    };
  }
}

export interface ICommandHandler<
  TInput extends StandardSchemaV1,
  TOutput extends StandardSchemaV1,
> {
  isCommandMatching(otherCommand: ICommand<any, any>): boolean;
  handle(
    command: ICommand<TInput, TOutput>,
  ): Promise<StandardSchemaV1.InferOutput<TOutput>>;
}

export namespace CommandHandlerBuilder {
  export function command<
    TInput extends StandardSchemaV1,
    TOutput extends StandardSchemaV1,
  >(
    command: new (
      input: StandardSchemaV1.InferOutput<TInput>,
    ) => ICommand<TInput, TOutput>,
  ) {
    return {
      handler(
        callback: (
          input: StandardSchemaV1.InferOutput<TInput>,
        ) => Promise<StandardSchemaV1.InferOutput<TOutput>>,
      ) {
        return class CommandHandler
          implements ICommandHandler<TInput, TOutput>
        {
          callback = callback;

          isCommandMatching(otherCommand: ICommand<TInput, TOutput>) {
            return otherCommand instanceof command;
          }

          async handle(command: ICommand<TInput, TOutput>) {
            const parsedInput = command.inputSchema["~standard"].validate(
              command.input,
            );
            const result = await this.callback(parsedInput);
            const parsedOutput =
              command.inputSchema["~standard"].validate(result);

            return parsedOutput;
          }
        };
      },
    };
  }
}

export class Mediator {
  handlers: ICommandHandler<any, any>[];

  constructor() {
    this.handlers = [];
  }

  add(handler: ICommandHandler<any, any>) {
    this.handlers.push(handler);
  }

  addMany(handlers: ICommandHandler<any, any>[]) {
    this.handlers.push(...handlers);
  }

  async send<TInput extends StandardSchemaV1, TOutput extends StandardSchemaV1>(
    command: ICommand<TInput, TOutput>,
  ): Promise<StandardSchemaV1.InferOutput<TOutput>> {
    const handler = this.handlers.find((handler) =>
      handler.isCommandMatching(command),
    );

    if (!handler) {
      throw new Error(`No handler found for command`);
    }

    return handler.handle(command);
  }
}
