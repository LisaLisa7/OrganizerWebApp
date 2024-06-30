import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components/shared/confirm-dialog/confirm-dialog.component';
@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {

  constructor(private dialog: MatDialog) { }


  openConfirmDialog(message: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: { message }
    });
  }
}
