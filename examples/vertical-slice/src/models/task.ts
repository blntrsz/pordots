import { z } from "zod";
import { Model } from "@pordots/domain";
import { randomUUID } from "node:crypto";

export type TaskSchema = z.infer<typeof TaskSchema>;
export const TaskSchema = z.object({
  id: z.string(),
  updatedAt: z.date(),
  createdAt: z.date(),

  doneAt: z.date().optional(),
  title: z.string(),
});

export class TaskModel extends Model(TaskSchema) {
  static create(props: Pick<TaskSchema, "title">) {
    const now = new Date();

    return new TaskModel({
      id: randomUUID(),
      title: props.title,
      createdAt: now,
      updatedAt: now,
    });
  }
}
