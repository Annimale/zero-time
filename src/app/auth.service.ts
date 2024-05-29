import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.tokenExists()
  );
  isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/sign-up`, userData);
  }

  login(userData: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, userData);
  }

  loginWithGoogle(googleToken: {
    token: string;
  }): Observable<{ credential: string }> {
    return this.http.post<{ credential: string }>(
      `${this.apiUrl}/login-with-google`,
      googleToken,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  tokenExists(): boolean {
    return this.cookieService.check('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.cookieService.delete('token');
    localStorage.removeItem('cartItems');
    window.location.href = 'http://localhost:3000/logout';
  }
  localTokenExists(): boolean {
    return !!localStorage.getItem('token');
  }
  updateAuthenticationStatus(status: boolean): void {
    this.isAuthenticatedSubject.next(status);
  }

  isAdmin(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token =
        this.cookieService.get('token') || localStorage.getItem('token');
      if (!token) {
        //console.log('No ha conseguido el token');
        return false;
      }
      try {
        const decoded: any = jwtDecode(token);
        //console.log('Token decoded', decoded);
        return decoded.role && decoded.role === 'admin'; // Verifica que el role exista y sea 'admin'.
      } catch (error) {
        console.error('Error decoding token', error);
        return false;
      }
    } else {
      // En el servidor, no podemos acceder a localStorage
      //console.log('LocalStorage no está disponible en el servidor');
      return false;
    }
  }

  isUser(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token =
        this.cookieService.get('token') || localStorage.getItem('token');
      if (!token) {
        //console.log('No hay token de user');
        return false;
      } else {
        //console.log('El user no es guest por lo que tiene token');
        return true;
      }
    } else {
      // En el servidor, no podemos acceder a localStorage
      //console.log('LocalStorage no está disponible en el servidor');
      return false;
    }
  }
}
