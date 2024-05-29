import { Component } from '@angular/core';
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
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../http.service';
import { Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

type ErrorMessages = {
  [key: string]: string;
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, TranslateModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;
  errorMessage: string = '';
  userInfo!: any;

  errorMessages: ErrorMessages = {
    'Usuario no encontrado':
      'El correo electrónico proporcionado no está registrado',
    'Contraseña incorrecta': 'La contraseña ingresada es incorrecta',
    'Formulario incompleto': 'Debes rellenar el formulario',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private googleAuthService: SocialAuthService,
    private http: HttpService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = this.errorMessages['Formulario incompleto'];
      return;
    }
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        //console.log('Inicio de sesión exitoso', response);
        localStorage.setItem('token', response.token);
        this.router.navigateByUrl('/home').then(() => {
          window.location.reload();
        });
      },
      error: (error) => {
        console.error('Error de inicio de sesión', error);
        this.errorMessage =
          this.errorMessages[error.error.message] ||
          'Error al iniciar sesión, verifique su correo';
      },
    });
  }
}
