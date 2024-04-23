import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WatchService } from '../watch.service';
import { BrandService } from '../brand.service';
import Swal from 'sweetalert2';




interface WatchFormValues {
  brandID: number;
  model: string;
  description: string;
  movement: string;
  condition: string;
  caseSize: number;
  caseThickness: number;
  price: number;
}


@Component({
  selector: 'app-add-watch',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule,CommonModule],
  templateUrl: './add-watch.component.html',
  styleUrl: './add-watch.component.css'
})
export class AddWatchComponent {
  brands: any[] = [];
  files: File[] = [];


  watchForm = new FormGroup({
    brandID: new FormControl('', Validators.required),
    model: new FormControl('', Validators.required),
    description: new FormControl(''),
    movement: new FormControl('', Validators.required),
    condition: new FormControl('', Validators.required),
    caseSize: new FormControl('', [Validators.required, Validators.min(1)]),
    caseThickness: new FormControl('', [Validators.required, Validators.min(1)]),
    price: new FormControl('', [Validators.required, Validators.min(1)]),

  })
  constructor(private watchService: WatchService, private brandService: BrandService,
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
  onSubmit(): void {
    if (this.watchForm.valid && this.files.length > 0) {
      const formData = new FormData();
      const formValues: WatchFormValues = {
        brandID: Number(this.watchForm.get('brandID')?.value) || 0,
        model: this.watchForm.get('model')?.value || '',
        description: this.watchForm.get('description')?.value || '',
        movement: this.watchForm.get('movement')?.value || '',
        condition: this.watchForm.get('condition')?.value || '',
        caseSize: Number(this.watchForm.get('caseSize')?.value) || 0,
        caseThickness: Number(this.watchForm.get('caseThickness')?.value) || 0,
        price: Number(this.watchForm.get('caseThickness')?.value) || 0,

      };

      Object.keys(formValues).forEach(key => {
        const value = formValues[key as keyof WatchFormValues];
        formData.append(key, value.toString());
      });

      const files = (document.getElementById('dropzone-file') as HTMLInputElement).files;
      if (files) {
        Array.from(files).forEach(file => {
          formData.append('images', file);
        });
      }

      this.watchService.addWatch(formData).subscribe({
        next: (watch) => {
          Swal.fire({
            title: 'Éxito!',
            text: 'El reloj se ha añadido correctamente.',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.value) {
              window.location.reload();  // Recargar la página
            }
          });
          console.log('Reloj añadido con imágenes:', watch);
          
        },
        error: (error) => {
          Swal.fire({
            title: 'Error!',
            text: 'No se pudo añadir el reloj.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
          });
          console.error('Error al añadir el reloj:', error);
        }
      });
    } else {
      Swal.fire('Error', 'Debes completar el formulario y seleccionar al menos una imagen.', 'error');

      console.error('El formulario no es válido');
    }
  }
  onFileSelect(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.files = Array.from(fileList);
      // Puedes añadir lógica aquí para mostrar las miniaturas de las imágenes
    }
  }
}
