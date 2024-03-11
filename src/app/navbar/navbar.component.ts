import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  mobileMenuVisible = false;

  toggleMobileMenu() {
    this.mobileMenuVisible = !this.mobileMenuVisible;
  }
}
