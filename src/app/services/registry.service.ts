import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase'
import { registryEntry } from '../interfaces/registryEntry';
import { BehaviorSubject, Observable } from 'rxjs';
import { Summary } from '../interfaces/summary';


@Injectable({
  providedIn: 'root'
})
export class RegistryService {

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
  getCurrentDate(){
    const currentDate = new Date();
    //console.log(currentDate)
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because getMonth() returns zero-based index
    const year = currentDate.getFullYear();
    const formattedDate = day + '-' + month + '-' + year;
    //console.log(formattedDate); // Output: day-month-year

    return formattedDate;
  }

  getYesterday(){
    const currentDate=new Date();
    const dayBefore = new Date(currentDate);
    dayBefore.setDate(currentDate.getDate() - 1);

    const day = dayBefore.getDate().toString().padStart(2, '0');
    const month = (dayBefore.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because getMonth() returns zero-based index
    const year = dayBefore.getFullYear();

    const formattedDate = day + '-' + month + '-' + year;
    //console.log(formattedDate); // Output: day-month-year

    return formattedDate;
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
    let balance = 0;
    for (const entry of entries){
      if (entry.Type == 'Expenses')
        totalSumExpenses+= entry.Sum;
      else if (entry.Type == 'Income')
        totalSumIncome += entry.Sum;
    }
    balance = totalSumIncome - totalSumExpenses;

    const summaries : Summary[] =[
      {month : month_current,
       sum : totalSumExpenses,
       type : "Expenses"
      },
      {month : month_current,
      sum : totalSumIncome,
      type : "Income"
      },
      {
      month : month_current,
      sum : balance,
      type : "Balance"
      }
    ]
    //console.log(summaries);
    

    return summaries;
  }

  formatData(date:any){
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  async getRecentEntriesToday(){
    let picUrl = ""
    const currentDate = new Date();
    const today = this.formatData(currentDate);

    const filterString = `Date >= "${today}" && Date <= "${today} 23:59:59 " && Type != "Savings-" && Type != "Savings+"`
    console.log(filterString)
    //console.log(filterString);

    const resultList = await this.pb.collection('Registry').getList(1, 4, {sort: '-Date',
      filter: filterString,requestKey: null 
  });
  console.log(resultList)
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

  async getRecentEntriesYesterday(){

    const currentDate = new Date();
    const yesterdayDate = new Date(currentDate);
    yesterdayDate.setDate(currentDate.getDate() - 1);
    const yesterday = this.formatData(yesterdayDate);
    let picUrl = "";

    
    const filterString = `Date >= "${yesterday} 00:00:00" && Date < "${yesterday} 23:59:59"`
    console.log(filterString);
    const resultList = await this.pb.collection('Registry').getList(1, 4, {
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

  async getPaginated(pageNumber:any,itemsPerPage:any,filter:any){
    
    let resultList
    let picUrl = "";
    if(filter == undefined)
    {
      resultList = await this.pb.collection('Registry').getList(pageNumber, itemsPerPage, {
        filter: '',sort: '-Date',requestKey: null});
    }
    else
    {
      resultList = await this.pb.collection('Registry').getList(pageNumber, itemsPerPage, {
        filter: filter,sort: '-Date',requestKey: null});
    }


    console.log(resultList)

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


    return {
      items : entries,
      currentPage : resultList.page,
      totalPages : resultList.totalPages
    };
    //return resultList
  }




  async getEntriesByMonth():Promise<registryEntry[]>{
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // January is 0, so we add 1
    
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0).getDate() +1;
    //console.log(lastDayOfMonth);


    const records = await this.pb.collection('Registry').getFullList({
      
      //fields: 'id,Description,Sum,Source,Date,Pictogram,Type',
      //filter: 'Date>= "2024-05-29 00:00:00"',
      filter: `Date >= "${currentYear}-${currentMonth.toString().padStart(2, '0')}-01" && Date <= "${currentYear}-${currentMonth.toString().padStart(2, '0')}-${lastDayOfMonth}"`,
      requestKey: null,
    });
    

    // Assuming records is an array of objects with the structure defined in registryEntry
    const entries: registryEntry[] = records.map((record: { [key: string]: any }) => ({
      Id: record['id'],
      Date: record['Date'],
      Description: record['Description'],
      Pictogram: record['Pictogram_Id'],
      Source: record['Source'],
      Sum: record['Sum'],
      Type: record['Type']
    }));

    //console.log(entries);
  return entries;
  }


  async getEntriesLastMonth():Promise<registryEntry[]>{
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; 

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1; 

    let lastMonthYear = currentYear;
    if (currentMonth === 0) {
      lastMonthYear = currentYear - 1; 
    }
    const lastDayOfPreviousMonth = new Date(lastMonthYear, lastMonth + 1, 0).getDate();
    //console.log(lastDayOfMonth);


    const records = await this.pb.collection('Registry').getFullList({
      
      //fields: 'id,Description,Sum,Source,Date,Pictogram,Type',
      //filter: 'Date>= "2024-05-29 00:00:00"',
      filter: `Date >= "${lastMonthYear}-${lastMonth.toString().padStart(2, '0')}-01" && Date <= "${lastMonthYear}-${lastMonth.toString().padStart(2, '0')}-${lastDayOfPreviousMonth}"`,
      requestKey: null,
    });
    

    // Assuming records is an array of objects with the structure defined in registryEntry
    const entries: registryEntry[] = records.map((record: { [key: string]: any }) => ({
      Id: record['id'],
      Date: record['Date'],
      Description: record['Description'],
      Pictogram: record['Pictogram_Id'],
      Source: record['Source'],
      Sum: record['Sum'],
      Type: record['Type']
    }));

    //console.log(entries);
  return entries;
  }


async createRecord(data:any){
  
  const record = await this.pb.collection('Registry').create(data);
  
}

async updateRecord(data:any){
  const record = await this.pb.collection('Registry').update(data.id, data);
}

async deleteRecord(id:string){
  const ok = await this.pb.collection('Registry').delete(id);
  //this.entryDeletedSubject.next(undefined);
  //console.log(ok)
}

async getAllSavings(){

  let picUrl = "";
  const records = await this.pb.collection('Registry').getFullList({
    sort: '-created',requestKey: null,filter : "Type = 'Savings+' || Type = 'Savings-'"
  });

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

async getSummarySavings(){
  
  const entries = await this.getAllSavings();


  let totalSumExpenses = 0;
  let totalSumIncome = 0;
  let balance = 0;

  for (const entry of entries){
    if (entry.Type == 'Savings-')
      totalSumExpenses+= entry.Sum;
    else if (entry.Type == 'Savings+')
      totalSumIncome += entry.Sum;
  }
  balance = totalSumIncome - totalSumExpenses;

  const summaries : Summary[] =[
    {month : "Total",
      sum : totalSumExpenses,
      type : "Expenses"
    },
    {month : "Total",
    sum : totalSumIncome,
    type : "Income"
    },
    {
    month : "Total",
    sum : balance,
    type : "Balance"
    }
    ]
    //console.log(summaries);
    
    return summaries;
}


  constructor() { }
}
