import { TaskLabel } from "./task-label";

export interface BoardTask {
    Id : string,
    Title : string,
    Board_Id : string,
    Description : string,
    Column_Id : string,
    Due : Date,
    Created : Date,
    Updated : Date,
    Done : boolean,
    Labels : Array<TaskLabel>
}
