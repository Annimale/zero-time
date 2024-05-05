import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from '../news.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { HttpService } from '../http.service';
import { jwtDecode } from 'jwt-decode';

interface CustomJwtPayload {
  id: number;
  iat: number;
  exp: number;
}
@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.css',
})
export class NewsDetailComponent {
  currentDate = new Date();
  news: any = {};
  baseUrl: string = 'http://localhost:3000/';
  cookie!: string;
  userInfo: any={};
  isAuthenticated: boolean = false;
  localToken: any;
  userLocalInfo: any = {};
  userGoogle: any = {};

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private http: HttpService,
    private http2: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const newsId = this.route.snapshot.params['id'];
    console.log(newsId);
    this.newsService.getNewsById(newsId).subscribe({
      next: (data) => {
        console.log('Initial data loaded', data);
        this.news = data;
      },
      error: (error) => {
        console.error('Error al obtener los detalles del reloj:', error);
      },
    });

    this.isAuthenticated = this.authService.tokenExists();
    if (this.isAuthenticated) {
      this.getPayload();
    }
    this.getLocalTokenInfo();
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) {
      // Si no hay una ruta de imagen, devuelve una imagen por defecto
      return 'src/assets/images/default-image.webp';
    }
    // Reemplaza las barras invertidas con barras normales si es necesario
    const imageUrl = `${this.baseUrl}${imagePath.replace(/\\/g, '/')}`;
    return imageUrl;
  }

  //!Lógica para coger info users
  //Cogemos token local
  getLocalUserData(id: any) {
    this.http.getLocalUser(id).subscribe({
      next: (response) => {
        console.log('Datos del usuario:', response);
        this.userLocalInfo = response;
      },
      error: (error) => {
        console.log('Error en getLocalUserData:', error);
      },
    });
  }
  getLocalTokenInfo() {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      //Esto lo hacemos para comprobar que existe localStorage en el entorno
      this.isAuthenticated = true;
      this.localToken = localStorage.getItem('token');
      const localInfo = jwtDecode(this.localToken) as CustomJwtPayload;
      console.log(localInfo.id);

      if (localInfo && localInfo.id) {
        this.getLocalUserData(localInfo.id);
      }
    } else {
      console.log('De momento no hay localToken');
    }
  }

  getPayload() {
    this.http.getPayload().subscribe({
      next: (res) => {
        console.log('Datos del usuario:', res.user);
        this.userInfo = jwtDecode(res.user);
        console.log(this.userInfo.id);
        this.isAuthenticated = true;

        this.http2
          .get<any>(`http://localhost:3000/user/${this.userInfo.id}`)
          .subscribe({
            next: (userRes) => {
              console.log(userRes);
              this.userGoogle = userRes;
              console.log(this.userGoogle.role);
            },
          });
      },
      error: (error) => {
        console.error('Error al obtener datos del usuario', error);
      },
    });
  }

  navigateToEditNews(newsId: number) {
    this.router.navigate(['/edit-news', newsId]);
  }
}
