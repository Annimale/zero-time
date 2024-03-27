import { Component } from '@angular/core';
import { EuropeNumberPipe } from "../europe-number.pipe";

@Component({
    selector: 'app-shop',
    standalone: true,
    templateUrl: './shop.component.html',
    styleUrl: './shop.component.css',
    imports: [EuropeNumberPipe]
})
export class ShopComponent {

}
