import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase'
import { Project } from '../../interfaces/academic-interfaces/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  pb = new PocketBase('http://127.0.0.1:8090');

  constructor() { }


  async getProjectId(projectName : string)
  {
    let filterString = `Title = '${projectName}'`;
    const record = await this.pb.collection("Projects").getFirstListItem(filterString)
    return record.id;

  }

  async getAllProjectsNames(){

    const records = await this.pb.collection("Projects").getFullList({fields:"Title"});
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

  async createProject(data:any){

    const rec = await this.pb.collection("Projects").create(data);
  }

  async updateProject(id:string, data:any){
    const rec = await this.pb.collection("Projects").update(id,data);
  }



}
