import { Component } from '@angular/core';
import { EuropeNumberPipe } from "../europe-number.pipe";
import { BrandService } from '../brand.service';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-shop',
    standalone: true,
    templateUrl: './shop.component.html',
    styleUrl: './shop.component.css',
    imports: [EuropeNumberPipe,CommonModule]
})
export class ShopComponent {
    brands: any[] = [];
    constructor(
        private brandService: BrandService,
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
    }
}
