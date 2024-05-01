import { Component, ElementRef, ViewChild } from '@angular/core';
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
    imports: [EuropeNumberPipe, CommonModule]
})
export class ShopDetailComponent {
    watch: any = {};
    brands: any[] = [];
    showModal: boolean = false;
    selectedImage: string = '';
    @ViewChild('zoomImage') zoomImage!: ElementRef<HTMLImageElement>;




    constructor(private route: ActivatedRoute, private watchService: WatchService, private brandService: BrandService) { }

    ngOnInit(): void {

        const watchId = this.route.snapshot.params['id'];
        console.log(watchId);
        this.watchService.getWatchById(watchId).subscribe({
            next: (data) => {
                console.log("Initial data loaded", data);
                this.watch = data;
                this.watch.images = this.parseImageUrls(this.watch.images);
                console.log("Images after parsing", this.watch.images);
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
    parseImageUrls(imageData: any): string[] {
        // Verificar si imageData es un string
        if (typeof imageData === 'string') {
            if (imageData.startsWith('http')) {
                return [imageData];
            } else {
                try {
                    const images: string[] = JSON.parse(imageData);
                    return images.map(img => `http://localhost:3000/${img.replace(/\\\\/g, '/')}`);
                } catch (e) {
                    console.error('Error parsing images JSON', e);
                    return ['src/assets/images/watches/default-image.webp']; // Imagen por defecto si el parseo falla
                }
            }
        } else if (Array.isArray(imageData)) {
            //? AQUI ESTABA LA CLAVE !!!
            // Si imageData es un array, asumir que cada elemento ya es una URL válida
            return imageData.map(img => img.replace(/\\\\/g, '/'));
        } else {
            // Si imageData no es un string ni un array, registrar el error y tipo de dato
            console.error('Expected string or array for imageData but received:', typeof imageData, imageData);
            return ['src/assets/images/watches/default-image.webp']; // Devolver imagen por defecto
        }
    }

    openModal(image: string) {
        this.selectedImage = image;
        this.showModal = true;
    }

    toggleModal() {
        this.showModal = !this.showModal;
    }

    adjustZoom(event: MouseEvent): void {
        const rect = this.zoomImage.nativeElement.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        this.zoomImage.nativeElement.style.transformOrigin = `${x}% ${y}%`;
        this.zoomImage.nativeElement.style.transform = 'scale(2)';  // Ajusta el nivel de zoom según sea necesario
    }

    resetZoom(): void {
        this.zoomImage.nativeElement.style.transform = 'scale(1)';
        this.zoomImage.nativeElement.style.transformOrigin = 'center center';
    }
    
    closeModal(event: MouseEvent): void {
        this.showModal = false;
    }
}
