import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { SaleService } from '../sale.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sell-your-watch',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './sell-your-watch.component.html',
  styleUrl: './sell-your-watch.component.css'
})
export class SellYourWatchComponent {

  saleForm = new FormGroup({
    brand: new FormControl('', [Validators.required]),
    model: new FormControl('', [Validators.required]),
    ref: new FormControl('', [Validators.required]),
    comment: new FormControl(''), // No es requerido
    caseSize: new FormControl('', [Validators.required]),
    box: new FormControl(false),
    papers: new FormControl(false),
    condition: new FormControl('', [Validators.required]),
    yearOfPurchase: new FormControl('', [Validators.required]),
    images: new FormControl<FileList | null>(null)  // Explicit type declaration
  });

  constructor(private saleService: SaleService) { }

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
        response => console.log('Venta creada con éxito', response),
        error => console.error('Error al crear la venta', error)
      );
    } else {
      console.error('Formulario no es válido', this.saleForm.errors);
    }
  }

  handleFileInput(files: FileList | null): void {
    if (files) {
      this.saleForm.patchValue({ images: files });
      this.saleForm.get('images')?.updateValueAndValidity();
    }
  }
}
