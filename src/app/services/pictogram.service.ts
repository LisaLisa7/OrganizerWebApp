import { Injectable } from '@angular/core';
import PocketBase, { RecordModel } from 'pocketbase'
import { registryEntry } from '../interfaces/registryEntry';
import { BehaviorSubject } from 'rxjs';
import { PictogramEntry } from '../interfaces/pictogram-entry';

@Injectable({
  providedIn: 'root'
})
export class PictogramService {

  pb = new PocketBase('http://127.0.0.1:8090');



  constructor() { 
    //this.getAllCategories();

    //this.getAllByCategory("Fun");
  }

  async getAllCategories():Promise<string[]>{

    let entries = await this.getAllPictograms();
    const categories = [...new Set(entries.map(obj => obj.Category))];

    //console.log(categories)
    return categories;
  }

  async getAllByCategory(category:string):Promise<any>{
    const filterString = `Category = "${category}"`;
    //console.log(filterString);

    let records = await this.pb.collection('Pictograms').getFullList({filter: filterString});
    let entries = await Promise.all(records.map(async (record: {[key: string]:any}) =>
    {

      const firstFilename = record['Pic']; // Assuming 'Pic' is an array of filenames
      const url = this.pb.files.getUrl(record, firstFilename,{'thumb': '100x250'})

      return {
        Id: record['id'],
        Pic: record['Pic'],
        Url: url,
        Category: record['Category'],
        Title: record['Title']
      }

    }));
    //console.log(entries)

    return entries;


  }

  async addPictogram(formData: any)
  {
    const createRec = await this.pb.collection('Pictograms').create(formData);
  }

  async deletePictogram(id:string)
  {
    const deleteRec = await this.pb.collection('Pictograms').delete(id);
  }




  async getAllPictograms() : Promise<PictogramEntry[]>{

    const records = await this.pb.collection('Pictograms').getFullList({
      sort: '-created',requestKey: null,
    });

    const entries: PictogramEntry[] = await Promise.all(records.map(async (record: {[key: string]:any}) =>
    {

      const firstFilename = record['Pic']; // Assuming 'Pic' is an array of filenames
      const url = this.pb.files.getUrl(record, firstFilename,{'thumb': '100x250'})

      return {
        Id: record['id'],
        Pic: record['Pic'],
        Url: url,
        Category: record['Category'],
        Title: record['Title']
      }

    }));

    //console.log(entries); 
    return entries;
  }
}
