import { Component } from '@angular/core';
import { EuropeNumberPipe } from '../europe-number.pipe';
import { ActivatedRoute,Router } from '@angular/router';
import { BrandService } from '../brand.service';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [EuropeNumberPipe],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css'
})
export class BrandsComponent {
  brandInfo:any={};

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
  }
  }

