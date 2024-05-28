import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BrandService {
  apiUrl:string='http://localhost:3000/brands'
  // apiUrl:string='environment.apiUrl'
  constructor(private http:HttpClient) { }

  getBrandByName(brandName: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/brands/${brandName}`);
  }
  getAllBrands():Observable<any[]>{
    return this.http.get<any>(`${this.apiUrl}/api/brands`);
    catchError(this.handleError)

  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
