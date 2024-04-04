import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';


//03/04/2024 Tuve un error al crear el signup y el authService y esque tenía que incluir el provideHttpClient aqui
//https://stackoverflow.com/questions/77482678/no-provider-for-httpclient
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
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
    }
  ]
};