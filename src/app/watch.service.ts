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

  getAllWatches():Observable<any[]>{
    return this.http.get<any>(`${this.baseUrl}/api/getWatches`)
  }

  getWatchById(id:number):Observable<any>{
    return this.http.get(`${this.baseUrl}/api/getWatchById/${id}`)
  }

  updateWatch(id:number,formData: FormData):Observable<any>{
    return this.http.patch(`${this.baseUrl}/api/editWatch/${id}`,formData)
  }
  
  deleteWatch(id:number):Observable<any>{
    return this.http.delete(`${this.baseUrl}/api/editWatch/${id}`)
  }
  getWatchesByBrandId(brandId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/brands/${brandId}/watches`);
  }
}
