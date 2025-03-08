import { z } from "zod";

export type TaskSchema = z.infer<typeof TaskSchema>;
export const TaskSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  done: z.boolean(),
});
