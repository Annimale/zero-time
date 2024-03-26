import { Component } from '@angular/core';
import { EuropeNumberPipe } from '../europe-number.pipe';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [EuropeNumberPipe],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css'
})
export class BrandsComponent {

}
