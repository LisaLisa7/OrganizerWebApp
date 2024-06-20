import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase'
import { Project } from '../../interfaces/academic-interfaces/project';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  pb = new PocketBase('http://127.0.0.1:8090');

  constructor() {

  }


  async getProjectId(projectName : string)
  {
    let filterString = `Title = '${projectName}'`;
    const record = await this.pb.collection("Projects").getFirstListItem(filterString,{requestKey:null})
    return record.id;

  }

  async getProjectName(id:string)
  {
    const rec = await this.pb.collection("Projects").getOne(id,{requestKey:null});
    //console.log("???")
    //console.log(rec['Title']);
    return rec['Title'];
  }

  async getAllProjectsNames(){

    const records = await this.pb.collection("Projects").getFullList({fields:"Title",requestKey:null});
    //console.log(records);
    return records.map((record: { [key: string]: any }) => {

      return record['Title']
      
    });
  }

  async getAllProjects(){
    const records = await this.pb.collection("Projects").getFullList();

    console.log(records);
    //console.log(records);
    const projects: Project[] = await Promise.all(records.map(async (record: { [key: string]: any }) => {
  
      return {
        id: record['id'],
        title: record['Title'],
        class_id: record['Class_I'],
        startDate: record['StartDate'],
        finishDate: record['FinishDate']
      };
    }));
  
    console.log(projects)
    return projects;
  }

  async getAllProjectsByClass(class_id : string){

    let filterString = `Class_Id = '${class_id}'`;

    const records = await this.pb.collection("Projects").getFullList({filter:filterString});

    console.log(records);
    //console.log(records);
    const projects: Project[] = await Promise.all(records.map(async (record: { [key: string]: any }) => {
  
      return {
        id: record['id'],
        title: record['Title'],
        class_id: record['Class_I'],
        startDate: record['StartDate'],
        finishDate: record['FinishDate']
      };
    }));
  
    console.log(projects)
    return projects;
  }

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


  async getDueProjects(){


    const date = this.getCurrentDate()
    let filterString = `FinishDate > '${date}' `;

    const records = await this.pb.collection("Projects").getList(1, 4,{filter:filterString,requestKey:null});

    console.log(records);
    //console.log(records);
    const projects: Project[] = await Promise.all(records.items.map(async (record: { [key: string]: any }) => {
  
      return {
        id: record['id'],
        title: record['Title'],
        class_id: record['Class_I'],
        startDate: record['StartDate'],
        finishDate: record['FinishDate']
      };
    }));


  
    console.log(projects)
    return projects;

  }

  async createProject(data:any){

    const rec = await this.pb.collection("Projects").create(data);
  }

  async updateProject(id:string, data:any){
    const rec = await this.pb.collection("Projects").update(id,data);
  }

  async deleteProject(id:string){
    const rec = await this.pb.collection("Projects").delete(id);
  }






}
