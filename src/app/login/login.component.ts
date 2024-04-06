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

  // signInWithGoogle(): void {
  //   this.googleAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((userData) => {
  //     // Aquí obtienes el token de Google
  //     const googleToken = userData.idToken; // Asegúrate de que este es el token correcto
  //     // Luego llamas a loginWithGoogle
  //     this.authService.loginWithGoogle({ token: googleToken }).subscribe({
  //       next: (response) => {
  //         // Manejo de la respuesta exitosa
  //       },
  //       error: (error) => {
  //         // Manejo del error
  //       }
  //     });
  //   });
  // }
  

  // signInWithGoogle(): void {
  //   console.log('Intentando iniciar sesión con Google'); // Añade esto para depurar

  //   this.googleAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((userData: SocialUser) => {
  //     console.log(userData);
      
  //     // Verifica que realmente tienes un idToken en userData
  //     if (userData.idToken) {
  //       this.authService.loginWithGoogle({ token: userData.idToken }).subscribe({
  //         next: (response) => {
  //           console.log('Inicio de sesión con Google exitoso', response);
  //           localStorage.setItem('token', response.token);
  //           this.router.navigate(['/']);
  //         },
  //         error: (error) => {
  //           console.error('Error de inicio de sesión con Google', error);
  //           this.errorMessage = error.error.message;
  //         }
  //       });
  //     } else {
  //       console.error('No se pudo obtener el idToken de Google');
  //     }
  //   }).catch((error) => {
  //     console.error('Error al iniciar sesión con Google:', error);
  //   });
  // }

}


