import { Mediator } from "@pordots/mediator";
import { CreateTaskCommandHandler } from "./Task/create";

const mediator = new Mediator();
mediator.add(new CreateTaskCommandHandler());
