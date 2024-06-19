import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase'
import { ClassTask } from '../../interfaces/academic-interfaces/class-task';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassTasksService {

  pb = new PocketBase('http://127.0.0.1:8090');

  private entryAddedSubject = new BehaviorSubject<void>(undefined);
  entryAdded$ = this.entryAddedSubject.asObservable();
  private entryDeletedSubject = new BehaviorSubject<void>(undefined);
  entryDeleted$ = this.entryDeletedSubject.asObservable();
  private entryModifiedSubject = new BehaviorSubject<void>(undefined);
  entryModified$ = this.entryModifiedSubject.asObservable();

  updateEntries() : void{
    this.entryAddedSubject.next(undefined);
  }

  deleteEntry():void{
    this.entryDeletedSubject.next(undefined);
  }

  modifyEntry():void{
    this.entryModifiedSubject.next(undefined);
  }


  constructor() { }


  async getAllTasks(){
    const records = await this.pb.collection("Tasks").getFullList({requestKey:null});

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
        done : record['Done'],
        parentTask : record['ParentTask']
      };
    }));
  
    console.log(classes)
    return classes;
  }

  async getAllTasksByProject(project_id : string){

    let filterString = `Project_Id = '${project_id}'`;


    const records = await this.pb.collection("Tasks").getFullList({filter:filterString,requestKey:null});

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
        done : record['Done'],
        parentTask : record['ParentTask']
      };
    }));
  
    console.log(classes)
    return classes;
  }

  async getAllParentTasksByProject(project_id : string){

    let filterString = `Project_Id = '${project_id}' && ParentTask= ''`;


    const records = await this.pb.collection("Tasks").getFullList({filter:filterString,requestKey:null});

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
        done : record['Done'],
        parentTask : record['ParentTask']
      };
    }));
  
    console.log(classes)
    return classes;
  }

  async createTask(data:any){

    const rec = await this.pb.collection("Tasks").create(data);
  }

  async updateTask(id:string,data:any)
  {
    const rec = await this.pb.collection("Tasks").update(id,data);
  }

  async deleteTask(id:string)
  {
    const rec = await this.pb.collection("Tasks").delete(id);
  }




  

}
