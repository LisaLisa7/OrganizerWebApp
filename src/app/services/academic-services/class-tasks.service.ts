import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase'
import { ClassTask } from '../../interfaces/academic-interfaces/class-task';
import { BehaviorSubject } from 'rxjs';
import { ProjectsService } from './projects.service';

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


  constructor(private projectService:ProjectsService) { }

  getCurrentDate(){
    const currentDate = new Date();
    //console.log(currentDate)
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); 
    const year = currentDate.getFullYear();
    const formattedDate = year +'-' + month + '-'+day;
    //console.log(formattedDate); 

    return formattedDate;
  }


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

  async getAllTasksToday(){


    const date = this.getCurrentDate()
    let filterString = `FinishDate >= '${date}' && FinishDate <= "${date} 23:59:59" && Done = False    `;
    console.log(filterString);


    const records = await this.pb.collection("Tasks").getFullList({filter:filterString,requestKey:null});

    console.log(records);
    //console.log(records);
    const classes: ClassTask[] = await Promise.all(records.map(async (record: { [key: string]: any }) => {
  
      let proj = await this.projectService.getProjectName(record['Project_Id'])

      return {
        id : record['id'],
        project_id : proj,
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

  isWithinCurrentWeek(dueDate:any,today:any,endOfWeek :any) {
    const taskDate = new Date(dueDate).getTime()
    console.log(new Date(dueDate)+ " >= " + today + " si " +new Date(dueDate)+ " <= " + endOfWeek)
    console.log(taskDate >= today.getTime() && taskDate <= endOfWeek.getTime())
    return taskDate >= today.getTime() && taskDate <= endOfWeek.getTime();
  }


  async getAllRemainingTasks(){


    const date = this.getCurrentDate()
    let filterString = `FinishDate > '${date}' && Done = False`;
    //console.log(filterString);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday','Sunday'];
    const currentDayIndex = new Date().getDay()-1;

    let endOfWeek = new Date();
    endOfWeek.setDate(new Date().getDate() + (6 - currentDayIndex));
    endOfWeek.setHours(23, 59, 59, 999); 

    const records = await this.pb.collection("Tasks").getFullList({filter:filterString,requestKey:null});

    console.log(records);
    //console.log(records);
    const tasks: ClassTask[] = await Promise.all(records.map(async (record: { [key: string]: any }) => {
      
      let proj = await this.projectService.getProjectName(record['Project_Id'])
      
      return {
        id : record['id'],
        project_id : proj,
        title : record['Title'],
        description : record['Description'],
        startDate : record['StartDate'],
        finishDate : record['FinishDate'],
        done : record['Done'],
        parentTask : record['ParentTask']
      };
    }));

    
    const filtered = tasks.filter(t => this.isWithinCurrentWeek(t.finishDate,new Date(),endOfWeek))
    //console.log("!!!!!!!!!")
    //console.log(filtered);


  
    //console.log(tasks)
    return filtered;
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
