import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WatchService } from '../watch.service';
import { BrandService } from '../brand.service';
import Swal from 'sweetalert2';
import { HttpService } from '../http.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

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
  selector: 'app-edit-watch',
  standalone: true,
  imports: [RouterLink, TranslateModule, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-watch.component.html',
  styleUrl: './edit-watch.component.css',
})
export class EditWatchComponent {
  brands: any[] = [];
  files: File[] = [];
  watchImages: string[] = [];
  watch: any = {};

  constructor(
    private watchService: WatchService,
    private brandService: BrandService,
    private http: HttpService,
    private http2: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  watchEditForm = new FormGroup({
    brandID: new FormControl('', Validators.required),
    model: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    movement: new FormControl('', Validators.required),
    condition: new FormControl('', Validators.required),
    caseSize: new FormControl('', [Validators.required, Validators.min(1)]),
    caseThickness: new FormControl('', [
      Validators.required,
      Validators.min(1),
    ]),
    price: new FormControl('', [Validators.required, Validators.min(1)]),
  });
  ngOnInit(): void {
    const watchID = this.route.snapshot.params['id'];

    this.brandService.getAllBrands().subscribe({
      next: (data) => {
        //console.log('Brands loaded:', data);
        this.brands = data;
      },
      error: (error) => {
        console.error('Failed to load brands. Response:', error);
        console.error('Error details:', error.error.text || error.error);
      },
    });

    this.watchService.getWatchById(watchID).subscribe({
      next: (watch) => {
        //console.log('Reloj actual', watch);
        this.watch = watch;
        this.fillForm(watch);
      },
      error: (error) => {
        console.error('Failed to fetch watch', error);
      },
    });
  }

  onSubmit(): void {
    if (this.watchEditForm.valid) {
      const formData = new FormData();
      const formValues: WatchFormValues = {
        brandID: Number(this.watchEditForm.get('brandID')?.value) || 0,
        model: this.watchEditForm.get('model')?.value || '',
        description: this.watchEditForm.get('description')?.value || '',
        movement: this.watchEditForm.get('movement')?.value || '',
        condition: this.watchEditForm.get('condition')?.value || '',
        caseSize: Number(this.watchEditForm.get('caseSize')?.value) || 0,
        caseThickness:
          Number(this.watchEditForm.get('caseThickness')?.value) || 0,
        price: Number(this.watchEditForm.get('price')?.value) || 0,
      };

      Object.keys(formValues).forEach((key) => {
        const value = formValues[key as keyof WatchFormValues];
        formData.append(key, value.toString());
      });

      const files = (
        document.getElementById('dropzone-file') as HTMLInputElement
      ).files;
      if (files && files.length > 0) {
        Array.from(files).forEach((file) => {
          formData.append('images', file);
        });
      }

      this.watchService.updateWatch(this.watch.id, formData).subscribe({
        next: (watch) => {
          Swal.fire({
            title: 'Éxito!',
            text: 'El reloj se ha editado correctamente.',
            icon: 'success',
            confirmButtonText: 'Ok',
          }).then((result) => {
            if (result.value) {
            }
          });
          //console.log('Reloj editado con imágenes:', watch);
        },
        error: (error) => {
          Swal.fire({
            title: 'Error!',
            text: 'No se pudo editar el reloj.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
          });
          console.error('Error al editar el reloj:', error);
        },
      });
    } else {
      Swal.fire(
        'Formulario inválido',
        'Por favor, rellena todos los campos obligtaorios.',
        'error'
      );

      console.error('El formulario no es válido');
    }
  }

  deleteWatch(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertirlo',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.watchService.deleteWatch(this.watch.id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminado',
              'El reloj ha sido eliminado exitosamente.',
              'success'
            ).then(() => window.location.reload());
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar el reloj.', 'error');
          },
        });
      }
    });
  }
  onFileSelect(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.files = Array.from(fileList);
    }
  }

  fillForm(watch: any): void {
    this.watchEditForm.patchValue({
      brandID: watch.brandID,
      model: watch.model,
      description: watch.description,
      movement: watch.movement,
      condition: watch.condition,
      caseSize: watch.caseSize,
      caseThickness: watch.caseThickness,
      price: watch.price,
    });
  }
}
