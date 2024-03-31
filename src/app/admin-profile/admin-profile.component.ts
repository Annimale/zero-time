import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent {
  constructor(public dialog: MatDialog) {}

  openModal(imageUrl: string): void {
    this.dialog.open(ModalComponent, {
      width: 'auto',
      height: 'auto',
      data: { imageUrl } // Pasamos la URL de la imagen como dato al modal
    });
  }
}
