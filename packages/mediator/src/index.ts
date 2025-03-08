import { z } from "zod";

export interface ICommand<
  TInput extends z.ZodTypeAny,
  TOutput extends z.ZodTypeAny,
> {
  inputSchema: TInput;
  outputSchema: TOutput;
  input: z.infer<TInput>;
}

export namespace CommandBuilder {
  export function input<TInput extends z.ZodTypeAny>(inputSchema: TInput) {
    return {
      output<TOutput extends z.ZodTypeAny>(outputSchema: TOutput) {
        return class Command implements ICommand<TInput, TOutput> {
          inputSchema = inputSchema;
          outputSchema = outputSchema;
          input: z.infer<TInput>;

          constructor(input: z.infer<TInput>) {
            this.input = input;
          }
        };
      },
    };
  }
}

export interface ICommandHandler<
  TInput extends z.ZodTypeAny,
  TOutput extends z.ZodTypeAny,
> {
  isCommandMatching(otherCommand: ICommand<any, any>): boolean;
  handle(command: ICommand<TInput, TOutput>): Promise<z.infer<TOutput>>;
}

export namespace CommandHandlerBuilder {
  export function command<
    TInput extends z.ZodTypeAny,
    TOutput extends z.ZodTypeAny,
  >(command: new (input: z.infer<TInput>) => ICommand<TInput, TOutput>) {
    return {
      handler(callback: (input: z.infer<TInput>) => Promise<z.infer<TOutput>>) {
        return class CommandHandler
          implements ICommandHandler<TInput, TOutput>
        {
          callback = callback;

          isCommandMatching(otherCommand: ICommand<TInput, TOutput>) {
            return otherCommand instanceof command;
          }

          async handle(command: ICommand<TInput, TOutput>) {
            const parsedInput = command.inputSchema.parse(command.input);
            const result = await this.callback(parsedInput);
            const parsedOutput = command.outputSchema.parse(result);

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

  async send<TInput extends z.ZodTypeAny, TOutput extends z.ZodTypeAny>(
    command: ICommand<TInput, TOutput>,
  ): Promise<z.infer<TOutput>> {
    const handler = this.handlers.find((handler) =>
      handler.isCommandMatching(command),
    );

    if (!handler) {
      throw new Error(`No handler found for command`);
    }

    return handler.handle(command);
  }
}
