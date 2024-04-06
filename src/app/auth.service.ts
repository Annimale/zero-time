import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'

  constructor(private http: HttpClient) { }

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/sign-up`, userData)
  }

  login(userData: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, userData);
  }



  loginWithGoogle(googleToken: { token: string }) {
    console.log("Enviando token al servidor:", googleToken); // Añadir para depuración
    return this.http.post(`${this.apiUrl}/login-with-google`, googleToken, { headers: { 'Content-Type': 'application/json' } });


  }




  logout() {
    localStorage.removeItem('token')
  }
}
