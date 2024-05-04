import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase'
import { registryEntry } from '../interfaces/registryEntry';
import { BehaviorSubject } from 'rxjs';
import { Summary } from '../interfaces/summary';


@Injectable({
  providedIn: 'root'
})
export class SavingsService {

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



  formatData(date:any){
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  async getPicById(id:string):Promise<string>
  {
    const record = await this.pb.collection('Pictograms').getOne(id, {
      expand: 'relField1,relField2.subRelField',requestKey: null 
    });
    //console.log(record);
    const filename = record['Pic']; 
    const url = this.pb.files.getUrl(record, filename,{'thumb': '100x250'});
    //console.log(url);
    return url;

  }


  async getRecentEntriesToday(){
    const currentDate = new Date();
    const today = this.formatData(currentDate);
    let picUrl = "";

    const filterString = `Type != "Income" && Type != "Expenses"`
    console.log(filterString)
    //console.log(filterString);

    const resultList = await this.pb.collection('Registry').getList(1, 3, {sort: '-Date',
      filter: filterString,requestKey: null 
  });
  const entries: registryEntry[] = await Promise.all(resultList.items.map(async (record: { [key: string]: any }) => {
      
    //console.log(this.pb.files.getUrl(record, firstFilename,{'thumb': '100x250'}));
    //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

    //const firstFilename = record['Pic']; // Assuming 'Pic' is an array of filenames
    //const url = this.pb.files.getUrl(record, firstFilename,{'thumb': '100x250'})
    if(record['Pictogram_Id'] != "")
      { picUrl = await this.getPicById(record['Pictogram_Id']);
        console.log("BOMBAAAAAAAAAAAAAAA");
      }
    

    return {
      Id: record['id'],
      Date: record['Date'],
      Description: record['Description'],
      Pictogram: picUrl,
      Source: record['Source'],
      Sum: record['Sum'],
      Type: record['Type'],
      
    };
  }));

    console.log(entries)
    return entries;
    
  }

  
  async getAllEntries(): Promise<registryEntry[]> {

    const records = await this.pb.collection('Registry').getFullList({
      sort: '-created',requestKey: null,
    });

    let picUrl = "";

    const entries: registryEntry[] = await Promise.all(records.map(async (record: { [key: string]: any }) => {
      
      //console.log(this.pb.files.getUrl(record, firstFilename,{'thumb': '100x250'}));
      //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

      //const firstFilename = record['Pic']; // Assuming 'Pic' is an array of filenames
      //const url = this.pb.files.getUrl(record, firstFilename,{'thumb': '100x250'})

      if(record['Pictogram_Id'] != "")
        { picUrl = await this.getPicById(record['Pictogram_Id']);
          console.log("BOMBAAAAAAAAAAAAAAA");
        }

      return {
        Id: record['id'],
        Date: record['Date'],
        Description: record['Description'],
        Pictogram: picUrl,
        Source: record['Source'],
        Sum: record['Sum'],
        Type: record['Type'],
        
      };
    }));
    //console.log(entries);
    return entries;
  }

  async getTotalSumByMonth(entries: registryEntry[]):Promise<Summary[]>{

    const currentDate = new Date();
    const month_current = new Intl.DateTimeFormat('en', { month: 'long' }).format(currentDate);
    //console.log("?")
    
    //console.log("??")

    let totalSumExpenses = 0;
    let totalSumIncome = 0;
    for (const entry of entries){
      if (entry.Type == 'Expenses')
        totalSumExpenses+= entry.Sum;
      else if (entry.Type == 'Income')
        totalSumIncome += entry.Sum;
    }
    const summaries : Summary[] =[
      {month : month_current,
       sum : totalSumExpenses,
       type : "Expenses"
      },
      {month : month_current,
      sum : totalSumIncome,
      type : "Income"
      }
    ]
    //console.log(summaries);
    

    return summaries;
  }


  
  async getRecentEntriesYesterday(){

    const currentDate = new Date();
    const yesterdayDate = new Date(currentDate);
    yesterdayDate.setDate(currentDate.getDate() - 1);
    const yesterday = this.formatData(yesterdayDate);
    let picUrl = "";

    
    const filterString = `Date >= "${yesterday} 00:00:00" && Date < "${yesterday} 23:59:59"`
    console.log(filterString);
    const resultList = await this.pb.collection('Registry').getList(1, 3, {
      filter: filterString,requestKey: null 
  });
  const entries: registryEntry[] = await Promise.all(resultList.items.map(async (record: { [key: string]: any }) => {
      
    //console.log(this.pb.files.getUrl(record, firstFilename,{'thumb': '100x250'}));
    //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

    //const firstFilename = record['Pic']; // Assuming 'Pic' is an array of filenames
    //const url = this.pb.files.getUrl(record, firstFilename,{'thumb': '100x250'})
    if(record['Pictogram_Id'] != "")
      { picUrl = await this.getPicById(record['Pictogram_Id']);
        console.log("BOMBAAAAAAAAAAAAAAA");
      }
    

    return {
      Id: record['id'],
      Date: record['Date'],
      Description: record['Description'],
      Pictogram: picUrl,
      Source: record['Source'],
      Sum: record['Sum'],
      Type: record['Type'],
      
    };
  }));

    //console.log(entries)
    return entries;


  }

  
async createRecord(data:any){
  
  const record = await this.pb.collection('Savings').create(data);
  
}

async updateRecord(data:any){
  const record = await this.pb.collection('Savings').update(data.id, data);
}

async deleteRecord(id:string){
  const ok = await this.pb.collection('Registry').delete(id);
  //this.entryDeletedSubject.next(undefined);
  //console.log(ok)
}



  constructor() { }
}
