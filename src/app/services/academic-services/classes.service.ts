import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase'
import { Class } from '../../interfaces/academic-interfaces/class';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {

  pb = new PocketBase('http://127.0.0.1:8090');
  constructor() { }

  async getClassId(className : string)
  {
    let filterString = `ClassName = '${className}'`;
    const record = await this.pb.collection("Classes").getFirstListItem(filterString)
    return record.id;

  }

  async getAllClassesNames(){

    const records = await this.pb.collection("Classes").getFullList({fields:"ClassName",filter:`Type != 'Course'`});
    //console.log(records);
    return records.map((record: { [key: string]: any }) => {

      return record['ClassName']
      
    });
  }


  async getAllClasses(){
    const records = await this.pb.collection("Classes").getFullList();

    console.log(records);
    //console.log(records);
    const classes: Class[] = await Promise.all(records.map(async (record: { [key: string]: any }) => {
  
      return {
        id : record['id'],
        ClassName : record['ClassName'],
        TimeInterval : record['TimeInterval'],
        Day : record['Day'],
        Type : record['Type'],
        Repeat : record['Repeat'],
        Location : record['Location']
      };
    }));
  
    console.log(classes)
    return classes;
  }

  async createClass(data:any){
    await this.pb.collection('Classes').create(data);
  }

  async updateClass(id:string,data:any){
    await this.pb.collection('Classes').update(id,data);
  }

  async deleteClass(id:string){
    await this.pb.collection('Classes').delete(id);
  }

  async deleteAll(classes : any){

    for(const c of classes)
    {
      await this.deleteClass(c.id);
    }
  }
  


}
