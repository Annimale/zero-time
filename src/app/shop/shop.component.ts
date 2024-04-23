import { Component } from '@angular/core';
import { EuropeNumberPipe } from "../europe-number.pipe";
import { BrandService } from '../brand.service';
import { CommonModule } from '@angular/common';
import { WatchService } from '../watch.service';
@Component({
    selector: 'app-shop',
    standalone: true,
    templateUrl: './shop.component.html',
    styleUrl: './shop.component.css',
    imports: [EuropeNumberPipe, CommonModule]
})
export class ShopComponent {
    brands: any[] = [];
    watches: any;
    constructor(
        private brandService: BrandService,
        private watchService: WatchService,
    ) { }
    ngOnInit(): void {
        this.brandService.getAllBrands().subscribe({
            next: (data) => {
                console.log("Brands loaded:", data);
                this.brands = data;
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
            },
            error: (error) => {
                console.error("Failed to load watches. Response:", error);
                console.error("Error details:", error.error.text || error.error);  // Attempting to capture non-JSON error message
            }
        })
    }

    //? Método para obtener el nombre de la brand a través del brandID de cada reloj
    getBrandName(brandID: number): string {
        const brand = this.brands.find(brand => brand.id === brandID);
        return brand ? brand.name : 'Unknown Brand';
    }

    getFirstImageUrl(images: string[]): string {
        if (images && images.length > 0) {
            const firstImage = images[0]; // Obtener la primera imagen de la lista
            // Puedes necesitar ajustar la ruta base de la URL dependiendo de cómo esté configurado tu servidor
            return `http://localhost:3000/uploads/` + firstImage;
        } else {
            return 'src/assets/images/watches/r1.webp'; // URL de una imagen por defecto en caso de que no haya ninguna imagen
        }
    }
}
