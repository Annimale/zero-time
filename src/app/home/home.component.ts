import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EuropeNumberPipe } from '../europe-number.pipe';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { WatchService } from '../watch.service';
import { BrandService } from '../brand.service';
import { TranslateModule } from '@ngx-translate/core';

interface Watch {
  id: number;
  brandID: number;
  caseSize: number;
  caseThickness: number;
  condition: string;
  createdAt: string;
  description: string;
  images: string;
  model: string;
  movement: string;
  price: number;
  updatedAt: string;
  userID: number | null;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslateModule, EuropeNumberPipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  isUser: any;
  brands: any[] = [];
  watches: any;
  constructor(
    private authService: AuthService,
    private brandService: BrandService,
    private watchService: WatchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isUser = this.authService.isUser();
    this.brandService.getAllBrands().subscribe({
      next: (data) => {
        //console.log('Brands loaded:', data);
        this.brands = data;
      },
      error: (error) => {
        console.error('Failed to load brands. Response:', error);
        console.error('Error details:', error.error.text || error.error);
      },
    });
    this.watchService.getAllWatches().subscribe({
      next: (data) => {
        //console.log('watches loaded:', data);
        this.watches = data;
      },
      error: (error) => {
        console.error('Failed to load watches. Response:', error);
        console.error('Error details:', error.error.text || error.error);
      },
    });
  }
  getBrandName(brandID: number): string {
    const brand = this.brands.find((brand) => brand.id === brandID);
    return brand ? brand.name : 'Unknown Brand';
  }

  getCurrentImageUrl(watch: any): string {
    if (!watch.currentImage && watch.images) {
      if (typeof watch.images === 'string') {
        watch.images = JSON.parse(watch.images);
      }
      watch.currentImage = watch.images[0];
      watch.currentImageIndex = 0;
    }
    const imageUrl = `http://localhost:3000/${watch.currentImage.replace(
      /\\\\/g,
      '/'
    )}`;
    return imageUrl;
  }

  navigateToWatchDetail(watchId: number) {
    this.router.navigate(['/shop', watchId]);
  }
  showNextImage(watch: any): void {
    if (typeof watch.images === 'string') {
      watch.images = JSON.parse(watch.images);
    }

    const currentIndex = watch.currentImageIndex ?? 0;
    const nextIndex = (currentIndex + 1) % watch.images.length;
    watch.currentImageIndex = nextIndex;
    watch.currentImage = watch.images[nextIndex];
  }

  resetImage(watch: any): void {
    watch.currentImage = null;
  }
  getFirstImageUrl(imageJson: string): string {
    let images;
    try {
      images = JSON.parse(imageJson);
    } catch (e) {
      console.error('Error parsing images JSON', e);
      return '../../assets/images/brandNoWatch.svg';
    }

    if (images && images.length > 0) {
      const firstImage = images[0];
      const imageUrl = `http://localhost:3000/${firstImage.replace(
        /\\\\/g,
        '/'
      )}`;
      return imageUrl;
    } else {
      return '../../assets/images/brandNoWatch.svg';
    }
  }
}
