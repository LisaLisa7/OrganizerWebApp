import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase'
import { BoardColumn } from '../../interfaces/personal-interfaces/board-column';
import { BoardTask } from '../../interfaces/personal-interfaces/board-task';
import { TaskLabel } from '../../interfaces/personal-interfaces/task-label';

@Injectable({
  providedIn: 'root'
})
export class TasksService {


  pb = new PocketBase('http://127.0.0.1:8090');


  constructor() { }

  async getBoardId(boardName : string){

    let filterString = `Title = '${boardName}'`;
    //console.log(filterString);

    const records = await this.pb.collection("Boards").getFirstListItem(filterString)
    return records.id;

  }

  async getAllBoardsNames(){

    const records = await this.pb.collection("Boards").getFullList({fields:"Title"});
    //console.log(records);
    return records.map((record: { [key: string]: any }) => {

      return record['Title']
      
    });
  }


  async getAllColumns(boardName : string){
    const id = await this.getBoardId(boardName);
    let filterString = `Board_ID = '${id}'`;

    const records = await this.pb.collection("BoardColumns").getFullList({filter:filterString});

    const columns : BoardColumn[] = records.map((record: { [key: string]: any }) => {

      return {
      Id: record['id'],
      Board_Id: record['Board_ID'],
      Name: record['Name'],
      Position: record['Position'],
      }
    });

    //console.log(columns);
    return columns;
  }

  async getAllColumnsById(id : string){
    let filterString = `Board_ID = '${id}'`;

    const records = await this.pb.collection("BoardColumns").getFullList({filter:filterString});

    const columns : BoardColumn[] = records.map((record: { [key: string]: any }) => {

      return {
      Id: record['id'],
      Board_Id: record['Board_ID'],
      Name: record['Name'],
      Position: record['Position'],
      }
    });

    //console.log(columns);
    return columns;
  }

  async getLabelDetails(labelIds: string[]): Promise<TaskLabel[]> {
    const labels = await Promise.all(labelIds.map(async (id) => {
      const record = await this.pb.collection("TaskLabel").getOne(id);
      return {
        Id : record['id'],
        Name: record['Name'],
        Color: record['Color']
      };
    }));
    return labels;
  }

  async getAllLabels(){

    const records = await this.pb.collection("TaskLabel").getFullList();
    const labels : TaskLabel[] = records.map((record: { [key: string]: any }) => {

      return {
        Id : record['id'],
        Name: record['Name'],
        Color: record['Color']
      }
    });

    return labels;
  }


  async getTasks(columnId : string,boardId : string){

    let filterString = `Column_ID = '${columnId}' && Board_ID = '${boardId}'`;
    //console.log(filterString)
    const records = await this.pb.collection("BoardTask").getFullList({filter:filterString});

    console.log(records);
    //console.log(records);
    const tasks: BoardTask[] = await Promise.all(records.map(async (record: { [key: string]: any }) => {
      const labelIds = record['Labels'];
      const labels = await this.getLabelDetails(labelIds);
  
      return {
        Id: record['id'],
        Title: record['Title'],
        Board_Id: record['Board_ID'],
        Description: record['Description'],
        Column_Id: record['Column_ID'],
        Due: record['DueDate'],
        Created: record['created'],
        Updated: record['updated'],
        Done: record['Done'],
        Labels: labels 
      };
    }));
  
    return tasks;

  }

  async insertBoard(formData:any){

    const rec = await this.pb.collection("Boards").create(formData);
  }

  async insertBoardColumn(formData:any){

    const rec = await this.pb.collection("BoardColumns").create(formData);
  }

  async insertBoardColumnTask(formData:any)
  {
    const rec = await this.pb.collection("BoardTask").create(formData);

  }

  async updateTask(formData : any){
    const rec = await this.pb.collection("BoardTask").update(formData.Id,formData);
  }

  async deleteTask(id:string)
  {
    const rec = await this.pb.collection("BoardTask").delete(id);
  }

  async deleteBoard(id:string)
  {
    const rec = await this.pb.collection("Boards").delete(id);
    
  }

  async deleteColumn(id:string){
    const rec = await this.pb.collection("BoardColumns").delete(id);
  }

  async insertLabel(data:any){
    const rec = await this.pb.collection("TaskLabel").create(data);
  }

  async updateLabel(data:any){

    console.log(data);
    const rec = await this.pb.collection("TaskLabel").update(data.id,data);
  }


}
