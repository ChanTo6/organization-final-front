import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../../service/service.service';
import { Employee } from '../../../Models/Employee';
import { Router } from '@angular/router';  

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit {
  employees: Employee[] = [];
  loading: boolean = true;
  displayDialog: boolean = false;
  displayRegisterDialog: boolean = false;
  selectedEmployee: any;
  role: string = "operator";
  roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Operator', value: 'operator' },
    { label: 'Manager', value: 'manager' }
  ];
  organizationNames: { label: string, value: string }[] = []; 

  constructor(private service: ServiceService, private router: Router) {}

  ngOnInit() {
    this.fetchEmployees();
    this.fetchOrganizationNames();
    this.FetchNameAndLocation();
   // this.role = localStorage.getItem('role'); 
  }

  fetchEmployees() {
    this.service.GetAllProjectUsersAsync().subscribe({
      next: (employees: Employee[]) => {
        console.log(employees);
  
        // Filter out employees where employeeName and employeeSurname are both 'manager'
        this.employees = employees
          .filter(employee => employee.employeeName !== '' || employee.employeeSurname !== '')
          .map(({ password, orgId, ...filteredEmployee }) => filteredEmployee as Employee);
  
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching employees:', err);
        this.loading = false;
      }
    });
  }
  

  fetchOrganizationNames() {
    this.service.getAllOrganizationNames().subscribe({
      next: (data) => {
        this.organizationNames = data.map(orgName => ({ label: orgName, value: orgName }));
      },
      error: (err: any) => {
        console.error('Error fetching organization names:', err);
      }
    });
  }

  onAdd() {
    this.displayRegisterDialog=true;
    
    console.log('Add employee clicked');
  }

  saveEmployee() {
    if (this.selectedEmployee) {
      const updateRequest = {
        personId: this.selectedEmployee.personId,
        employeeName: this.selectedEmployee.employeeName,
        employeeSurname: this.selectedEmployee.employeeSurname,
        password: this.selectedEmployee.password,
        role: this.selectedEmployee.role,
        telephone: this.selectedEmployee.telephone,
        orgName: this.selectedEmployee.orgName,
        warehouse:  this.selectedEmployee.warehouse, // Include warehouse if applicable
        orgEmail: this.selectedEmployee.orgEmail || '',
        userId: this.selectedEmployee.userId || 0,
        isActive: this.selectedEmployee.isActive !== undefined ? this.selectedEmployee.isActive : true
      };

        console.log(updateRequest); 
        this.service.UpdateEmployeeAsync(updateRequest).subscribe({
            next: () => {
                this.fetchEmployees(); 
                this.displayDialog = false; 
                alert('Employee updated successfully!'); 
            },
            error: (err: any) => {
                console.error('Error updating employee:', err);
                alert('Failed to update employee. Please try again later.');
            }
        });
    }
}


  

onUpdate(employee: Employee) {
  this.selectedEmployee = { ...employee }; // Clone the employee to avoid directly modifying the table data
  this.displayDialog = true;
}

  onCancel() {
    this.selectedEmployee = null;
    this.displayDialog = false;
    this.displayRegisterDialog = false;
    this.showWarehouseDropdown = false; // Hide the warehouse dropdown
  }
  onDelete(userId: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
    //  console.log(userId);
      this.service.DeleteEmployeeAsync(userId).subscribe({
        error: (err: any) => {
          this.fetchEmployees(); 
         
          alert('Failed to delete employee. Please try again later.'); 
        }
      });
    }
    this.fetchEmployees();
   // this.fetchOrganizationNames();
  }

  logOff() {
    localStorage.clear(); 
    window.location.reload();
   // this.router.navigate(['']); 
  }

  newUser: any = {}; 
  registerEmployee() {
    console.log(this.newUser);
    this.service.register(this.newUser).subscribe({
      next: () => {
        this.fetchEmployees();
        this.displayRegisterDialog = false;
        alert('Employee registered successfully!');
      },
      error: (err: any) => {
        console.error('Error registering employee:', err);
        alert('Failed to register employee. Please try again later.');
      }
    });
  }



  FetchNameAndLocation() {
    this.service.FetchNameAndLocation().subscribe({
      next: (response) => {
        console.log(response)
        this.warehouseOptions = response.map((item: any) => item.warehouseName);
        console.log(response);
      },
      error: (error) => {
        console.error('Error fetching name and location:', error);
      }
    });
  }
  

  warehouseOptions: { label: string, value: string }[] = []; 
  showWarehouseDropdown = false;

  onRoleChange(role: string) {
    if (this.selectedEmployee?.role === 'operator') {
      this.FetchNameAndLocation();
      this.showWarehouseDropdown = true;
    } else {
      this.showWarehouseDropdown = false;
      this.warehouseOptions = [];
    }
    if (this.selectedEmployee?.warehouse?.warehouseName) {
      console.log(`Selected employee's warehouse name: ${this.selectedEmployee.warehouse.warehouseName}`);
    }
  } 
}
