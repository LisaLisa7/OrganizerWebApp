import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase'
import { registryEntry } from '../interfaces/registryEntry';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor() { }
  pb = new PocketBase('http://127.0.0.1:8090');


  
  async getEntriesByMonth():Promise<registryEntry[]>{
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // January is 0, so we add 1
    
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0).getDate() +1;
    //console.log(lastDayOfMonth);


    const records = await this.pb.collection('Registry').getFullList({
      
      fields: 'id,Description,Sum,Source,Date,Pictogram,Type',
      //filter: 'Date>= "2024-05-29 00:00:00"',
      filter: `Date >= "${currentYear}-${currentMonth.toString().padStart(2, '0')}-01" && Date <= "${currentYear}-${currentMonth.toString().padStart(2, '0')}-${lastDayOfMonth}"`,
      requestKey: null,
    });
    

    // Assuming records is an array of objects with the structure defined in registryEntry
    const entries: registryEntry[] = records.map((record: { [key: string]: any }) => ({
      Id: record['id'],
      Date: record['Date'],
      Description: record['Description'],
      Pictogram: record['Pictogram'],
      Source: record['Source'],
      Sum: record['Sum'],
      Type: record['Type']
    }));

    //console.log(entries);
  return entries;
  }

  calculateProportionsPieChart(currentMonthEntries:registryEntry[]) {
    const typeCounts: { [type: string]: number } = {};
    let pieChartData;

    // Count the number of entries for each type
    currentMonthEntries.forEach(entry => {
      if (typeCounts[entry.Type]) {
        typeCounts[entry.Type]++;
      } else {
        typeCounts[entry.Type] = 1;
      }
    });

    // Calculate proportions
    const totalEntries = currentMonthEntries.length;
    pieChartData = Object.keys(typeCounts).map(type => ({
      name: type,
      value: (typeCounts[type] / totalEntries) * 100 // Calculate percentage
    }));

    return pieChartData;
  }

  calculateDataBarChart(currentMonthEntries:registryEntry[])
  {

    const typeSum: { [type: string]: number } = {};
  let barChartData;

  // Count the sum of entries for each type
  currentMonthEntries.forEach(entry => {
    if (typeSum[entry.Type]) {
      typeSum[entry.Type] += entry.Sum;
    } else {
      typeSum[entry.Type] = entry.Sum;
    }
  });

  // Convert typeSum to barChartData
  barChartData = Object.keys(typeSum).map(type => ({
    name: type,
    value: typeSum[type]
  }));

  return barChartData;

  }
  
}
