import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../news.service';


@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.css'
})
export class NewsDetailComponent {
  currentDate = new Date();
  news: any = {};
  baseUrl: string = 'http://localhost:3000/';


  constructor(private route: ActivatedRoute, private newsService: NewsService) { }

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
      }
    })
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

 

}
