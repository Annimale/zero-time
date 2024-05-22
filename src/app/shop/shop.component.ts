import { Component } from '@angular/core';
import { EuropeNumberPipe } from "../europe-number.pipe";
import { BrandService } from '../brand.service';
import { CommonModule } from '@angular/common';
import { WatchService } from '../watch.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';



interface Watch {
    id: number;
    brandID: number;
    caseSize: number;
    caseThickness: number;
    condition: string;
    createdAt: string;
    description: string;
    images: string; // assuming this is a JSON string of an array
    model: string;
    movement: string;
    price: number;
    updatedAt: string;
    userID: number | null; // use null if userID can be null, otherwise just number
}

@Component({
    selector: 'app-shop',
    standalone: true,
    templateUrl: './shop.component.html',
    styleUrl: './shop.component.css',
    imports: [EuropeNumberPipe, CommonModule, FormsModule,TranslateModule]
})


export class ShopComponent {
    brands: any[] = [];
    watches: any;
    filters = {
        searchTerm: '',
        selectedBrands: new Set<string>(),
        priceRange: { min: 0, max: 100000 },
        currentPrice: 0,
    };
    filteredWatches: any[]=[];

    constructor(
        private brandService: BrandService,
        private watchService: WatchService,
        private router: Router,
    ) { }
    ngOnInit(): void {
        this.brandService.getAllBrands().subscribe({
            next: (data) => {
                console.log("Brands loaded:", data);
                this.brands = data;
                this.applyFilters();

            },
            error: (error) => {
                console.error("Failed to load brands. Response:", error);
                console.error("Error details:", error.error.text || error.error);  // Attempting to capture non-JSON error message
            }
        });
        this.watchService.getAllWatches().subscribe({
            next: (data) => {
                console.log("watches loaded:", data);
                this.watches = data;
                this.applyFilters();

            },
            error: (error) => {
                console.error("Failed to load watches. Response:", error);
                console.error("Error details:", error.error.text || error.error);  // Attempting to capture non-JSON error message
            }
        })
        this.filteredWatches = this.watches;

    }

    //? Método para obtener el nombre de la brand a través del brandID de cada reloj
    getBrandName(brandID: number): string {
        const brand = this.brands.find(brand => brand.id === brandID);
        return brand ? brand.name : 'Unknown Brand';
    }

    getFirstImageUrl(imageJson: string): string {
        let images;
        try {
            images = JSON.parse(imageJson);
        } catch (e) {
            console.error('Error parsing images JSON', e);
            return '../../assets/images/brandNoWatch.svg'; // Imagen por defecto
        }

        if (images && images.length > 0) {
            const firstImage = images[0];
            const imageUrl = `http://localhost:3000/${firstImage.replace(/\\\\/g, '/')}`;
            // console.log("Trying to load image:", imageUrl); // Imprime la URL intentada
            return imageUrl;
        } else {
            return '../../assets/images/brandNoWatch.svg';
        }
    }

    navigateToWatchDetail(watchId: number) {
        this.router.navigate(['/shop', watchId]);
    }

    applyFilters(): void {
        // Check if watches or brands are still undefined (not loaded yet).
        if (!this.watches || !this.brands) {
            return; // Don't do anything if the data hasn't loaded yet.
        }

        this.filteredWatches = this.watches.filter((watch: Watch) => {
            const searchTermLower = this.filters.searchTerm.toLowerCase();
            const brand = this.brands.find(b => b.id === watch.brandID);
            const brandNameLower = brand ? brand.name.toLowerCase() : '';

            const matchesSearchTerm = brandNameLower.includes(searchTermLower) ||
                watch.model.toLowerCase().includes(searchTermLower) ||
                watch.price.toString().includes(searchTermLower);

            const matchesBrand = this.filters.selectedBrands.size === 0 || this.filters.selectedBrands.has(watch.brandID.toString());

            const matchesPrice = watch.price >= this.filters.currentPrice && watch.price <= this.filters.priceRange.max;
            return matchesSearchTerm && matchesBrand && matchesPrice;
        });
        console.log(this.filteredWatches);
    }


    onBrandChange(brandId: number, event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        if (inputElement) {
            const isChecked = inputElement.checked;
            if (isChecked) {
                this.filters.selectedBrands.add(brandId.toString());
            } else {
                this.filters.selectedBrands.delete(brandId.toString());
            }
            this.applyFilters();
        }
    }
    clearBrandFilters(): void {
        this.filters.selectedBrands.clear(); // Limpia todas las selecciones de marca
        this.applyFilters(); // Vuelve a aplicar los filtros para actualizar la lista
    }


    onSearchChange(searchTerm: string) {
        this.filters.searchTerm = searchTerm;
        this.applyFilters();
    }

    onPriceChange(newPrice: number): void {
        this.filters.currentPrice = newPrice;
        this.applyFilters();
    }

    getCurrentImageUrl(watch: any): string {
        if (!watch.currentImage && watch.images) {
            if (typeof watch.images === 'string') {
                watch.images = JSON.parse(watch.images);
            }
            watch.currentImage = watch.images[0]; // Establece la primera imagen por defecto
            watch.currentImageIndex = 0; // Establece el índice inicial
        }
        const imageUrl = `http://localhost:3000/${watch.currentImage.replace(/\\\\/g, '/')}`;
        return imageUrl;
    }
    

    showNextImage(watch: any): void {
        // Intenta parsear el JSON solo si es necesario
        if (typeof watch.images === 'string') {
            watch.images = JSON.parse(watch.images);
        }
    
        const currentIndex = watch.currentImageIndex ?? 0;
        const nextIndex = (currentIndex + 1) % watch.images.length; // Ciclar las imágenes
        watch.currentImageIndex = nextIndex; // Guarda el índice actual para uso futuro
        watch.currentImage = watch.images[nextIndex]; // Actualiza la imagen actual
    }
    

    resetImage(watch: any): void {
        watch.currentImage = null; // Reset a la imagen original
    }
}
