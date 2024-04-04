import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {
  registerForm!: FormGroup;
  passwordsMatch: boolean = true;

  constructor(private authService: AuthService) { }
  checkPasswords() {
    // Comprobar si las contraseñas coinciden y actualizar la propiedad passwordsMatch
    // Solo si ambos campos han sido tocados
    if (this.registerForm.get('password')?.touched && this.registerForm.get('confirmPassword')?.touched) {
      const password = this.registerForm.get('password')?.value;
      const confirmPassword = this.registerForm.get('confirmPassword')?.value;
      this.passwordsMatch = password === confirmPassword;
    }
  }



  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', Validators.required),
    })
    // Suscribirse a los cambios de los campos de contraseña
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.checkPasswords();
    });
    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.checkPasswords();
    });

  }
  onSubmit() {
    // Verificar si las contraseñas coinciden
    if (this.registerForm.invalid || !this.passwordsMatch) {
      return;
    }
    // Llamar al servicio de autenticación para registrar al usuario
    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('REGISTRO CON ÉXITO', response);
        // Redirigir al usuario o mostrar un mensaje de éxito
      },
      error: (error) => {
        console.error('REGISTRO FALLIDO', error);
        // Mostrar al usuario el mensaje de error
      }
    });
  }

}
