import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private baseUrl = 'http://localhost:3000/news';
  constructor(private http: HttpClient) { }
  addNews(newsData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/news`, newsData);
  }
}
