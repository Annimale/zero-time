import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', Validators.required),
    })

  }
  onSubmit() {
    // Verificar si las contraseñas coinciden
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      // Manejar el error de contraseña no coincidente
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
