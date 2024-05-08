import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';  // This service is used to access cookies

@Injectable({
  providedIn: 'root'
})
export class CommentService {
private baseUrl='http://localhost:3000/comments'
  constructor(private http:HttpClient,private cookieService: CookieService) { }

  postComment(commentData: { body: string, userID: number, articleID: string }): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.baseUrl}/api/createComment`, commentData,{headers});
  }

  getComments(articleId: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.baseUrl}/api/getComments/${articleId}`,{headers});
  }

  private getToken(): string | null {
    // First try to get the token from localStorage
    let token = localStorage.getItem('token')||this.cookieService.get('token');
    
    

    return token;
  }
}
