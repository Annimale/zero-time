import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";
import { HttpClientModule } from '@angular/common/http';
import { withFetch } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';




import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';

// or via CommonJS



@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, NavbarComponent, FooterComponent,HttpClientModule,SocialLoginModule]
})
export class AppComponent {
  title = 'zero-time';
}
