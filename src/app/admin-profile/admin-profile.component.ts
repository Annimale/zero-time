import { Component,NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleService } from '../sale.service';


@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent {
  
  sales:any=[];
  
  
  constructor(private saleService: SaleService) {}


  ngOnInit(): void {
    this.saleService.getAllSales().subscribe({
      next:(data)=>{
        console.log('Sales:', data);
        this.sales=data;
      }
    })

  }
  
}
