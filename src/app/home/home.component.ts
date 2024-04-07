import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EuropeNumberPipe } from '../europe-number.pipe';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, EuropeNumberPipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(){}
  ngOnInit(): void {
    // Intenta obtener el token del localStorage
    const userToken = localStorage.getItem('userToken');

    // Verifica si el token existe
    if (userToken) {
      console.log('Token guardado en localStorage:', userToken);
      // Aquí puedes realizar cualquier acción adicional que necesites con el token
    } else {
      console.error('No se ha guardado ningún token en localStorage');
      // Aquí puedes manejar el caso en el que no se haya guardado el token
    }
  }
}
