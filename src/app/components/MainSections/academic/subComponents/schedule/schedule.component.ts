import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Class } from '../../../../../interfaces/academic-interfaces/class';
import { ClassesService } from '../../../../../services/academic-services/classes.service';
import { MatDialog } from '@angular/material/dialog';
import { NewClassDialogComponent } from '../dialogs/new-class-dialog/new-class-dialog.component';
import { UpdateClassDialogComponent } from '../dialogs/update-class-dialog/update-class-dialog.component';
import { ImportScheduleDialogComponent } from '../dialogs/import-schedule-dialog/import-schedule-dialog.component';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="contentContainer">

    <h1>Data curenta // punem si saptamana maybe?</h1>
      <div class="containerUp">
        
        <button (click)="openImportDialog()">Import Schedule</button>
        <button (click)="openNewClassDialog()">New Class</button>
      </div>

      <div class="scheduleContainer">

        <div class="schedule-grid">
          <div class="day-column" *ngFor="let day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']" [id]="day.toLowerCase()">
            <h3>{{ day }}</h3>
            <div class="class-item"  *ngFor="let cls of getClassesForDay(day)">
              
              <button (click)="openUpdateClassDialog(cls)" class="classButton"><span><img class="classImg" [src]="updateSVG"></span></button>
              <button (click)="deleteClass(cls.id)" class="classButton"><span><img class="classImg" [src]="deleteSVG"></span></button>

              <h4>{{ cls.ClassName }}</h4>
              <p>Time: {{ cls.TimeInterval }}</p>
              <p>Type: {{ cls.Type }}</p>
              <p>Location: {{ cls.Location }}</p>
              <p>Repeat: {{ cls.Repeat }}</p>
            </div>
          </div>
        </div>

      </div>



    </div>
  `,
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent {

  classes : Class[] = [];
  deleteSVG = "/assets/delete.svg";
  updateSVG = "/assets/settings.svg";

  constructor(private classesService:ClassesService,public dialog: MatDialog)
  {
    this.loadData();
  }


  async loadData(){
    this.classes = await this.classesService.getAllClasses();

  }
  getClassesForDay(day: string): Class[] {
    return this.classes
          .filter(cls => cls.Day.toLowerCase() === day.toLowerCase())
          .sort((a, b) => this.compareIntervals(a.TimeInterval, b.TimeInterval));
  }

  private compareIntervals(intervalA: string, intervalB: string): number {
    const [startA] = intervalA.split('-').map(Number);
    const [startB] = intervalB.split('-').map(Number);
    return startA - startB;
  }

  openUpdateClassDialog(cls:Class){
    console.log(cls);
    const dialogRef = this.dialog.open(UpdateClassDialogComponent, {
      width: '500px',
      data : cls
    });

  }

  openNewClassDialog(){

    const dialogRef = this.dialog.open(NewClassDialogComponent, {
      width: '500px'
    });

  }

  openImportDialog(){
    const dialogRef = this.dialog.open(ImportScheduleDialogComponent, {
      width: '500px'
    });
  }

  async deleteClass(id:string){

    await this.classesService.deleteClass(id);

  }


}
