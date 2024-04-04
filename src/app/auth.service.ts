import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl='http://localhost:3000/api/auth'

  constructor(private http:HttpClient) { }

  register (userData:any){
    return this.http.post(`${this.apiUrl}/sign-up`,userData)
  }

  login(userData: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, userData);
  }

  loginWithGoogle(token: string) {
    return this.http.post<any>(`${this.apiUrl}/login-with-google`, { token });
  }

  logout(){
    localStorage.removeItem('token')
  }
}
