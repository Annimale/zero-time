import { Component } from '@angular/core';
import { EuropeNumberPipe } from "../europe-number.pipe";
import { CartService } from '../cart.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-cart',
    standalone: true,
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.css',
    imports: [EuropeNumberPipe,CommonModule]
})
export class CartComponent {
    cartItems: any[] = []; // Lista de relojes en el carrito

    constructor(private cartService: CartService) {
      // Suscribirse a los cambios en el carrito para actualizar la lista de relojes
      this.cartService.cartItems$.subscribe((items) => {
        this.cartItems = items;
      });
    }
  
    removeItemFromCart(index: number) {
      this.cartService.removeFromCart(index); // Llamar al método del servicio para eliminar el reloj del carrito
    }
}
