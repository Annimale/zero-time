import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode'
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';







@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgClass, CommonModule, RouterOutlet, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isOpen: boolean = false;
  cookie!: string;
  userInfo: any;
  userName: string = '';
  isAuthenticated: boolean = false; 


  constructor(private authService: AuthService, private router: Router, private http: HttpService, private http2: HttpClient) { }
  ngOnInit(): void { this.getPayload() }


  getPayload() {
    this.http.getPayload().subscribe({
      next: (res) => {
        console.log('Datos del usuario:', res.user);
        this.userInfo = jwtDecode(res.user)
        console.log(this.userInfo.id);
        this.isAuthenticated=true;

        this.http2.get<any>(`http://localhost:3000/user/${this.userInfo.id}`).subscribe({
          next: (userRes) => {
            console.log(userRes);
            this.userName = userRes.name;
          }
        })
      },
      error: (error) => {
        console.error('Error al obtener datos del usuario', error)
      }
    })
  }

  logout() {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "info",
      title: "Sesión cerrada con éxito"
    });

    this.authService.logout();
    this.router.navigate(['/']);

  }

  toggleMenu() {
    console.log('Toggle menu clicked'); // Add this line

    this.isOpen = !this.isOpen;
  }

}
