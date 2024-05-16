import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public cartItems$: Observable<any[]> = this.cartItemsSubject.asObservable();

  constructor() { }

  addToCart(watch: any): void {
    let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    cartItems.push(watch);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }

  getCartItems(): any[] {
    if (typeof localStorage !== 'undefined') {
      return JSON.parse(localStorage.getItem('cartItems') || '[]');
    } else {
      console.error('localStorage is not available');
      return [];
    }
  }
  

  clearCart(): void {
    localStorage.removeItem('cartItems');
  }

  removeCartItem(index: number): void {
    let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    if (index >= 0 && index < cartItems.length) {
      cartItems.splice(index, 1);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }

  
}
