import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';





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

  constructor(private authService: AuthService, private router: Router, private googleAuthService: SocialAuthService, private http: HttpClient) { }


  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }
  // onGoogleLogin() {
  //   // Realizar la solicitud al servidor para iniciar sesión con Google
  //   this.http.get<any>('/login-with-google')
  //     .subscribe(
  //       data => {
  //         const userToken = data.userToken;
  //         localStorage.setItem('userToken', userToken);
  //         // Redirigir al usuario a otra página si es necesario
  //         window.location.href = '/home';
  //       },
  //       error => {
  //         console.error('Error al obtener el token:', error);
  //       }
  //     );
  // }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Inicio de sesión exitoso', response);
        // Aquí puedes guardar el token en el localStorage y redirigir al usuario
        localStorage.setItem('token', response.token);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error de inicio de sesión', error);
        this.errorMessage = error.error.message;

      }

    });


  }
}
// }
// signInWithGoogle(): void {
//   this.googleAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(userData => {
//     if (userData.idToken) {
//       this.authService.loginWithGoogle({ token: userData.idToken }).subscribe({
//         next: (response) => {
//           console.log('Inicio de sesión con Google exitoso', response);
//           localStorage.setItem('token', response.credential); // Asegúrate de que estás accediendo a la propiedad correcta aquí
//           this.router.navigate(['/home']); // Redirige al usuario a la ruta home
//         },
//         error: (error) => {
//           console.error('Error de inicio de sesión con Google', error);
//           this.errorMessage = error.error.message;
//         }
//       });
//     } else {
//       console.error('No se pudo obtener el idToken de Google');
//     }
//   }).catch(error => {
//     console.error('Error al iniciar sesión con Google:', error);
//   });
// }