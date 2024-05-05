import { Component, ViewChild, ElementRef } from '@angular/core';
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
import { NewsService } from '../news.service';

interface NewsFormValues {
  title: string;
  subtitle: string;
  body: string;
  author: string;
  category: string;
}

@Component({
  selector: 'app-edit-news',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-news.component.html',
  styleUrl: './edit-news.component.css',
})
export class EditNewsComponent {
  news: any = {};
  constructor(
    private newsService: NewsService,
    private http: HttpService,
    private http2: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  files: File[] = [];
  @ViewChild('coverImageInput') coverImageInput!: ElementRef;
  @ViewChild('secondaryImageInput') secondaryImageInput!: ElementRef;

  newsEditForm = new FormGroup({
    title: new FormControl('', Validators.required),
    subtitle: new FormControl('', Validators.required),
    body: new FormControl('', Validators.required),
    author: new FormControl('', [Validators.required, Validators.minLength(2)]),
    category: new FormControl('', Validators.required),
    coverImage: new FormControl(''),
    secondaryImage: new FormControl(''),
  });

  ngOnInit(): void {
    const newsID = this.route.snapshot.params['id'];

    this.newsService.getNewsById(newsID).subscribe({
      next: (news) => {
        console.log('News actual', news);
        this.fillForm(news);
        this.news = news;
      },
    });
  }

  fillForm(news: any): void {
    this.newsEditForm.patchValue({
      title: news.title,
      subtitle: news.subtitle,
      body: news.body,
      author: news.author,
      category: news.category,
    });
  }

  onSubmit(): void {
    if (this.newsEditForm.valid) {
      const formData = new FormData();
      Object.keys(this.newsEditForm.controls).forEach((key) => {
        const control = this.newsEditForm.get(key);
        if (
          (key === 'coverImage' || key === 'secondaryImage') &&
          control?.value
        ) {
          const fileInput = control.value[0]; // Access the first file
          if (fileInput) formData.append(key, fileInput, fileInput.name);
        } else if (control?.value) {
          formData.append(key, control.value.toString());
        }
      });

      this.newsService.updateNews(this.news.id, formData).subscribe({
        next: () => {
          Swal.fire('Success', 'News updated successfully', 'success').then(
            (result) => {
              if (result.value) {
                window.location.reload(); // Recargar la página
              }
            }
          );
        },
        error: (error) => {
          Swal.fire('Error', 'Failed to update news', 'error');
          console.error('Error updating news:', error);
        },
      });
    } else {
      Swal.fire(
        'Invalid Form',
        'Please complete all required fields.',
        'error'
      );
    }
  }

  handleFileInput(event: Event, key: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.newsEditForm.patchValue({
        [key]: input.files,
      });
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
        this.newsService.deleteNews(this.news.id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminada',
              'La noticia se ha sido eliminado exitosamente.',
              'success'
            ).then(() => window.location.reload());
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar la noticia.', 'error');
          },
        });
      }
    });
  }
}
