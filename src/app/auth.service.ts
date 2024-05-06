import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.tokenExists());
  isAuthenticated = this.isAuthenticatedSubject.asObservable();

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
    return this.cookieService.check('token')
  }
  
  logout() {
    localStorage.removeItem('token')
    this.cookieService.delete('token');
    window.location.href = 'http://localhost:3000/logout'
  }
  localTokenExists(): boolean{
    return !!localStorage.getItem('token');

  }
  updateAuthenticationStatus(status: boolean): void {
    this.isAuthenticatedSubject.next(status);
  }

  isAdmin(): boolean {
    const token = this.cookieService.get('token') || localStorage.getItem('token');
    if (!token) {
      console.log('No ha conseguido el token');
      return false;
    }
    try {
      const decoded: any = jwtDecode(token);
      return decoded.role && decoded.role === 'admin'; // Verifica que el role exista y sea 'admin'.
    } catch (error) {
      console.error('Error decoding token', error);
      return false;
    }
  }


}
