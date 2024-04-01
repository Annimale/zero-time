import { Component } from '@angular/core';
import { EuropeNumberPipe } from "../europe-number.pipe";

@Component({
    selector: 'app-shop-detail',
    standalone: true,
    templateUrl: './shop-detail.component.html',
    styleUrl: './shop-detail.component.css',
    imports: [EuropeNumberPipe]
})
export class ShopDetailComponent {

}
