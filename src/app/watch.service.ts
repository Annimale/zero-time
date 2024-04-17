import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class WatchService {
  private baseUrl = 'http://localhost:3000/watches'; // Ajusta esto según sea necesario

  constructor(private http:HttpClient) { }

  addWatch(watchData:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/api/watches`,watchData,{
      reportProgress: true,
      observe: 'events'
    
    })
  }
}
