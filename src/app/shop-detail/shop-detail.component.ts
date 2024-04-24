import { Component } from '@angular/core';
import { EuropeNumberPipe } from "../europe-number.pipe";
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-shop-detail',
    standalone: true,
    templateUrl: './shop-detail.component.html',
    styleUrl: './shop-detail.component.css',
    imports: [EuropeNumberPipe]
})
export class ShopDetailComponent {

    constructor (private route:ActivatedRoute){}

    ngOnInit(): void {

        const watchId = this.route.snapshot.params['id'];
        console.log(watchId);
        
    }

}
