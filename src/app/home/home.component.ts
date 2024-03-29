import { Component } from '@angular/core';
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

}
