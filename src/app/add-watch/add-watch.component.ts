import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { WatchService } from '../watch.service';


interface WatchFormValues {
  brand: string;
  model: string;
  description: string;
  movement: string;
  condition: string;
  caseSize: number;
  caseThickness: number;
}


@Component({
  selector: 'app-add-watch',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './add-watch.component.html',
  styleUrl: './add-watch.component.css'
})
export class AddWatchComponent {


  watchForm = new FormGroup({
    brand: new FormControl('', Validators.required),
    model: new FormControl('', Validators.required),
    description: new FormControl(''),
    movement: new FormControl('', Validators.required),
    condition: new FormControl('', Validators.required),
    caseSize: new FormControl('', [Validators.required, Validators.min(1)]),
    caseThickness: new FormControl('', [Validators.required, Validators.min(1)]),
  })
  constructor(private watchService: WatchService) { }
  onSubmit(): void {
    if (this.watchForm.valid) {
      const formData = new FormData();
      const formValues: WatchFormValues = {
        brand: this.watchForm.get('brand')?.value || '',
        model: this.watchForm.get('model')?.value || '',
        description: this.watchForm.get('description')?.value || '',
        movement: this.watchForm.get('movement')?.value || '',
        condition: this.watchForm.get('condition')?.value || '',
        caseSize: Number(this.watchForm.get('caseSize')?.value) || 0,
        caseThickness: Number(this.watchForm.get('caseThickness')?.value) || 0,
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
          console.log('Reloj añadido con imágenes:', watch);
        },
        error: (error) => {
          console.error('Error al añadir el reloj:', error);
        }
      });
    } else {
      console.error('El formulario no es válido');
    }
  }
}
