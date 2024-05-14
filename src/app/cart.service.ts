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
    const currentItems = this.cartItemsSubject.getValue();
    const updatedItems = [...currentItems, watch];
    this.cartItemsSubject.next(updatedItems);
  }

  removeFromCart(watch: any): void {
    const currentItems = this.cartItemsSubject.getValue();
    const updatedItems = currentItems.filter(item => item.id !== watch.id);
    this.cartItemsSubject.next(updatedItems);
  }
}
