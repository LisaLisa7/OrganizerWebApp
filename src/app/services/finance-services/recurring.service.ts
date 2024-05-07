import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase'
import { registryEntry } from '../../interfaces/finance-interfaces/registryEntry';
import { BehaviorSubject } from 'rxjs';
import { Summary } from '../../interfaces/finance-interfaces/summary';
import { recurringEntry } from '../../interfaces/finance-interfaces/recurringEntry';

@Injectable({
  providedIn: 'root'
})
export class RecurringService {

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

  
  async getEntriesByMonth():Promise<recurringEntry[]>{
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // January is 0, so we add 1
    const currentDay = currentDate.getDate() ;

    
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0).getDate();
    console.log(lastDayOfMonth);


    const filterString = `Date >= "${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')} 00:00:00" && Date <= "${currentYear}-${currentMonth.toString().padStart(2, '0')}-${lastDayOfMonth} 23:59:59"`
    //filter: `Date >= "${currentYear}-${currentDay.toString().padStart(2, '0')}-${currentMonth.toString().padStart(2, '0')} 00:00:00" && Date <= "${currentYear}-${lastDayOfMonth}-${currentMonth.toString().padStart(2, '0')} 23:59:59"`
    
    const records = await this.pb.collection('RecurringEntries').getFullList({
      //filter: 'Date>= "2024-05-29 00:00:00"',
      filter: filterString,
      //filter: `Date >= "${currentYear}-${currentDay.toString().padStart(2, '0')}-${currentMonth.toString().padStart(2, '0')} 00:00:00" && Date <= "${currentYear}-${lastDayOfMonth}-${currentMonth.toString().padStart(2, '0')} 23:59:59"`,
      //       filter: `Date >= "${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')} 00:00:00" && Date <= "${currentYear}-${currentMonth.toString().padStart(2, '0')}-${lastDayOfMonth} 23:59:59"`,

      requestKey: null,
    });
    
    
    
    console.log("aici ar trebui i guess");
    console.log('-------------------')
    console.log(currentDay)
    //console.log(`Date >= "${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}" && Date <= "${currentYear}-${currentMonth.toString().padStart(2, '0')}-${lastDayOfMonth}"`)
    //console.log(`Date >= "${currentYear}-${currentDay.toString().padStart(2, '0')}-${currentMonth.toString().padStart(2, '0')}" && Date <= "${currentYear}-${lastDayOfMonth}-${currentMonth.toString().padStart(2, '0')}"`)
    console.log(filterString)
    console.log(records)
    console.log('-------------------')

    // Assuming records is an array of objects with the structure defined in registryEntry
    const entries: recurringEntry[] = records.map((record: { [key: string]: any }) => ({
        Id: record['id'],
        Description: record['Description'],
        Date : record['Date'],
        Pictogram: record['Pictogram_Id'],
        Sum: record['Sum'],
        Type: record['Type'],
        Repeat: record['Repeat'],
        WeekDay: record['Day_Of_Week'],
        MonthDay: record['Day_Of_Month']

    }));

    console.log("AICIIIIIIIIIIIIIII")
    console.log(entries);
    console.log("AICIIIIIIIIIIIIIII")

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      
      switch(entry.Repeat){
        case "Weekly":
          console.log("am prins un weekly");
          break;
        case "Daily":
          console.log("Am prins un daily");
          break;

        case "Monthly":
          console.log("am prins cun monthly");
          break;
        default:
          console.log("default");
          break;
      }


      console.log(entry);
    }


  return entries;
  }

  getPlannedThisMonth(entries:recurringEntry){

    //const filteredEntries:recurringEntry[] = entries.map()

  }

  calculateRemainingDays(entryDate: Date): number {
    const currentDate = new Date();
    const diffTime = entryDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }



  async getAllEntries(): Promise<recurringEntry[]> {

    const records = await this.pb.collection('RecurringEntries').getFullList({
      sort: '-created',requestKey: null,
    });

    const entries: recurringEntry[] = await Promise.all(records.map(async (record: { [key: string]: any }) => {
      
      //console.log(this.pb.files.getUrl(record, firstFilename,{'thumb': '100x250'}));
      //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

      //const firstFilename = record['Pic']; // Assuming 'Pic' is an array of filenames
      //const url = this.pb.files.getUrl(record, firstFilename,{'thumb': '100x250'})
      const picUrl = await this.getPicById(record['Pictogram_Id']);

      return {
        Id: record['id'],
        Description: record['Description'],
        Pictogram: picUrl,
        Date : record['Date'],
        Sum: record['Sum'],
        Type: record['Type'],
        Repeat: record['Repeat'],
        WeekDay: record['Day_Of_Week'],
        MonthDay: record['Day_Of_Month']
        
      };
    }));
    //console.log(entries);
    return entries;
  }


  formatData(date:any){
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  


async createRecord(data:any){
  
  const record = await this.pb.collection('RecurringEntries').create(data);
  
}

async updateRecord(data:any){
  const record = await this.pb.collection('Registry').update(data.id, data);
}

async deleteRecord(id:string){
  const ok = await this.pb.collection('Registry').delete(id);
  //this.entryDeletedSubject.next(undefined);
  //console.log(ok)
}

  constructor() { }
}
