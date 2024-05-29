import { Component } from '@angular/core';
import { HttpService } from '../http.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  users: any = [];
  constructor(private http: HttpService) {}
  ngOnInit(): void {
    this.http.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        //console.log('Users en la DB', this.users);
      },
    });
  }

  eliminarUsuario(id: number): void {
    this.http.deleteUser(id).subscribe({
      next: () => {
        this.http.getAllUsers().subscribe({
          next: (data) => {
            this.users = data;
          },
          error: (error) => {
            console.error(error);
          },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
