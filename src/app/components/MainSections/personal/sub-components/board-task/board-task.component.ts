import { Component, Input, SimpleChanges } from '@angular/core';
import { BoardColumn } from '../../../../../interfaces/personal-interfaces/board-column';
import { TasksService } from '../../../../../services/personal-services/tasks.service';
import { RecordModel } from 'pocketbase';

@Component({
  selector: 'app-board-task',
  standalone: true,
  imports: [],
  template: `
    <p>
      kms
    </p>
  `,
  styleUrl: './board-task.component.css'
})
export class BoardTaskComponent {

  

}
