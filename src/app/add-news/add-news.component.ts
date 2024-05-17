import { Component,ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NewsService } from '../news.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

interface NewsFormValues {
  title: string;
  subtitle: string;
  body: string;
  author: string;
  category: string
}


@Component({
  selector: 'app-add-news',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './add-news.component.html',
  styleUrl: './add-news.component.css'
})
export class AddNewsComponent {
  files: File[] = [];
  @ViewChild('coverImageInput') coverImageInput!: ElementRef;
  @ViewChild('secondaryImageInput') secondaryImageInput!: ElementRef;

  newsForm = new FormGroup({
    title: new FormControl('', Validators.required),
    subtitle: new FormControl('', Validators.required),
    body: new FormControl('', Validators.required),
    author: new FormControl('', [Validators.required, Validators.minLength(2)]),
    category: new FormControl('', Validators.required),
    coverImage: new FormControl('', Validators.required),
    secondaryImage: new FormControl('', Validators.required),

  })

  constructor(private newsService: NewsService) { }

  onSubmit(): void {
    if (this.newsForm.valid) {
      const formData = new FormData();
      // Agregar datos del formulario al objeto FormData
      Object.keys(this.newsForm.controls).forEach(key => {
        const control = this.newsForm.get(key);
        if (key === 'coverImage' || key === 'secondaryImage') {
          // Verifica primero si control.value es un FileList y no es null
          if (control && control.value instanceof FileList && control.value.length > 0) {
            const file = control.value[0];
            formData.append(key, file, file.name);
          }
        } else {
          formData.append(key, control!.value);
        }
      });

      // Llamar al servicio para enviar los datos
      this.newsService.addNews(formData).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: '¡Noticia añadida con éxito!',
            text: 'La noticia se ha registrado correctamente.'
          });
          this.resetFormAndFileInputs(); // Resetear el formulario después del éxito

        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al añadir la noticia',
            text: 'No se pudo registrar la noticia.'
          });
          console.error('Error al añadir la noticia:', error);
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Formulario no válido',
        text: 'Por favor, completa correctamente todos los campos requeridos.'
      });
    }
  }
 

  handleFileInput(event: Event, key: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      console.log("Archivo cargado para", key, input.files[0]);
      this.newsForm.patchValue({
        [key]: input.files
      });
    }
  }
  
  
  resetFormAndFileInputs(): void {
    this.newsForm.reset(); // Esto resetea los otros campos del formulario
    const categorySelect = document.getElementById(
      'floating_category'
    ) as HTMLSelectElement;
    categorySelect.selectedIndex=0;
    // Ahora resetea manualmente los inputs de archivo
    if (this.coverImageInput && this.coverImageInput.nativeElement) {
      this.coverImageInput.nativeElement.value = '';
    }
    if (this.secondaryImageInput && this.secondaryImageInput.nativeElement) {
      this.secondaryImageInput.nativeElement.value = '';
    }
  }
  

}


