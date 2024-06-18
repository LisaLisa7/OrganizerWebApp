import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase'
import { ClassTask } from '../../interfaces/academic-interfaces/class-task';

@Injectable({
  providedIn: 'root'
})
export class ClassTasksService {

  pb = new PocketBase('http://127.0.0.1:8090');

  constructor() { }


  async getAllTasks(){
    const records = await this.pb.collection("Tasks").getFullList();

    console.log(records);
    //console.log(records);
    const classes: ClassTask[] = await Promise.all(records.map(async (record: { [key: string]: any }) => {
  
      return {
        id : record['id'],
        project_id : record['Project_Id'],
        title : record['Title'],
        description : record['Description'],
        startDate : record['StartDate'],
        finishDate : record['FinishDate'],
        completion : record['Completion_Percentage'],
        parentTask : record['ParentTask']
      };
    }));
  
    console.log(classes)
    return classes;
  }

  async getAllTasksByProject(project_id : string){

    let filterString = `Project_Id = '${project_id}'`;


    const records = await this.pb.collection("Tasks").getFullList({filter:filterString});

    console.log(records);
    //console.log(records);
    const classes: ClassTask[] = await Promise.all(records.map(async (record: { [key: string]: any }) => {
  
      return {
        id : record['id'],
        project_id : record['Project_Id'],
        title : record['Title'],
        description : record['Description'],
        startDate : record['StartDate'],
        finishDate : record['FinishDate'],
        completion : record['Completion_Percentage'],
        parentTask : record['ParentTask']
      };
    }));
  
    console.log(classes)
    return classes;
  }

  async getAllParentTasksByProject(project_id : string){

    let filterString = `Project_Id = '${project_id}' && ParentTask= ''`;


    const records = await this.pb.collection("Tasks").getFullList({filter:filterString});

    console.log(records);
    //console.log(records);
    const classes: ClassTask[] = await Promise.all(records.map(async (record: { [key: string]: any }) => {
  
      return {
        id : record['id'],
        project_id : record['Project_Id'],
        title : record['Title'],
        description : record['Description'],
        startDate : record['StartDate'],
        finishDate : record['FinishDate'],
        completion : record['Completion_Percentage'],
        parentTask : record['ParentTask']
      };
    }));
  
    console.log(classes)
    return classes;
  }




  

}
