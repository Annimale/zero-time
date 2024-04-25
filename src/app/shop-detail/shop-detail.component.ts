import { Component } from '@angular/core';
import { EuropeNumberPipe } from "../europe-number.pipe";
import { ActivatedRoute } from '@angular/router';
import { WatchService } from '../watch.service';
import { BrandService } from '../brand.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-shop-detail',
    standalone: true,
    templateUrl: './shop-detail.component.html',
    styleUrl: './shop-detail.component.css',
    imports: [EuropeNumberPipe,CommonModule]
})
export class ShopDetailComponent {
    watch: any = {};
    brands: any[] = [];
    constructor(private route: ActivatedRoute, private watchService: WatchService,private brandService:BrandService) { }

    ngOnInit(): void {

        const watchId = this.route.snapshot.params['id'];
        console.log(watchId);
        this.watchService.getWatchById(watchId).subscribe({
            next: (data) => {
                this.watch = data;
                this.watch.images = this.parseImageUrls(this.watch.images); // Asegúrate de que esta línea está parseando correctamente
            },
            error: (error) => {
                console.error('Error al obtener los detalles del reloj:', error);
            }
        });
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

    }

    //? Método para obtener el nombre de la brand a través del brandID de cada reloj
    getBrandName(brandID: number): string {
        const brand = this.brands.find(brand => brand.id === brandID);
        return brand ? brand.name : 'Unknown Brand';
    }
    parseImageUrls(imageJson: string): string[] {
        try {
            // Asegúrate de que estás convirtiendo de JSON a un array correctamente
            const images: string[] = JSON.parse(imageJson);
            return images.map(img => `http://localhost:3000/${img.replace(/\\\\/g, '/')}`);
        } catch (e) {
            console.error('Error parsing images JSON', e);
            return ['src/assets/images/watches/default-image.webp']; // Imagen por defecto
        }
    }
}
