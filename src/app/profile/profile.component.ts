import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode'
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';

interface CustomJwtPayload {
  id: number,
  iat: number,
  exp: number,

}


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  editForm!: FormGroup;
  cookie!: string;
  userInfo: any;
  userName: string = '';
  isAuthenticated: boolean = false;
  localToken: any;
  userLocalInfo: any = {};

  constructor(private authService: AuthService, private router: Router, private http: HttpService, private http2: HttpClient) { }


  //Inicializamos el form
  ngOnInit(): void {
    this.editForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
      oldPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
    this.isAuthenticated = this.authService.tokenExists()
    if (this.isAuthenticated) {
      this.getPayload()
    }
    this.getLocalTokenInfo()

  }

  getLocalUserData(id: any) {
    this.http.getLocalUser(id).subscribe({
      next: (response) => {
        console.log('Datos del usuario:', response);
        this.userLocalInfo = response;
      },
      error: (error) => {
        console.log('Error en getLocalUserData:', error);
      }
    })
  }

  getLocalTokenInfo() {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {//Esto lo hacemos para comprobar que existe localStorage en el entorno
      this.isAuthenticated = true;
      this.localToken = localStorage.getItem('token');
      const localInfo = jwtDecode(this.localToken) as CustomJwtPayload
      console.log(localInfo.id);

      if (localInfo && localInfo.id) {
        this.getLocalUserData(localInfo.id)
      }


    } else {
      console.log('De momento no hay localToken');
    }
  }

  getPayload() {
    this.http.getPayload().subscribe({
      next: (res) => {
        console.log('Datos del usuario:', res.user);
        this.userInfo = jwtDecode(res.user)
        console.log(this.userInfo.id);
        this.isAuthenticated = true;

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

  onSubmit() {

    console.log('Whtas poppin');
    const formData = this.editForm.value;
    // Verificar la contraseña actual
    this.http.verifyPassword(this.userLocalInfo.id, formData.oldPassword).subscribe({
      next: (result) => {
        if (result.isValid) {
          const updateData = {
            name: formData.name,
            lastName: formData.lastName,

            newPassword: formData.newPassword // Asegúrate de hashear esto en el servidor
          };
          this.http.updateUserProfile(this.userLocalInfo.id, updateData).subscribe({
            next: (response) => {
              console.log('Perfil actualizado con éxito', response);
              Swal.fire('Éxito', 'Tu perfil ha sido actualizado correctamente.', 'success');
            },
            error: (error) => {
              console.error('Error actualizando el perfil', error);
              Swal.fire('Error', 'Hubo un problema actualizando tu perfil.', 'error');
            }
          });
        } else {
          Swal.fire('Error', 'La contraseña antigua es incorrecta.', 'error');
        }
      },
      error: (error) => {
        console.error('Error verificando la contraseña', error);
        Swal.fire('Error', 'Hubo un problema verificando tu contraseña.', 'error');
      }
    });
  }


}