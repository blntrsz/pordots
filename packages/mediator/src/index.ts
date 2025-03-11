import { StandardSchemaV1 } from "@standard-schema/spec";

interface ClassWithSchema {
  new (...args: any): any;
  schema: StandardSchemaV1;
}

type IO = StandardSchemaV1 | ClassWithSchema;
type ExtractIO<T extends IO> = T extends StandardSchemaV1
  ? StandardSchemaV1.InferOutput<T>
  : T extends ClassWithSchema
    ? StandardSchemaV1.InferOutput<T["schema"]>
    : never;

type ExtractIOForResponse<T extends IO> = T extends StandardSchemaV1
  ? StandardSchemaV1.InferOutput<T>
  : T extends ClassWithSchema
    ? InstanceType<T>
    : never;

export interface ICommand<TInput extends IO, TOutput extends IO> {
  inputSchema: TInput;
  outputSchema: TOutput;
  input: ExtractIO<TInput>;
}

export function Command<TInput extends IO>(inputSchema: TInput) {
  return {
    output<TOutput extends IO>(outputSchema: TOutput) {
      return class Command implements ICommand<TInput, TOutput> {
        inputSchema = inputSchema;
        outputSchema = outputSchema;
        input: ExtractIO<TInput>;

        constructor(input: ExtractIO<TInput>) {
          this.input = input;
        }
      };
    },
  };
}

export interface ICommandHandler<TInput extends IO, TOutput extends IO> {
  isCommandMatching(otherCommand: ICommand<any, any>): boolean;
  handle(
    command: ICommand<TInput, TOutput>,
  ): Promise<ExtractIOForResponse<TOutput>>;
}

export function CommandHandler<TInput extends IO, TOutput extends IO>(
  command: new (input: ExtractIO<TInput>) => ICommand<TInput, TOutput>,
) {
  return {
    dependencies<TDependencies extends Record<string, any>>() {
      return {
        handler(
          callback: (
            input: ExtractIO<TInput>,
            dependencies: TDependencies,
          ) => Promise<ExtractIOForResponse<TOutput>>,
        ) {
          return class implements ICommandHandler<TInput, TOutput> {
            callback = callback;
            dependencies: TDependencies;

            isCommandMatching(otherCommand: ICommand<TInput, TOutput>) {
              return otherCommand instanceof command;
            }

            async handle(command: ICommand<TInput, TOutput>) {
              const result = await this.callback(
                command.input,
                this.dependencies,
              );

              return result;
            }

            constructor(dependencies: TDependencies) {
              this.dependencies = dependencies;
            }
          };
        },
      };
    },
  };
}

export class Mediator {
  handlers: ICommandHandler<any, any>[];

  constructor(handlers: ICommandHandler<any, any>[] = []) {
    this.handlers = handlers;
  }

  add(handler: ICommandHandler<any, any>) {
    this.handlers.push(handler);
  }

  addMany(handlers: ICommandHandler<any, any>[]) {
    this.handlers.push(...handlers);
  }

  async send<TInput extends IO, TOutput extends IO>(
    command: ICommand<TInput, TOutput>,
  ): Promise<ExtractIOForResponse<TOutput>> {
    const handler = this.handlers.find((handler) =>
      handler.isCommandMatching(command),
    );

    if (!handler) {
      throw new Error(`No handler found for command`);
    }

    return handler.handle(command);
  }
}
