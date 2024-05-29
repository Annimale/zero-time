import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private baseUrl = 'http://localhost:3000/comments';
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  private getToken(): string | null {
    // First try to get the token from localStorage
    let token =
      localStorage.getItem('token') || this.cookieService.get('token');
    //console.log('GetToken:', token);

    return token;
  }

  postComment(commentData: {
    body: string;
    articleID: string;
  }): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(`${this.baseUrl}/api/createComment`, commentData, {
      headers,
    });
  }

  getComments(articleID: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/getComments/${articleID}`);
  }

  updateComment(
    commentId: number,
    commentData: { body: string }
  ): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put(
      `${this.baseUrl}/api/editComment/${commentId}`,
      commentData,
      { headers }
    );
  }

  deleteComment(commentId: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete(`${this.baseUrl}/api/deleteComment/${commentId}`, {
      headers,
    });
  }
}
