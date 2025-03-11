import { z } from "zod";
import { Model } from "@pordots/domain";
import { randomUUID } from "node:crypto";

export type UserSchema = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
  id: z.string(),
  updatedAt: z.date().optional(),
  createdAt: z.date().optional(),

  email: z.string().email(),
});

export class UserModel extends Model(UserSchema) {
  static create(props: Pick<UserSchema, "email">) {
    const now = new Date();

    return new UserModel({
      id: randomUUID(),
      email: props.email,
      createdAt: now,
      updatedAt: now,
    });
  }
}
