import { Component } from '@angular/core';
import { WareHouse } from '../../../Models/WareHouse';
import { ServiceService } from '../../../service/service.service';
import { Router } from '@angular/router';  
@Component({
  selector: 'app-removed-products',
  templateUrl: './removed-products.component.html',
  styleUrl: './removed-products.component.css'
})
export class RemovedProductsComponent {
  product!: WareHouse[]; 
  loading: boolean = true;

  constructor(private service: ServiceService,  private router: Router) {}

  ngOnInit(): void {
    this.get();
  }

  get() {
    this.loading = true; 
    this.service.GetRemovedProducts().subscribe({
      next: (data: WareHouse[]) => {
        this.product = data; 
   console.log(data); 
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching data', err);
        this.loading = false; 
      }
    });
  }
  logOff() {
    localStorage.clear();  
    this.router.navigate(['']);  
  }
  goToRemovedProducts() {
   
    this.router.navigate(['/manager']); 
  }
}
