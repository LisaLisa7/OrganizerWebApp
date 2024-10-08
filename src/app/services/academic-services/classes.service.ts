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

    //console.log(records);
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
  
    //console.log(classes)
    return classes;
  }

  async getAllClassesToday(){

    const dayName = new Date().toLocaleDateString('en-US',{weekday:'long'});

    const filterString = `Day = '${dayName}'`
    console.log(filterString);

    const records = await this.pb.collection("Classes").getFullList({filter:filterString,requestKey:null});
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

  async getAllRemainingClasses(){

    const dayName = new Date().toLocaleDateString('en-US',{weekday:'long'});
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const currentDayIndex = new Date().getDay()-1;

    const filterString = `Day != '${dayName}'`
    console.log(filterString);

    const records = await this.pb.collection("Classes").getFullList({filter:filterString,requestKey:null});
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

    const filteredClasses = classes.filter(c => {
      const index = days.indexOf(c['Day'])
      console.log(index + " > " +currentDayIndex )
      return index>currentDayIndex;

    })
  
    console.log(filteredClasses)
    return filteredClasses;


  }

  async searchClass(data:any){

    let filterString = `ClassName = "${data.ClassName}" && Type = "${data.Type}"`;
    let rez;
    try{
      rez = await this.pb.collection('Classes').getFirstListItem(filterString);
    }catch(e)
    {
      return false;
    }
    return true;

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
