import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SheduleService {

  private baseURL = 'http://127.0.0.1:5000'


  constructor(public http: HttpClient) { }

  getData(sheetId : string,group : string, year : string) : Observable<any>{

    const url = `${this.baseURL}/schedule`;

    const params = {
      sheet_id : sheetId,
      group: group,
      year: year
    }
    

    return this.http.get<any>(url,{params});
  }
}
