import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewsService } from '../news.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent {
  currentDate = new Date();
  news: any[] = [];
  baseUrl: string = 'http://localhost:3000/';
  filteredNews: any[] = [];
  filters = {
    categories: new Set<string>(),
    author: '',
    sortByDate: 'newest'
  };
  selectedCategories = new Set<string>();
  isChecked = false;


  constructor(
    private newsService: NewsService,
    private router:Router
  ) { }


  ngOnInit(): void {
    this.newsService.getAllNews().subscribe({
      next: (data) => {
        console.log('News loaded:', data);
        this.news = data;
        this.filteredNews = data; // Initialize filtered news with all news initially
        this.applyFilters();

      }, error: (error) => {
        console.error("Failed to load news. Response:", error);
        console.error("Error details:", error.error.text || error.error);  // Attempting to capture non-JSON error message
      }
    });
  }

  applyFilters() {
    this.filteredNews = this.news.filter(newsItem => {
      const categoryMatch = this.selectedCategories.size === 0 || Array.from(this.selectedCategories).every(cat => newsItem.category.includes(cat));
      const authorMatch = !this.filters.author || newsItem.author.toLowerCase().includes(this.filters.author.toLowerCase());
      return categoryMatch && authorMatch;
    });
    this.sortNews();
}

  sortNews() {
    if (this.filters.sortByDate === 'newest') {
      this.filteredNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      this.filteredNews.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
  }

 

  updateCategoryFilter(category: string, event: any): void {
  const isChecked = event.target?.checked;
  if (isChecked) {
    this.selectedCategories.add(category);
  } else {
    this.selectedCategories.delete(category);
  }
  this.applyFilters();
}


  
  
  
  updateAuthorFilter(author: string) {
    this.filters.author = author;
    this.applyFilters();
  }

  updateSortOrder(sortOrder: string) {
    this.filters.sortByDate = sortOrder;
    this.applyFilters();
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

