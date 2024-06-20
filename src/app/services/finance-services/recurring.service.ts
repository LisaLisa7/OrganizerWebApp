import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase'
import { BehaviorSubject } from 'rxjs';
import { recurringEntry } from '../../interfaces/finance-interfaces/recurringEntry';
import { RegistryService } from './registry.service';

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
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); 
    const year = currentDate.getFullYear();
    const formattedDate = day + '-' + month + '-' + year;
    //console.log(formattedDate); 

    return formattedDate;
  }

  
  async getEntriesByMonth():Promise<recurringEntry[]>{
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; 
    const currentDay = currentDate.getDate() ;

    
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0).getDate();
    //console.log(lastDayOfMonth);


    const filterString = `StartDate >= "${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')} 00:00:00" && StartDate <= "${currentYear}-${currentMonth.toString().padStart(2, '0')}-${lastDayOfMonth} 23:59:59"`
    
    const records = await this.pb.collection('RecurringEntries').getFullList({
      filter: filterString,
     
      requestKey: null,
    });
    

    const entries: recurringEntry[] = records.map((record: { [key: string]: any }) => ({
        Id: record['id'],
        Description: record['Description'],
        LastExecuted : record['LastExecuted'],
        Pictogram: record['Pictogram_Id'],
        Sum: record['Sum'],
        Type: record['Type'],
        Repeat: record['Repeat'],
        MonthDay: record['MonthDay']

    }));

  return entries;
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
    
      const picUrl = await this.getPicById(record['Pictogram_Id']);

      return {
        Id: record['id'],
        Description: record['Description'],
        LastExecuted : record['LastExecuted'],
        Pictogram: record['Pictogram_Id'],
        Sum: record['Sum'],
        Type: record['Type'],
        Repeat: record['Repeat'],
        MonthDay: record['MonthDay']
        
      };
    }));
    
    return entries;
  }


  formatData(date:any){
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  async handleRecurringEvents(entries:recurringEntry[]){

    const currentDay = new Date();


    entries.forEach( (entry :any) => {

            let shouldTakePlace = false;

            if(entry.Repeat ===`Daily`)
            {
              console.log("Daily la handle")
              if(entry.LastExecuted){
                shouldTakePlace = !this.isSameDay(currentDay,entry.LastExecuted);
              }
              else
              {
                shouldTakePlace = true
              }
            }  
            else if(entry.Repeat ===`Monthly`){


              console.log("Monthly la handle")

              if(entry.LastExecuted){
                shouldTakePlace = this.isRightDay(currentDay,entry.LastExecuted,entry.MonthDay);
              }
              else{

                if(currentDay.getDate() === entry.MonthDay)
                  shouldTakePlace = true;

              }

            }
            if(shouldTakePlace)
            {
              this.executeRecurring(entry);
              this.updateLastExecuted(entry.Id,currentDay);
              
            }
            
          });
  }

  async executeRecurring(entry:any){

    //console.log(entry);
    //console.log("Trb adaugat source");
    let d = new Date(new Date().toLocaleString('en', {timeZone: 'Europe/Bucharest'}));
    console.log(d);
    let tr = {
      Date: d, 
      Description: entry.Description,
      Pictogram_Id: entry.Pictogram, 
      Source: "Card", 
      Sum: entry.Sum,
      Type: entry.Type
    }
    //console.log(tr);
    await this.registryService.createRecord(tr);
  }

  async updateLastExecuted(id:string,entry:any){

    console.log("recurring event done!");
    let formatedDate = this.formatData(new Date())

    let updateBody = {"LastExecuted" : formatedDate};
    console.log(updateBody);
    await this.pb.collection("RecurringEntries").update(id,updateBody);

  }

  isSameDay(currentDay:any,lastEx:any):boolean{
    let date = new Date(lastEx.toString());
    //console.log(lastEx)
    //console.log(currentDay.getFullYear() + "/" +currentDay.getMonth()+"/" +currentDay.getDate() );

    return date.getFullYear() === currentDay.getFullYear() &&
            date.getMonth() === currentDay.getMonth() &&
            date.getDate() === currentDay.getDate();

  }

  isRightDay(currentDay:Date,lastExecuted:any,monthDay:number):boolean{

    let duplicat = this.isSameDay(currentDay,lastExecuted);

    let lastE = new Date(lastExecuted.toString());
    
    //console.log(duplicat);
    //console.log(currentDay.getDate()+ " " +monthDay)
    return !duplicat && currentDay.getDate() === monthDay;

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

    constructor(private registryService:RegistryService) { }
}
