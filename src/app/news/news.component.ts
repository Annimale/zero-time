import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewsService } from '../news.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent {
  currentDate = new Date();
  news: any[] = [];
  baseUrl: string = 'http://localhost:3000/';

  constructor(
    private newsService: NewsService,
    private router:Router
  ) { }


  ngOnInit(): void {
    this.newsService.getAllNews().subscribe({
      next: (data) => {
        console.log('News loaded:', data);
        this.news = data;
      }, error: (error) => {
        console.error("Failed to load news. Response:", error);
        console.error("Error details:", error.error.text || error.error);  // Attempting to capture non-JSON error message
      }
    });

  }
  getCoverImageUrl(coverImagePath: string): string {
    if (!coverImagePath) {
      // Si no hay una ruta de imagen, devuelve una imagen por defecto
      return 'src/assets/images/default-image.webp';
    }
    // Reemplaza las barras invertidas con barras normales si es necesario
    const imageUrl = `${this.baseUrl}${coverImagePath.replace(/\\/g, '/')}`;
    return imageUrl;
  }
  navigateToNewsDetail(newsId: number) {
    this.router.navigate(['/news', newsId]);
}
}

