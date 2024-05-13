import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';
import { BrandService } from '../brand.service';

interface CustomJwtPayload {
  id: number;
  iat: number;
  exp: number;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgClass, CommonModule, RouterOutlet, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isOpen: boolean = false;
  brands: any[] = [];
  cookie!: string;
  userInfo: any;
  userName: string = '';
  isAuthenticated: boolean = false;
  localToken: any;
  localName: string = '';
  userGoogle: any = {};
  isAdmin: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpService,
    private http2: HttpClient,
    private brandService: BrandService
  ) {}
  ngOnInit(): void {
    this.isAuthenticated = this.authService.tokenExists();
    if (this.isAuthenticated) {
      this.getPayload();
      this.isAdmin = this.authService.isAdmin();
      console.log('El user es:', this.isAdmin);
    }
    this.brandService.getAllBrands().subscribe({
      next: (data) => {
        this.brands = data;
      },
      error: (error) => {
        console.error('Failed to load brands. Response:', error);
      },
    });
    this.getLocalTokenInfo();
    this.isAdmin = this.authService.isAdmin();
    console.log('El localStorage token tiene de role admin:',this.isAdmin);
  }

  getLocalUserData(id: any) {
    this.http.getLocalUser(id).subscribe({
      next: (response) => {
        console.log('Datos del usuario:', response);
        this.localName = response.name;
      },
      error: (error) => {
        console.log('Error en getLocalUserData:', error);
      },
    });
  }

  getLocalTokenInfo() {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      //Esto lo hacemos para comprobar que existe localStorage en el entorno
      this.isAuthenticated = true;
      this.localToken = localStorage.getItem('token');
      const localInfo = jwtDecode(this.localToken) as CustomJwtPayload;
      console.log(localInfo.id);

      if (localInfo && localInfo.id) {
        this.getLocalUserData(localInfo.id);
      }
    } else {
      console.log('De momento no hay localToken');
    }
  }

  getPayload() {
    this.http.getPayload().subscribe({
      next: (res) => {
        console.log('Datos del usuario:', res.user);
        this.userInfo = jwtDecode(res.user);
        console.log(this.userInfo.id);
        this.isAuthenticated = true;

        this.http2
          .get<any>(`http://localhost:3000/user/${this.userInfo.id}`)
          .subscribe({
            next: (userRes) => {
              console.log(userRes);
              this.userGoogle = userRes;
            },
          });
      },
      error: (error) => {
        console.error('Error al obtener datos del usuario', error);
      },
    });
  }

  logout() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: 'info',
      title: 'Sesión cerrada con éxito',
    });

    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleMenu() {
    console.log('Toggle menu clicked'); // Add this line

    this.isOpen = !this.isOpen;
  }
}
