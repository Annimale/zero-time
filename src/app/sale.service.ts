import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private baseUrl = 'http://localhost:3000/sales';

  constructor(private http: HttpClient) { }

  createSale(saleData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/createSale`, saleData);
  }

}
