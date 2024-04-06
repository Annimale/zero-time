import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';





@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private googleAuthService: SocialAuthService) {
    console.log('HIIIIIIII');
    this.googleAuthService.authState.subscribe((user) => {
      console.log('Estamos dentro de googleAuth');
      if (user) {
      console.log('Estamos dentro de user');

        // Usuario autenticado con Google, envía el token a tu servidor
        this.authService.loginWithGoogle({ token: user.idToken }).subscribe({
          next: (response: any) => {
            // Asumiendo que la respuesta del servidor incluye un token JWT
            // Guarda el token de sesión
            localStorage.setItem('token', response.credential);
            // Redirige al usuario a la página de inicio
            this.router.navigate(['/home']);
          },
          error: (error) => {
            console.error('Error al iniciar sesión con Google', error);
          }
        });
      }
    });
  }



  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })


  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Inicio de sesión exitoso', response);
        // Aquí puedes guardar el token en el localStorage y redirigir al usuario
        localStorage.setItem('token', response.token);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error de inicio de sesión', error);
        this.errorMessage = error.error.message;

      }

    });
  }
  signInWithGoogle(): void {
    this.googleAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(userData => {
      if (userData.idToken) {
        this.authService.loginWithGoogle({ token: userData.idToken }).subscribe({
          next: (response) => {
            console.log('Inicio de sesión con Google exitoso', response);
            localStorage.setItem('token', response.credential); // Asegúrate de que estás accediendo a la propiedad correcta aquí
            this.router.navigate(['/home']); // Redirige al usuario a la ruta home
          },
          error: (error) => {
            console.error('Error de inicio de sesión con Google', error);
            this.errorMessage = error.error.message;
          }
        });
      } else {
        console.error('No se pudo obtener el idToken de Google');
      }
    }).catch(error => {
      console.error('Error al iniciar sesión con Google:', error);
    });
  }


}