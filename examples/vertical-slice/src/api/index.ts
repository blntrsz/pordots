import { CreateTaskCommand } from "../features/task/create-task";
import { mediator } from "../mediator";

export async function createTaskHandler(request: Request) {
  const body = await request.json();

  const command = new CreateTaskCommand({
    title: body.title,
  });

  const task = await mediator.send(command);

  return new Response(JSON.stringify(task), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
