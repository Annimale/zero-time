import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BrandService {
  apiUrl:string='http://localhost:3000/brands'
  constructor(private http:HttpClient) { }

  getBrandByName(brandName: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/brands/${brandName}`);
  }
  getAllBrands():Observable<any[]>{
    return this.http.get<any>(`${this.apiUrl}/api/brands`)
  }
}
