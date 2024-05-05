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

  getAllNews():Observable<any[]>{
    return this.http.get<any>(`${this.baseUrl}/api/getNews`)
  }

  getNewsById(id:number):Observable<any>{
    return this.http.get(`${this.baseUrl}/api/getNewsById/${id}`)
  }

  updateNews(id:number,formData: FormData):Observable<any>{
    return this.http.patch(`${this.baseUrl}/api/editNews/${id}`,formData)
  }
  
  deleteNews(id:number):Observable<any>{
    return this.http.delete(`${this.baseUrl}/api/editNews/${id}`)
  }

}
