import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EuropeNumberPipe } from '../europe-number.pipe';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,EuropeNumberPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
