import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private baseUrl = 'http://localhost:3000/sales';

  constructor(private http: HttpClient) { }

  createSale(saleData: FormData): Observable<any> {
    // Intenta obtener el token de localStorage
    const token = localStorage.getItem('token');

    // Configura las opciones de la solicitud basándote en si el token está disponible o no
    let options = {};

    if (token) {
      // Si el token está disponible en localStorage, usa HttpHeaders para enviarlo
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      options = { headers: headers };
    } else {
      // Si el token no está en localStorage, asume que se usa la cookie y asegúrate de enviar credenciales
      options = { withCredentials: true };
    }

    return this.http.post(`${this.baseUrl}/api/createSale`, saleData, options);
  }

}
