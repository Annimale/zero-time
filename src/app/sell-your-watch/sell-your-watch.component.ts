import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { SaleService } from '../sale.service';
import { CommonModule } from '@angular/common';
import { BrandService } from '../brand.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sell-your-watch',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './sell-your-watch.component.html',
  styleUrl: './sell-your-watch.component.css'
})
export class SellYourWatchComponent {
  brands:any[]=[];

  saleForm = new FormGroup({
    brandID: new FormControl('', [Validators.required]),
    model: new FormControl('', [Validators.required]),
    ref: new FormControl('', [Validators.required]),
    notes: new FormControl(''), // No es requerido
    caseSize: new FormControl('', [Validators.required]),
    box: new FormControl(false),
    papers: new FormControl(false),
    condition: new FormControl('', [Validators.required]),
    yearOfPurchase: new FormControl('', [Validators.required]),
    images: new FormControl<FileList | null>(null),  // Explicit type declaration
    watchID: new FormControl(null)
  });

  constructor(private saleService: SaleService,private brandService:BrandService) { }

  ngOnInit(): void {
    this.brandService.getAllBrands().subscribe({
      next:(data)=>{
        this.brands=data;
        console.log('Brands loaded:', data);
      }, error:(error)=>{
        console.error("Failed to load brands. Response:", error);

      }
    })
    
  }
  onSubmit(): void {
    if (this.saleForm.valid) {
      const formData = new FormData();
      const images = this.saleForm.get('images')!.value;
      if (images) {
        Array.from(images).forEach((file: File) => {
          formData.append("images", file);
        });
      }

      Object.keys(this.saleForm.controls).forEach(key => {
        if (key !== 'images' && this.saleForm.get(key)!.value != null) {
          formData.append(key, this.saleForm.get(key)!.value.toString());
        }
      });

      this.saleService.createSale(formData).subscribe(
        response => {
          console.log('Venta creada con éxito', response);
          Swal.fire({
            title: 'Enviada',
            text: 'Su venta ha sido enviada exitosamente.',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
          this.saleForm.reset();  // Resetear el formulario tras la creación exitosa
        },
        error => {
          console.error('Error al crear la venta', error);
          Swal.fire({
            title: 'Error!',
            text: 'No se pudo crear la venta.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
          });
        }
      );
    } else {
      console.error('Formulario no es válido', this.saleForm.errors);
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, completa el formulario correctamente.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
    }
  }


  handleFileInput(files: FileList | null): void {
    if (files) {
      this.saleForm.patchValue({ images: files });
      this.saleForm.get('images')?.updateValueAndValidity();
    }
  }
}
