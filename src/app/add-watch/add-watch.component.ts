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
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
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

interface CustomJwtPayload {
  id: number;
  iat: number;
  exp: number;
}

@Component({
  selector: 'app-add-watch',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule,TranslateModule],
  templateUrl: './add-watch.component.html',
  styleUrl: './add-watch.component.css',
})
export class AddWatchComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  brands: any[] = [];
  files: File[] = [];
  cookie!: string;
  userInfo: any;

  isAuthenticated: boolean = false;
  localToken: any;
  userLocalInfo: any = {};
  userGoogle: any = {};

  watchForm = new FormGroup({
    brandID: new FormControl('', Validators.required),
    model: new FormControl('', Validators.required),
    description: new FormControl(''),
    movement: new FormControl('', Validators.required),
    condition: new FormControl('', Validators.required),
    caseSize: new FormControl('', [Validators.required, Validators.min(1)]),
    caseThickness: new FormControl('', [
      Validators.required,
      Validators.min(1),
    ]),
    price: new FormControl('', [Validators.required, Validators.min(1)]),
  });
  constructor(
    private watchService: WatchService,
    private brandService: BrandService,
    private http: HttpService,
    private http2: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.brandService.getAllBrands().subscribe({
      next: (data) => {
        console.log('Brands loaded:', data);
        this.brands = data;
      },
      error: (error) => {
        console.error('Failed to load brands. Response:', error);
        console.error('Error details:', error.error.text || error.error); // Attempting to capture non-JSON error message
      },
    });

    this.isAuthenticated = this.authService.tokenExists();
    if (this.isAuthenticated) {
      this.getPayload();
    }
    this.getLocalTokenInfo();
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
        price: Number(this.watchForm.get('price')?.value) || 0,
      };

      Object.keys(formValues).forEach((key) => {
        const value = formValues[key as keyof WatchFormValues];
        formData.append(key, value.toString());
      });

      const files = (
        document.getElementById('dropzone-file') as HTMLInputElement
      ).files;
      if (files) {
        Array.from(files).forEach((file) => {
          formData.append('images', file);
        });
      }

      this.watchService.addWatch(formData).subscribe({
        next: (watch) => {
          Swal.fire({
            title: 'Éxito!',
            text: 'El reloj se ha añadido correctamente.',
            icon: 'success',
            confirmButtonText: 'Ok',
          }).then((result) => {
            this.watchForm.reset();
            this.setDefaultSelectValue();
            
           
          });
          console.log('Reloj añadido con imágenes:', watch);
        },
        error: (error) => {
          Swal.fire({
            title: 'Error!',
            text: 'No se pudo añadir el reloj.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
          });
          console.error('Error al añadir el reloj:', error);
        },
      });
    } else {
      Swal.fire(
        'Error',
        'Debes completar el formulario y seleccionar al menos una imagen.',
        'error'
      );

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

  //Lógica para coger info users

  //Cogemos token local
  getLocalUserData(id: any) {
    this.http.getLocalUser(id).subscribe({
      next: (response) => {
        console.log('Datos del usuario:', response);
        this.userLocalInfo = response;
      },
      error: (error) => {
        console.log('Error en getLocalUserData:', error);
      },
    });
  }
  getLocalTokenInfo() {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      //Esto lo hacemos para comprobar que existe localStorage en el entorno
      this.isAuthenticated = true;
      this.localToken = localStorage.getItem('token');
      const localInfo = jwtDecode(this.localToken) as CustomJwtPayload;
      console.log(localInfo.id);

      if (localInfo && localInfo.id) {
        this.getLocalUserData(localInfo.id);
      }
    } else {
      console.log('De momento no hay localToken');
    }
  }

  getPayload() {
    this.http.getPayload().subscribe({
      next: (res) => {
        console.log('Datos del usuario:', res.user);
        this.userInfo = jwtDecode(res.user);
        console.log(this.userInfo.id);
        this.isAuthenticated = true;

        this.http2
          .get<any>(`http://localhost:3000/user/${this.userInfo.id}`)
          .subscribe({
            next: (userRes) => {
              console.log(userRes);
              this.userGoogle = userRes;
              console.log(this.userGoogle.role);
            },
          });
      },
      error: (error) => {
        console.error('Error al obtener datos del usuario', error);
      },
    });
  }

  setDefaultSelectValue(): void {
    // Obtiene el elemento del campo de selección
    const movementSelect = document.getElementById(
      'movement'
    ) as HTMLSelectElement;
    const brandSelect = document.getElementById('brandID') as HTMLSelectElement;
    const conditionSelect = document.getElementById(
      'condition'
    ) as HTMLSelectElement;
   

    // Establece el valor predeterminado deseado (en este caso, el primer valor)
    movementSelect.selectedIndex = 0;
    brandSelect.selectedIndex = 0;
    conditionSelect.selectedIndex = 0;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }

  }
  
}
