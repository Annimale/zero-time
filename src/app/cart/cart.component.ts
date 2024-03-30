import { Component } from '@angular/core';
import { EuropeNumberPipe } from "../europe-number.pipe";

@Component({
    selector: 'app-cart',
    standalone: true,
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.css',
    imports: [EuropeNumberPipe]
})
export class CartComponent {

}
