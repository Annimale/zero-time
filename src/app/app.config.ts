import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';


//03/04/2024 Tuve un error al crear el signup y el authService y esque tenía que incluir el provideHttpClient aqui
//https://stackoverflow.com/questions/77482678/no-provider-for-httpclient
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideAnimationsAsync(), provideHttpClient(withFetch())]
};
