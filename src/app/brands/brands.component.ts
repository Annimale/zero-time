import { Component } from '@angular/core';
import { EuropeNumberPipe } from '../europe-number.pipe';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { BrandService } from '../brand.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WatchService } from '../watch.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [EuropeNumberPipe, TranslateModule, CommonModule, RouterLink],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent {
  brandInfo: any = {};
  brands: any[] = [];
  watches: any[] = [];
  baseUrl: string = 'http://localhost:3000/';
  brandName: string = '';
  brandCoverImageUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private brandService: BrandService,
    private router: Router,
    private watchService: WatchService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const brandName = params.get('brandName');
      //console.log(`Brand name from URL: ${brandName}`);

      if (brandName) {
        this.loadBrand(brandName);
      } else {
        console.error('Brand name is null');
        this.router.navigate(['/not-found']);
      }
    });

    this.brandService.getAllBrands().subscribe({
      next: (data) => {
        this.brands = data;
      },
      error: (error) => {
        console.error('Failed to load brands:', error);
      },
    });
  }

  loadBrand(brandName: string): void {
    this.brandService.getBrandByName(brandName).subscribe(
      (brandData) => {
        this.brandInfo = brandData;
        this.brandName = brandData.name;
        if (this.brandInfo && this.brandInfo.id) {
          this.loadWatches(this.brandInfo.id);
        }
      },
      (error) => {
        //console.log(error);
        this.router.navigate(['/not-found']);
      }
    );
  }

  loadWatches(brandId: number): void {
    this.watchService.getWatchesByBrandId(brandId).subscribe(
      (watchesData) => {
        this.watches = watchesData;
        if (this.watches.length > 0) {
          this.setBrandCoverImage(this.watches[0]);
        } else {
          this.brandCoverImageUrl = '../../assets/images/brandNoWatch.svg';
        }
      },
      (error) => {
        console.error('Failed to load watches:', error);
      }
    );
  }

  navigateToWatchDetail(watchId: number) {
    this.router.navigate(['/shop', watchId]);
  }
  getCurrentImageUrl(watch: any): string {
    if (!watch.currentImage && watch.images) {
      if (typeof watch.images === 'string') {
        watch.images = JSON.parse(watch.images);
      }
      watch.currentImage = watch.images[0]; // Establece la primera imagen por defecto
      watch.currentImageIndex = 0; // Establece el índice inicial
    }
    const imageUrl = `http://localhost:3000/${watch.currentImage.replace(
      /\\\\/g,
      '/'
    )}`;
    return imageUrl;
  }
  getFirstImageUrl(imageJson: string): string {
    try {
      const images = JSON.parse(imageJson);
      if (images && images.length > 0) {
        return `http://localhost:3000/${images[0].replace(/\\\\/g, '/')}`;
      }
    } catch (e) {
      console.error('Error parsing images JSON', e);
    }
    //!FIXME
    return '../../assets/images/brandNoWatch.svg'; // Imagen por defecto
  }
  showNextImage(watch: any): void {
    // Verifica si es necesario parsear las imágenes desde JSON
    if (typeof watch.images === 'string') {
      watch.images = JSON.parse(watch.images);
    }

    // Maneja la lógica para ciclar las imágenes
    const currentIndex = watch.currentImageIndex || 0;
    const nextIndex = (currentIndex + 1) % watch.images.length;
    watch.currentImageIndex = nextIndex;
    watch.currentImage = watch.images[nextIndex];
  }

  resetImage(watch: any): void {
    watch.currentImageIndex = 0;
    watch.currentImage = watch.images[0];
  }

  setBrandCoverImage(watch: any): void {
    let images = watch.images;

    // Intentar parsear si images es una cadena que parece un JSON
    if (typeof images === 'string') {
      try {
        images = JSON.parse(images);
      } catch (error) {
        console.error('Error parsing images:', error);
        images = []; // En caso de error, usar un array vacío
      }
    }

    //console.log('Normalized watch images:', images);
    if (images.length > 0) {
      const imagePath = images[0].replace(/\\\\/g, '/').replace(/\\/g, '/');
      this.brandCoverImageUrl = `http://localhost:3000/${imagePath}`;
      //console.log('Attempting to load image at:', this.brandCoverImageUrl);
    } else {
      this.brandCoverImageUrl = '../../assets/images/brandNoWatch.svg';
      //console.log('No images available, setting default image.');
    }
  }
}
