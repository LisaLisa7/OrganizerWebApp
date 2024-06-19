import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Class } from '../../../../../interfaces/academic-interfaces/class';
import { ClassesService } from '../../../../../services/academic-services/classes.service';
import { MatDialog } from '@angular/material/dialog';
import { NewClassDialogComponent } from '../dialogs/new-class-dialog/new-class-dialog.component';
import { UpdateClassDialogComponent } from '../dialogs/update-class-dialog/update-class-dialog.component';
import { ImportScheduleDialogComponent } from '../dialogs/import-schedule-dialog/import-schedule-dialog.component';
import { ConfirmationDialogService } from '../../../../../services/confirmation-dialog.service';
@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="contentContainer">

    <h1 style="margin-top: 5px;">{{currentDay | date : "EEEE, MMMM d "}}</h1>
      <div class="containerUp">
        
        <button (click)="openImportDialog()"><img [src]="exportSVG" alt="newBoard"><span>Import Schedule</span></button>
        <button (click)="openNewClassDialog()"><img [src]="plusSVG" alt="newBoard"><span>New Class</span></button>
        <button (click)="clearSchedule()"><img [src]="deleteSVG" alt="newBoard"><span>Clear Schedule</span></button>

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
  plusSVG = "/assets/plus.svg"
  exportSVG = "/assets/export.svg";
  currentDay : Date;

  constructor(private classesService:ClassesService,private confirmService:ConfirmationDialogService,public dialog: MatDialog)
  {
    this.currentDay = new Date();
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
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadData();
    });

  }

  openNewClassDialog(){

    const dialogRef = this.dialog.open(NewClassDialogComponent, {
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadData();
    });

  }

  openImportDialog(){
    const dialogRef = this.dialog.open(ImportScheduleDialogComponent, {
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadData();
    });
  }

  async clearSchedule(){

    await this.classesService.deleteAll(this.classes);
    this.loadData();

  }

  async deleteClass(id:string){

    const dialogRef = this.confirmService.openConfirmDialog("Are you sure you want to delete this class?\nAll it's projects and tasks will also be deleted");

    const result = await dialogRef.afterClosed().toPromise();
    if(result){
    
      await this.classesService.deleteClass(id);
      await this.loadData();

    }
    

  }

  


}
