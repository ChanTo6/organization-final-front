import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { UserRoleService } from '../../../service/UserRoleService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../../../service/service.service';
import { WareHouse } from '../../../Models/WareHouse';
import { WarehouseInfo } from '../../../Models/WarehouseInfo';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-products-management',
  templateUrl: './products-management.component.html',
  styleUrls: ['./products-management.component.css']
})
export class ProductsManagementComponent implements OnInit {
  role: string | null = '';
  activeTab: string = 'entered'; 
  enteredProducts: any[] = []; 
  outProducts: any[] = []; 
  currentBalances: any[] = []; 
  warehouses: any[] = []; 
  displayDialog: boolean = false; 
  displayDialogEdit:boolean=false;
  isEditMode: boolean = false; 
  selectedProductId: number | null = null; 
  productForm!: FormGroup; 
  userStatus!: number;
  selectedProduct: any;
  constructor(
    private userRoleService: UserRoleService,
    private service: ServiceService,
    private fb: FormBuilder,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.confirmRemove();
    this.productForm = this.fb.group({
      barcode: [{ value: '', disabled: true }], // Correctly initialized
      ProductName: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1), Validators.max(40)]],
      warehouse: [''],
      location: ['']
    });
    this.role = localStorage.getItem('userRole');
    this.userRoleService.role$.subscribe(role => {
      this.role = role;
      if (role) {
        localStorage.setItem('userRole', role);
        this.fetchProducts();
      } else {
        localStorage.removeItem('userRole');
      }
    });

    this.fetchNameAndLocation();
    console.log(this.warehouses);
  }


  fetchProducts() {
    const userIdString = localStorage.getItem('userId');
    if (userIdString) {
      const userId = Number(userIdString);
      
      if (this.role !== 'manager') {
        // Operator fetches products
        this.service.FetchProductbyuserId(userId).subscribe(
          (data: WareHouse[]) => {
            this.enteredProducts = data || [];
            console.log('Operator entered products:', this.enteredProducts);
          },
          (error) => {
            console.error('Error fetching entered products for operator:', error);
          }
        );


        this.service.GetRemovedProductsByUserId(userId).subscribe(
          (data: WareHouse[]) => {
            this.outProducts = data || [];
          },
          (error) => {
          }
        );

        this.service.checkFreeSeatsByUserId(userId).subscribe(
          (data: WarehouseInfo[]) => {
            this.currentBalances = data || [];
          },
          (error) => {
          }
        );

      } else {

        this.service.FetchProducts().subscribe(
          (data: WareHouse[]) => {
            this.enteredProducts = data || []; 
          },
          (error) => {
            console.error('Error fetching entered products for manager:', error);
          }
        );


        this.service.GetRemovedProducts().subscribe(
          (data: WareHouse[]) => {
            this.outProducts = data || [];
          },
          (error) => {
            console.error('Error fetching removed products for manager:', error);
          }
        );

        this.fetchWarehouses(); 
        this.service.checkFreeSeatsAllWarehouses().subscribe(
          (data: WarehouseInfo[]) => {
            this.currentBalances = data || [];
          },
          (error) => {
            console.error('Error checking free seats for all warehouses:', error);
          }
        );
      }
    } else {
      console.warn('No user ID found in local storage.');
    }
  }
  confirmRemove() { 
    if (this.selectedProduct && this.quantityToRemove > 0) {
        const barcode = this.selectedProduct.barcode;

        this.service.removeProduct(barcode, this.quantityToRemove).pipe(
            catchError(err => {
                console.error('Error removing product:', err);
                return throwError(err);
            })
        ).subscribe(
            response => {
                console.log('Product removed successfully');
                
                // Find the product to update its quantity
                const productToUpdate = this.enteredProducts.find(product => product.barcode === barcode);
                if (productToUpdate) {
                    productToUpdate.quantity -= this.quantityToRemove; // Decrease the quantity

                    // Check if quantity reaches 0
                    if (productToUpdate.quantity <= 0) {
                        this.enteredProducts = this.enteredProducts.filter(product => product.barcode !== barcode);
                    }
                }
                this.cd.detectChanges(); // Ensure changes are reflected
                this.displayDialog = false; 
            },
            error => {
                console.error('Error removing product:', error);
            }
        );
    } else {
        console.error('Please enter a valid quantity to remove.');
    }
}



fetchWarehouses() {
  console.log("gg");
  this.service.FetchNameAndLocation().subscribe(
    (data: any[]) => {
      console.log(data);
      this.warehouses = data || []; 
      console.log('Warehouses data fetched:', this.warehouses);
    },
    (error) => {
      console.error('Error fetching warehouses data:', error);
    }
  );
}


  


selectTab(tab: string) {
  this.activeTab = tab;

  if (tab === 'out') {
    this.fetchProducts();  
  }
}
showDialog() {
  this.displayDialogEdit = true; 
  this.displayDialog = false; 
  this.isEditMode = false;
  this.productForm.reset();
  this.productForm.controls['barcode'].disable();
}


saveProduct() {
  if (this.productForm.valid) {
    const productData = this.productForm.value;

    productData.userId = Number(localStorage.getItem('userId'));

    const warehouseName = productData.warehouse;
    const location = productData.location; // Added location handling

    if (this.isEditMode) {
      productData.productId = this.selectedProductId;
      console.log(productData);
      this.service.updateProduct(productData).subscribe(() => {
        this.fetchProducts();
        this.hideDialog();
      }, error => {
        console.error("Error updating product:", error);
      });
    } else {
      if (!warehouseName || !location) { // Check for both warehouse and location
        console.error("Warehouse and location are required");
        return;
      }
      console.log(productData);
      this.service.addProduct(productData).subscribe(() => {
        this.fetchProducts();
        this.hideDialog();
        console.log(productData);
      }, error => {
        console.error("Error adding product:", error);
      });
    }
  }
  }
  
  

  hideDialog() {
    this.displayDialog = false;
    this.displayDialogEdit=false;
  }
  hideDialogEdit() {
    this.displayDialogEdit = false; 
  }
  onRowSelect(product: any) {
    this.isEditMode = true;                  
    this.selectedProductId = product.productId; 
    this.productForm.patchValue(product);     
    this.productForm.controls['barcode'].enable(); 
    
    this.displayDialog = false;               
    this.displayDialogEdit = true;            
  }

  onRowSelectOut(product: any) {
  }


  turnoff()
  {
    localStorage.clear();
    location.reload();
  }

  updateStatus(status: number) {
    const userIdString = localStorage.getItem('userId');
    if (userIdString) {
      const userId = parseInt(userIdString, 10);
  
      if (!isNaN(userId)) {
        this.service.updateUserStatus(userId, status).subscribe(
          response => {
            console.log('Status updated:', response.message);
          },
          error => {
            console.error('Error updating status:', error);
          }
        );
      } else {
        console.error('Invalid user ID');
      }
    } else {
      console.error('User ID is not available');
    }
  }

  validateQuantityInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value + event.key);  

    if (value < 1 || value > 40) {
      event.preventDefault(); 
    }
  }


  quantityToRemove =0;
  onRemoveProduct(product: any) {
    this.selectedProduct = product;          
    this.displayDialogEdit = false;          
    this.displayDialog = true;               
    this.quantityToRemove = 1;               
  }


  displayWarehouseDialog: boolean = false;
  newWarehouse: any = {
    userId: null,
    warehouseName: '',
    location: ''
  };


  addWarehouse() {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.newWarehouse.userId = +storedUserId; 
    } else {
      console.error('User ID not found in local storage');
      return; 
    }
  
    if (!this.newWarehouse.warehouseName || !this.newWarehouse.location) {
      console.error('Warehouse name and location are required');
      return; 
    }

    this.service.addWarehouse(this.newWarehouse).subscribe(
      response => {
        console.log('Warehouse added successfully:', response);
        this.displayWarehouseDialog = false;
        this.newWarehouse = { userId: this.newWarehouse.userId, warehouseName: '', location: '' };
      },
      error => {
        console.error('Error adding warehouse:', error);
      }
    );
  }

  onCancel() {
    this.displayWarehouseDialog = false;
  }

  openDialog() {
    this.displayWarehouseDialog = true;
  }


  fetchNameAndLocation(): void {
    this.service.FetchNameAndLocation().subscribe(
      (data) => {
        if (Array.isArray(data)) {
          this.warehouses = data; 
          console.log(this.warehouses);
        }
      },
      (error) => {
        console.error('Error fetching warehouses', error);
      }
    );
  }

}