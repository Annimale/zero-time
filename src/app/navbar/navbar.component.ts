import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgClass, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isOpen: boolean = false;

  toggleMenu() {
    console.log('Toggle menu clicked'); // Add this line

    this.isOpen = !this.isOpen;
  }
}
