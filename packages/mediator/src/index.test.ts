import { z } from "zod";
import { Command, CommandHandler, Mediator } from "./index.js";
import { describe, expect, it } from "vitest";

class CreateTaskCommand extends Command(
  z.object({
    title: z.string(),
  }),
).output(
  z.object({
    id: z.string(),
    title: z.string(),
  }),
) {}

class CreateTaskCommandHandler extends CommandHandler(CreateTaskCommand)
  .dependencies()
  .handler(async (input) => {
    return {
      id: "1",
      title: input.title,
    };
  }) {}

const client = new Mediator();
client.add(new CreateTaskCommandHandler({}));

describe("mediator", () => {
  it("should throw an error if no handler is found for the command", async () => {
    const emptyClient = new Mediator();

    await expect(
      emptyClient.send(new CreateTaskCommand({ title: "test" })),
    ).rejects.toThrowError("No handler found for command");
  });

  it("should return the result of the command handler", async () => {
    const title = "test";
    const command = new CreateTaskCommand({ title });

    const result = await client.send(command);

    expect(result).toEqual({
      id: "1",
      title,
    });
  });

  it("should validate the input of the command", async () => {
    // @ts-expect-error -- we intentionally pass an invalid input
    const command = new CreateTaskCommand({});

    await expect(client.send(command)).rejects
      .toThrowErrorMatchingInlineSnapshot(`
      [ZodError: [
        {
          "code": "invalid_type",
          "expected": "string",
          "received": "undefined",
          "path": [
            "title"
          ],
          "message": "Required"
        }
      ]]
    `);
  });

  it("should validate the output of the command handler", async () => {
    class CreateTaskCommandHandler extends CommandHandler(CreateTaskCommand)
      .dependencies()
      // @ts-expect-error -- we intentionally pass an invalid input
      .handler(async (input) => {
        return {
          id: "1",
          label: input.title,
        };
      }) {}

    const client = new Mediator();
    client.add(new CreateTaskCommandHandler({}));

    const title = "test";
    const command = new CreateTaskCommand({ title });

    await expect(client.send(command)).rejects
      .toThrowErrorMatchingInlineSnapshot(`
      [ZodError: [
        {
          "code": "invalid_type",
          "expected": "string",
          "received": "undefined",
          "path": [
            "title"
          ],
          "message": "Required"
        }
      ]]
    `);
  });
});
