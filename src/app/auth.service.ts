import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'

  constructor(private http: HttpClient, private cookieService: CookieService, ) { }

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/sign-up`, userData)
  }

  login(userData: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, userData);
  }

  loginWithGoogle(googleToken: { token: string }): Observable<{ credential: string }> {
    return this.http.post<{ credential: string }>(`${this.apiUrl}/login-with-google`, googleToken, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  tokenExists(): boolean {
    return this.cookieService.check('token'); // Reemplaza 'nombreDeTuCookie' con el nombre real de tu cookie
  }

  logout() {
    localStorage.removeItem('token')//
    window.location.href = 'http://localhost:3000/logout'
  }
}
