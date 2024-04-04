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

  constructor(private authService: AuthService, private router: Router, private googleAuthService: SocialAuthService) { }



  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })

    // gapi.load('auth2', () => {
    //   gapi.auth2.init({
    //     client_id: '603153535129-plb0i5pqros03qgdcqbbvm799qf8gsl6.apps.googleusercontent.com', // Reemplaza con tu Client ID
    //   });
    // });
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
    this.googleAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((userData: SocialUser) => {
      console.log(userData);
      // Aquí puedes enviar el token de Google a tu servidor para validar la sesión y crear una sesión de usuario en tu aplicación.
    });
    // signInWithGoogle() {
    //   const GoogleAuth = gapi.auth2.getAuthInstance();
    //   GoogleAuth.signIn().then((googleUser:any) => {
    //     const id_token = googleUser.getAuthResponse().id_token;
    //     // Envía este token a tu servidor para verificarlo y autenticar al usuario
    //     this.authService.loginWithGoogle(id_token).subscribe({
    //       next: (response) => {
    //         console.log('Inicio de sesión exitoso', response);
    //         localStorage.setItem('token', response.token);
    //         this.router.navigate(['/']);
    //       },
    //       error: (error) => {
    //         console.error('Error de inicio de sesión', error);
    //         this.errorMessage = error.error.message;
    //       }
    //     });
    //   });
    // }

  }
}
