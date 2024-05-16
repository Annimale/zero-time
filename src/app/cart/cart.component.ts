import { Component } from '@angular/core';
import { EuropeNumberPipe } from '../europe-number.pipe';
import { CartService } from '../cart.service';
import { CommonModule } from '@angular/common';
import { BrandService } from '../brand.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { jwtDecode } from 'jwt-decode';

interface CustomJwtPayload {
  id: number;
  iat: number;
  exp: number;
}

interface CartItem {
  id: number;
  model: string;
  caseSize: number;
  caseThickness: number;
  movement: string;
  condition: string;
  description: string;
  price: number;
  images: string[];
  brandID: number;
  userID: string | null;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  imports: [EuropeNumberPipe, CommonModule, MatTooltipModule],
})
export class CartComponent {
  cartItems: any[] = []; // Lista de relojes en el carrito
  brands: any[] = [];
  subtotal: number = 0; // Subtotal inicializado en 0
  cookie!: string;
  userInfo: any = {};
  isAuthenticated: boolean = false;
  localToken: any;
  userLocalInfo: any = {};
  userGoogle: any = {};
  isUser: boolean = false;
  constructor(
    private cartService: CartService,
    private brandService: BrandService,
    private route: ActivatedRoute,
    private http: HttpService,
    private http2: HttpClient,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.brandService.getAllBrands().subscribe({
      next: (data) => {
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
    this.calculateSubtotal();
  }
  ngDoCheck(): void {
    this.isUser = this.route.snapshot.data['isUser'];
  }
  getBrandName(brandID: number): string {
    const brand = this.brands.find((brand) => brand.id === brandID);
    return brand ? brand.name : 'Unknown Brand';
  }
  removeCartItem(index: number): void {
    // Eliminar el reloj del carrito
    this.cartService.removeCartItem(index);

    // Actualizar la lista de relojes en el componente
    this.cartItems = this.cartService.getCartItems();
    this.calculateSubtotal();
  }
  calculateSubtotal(): void {
    // Sumar el precio de cada artículo en el carrito
    this.subtotal = this.cartItems.reduce(
      (total, item) => total + item.price,
      0
    );
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

  realizarPedido() {
    const cartItemsString = localStorage.getItem('cartItems');

    if (!cartItemsString) {
      console.error('No hay elementos en el carrito');
      return;
    }

    // Parsear los elementos del carrito
    const cartItems: CartItem[] = JSON.parse(cartItemsString);

    // Calcular el monto total
    const totalAmount = cartItems.reduce(
      (total, item) => total + item.price,
      0
    );

    const cartItemsWithDetails = cartItems.map((item: CartItem) => ({
      name: item.model,
      quantity: 1,
      unit_amount: {
        currency_code: 'USD', // Cambiar según la moneda utilizada
        value: item.price.toFixed(2), // Redondear el precio a 2 decimales
      },
    }));
    const itemTotal = {
      currency_code: 'USD', // Cambiar según la moneda utilizada
      value: totalAmount.toFixed(2), // Redondear el total a 2 decimales
    };
    console.log(cartItemsWithDetails)
    // Enviar los datos a PayPal
    this.http2
      .post('http://localhost:3000/checkout/paypal', {
        items: cartItemsWithDetails,
        amount: totalAmount.toFixed(2) // Agrega el monto total como un parámetro
          
        
      })
      .subscribe(
        (response: any) => {
          window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${response.orderId}`;
        },
        (error) => {
          console.error(error);
          // Manejar el error
        }
      );
  }
}
