import { ResolveFn } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const isUserResolver: ResolveFn<boolean> = (route, state) => {
  const authService = inject(AuthService);

  return authService.isUser();
};
