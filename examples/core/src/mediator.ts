import { Mediator } from "@ports/mediator";
import { CreateTaskCommandHandler } from "./Task/create";

const mediator = new Mediator();
mediator.add(new CreateTaskCommandHandler());
