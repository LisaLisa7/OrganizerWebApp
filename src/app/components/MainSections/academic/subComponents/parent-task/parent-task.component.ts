import { Component,Input } from '@angular/core';
import { ClassTask } from '../../../../../interfaces/academic-interfaces/class-task';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-parent-task',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-container">
      <div class="task-header" (click)="toggleCollapse()">
        <h3>{{ task.title }} - {{ task.completion }}%</h3>
        <p>{{ task.startDate | date:'dd/MM/yyyy' }} - {{ task.finishDate | date:'dd/MM/yyyy' }}</p>
      </div>
      <div class="task-body" *ngIf="!isCollapsed">
        <p>{{ task.description }}</p>
        <div *ngIf="getSubTasks(task.id).length > 0">
          <h4>Subtasks:</h4>
          <div *ngFor="let subTask of getSubTasks(task.id)">
            <app-parent-task [task]="subTask" [tasks]="tasks"></app-parent-task>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './parent-task.component.css'
})
export class ParentTaskComponent {

  @Input() task!:ClassTask;
  @Input() tasks!: ClassTask[]; //toate 
  isCollapsed : boolean = true;

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  getSubTasks(taskId: string): ClassTask[] {
    return this.tasks.filter(task => task.parentTask === taskId);
  }

}
