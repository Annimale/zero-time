import { Component, inject, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SocialLoginModule } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, NavbarComponent, FooterComponent, HttpClientModule, SocialLoginModule, TranslateModule]
})
export class AppComponent {
  title = 'zero-time';
  languages = ['en', 'es'];
  private translateService = inject(TranslateService);
  private isBrowser = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.isBrowser)) {
      const defaultLanguage = localStorage.getItem('language') || 'es';
      this.translateService.setDefaultLang(defaultLanguage);
      this.translateService.use(defaultLanguage);
    }
  }

  changeLanguage(lang: string): void {
    if (isPlatformBrowser(this.isBrowser)) {
      this.translateService.use(lang);
      localStorage.setItem('language', lang);
    }
  }
}
