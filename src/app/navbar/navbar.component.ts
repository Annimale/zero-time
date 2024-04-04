import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgClass, CommonModule,RouterOutlet,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isOpen: boolean = false;

  constructor (private authService:AuthService,private router:Router){}

  logout(){
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
