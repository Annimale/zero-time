import { Component,ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';
import { SaleService } from '../sale.service';
import { url } from 'inspector';

interface CustomJwtPayload {
  id: number;
  iat: number;
  exp: number;
}

interface Sale {
  id: number;
  status: string;
  userID: number;
  ref: string;
  brandID: number;
  model: string;
  caseSize: number;
  condition: string;
  box: boolean;
  papers: boolean;
  images: string;
  notes: string;
  yearOfPurchase: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
  };
  brand: {
    id: number;
    name: string;
  };
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  editForm!: FormGroup;
  cookie!: string;
  userInfo: any;
  sales: any = [];
  isAuthenticated: boolean = false;
  localToken: any;
  userLocalInfo: any = {};
  disabledFields: boolean = false;
  userGoogle: any = {};
  submitButton: boolean = true;
  baseUrl: string = 'http://localhost:3000/';
  showModal: boolean = false;
  selectedImage: string = '';
  @ViewChild('zoomImage') zoomImage!: ElementRef<HTMLImageElement>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpService,
    private http2: HttpClient,
    private saleService: SaleService
  ) {}

  //Inicializamos el form
  ngOnInit(): void {
    this.editForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      email: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.email,
      ]),
      oldPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
    this.isAuthenticated = this.authService.tokenExists();
    if (this.isAuthenticated) {
      this.getPayload();
    }
    this.getLocalTokenInfo();
    this.checkCookieGoogle();
    this.saleService.getAllSales().subscribe({
      next: (data) => {
        console.log('Sales:', data);
        this.sales = data;
      },
    });
  }

  getLocalUserData(id: any) {
    this.http.getLocalUser(id).subscribe({
      next: (response) => {
        console.log('Datos del usuario:', response);
        this.userLocalInfo = response;
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

  checkCookieGoogle() {
    this.http.getPayload().subscribe(
      (res) => {
        // Aquí manejas la respuesta. Asumimos que si res existe, entonces hay una cookie.
        if (res) {
          console.log('Hay cookie de google');
          this.editForm.get('name')?.disable();
          this.editForm.get('lastName')?.disable();
          this.editForm.get('oldPassword')?.disable();
          this.editForm.get('newPassword')?.disable();
          this.submitButton = false; //Hiddeamos el boton
        } else {
          console.log('No hay cookie de google');
        }
      },
      (err) => {
        // Aquí manejas el caso de error, por ejemplo, si la solicitud falló
        console.log('No hay cookie de google', err);
      }
    );
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
              console.log(this.userGoogle.role);
            },
          });
      },
      error: (error) => {
        console.error('Error al obtener datos del usuario', error);
      },
    });
  }

  onSubmit() {
    console.log('Whtas poppin');
    const formData = this.editForm.value;
    // Verificar la contraseña actual
    this.http
      .verifyPassword(this.userLocalInfo.id, formData.oldPassword)
      .subscribe({
        next: (result) => {
          if (result.isValid) {
            const updateData = {
              name: formData.name,
              lastName: formData.lastName,

              newPassword: formData.newPassword, // Asegúrate de hashear esto en el servidor
            };
            this.http
              .updateUserProfile(this.userLocalInfo.id, updateData)
              .subscribe({
                next: (response) => {
                  console.log('Perfil actualizado con éxito', response);
                  Swal.fire(
                    'Éxito',
                    'Tu perfil ha sido actualizado correctamente.',
                    'success'
                  );
                },
                error: (error) => {
                  console.error('Error actualizando el perfil', error);
                  Swal.fire(
                    'Error',
                    'Hubo un problema actualizando tu perfil.',
                    'error'
                  );
                },
              });
          } else {
            Swal.fire('Error', 'La contraseña antigua es incorrecta.', 'error');
          }
        },
        error: (error) => {
          console.error('Error verificando la contraseña', error);
          Swal.fire(
            'Error',
            'Hubo un problema verificando tu contraseña.',
            'error'
          );
        },
      });
  }
  getImageUrl(sale: Sale): string[] {
    if (!sale.images) {
      return [];
    }
    return this.convertToImageArray(sale.images);
  }
  convertToImageArray(imagePaths: string): string[] {
    // Eliminar las comillas dobles al principio y al final de la cadena
    const trimmedPaths = imagePaths.slice(1, -1);

    // Reemplazar las barras dobles con una sola barra
    const normalizedPaths = trimmedPaths.replace(/\\\\/g, '/');

    // Eliminar las comillas dobles adicionales si quedan después de la normalización
    const finalPaths = normalizedPaths.replace(/"/g, '');

    // Dividir las rutas en una matriz usando comas como delimitador
    const pathsArray = finalPaths.split(',');

    // Mapear cada ruta para agregar el prefijo localhost:3000 y eliminar espacios en blanco
    const urls = pathsArray.map(
      (path) => `http://localhost:3000/${path.trim()}`
    );
    return urls;
  }
  openModal(image: string) {
    this.selectedImage = image;
    this.showModal = true;
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  adjustZoom(event: MouseEvent): void {
    const rect = this.zoomImage.nativeElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    this.zoomImage.nativeElement.style.transformOrigin = `${x}% ${y}%`;
    this.zoomImage.nativeElement.style.transform = 'scale(2)'; // Ajusta el nivel de zoom según sea necesario
  }

  resetZoom(): void {
    this.zoomImage.nativeElement.style.transform = 'scale(1)';
    this.zoomImage.nativeElement.style.transformOrigin = 'center center';
  }

  closeModal(event: MouseEvent): void {
    this.showModal = false;
  }
  approveSale(saleId: number): void {
    this.saleService.approveSale(saleId).subscribe({
      next: () => {
        // Actualizar la lista de ventas después de la aprobación
        this.updateSales();
        // Mostrar un mensaje de éxito
        Swal.fire('Venta aprobada', '', 'success');
      },
      error: (error) => {
        console.error('Error al aprobar la venta', error);
        Swal.fire('Error', 'Hubo un problema al aprobar la venta', 'error');
      },
    });
  }
  declineSale(saleId: number): void {
    this.saleService.declineSale(saleId).subscribe({
      next: () => {
        // Actualizar la lista de ventas después de la declinación
        this.updateSales();
        // Mostrar un mensaje de éxito
        Swal.fire('Venta declinada', '', 'success');
      },
      error: (error) => {
        console.error('Error al declinar la venta', error);
        Swal.fire('Error', 'Hubo un problema al declinar la venta', 'error');
      },
    });
  }

  // Método para actualizar la lista de ventas
  updateSales(): void {
    this.saleService.getAllSales().subscribe({
      next: (data) => {
        console.log('Sales:', data);
        this.sales = data;
      },
      error: (error) => {
        console.error('Error al obtener las ventas', error);
        // Manejar el error según sea necesario
      },
    });
  }
  deleteSale(saleId: number): void {
    this.saleService.deleteSale(saleId).subscribe({
      next: () => {
        // Actualizar la lista de ventas después de la declinación
        this.updateSales();
        // Mostrar un mensaje de éxito
        Swal.fire('Venta eliminada', '', 'success');
      },
      error: (error) => {
        console.error('Error al declinar la venta', error);
        Swal.fire('Error', 'Hubo un problema al borrar la venta', 'error');
      },
    });
  }
}
