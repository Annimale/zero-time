import { Component } from '@angular/core';
import { EuropeNumberPipe } from '../europe-number.pipe';
import { ActivatedRoute,RouterLink,Router } from '@angular/router';
import { BrandService } from '../brand.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [EuropeNumberPipe,CommonModule,RouterLink],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css'
})
export class BrandsComponent {
  brandInfo:any={};
  brands: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private brandService: BrandService,
    private router: Router,

  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const brandName = params.get('brandName');
      if (brandName) { 
        this.brandService.getBrandByName(brandName).subscribe(data => {
          this.brandInfo = data;
          console.log(this.brandInfo);
        }, error => {
          this.router.navigate(['/not-found']);
        });
      } else {
        console.error('Brand name is null');
        this.router.navigate(['/not-found']);

      }
    });
    this.brandService.getAllBrands().subscribe(data => {
      this.brands = data;
    }, error => {
      console.error('Failed to get brands', error);
    });
  }
  }

