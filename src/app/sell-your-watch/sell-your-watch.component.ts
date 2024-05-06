import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { SaleService } from '../sale.service';
import { CommonModule } from '@angular/common';
import { BrandService } from '../brand.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { HttpService } from '../http.service';
import { jwtDecode } from 'jwt-decode';

interface CustomJwtPayload {
  id: number;
  iat: number;
  exp: number;
}


@Component({
  selector: 'app-sell-your-watch',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './sell-your-watch.component.html',
  styleUrl: './sell-your-watch.component.css'
})
export class SellYourWatchComponent {
  brands:any[]=[];
  cookie!: string;
  userInfo: any={};
  isAuthenticated: boolean = false;
  localToken: any;
  userLocalInfo: any = {};
  userGoogle: any = {};


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

  constructor(private saleService: SaleService,private brandService:BrandService,private http: HttpService,
    private http2: HttpClient,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.brandService.getAllBrands().subscribe({
      next:(data)=>{
        this.brands=data;
        console.log('Brands loaded:', data);
      }, error:(error)=>{
        console.error("Failed to load brands. Response:", error);

      }
    })
    this.isAuthenticated = this.authService.tokenExists();
    if (this.isAuthenticated) {
      this.getPayload();
    }
    this.getLocalTokenInfo();
    
   
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

  //!Lógica para coger info users
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
}
