import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import { NgxStripeModule } from 'ngx-stripe';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http,'./assets/i18n/','.json');
}
//03/04/2024 Tuve un error al crear el signup y el authService y esque tenía que incluir el provideHttpClient aqui
//https://stackoverflow.com/questions/77482678/no-provider-for-httpclient
export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    })
    ),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),CookieService,
    // Configuración para la autenticación social con Google
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false, // True si quieres iniciar sesión automáticamente al cargar la app
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('603153535129-plb0i5pqros03qgdcqbbvm799qf8gsl6.apps.googleusercontent.com')
          }
        ]
      } as SocialAuthServiceConfig,
    },
  ]
};