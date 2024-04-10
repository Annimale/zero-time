import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


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

}
