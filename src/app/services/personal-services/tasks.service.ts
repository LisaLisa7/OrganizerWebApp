import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase'
import { BoardColumn } from '../../interfaces/personal-interfaces/board-column';
import { BoardTask } from '../../interfaces/personal-interfaces/board-task';

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

  async getTasks(columnId : string,boardId : string){

    let filterString = `Column_ID = '${columnId}' && Board_ID = '${boardId}'`;
    //console.log(filterString)
    const records = await this.pb.collection("BoardTask").getFullList({filter:filterString});

    //console.log(records);
    const tasks : BoardTask[] = records.map((record: { [key: string]: any }) => {
      return {
        Id : record['id'],
        Title : record['Title'],
        Board_Id : record['Board_ID'],
        Description : record['Description'],
        Column_Id : record['Column_ID'],
        Due : record['DueDate'],
        Created :record['created'],
        Updated : record['updated']
      }
    });

    console.log(tasks);

    return tasks;

  }

}
