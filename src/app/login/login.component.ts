import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../http.service';
import { subscribe } from 'diagnostics_channel';





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
  userInfo!:any;

  constructor(private authService: AuthService, private router: Router, private googleAuthService: SocialAuthService, private http:HttpService) { }


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
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error de inicio de sesión', error);
        this.errorMessage = error.error.message;

      }

    });


  }
}