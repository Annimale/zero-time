import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,of } from 'rxjs';
import { catchError, tap,map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getPayload(): Observable<any> {
    return this.http.get('http://localhost:3000/user', { withCredentials: true })
  }

  getLocalUser(id:any): Observable<any>{
    return this.http.get(`http://localhost:3000/localUser/${id}`)
  }
  updateUserProfile(userId: number, updateData: any): Observable<any> {
    return this.http.put(`http://localhost:3000/updateUser/${userId}`, updateData);
  }
  verifyPassword(userId: number, password: string): Observable<any> {
    return this.http.post(`http://localhost:3000/verify-password`, { userId, password });
  }
  

}
