import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EuropeNumberPipe } from '../europe-number.pipe';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, EuropeNumberPipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isUser: any;

  constructor(private authService:AuthService){}
  
  ngOnInit(): void {

    //Add 'implements OnInit' to the class.
    this.isUser = this.authService.isUser();
    
  }
}
