import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink,Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

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
  errorMessage: any;

  constructor(private authService: AuthService,private router:Router) { }
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
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "info",
          title: "Usuario creado exitosamente",
          text:"Revisa el correo introducido para activar la cuenta."
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        if (error.status === 409) {
          this.errorMessage = error.error.message; //El email ya está en uso
        } else {
          // Mostrar  el mensaje de error
          console.error('REGISTRO FALLIDO', error);

        }
      }
    });
  }

}
